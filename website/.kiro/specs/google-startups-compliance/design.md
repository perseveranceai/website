# Design Document: Google for Startups Website Compliance

## Overview

This design document outlines the implementation approach for updating perseveranceai.com to meet Google for Startups Cloud Program requirements. The updates involve adding new HTML sections and CSS styles to the existing static website without requiring any build process or backend changes.

The implementation follows a progressive enhancement approach, adding new content sections while preserving the existing dark theme design system and responsive behavior.

## Architecture

### High-Level Structure

```
perseveranceai.com (Updated)
├── Header (existing - unchanged)
├── Hero Section (existing + stage badge)
├── Product Demo Section (NEW)
│   ├── Video Player with fallback
│   └── Section heading/context
├── Product Screenshots Section (NEW)
│   ├── 4-image responsive grid
│   └── Captions for each image
├── Features Section (existing - unchanged)
├── Benefits Section (existing - unchanged)
├── Founder Section (NEW)
│   ├── Photo
│   ├── Bio text
│   ├── Credentials/awards
│   └── Social links
├── Technology Section (NEW)
│   └── 4-item capability list
├── Contact Section (existing + CTA updates)
└── Footer (existing - unchanged)
```

### File Structure

```
perseveranceai.com/
├── index.html                    # Main page (modifications)
├── assets/
│   ├── css/
│   │   └── styles.css           # Stylesheet (additions)
│   ├── images/
│   │   ├── founder-photo.jpg    # USER PROVIDED
│   │   ├── video-fallback.jpg   # USER PROVIDED (optional)
│   │   └── screenshots/
│   │       ├── lensy-url-input.png        # USER PROVIDED
│   │       ├── lensy-analysis-progress.png # USER PROVIDED
│   │       ├── lensy-quality-scores.png   # USER PROVIDED
│   │       └── lensy-recommendations.png  # USER PROVIDED
│   └── video/
│       └── lensy-demo.mp4       # USER PROVIDED (or YouTube embed)
```

## Components and Interfaces

### Component 1: Stage Badge

A visual indicator showing the product's development stage.

```html
<span class="stage-badge">
  🔬 Prototype • Actively Seeking Design Partners
</span>
```

**Placement:**
- Hero section: Below the hero buttons
- Contact section: Near the form heading

**Styling:**
- Subtle background with border
- Monospace or sans-serif font
- Muted colors to avoid distraction

### Component 2: Product Demo Section

A dedicated section for the demo video with fallback support.

```html
<section class="product-demo" id="demo">
  <div class="container">
    <div class="section-title">
      <h2>See Lensy In Action</h2>
      <p>Watch how Lensy analyzes documentation and delivers actionable recommendations.</p>
    </div>
    <div class="video-container">
      <!-- Option A: Self-hosted MP4 -->
      <video controls poster="assets/images/video-fallback.jpg">
        <source src="assets/video/lensy-demo.mp4" type="video/mp4">
        <img src="assets/images/video-fallback.jpg" alt="Lensy demo preview">
      </video>
      
      <!-- Option B: YouTube embed (alternative) -->
      <!-- <iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe> -->
    </div>
  </div>
</section>
```

**Features:**
- Responsive video container maintaining 16:9 aspect ratio
- Poster image for loading state
- Fallback image for browsers without video support

### Component 3: Product Screenshots Section

A responsive grid displaying 4 product screenshots with captions.

```html
<section class="screenshots" id="screenshots">
  <div class="container">
    <div class="section-title">
      <h2>How Lensy Works</h2>
      <p>From URL input to actionable recommendations in minutes.</p>
    </div>
    <div class="screenshots-grid">
      <figure class="screenshot-item">
        <img src="assets/images/screenshots/lensy-url-input.png" 
             alt="Lensy URL input interface">
        <figcaption>1. Enter your documentation URL</figcaption>
      </figure>
      <figure class="screenshot-item">
        <img src="assets/images/screenshots/lensy-analysis-progress.png" 
             alt="Lensy analysis in progress">
        <figcaption>2. Real-time streaming analysis</figcaption>
      </figure>
      <figure class="screenshot-item">
        <img src="assets/images/screenshots/lensy-quality-scores.png" 
             alt="Lensy quality scores dashboard">
        <figcaption>3. Quality scores across 5 dimensions</figcaption>
      </figure>
      <figure class="screenshot-item">
        <img src="assets/images/screenshots/lensy-recommendations.png" 
             alt="Lensy fix recommendations">
        <figcaption>4. Specific fix recommendations</figcaption>
      </figure>
    </div>
  </div>
</section>
```

