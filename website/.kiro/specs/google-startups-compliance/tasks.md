# Implementation Plan: Google for Startups Website Compliance

## Overview

This plan implements the website updates required for Google for Startups Cloud Program compliance. Tasks are organized to allow HTML structure to be built first, with user-provided assets integrated afterward. Tasks marked "ASSIGNED TO USER" require the user to provide assets before that task can be completed.

## Tasks

- [x] 1. Add CSS styles for new sections
  - [x] 1.1 Add stage badge styles to styles.css
    - Create `.stage-badge` class with subtle background, border, and appropriate typography
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 1.2 Add product demo section styles to styles.css
    - Create `.product-demo` section styles
    - Create `.video-container` with 16:9 aspect ratio responsive container
    - Style video/iframe elements for proper display
    - _Requirements: 1.1, 1.2, 7.3_
  - [x] 1.3 Add screenshots section styles to styles.css
    - Create `.screenshots` section styles
    - Create `.screenshots-grid` with responsive grid (2x2 desktop, 2-col tablet, 1-col mobile)
    - Create `.screenshot-item` figure styles with image and caption
    - _Requirements: 2.1, 2.2, 2.5, 7.1, 7.2_
  - [x] 1.4 Add founder section styles to styles.css
    - Create `.founder` section styles
    - Create `.founder-content` flexbox layout (side-by-side desktop, stacked mobile)
    - Create `.founder-photo`, `.founder-info`, `.founder-credentials`, `.founder-links` styles
    - _Requirements: 3.1, 7.1, 7.4_
  - [x] 1.5 Add technology section styles to styles.css
    - Create `.technology` section styles
    - Create `.tech-grid` with responsive layout (4-col desktop, 2x2 tablet/mobile)
    - Create `.tech-item` styles with icon and label
    - _Requirements: 5.1, 5.4_

- [x] 2. Update hero section with stage badge
  - [x] 2.1 Add stage badge HTML to hero section in index.html
    - Insert stage badge element below hero-buttons div
    - Use text: "🔬 Prototype • Actively Seeking Design Partners"
    - _Requirements: 4.1, 4.2_

- [-] 3. Add product demo section to index.html
  - [x] 3.1 Create product demo section HTML structure
    - Add section with id="demo" after hero section
    - Include section title with heading "See Lensy In Action"
    - Include context paragraph
    - Create video container with placeholder for video element
    - _Requirements: 1.1, 1.5_
  - [ ] 3.2 ASSIGNED TO USER: Provide demo video asset
    - Record 60-90 second demo video of Lensy workflow
    - Save as MP4 to assets/video/lensy-demo.mp4 OR provide YouTube URL
    - _Requirements: 1.3_
  - [ ] 3.3 ASSIGNED TO USER: Provide video fallback image (optional)
    - Create fallback image for video poster
    - Save as assets/images/video-fallback.jpg
    - _Requirements: 1.4_
  - [ ] 3.4 Integrate video asset into demo section
    - Update video element src with actual video path or YouTube embed
    - Add poster attribute with fallback image path
    - Add fallback img element inside video tag
    - _Requirements: 1.2, 1.4_

- [-] 4. Add product screenshots section to index.html
  - [x] 4.1 Create screenshots section HTML structure
    - Add section with id="screenshots" after demo section
    - Include section title with heading "How Lensy Works"
    - Create screenshots-grid container with 4 figure elements
    - Add placeholder img elements and figcaptions
    - _Requirements: 2.1, 2.2, 2.4_
  - [ ] 4.2 ASSIGNED TO USER: Provide 4 product screenshots
    - Capture lensy-url-input.png (URL input interface)
    - Capture lensy-analysis-progress.png (streaming analysis)
    - Capture lensy-quality-scores.png (quality scores dashboard)
    - Capture lensy-recommendations.png (fix recommendations)
    - Save to assets/images/screenshots/
    - _Requirements: 2.3_
  - [ ] 4.3 Integrate screenshot assets into screenshots section
    - Update img src paths with actual screenshot filenames
    - Verify alt text is descriptive for each image
    - _Requirements: 2.3_

- [x] 5. Add founder section to index.html
  - [x] 5.1 Create founder section HTML structure
    - Add section with id="founder" after benefits section
    - Include section title "About the Founder"
    - Create founder-content container with photo and info divs
    - Add name (Rakesh Pasupuleti), title (Founder & CEO), bio paragraph
    - Add credentials lists (Recognition, Background)
    - Add social links (LinkedIn, Portfolio)
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_
  - [ ] 5.2 ASSIGNED TO USER: Provide founder headshot photo
    - Use professional headshot (square format preferred)
    - Save as assets/images/founder-photo.jpg
    - _Requirements: 3.2_
  - [ ] 5.3 Integrate founder photo asset
    - Update img src with actual photo path
    - Verify alt text is appropriate
    - _Requirements: 3.2_

- [x] 6. Add technology section to index.html
  - [x] 6.1 Create technology section HTML structure
    - Add section with id="technology" after founder section, before contact
    - Include section title "Built for Scale"
    - Create tech-grid with 4 tech-items
    - Add icons and labels for: cloud-native, multi-model AI, real-time streaming, security
    - Ensure NO vendor names (AWS, Bedrock, Claude) are mentioned
    - _Requirements: 5.1, 5.2, 5.3_

- [-] 7. Update contact section
  - [x] 7.1 Update contact section heading and CTA text
    - Change h2 from "Get a Free Documentation Audit" to "Become a Design Partner"
    - Update submit button text to match design partner messaging
    - _Requirements: 6.1, 6.2_
  - [x] 7.2 Add stage badge to contact section
    - Insert stage badge element near the section title
    - _Requirements: 4.4_
  - [x] 7.3 Verify form fields are preserved
    - Confirm doc_url, name, email, organization fields remain unchanged
    - _Requirements: 6.3_

- [x] 8. Update navigation
  - [x] 8.1 Add navigation link for founder section
    - Add "About" or "Founder" link to nav-links list
    - Link to #founder anchor
    - _Requirements: 3.1_

- [ ] 9. Final verification checkpoint
  - [ ] 9.1 Verify all sections appear in correct order
    - Confirm order: Hero → Demo → Screenshots → Features → Benefits → Founder → Technology → Contact → Footer
    - _Requirements: 1.1, 2.1, 3.1, 5.1_
  - [ ] 9.2 Test responsive layouts
    - Test at desktop (1200px+), tablet (768px-1199px), and mobile (<768px) widths
    - Verify screenshot grid adapts correctly
    - Verify founder section stacks on mobile
    - Verify video maintains aspect ratio
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ] 9.3 Verify all links work correctly
    - Test LinkedIn and portfolio links open in new tab
    - Test internal navigation anchors
    - Test form submission still works
    - _Requirements: 3.6, 6.3_

## Notes

- Tasks marked "ASSIGNED TO USER" require user-provided assets and cannot be completed by the coding agent
- HTML structure tasks (3.1, 4.1, 5.1, 6.1) can proceed immediately with placeholder paths
- Asset integration tasks (3.4, 4.3, 5.3) should be completed after user provides assets
- All CSS should use existing design system variables (--bg-*, --text-*, --border-*, --space-*)
- No build process required - direct HTML/CSS modifications
