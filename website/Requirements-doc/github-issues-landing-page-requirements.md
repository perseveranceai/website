# Requirements: Update Perseverance AI Landing Page (GitHub Issues Mode)

## Goal
Update `perseveranceai.com` to highlight the new **GitHub Issues Mode** (Console feature) while retaining **Doc Mode** relevance.
The goal is to showcase the new capability to "Turn GitHub Issues into Documentation Fixes" alongside the existing URL analysis.

## Core Features & Strategy
- **GitHub Issues Mode**:
    - Primary Action: **"Copy Fix"** (Working).
    - Future Action: **"Open PR"** (Mark as *Coming Soon* or *Future*).
- **Doc Mode**:
    - Retain existing functionality (Paste URL -> Audit).
- **Navigation**:
    - Add "Features" link to the header.

## Implementation Details

### 1. Hero Section Updates
- Update Headline/Subhead to be inclusive of both modes (finding gaps from Issues OR URLs).
- Update CTA to point to the new **Features** section.

### 2. New Features Section
- **Location**: Insert immediately after the Hero section.
- **Layout**: Two-column grid with styled cards.
- **Card 1: GitHub Issues Sync (New)**
    - Copy: "Connect your repo. We automatically find issues that are actually documentation gaps. **Copy the fix** instantly."
    - Badge: "New" or "Beta".
    - Action: Highlight "Copy Fix". Mention "Open PR" as coming soon.
- **Card 2: Doc Health Check (Existing)**
    - Copy: "Paste a URL. Get an instant audit of your documentation quality."

### 3. How It Works Updates
- Minor text updates to reflect that Step 1 can be "Input URL" OR "Connect Repo".

### 4. Technical
- **File**: `index.html`
- **Styles**: `assets/css/styles.css`
- Ensure responsive design for the new Features grid.