**Layout:**
- Desktop: 2x2 grid
- Tablet: 2 columns
- Mobile: Single column stack

### Component 4: Founder Section

A section displaying founder information, credentials, and links.

```html
<section class="founder" id="founder">
  <div class="container">
    <div class="section-title">
      <h2>About the Founder</h2>
    </div>
    <div class="founder-content">
      <div class="founder-photo">
        <img src="assets/images/founder-photo.jpg" alt="Rakesh Pasupuleti">
      </div>
      <div class="founder-info">
        <h3>Rakesh Pasupuleti</h3>
        <p class="founder-title">Founder & CEO</p>
        <p class="founder-bio">
          Rakesh brings a unique blend of product management and engineering 
          expertise to Perseverance AI. With experience as a Product Manager-Technical 
          building developer tools, content management systems, and documentation 
          infrastructure at enterprise scale, he founded Lensy to solve the 
          documentation quality challenges he experienced firsthand.
        </p>
        <div class="founder-credentials">
          <h4>Recognition</h4>
          <ul>
            <li>🏆 2025 Stevie Award Winner (Technical Professional of the Year)</li>
            <li>🎯 Former Adobe Experience Manager Champion (2022-2024)</li>
            <li>🎤 Adobe Summit Speaker (2024 & 2025)</li>
          </ul>
          <h4>Background</h4>
          <ul>
            <li>MS Computer Science + MBA</li>
            <li>Deep expertise in AI/ML integration and developer experience</li>
          </ul>
        </div>
        <div class="founder-links">
          <a href="https://www.linkedin.com/in/pasupdr/" target="_blank" class="btn btn-secondary">LinkedIn</a>
          <a href="https://www.rakeshpasupuleti.com" target="_blank" class="btn btn-secondary">Portfolio</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Layout:**
- Desktop: Photo left, info right (flexbox)
- Mobile: Stacked vertically

### Component 5: Technology Section

A compact section highlighting technical capabilities.

```html
<section class="technology" id="technology">
  <div class="container">
    <div class="section-title">
      <h2>Built for Scale</h2>
    </div>
    <div class="tech-grid">
      <div class="tech-item">
        <span class="tech-icon">☁️</span>
        <span class="tech-label">Cloud-native serverless infrastructure</span>
      </div>
      <div class="tech-item">
        <span class="tech-icon">🤖</span>
        <span class="tech-label">Multi-model AI analysis</span>
      </div>
      <div class="tech-item">
        <span class="tech-icon">⚡</span>
        <span class="tech-label">Real-time WebSocket streaming</span>
      </div>
      <div class="tech-item">
        <span class="tech-icon">🔒</span>
        <span class="tech-label">Enterprise-grade security</span>
      </div>
    </div>
  </div>
