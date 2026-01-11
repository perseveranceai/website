// lambda/contact-form-handler.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { randomUUID } from 'crypto';

// Initialize clients
const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
const ses = new SESClient({ region: process.env.AWS_REGION });

// Environment variables will be set by CDK
const tableName = process.env.LEADS_TABLE_NAME || '';
const adminEmail = process.env.ADMIN_EMAIL || '';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, restrict this to your domain
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

  try {
    console.log("Received event:", JSON.stringify(event));
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: ''
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    // Parse the request body
    const requestBody = JSON.parse(event.body || '{}');
    const { doc_url, name, email, organization } = requestBody;
    console.log("Parsed body:", { doc_url, name, email, organization });

    // Validate required fields
    if (!name || !email || !doc_url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Name, email, and documentation URL are required' })
      };
    }

    // Create unique ID for the lead
    const leadId = randomUUID();
    const timestamp = new Date().toISOString();

    // Store lead in DynamoDB
    const leadItem = {
      id: leadId,
      name,
      email,
      doc_url,
      organization: organization || 'Not provided',
      createdAt: timestamp
    };

    console.log("Saving to DynamoDB...");
    await dynamoDb.send(new PutCommand({
      TableName: tableName,
      Item: leadItem
    }));

    // Send email notification
    if (adminEmail) {
      console.log("Sending email to:", adminEmail);
      const sesResponse = await ses.send(new SendEmailCommand({
        Source: 'notifications@perseveranceai.com',
        ReplyToAddresses: [email],
        Destination: { ToAddresses: [adminEmail] },
        Message: {
          Subject: { Data: `New Documentation Audit Request` },
          Body: {
            Text: {
              Data: `
                New documentation audit request:
                
                Name: ${name}
                Email: ${email}
                Documentation URL: ${doc_url}
                Organization: ${organization || 'Not provided'}
                
                This lead has been saved to your database with ID: ${leadId}
              `
            }
          }
        }
      }));
      console.log("SES Response:", JSON.stringify(sesResponse));
    }

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Form submitted successfully',
        leadId
      })
    };
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error processing your request. Please try again later.'
      })
    };
  }
}