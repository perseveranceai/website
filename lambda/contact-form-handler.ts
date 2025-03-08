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
    const { name, email, subject, message } = requestBody;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Name, email, and message are required' })
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
      subject: subject || 'Contact Form Submission',
      message,
      createdAt: timestamp
    };

    await dynamoDb.send(new PutCommand({
      TableName: tableName,
      Item: leadItem
    }));

    // Send email notification
    if (adminEmail) {
      await ses.send(new SendEmailCommand({
        Source: adminEmail,
        Destination: { ToAddresses: [adminEmail] },
        Message: {
          Subject: { Data: `New Lead: ${subject || 'Contact Form Submission'}` },
          Body: {
            Text: {
              Data: `
                New lead received from your website contact form:
                
                Name: ${name}
                Email: ${email}
                Subject: ${subject || 'N/A'}
                Message: ${message}
                
                This lead has been saved to your database with ID: ${leadId}
              `
            }
          }
        }
      }));
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