</section>
```

**Layout:**
- Desktop: 4-column horizontal row
- Tablet: 2x2 grid
- Mobile: 2x2 grid or single column

## Data Models

This implementation is purely frontend HTML/CSS with no dynamic data models. All content is static and hardcoded in the HTML.

### Asset Requirements (User-Provided)

| Asset | Format | Dimensions | Notes |
|-------|--------|------------|-------|
| Demo video | MP4 or YouTube URL | 1920x1080 (16:9) | 60-90 seconds |
| Video fallback | JPG/PNG | 1920x1080 | Optional |
| Founder photo | JPG | 400x400 (square) | Professional headshot |
| Screenshot 1 | PNG | 1200x800 (3:2) | URL input interface |
| Screenshot 2 | PNG | 1200x800 (3:2) | Analysis progress |
| Screenshot 3 | PNG | 1200x800 (3:2) | Quality scores |
| Screenshot 4 | PNG | 1200x800 (3:2) | Recommendations |



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Analysis

This implementation is a static HTML/CSS website update with no dynamic data processing, algorithmic logic, or data transformations. After analyzing all acceptance criteria:

- All testable criteria are structural verification tests (checking DOM elements exist)
- No data serialization/deserialization occurs
- No round-trip operations exist
- No invariants need to be maintained across transformations
- No user input processing beyond existing form (unchanged)

**Conclusion:** Property-based testing is not applicable for this static HTML/CSS implementation. All verification can be accomplished through example-based structural tests that confirm:
1. Required HTML sections exist in the correct DOM order
2. Required elements exist within each section
3. Required text content is present
4. Required links have correct href values

### Structural Verification Tests

While not property-based tests, the following structural verifications should be performed:

1. **Section Order Verification**: Verify DOM order is Hero → Demo → Screenshots → Features → Benefits → Founder → Technology → Contact → Footer

2. **Demo Section Structure**: Verify video container with video/iframe element and fallback mechanism exists

3. **Screenshots Section Structure**: Verify exactly 4 screenshot items with images and captions exist

4. **Founder Section Structure**: Verify photo, name, title, bio, credentials, and social links exist

5. **Stage Badge Presence**: Verify stage badge appears in hero section and contact section

6. **Technology Section Structure**: Verify 4 tech capability items exist without vendor names

7. **Contact Section Updates**: Verify updated heading text and preserved form fields

## Error Handling

### Video Loading Failures

**Scenario:** Demo video fails to load (network error, unsupported format, missing file)

**Handling:**
- HTML5 video element includes `poster` attribute showing fallback image during load
- Nested `<img>` fallback inside `<video>` tag for browsers without video support
- For YouTube embeds: iframe shows YouTube's native error state

```html
<video controls poster="assets/images/video-fallback.jpg">
  <source src="assets/video/lensy-demo.mp4" type="video/mp4">
  <img src="assets/images/video-fallback.jpg" alt="Lensy demo preview - video unavailable">
</video>
```

### Image Loading Failures

**Scenario:** Screenshot or founder photo fails to load

**Handling:**
- All images include descriptive `alt` text for accessibility and fallback display
- CSS can provide background color placeholder for image containers
- Browser displays alt text when image unavailable

```css
.screenshot-item img,
.founder-photo img {
  background-color: var(--bg-tertiary);
}
```

### Missing Assets

**Scenario:** User-provided assets not yet available

**Handling:**
- HTML structure uses placeholder paths that clearly indicate required assets
- Comments in HTML indicate which assets are user-provided
- Site remains functional (though incomplete) without assets

## Testing Strategy

### Overview

This static HTML/CSS implementation requires structural verification testing rather than property-based testing. Tests will verify that the DOM structure matches requirements and that all required content is present.

### Unit Testing Approach

**Framework:** Any HTML testing framework (e.g., Jest with jsdom, Playwright, Cypress)

**Test Categories:**

1. **Section Existence Tests**
   - Verify each new section exists with correct ID
   - Verify sections appear in correct DOM order

2. **Content Verification Tests**
   - Verify stage badge text content
   - Verify founder credentials text
   - Verify technology items text (and absence of vendor names)
   - Verify updated CTA text

3. **Structure Verification Tests**
   - Verify screenshot grid contains exactly 4 items
   - Verify each screenshot has image and caption
   - Verify founder section has photo, bio, and links
   - Verify video container has fallback mechanism

4. **Link Verification Tests**
   - Verify LinkedIn link href
   - Verify portfolio link href
   - Verify form action preserved

### Manual Testing Checklist

Since responsive behavior cannot be easily unit tested:

- [ ] Desktop (1200px+): Verify 2x2 screenshot grid, side-by-side founder layout
- [ ] Tablet (768px-1199px): Verify 2-column screenshot grid
- [ ] Mobile (<768px): Verify single-column layouts, stacked elements
- [ ] Video playback: Verify video plays correctly
- [ ] Video fallback: Verify fallback image displays when video unavailable
- [ ] All images load: Verify all screenshots and founder photo display
- [ ] Links work: Verify LinkedIn and portfolio links open correctly
- [ ] Form works: Verify contact form still submits correctly

### CSS Validation

- Validate CSS syntax using W3C CSS Validator
- Verify no CSS conflicts with existing styles
- Verify CSS variables are used consistently

### Accessibility Testing

- Verify all images have alt text
- Verify video has accessible controls
- Verify color contrast meets WCAG AA standards
- Verify keyboard navigation works for new sections
