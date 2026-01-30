# Website Content Requirements: Google for Startups Cloud Program
## Focus: Add Missing Content to Existing perseveranceai.com

### Google's Feedback
- "Primarily descriptive" - needs visual proof of product
- "Not enough visual information" - needs screenshots/video
- Must "clearly showcase a digital-native business model" - needs product demo

**Goal**: Add missing content sections to existing website. No redesign needed.

---

## SECTION 1: PRODUCT VIDEO (Homepage)

### 1.1 Demo Video Requirements

**Length**: 60-90 seconds  
**Location**: Embed on homepage (below hero or in new "See It In Action" section)

**Video Content Flow**:
```
0:00-0:10  - Title card: "Lensy - Documentation Quality Auditor"
0:10-0:20  - Show pasting a documentation URL into input field
0:20-0:35  - Real-time streaming analysis (progress messages appearing)
0:35-0:50  - Quality scores dashboard (5 dimensions with scores)
0:50-1:05  - Specific issue found (e.g., deprecated code on line 45)
1:05-1:20  - Fix recommendation showing before/after code
1:20-1:30  - Export report button / closing CTA
```

**Technical Notes**:
- Screen recording of actual Lensy UI
- Can add simple text overlays/annotations
- Host on YouTube (unlisted) or self-host MP4
- Include fallback image for slow connections

---

## SECTION 2: PRODUCT SCREENSHOTS

### 2.1 Required Screenshots (Minimum 4)

Add to homepage in a "How It Works" or "See Lensy In Action" section:

| Screenshot | What It Shows |
|------------|---------------|
| `lensy-url-input.png` | Clean input interface with example URL |
| `lensy-analysis-progress.png` | Streaming analysis with progress messages |
| `lensy-quality-scores.png` | 5-dimension quality dashboard with scores |
| `lensy-recommendations.png` | Specific code fix with before/after |

### 2.2 Capture Instructions

```
1. Run Lensy against real documentation (e.g., Resend docs)
2. Screenshot each stage of the analysis
3. Use dark mode UI (already looks professional)
4. Capture at 2x resolution for retina displays
5. No need to annotate - real UI is sufficient
```

---

## SECTION 3: FOUNDER SECTION

### 3.1 Add to Homepage

**Location**: New section between "Benefits" and "Contact" form

```markdown
## About the Founder

### Rakesh Pasupuleti
**Founder & CEO**

[PHOTO - use LinkedIn/portfolio headshot]

Rakesh brings a unique blend of product management and engineering 
expertise to Perseverance AI. With experience as a Product Manager-Technical 
building developer tools, content management systems, and documentation 
infrastructure at enterprise scale, he founded Lensy to solve the 
documentation quality challenges he experienced firsthand.

**Recognition:**
- 🏆 2025 Stevie Award Winner (Technical Professional of the Year)
- 🎯 Former Adobe Experience Manager Champion (2022-2024)
- 🎤 Adobe Summit Speaker (2024 & 2025)

**Background:**
- MS Computer Science + MBA
- Deep expertise in AI/ML integration and developer experience

[LinkedIn](https://www.linkedin.com/in/pasupdr/) | [Portfolio](https://www.rakeshpasupuleti.com)
```

### 3.2 Photo Requirements

- Professional headshot (use existing from LinkedIn or portfolio)
- Square format works best
- No specific size requirement

---

## SECTION 4: DEVELOPMENT STAGE INDICATOR

### 4.1 Add Stage Badge

**Location**: Near hero CTA buttons and/or contact section

**Text**: `🔬 Prototype • Actively Seeking Design Partners`

**Simple Implementation**:
```html
<span class="stage-badge">
  🔬 Prototype • Actively Seeking Design Partners
</span>
```

---

## SECTION 5: TECHNOLOGY SECTION (Optional but Recommended)

### 5.1 Brief Tech Overview

**Location**: Small section or footer area

```markdown
## Built for Scale

- ☁️ Cloud-native serverless infrastructure
- 🤖 Multi-model AI analysis
- ⚡ Real-time WebSocket streaming
- 🔒 Enterprise-grade security
```

**Note**: Keep generic - don't mention AWS/Bedrock/Claude specifically.

---

## SECTION 6: CONTENT UPDATES

### 6.1 Hero Section - Minor Tweaks

Current hero is fine. Optional additions:
- Add stage badge near CTAs
- Ensure "documentation quality auditor" positioning is clear

### 6.2 Features Section - Add Visuals

Current feature cards are text-only. Add:
- One screenshot per feature card, OR
- Single screenshot gallery section below features

### 6.3 Contact Section - Update CTA

**Current**: "Get a Free Documentation Audit"  
**Updated**: "Become a Design Partner" (matches stage badge messaging)

---

## IMPLEMENTATION CHECKLIST

### Must Have (Required for Approval)

- [ ] **Demo video** (60-90s) embedded on homepage
- [ ] **4 product screenshots** showing Lensy UI
- [ ] **Founder section** with photo, bio, credentials
- [ ] **Stage badge** ("Prototype • Seeking Design Partners")

### Should Have (Strengthens Application)

- [ ] Technology/infrastructure brief mention
- [ ] Video fallback image
- [ ] Updated CTA language ("Design Partner")

### Not Needed

- ❌ UX/UI redesign
- ❌ Separate demo page
- ❌ Resend-style dark theme
- ❌ New navigation structure
- ❌ Multiple analysis modes (keep hidden)

---

## ASSETS TO CREATE

| Asset | Type | Action |
|-------|------|--------|
| Demo video | MP4 (60-90s) | Record screen walkthrough of Doc Mode |
| URL input screenshot | PNG | Capture Lensy input screen |
| Analysis progress screenshot | PNG | Capture streaming analysis |
| Quality scores screenshot | PNG | Capture results dashboard |
| Recommendations screenshot | PNG | Capture code fix view |
| Founder photo | JPG | Use existing from LinkedIn/portfolio |

---

## HOMEPAGE STRUCTURE (After Updates)

```
perseveranceai.com
├── Hero Section (existing + stage badge)
├── Product Demo Section (NEW - video + screenshots)
├── Features Section (existing, optionally add visuals)
├── Benefits Section (existing)
├── About the Founder (NEW)
├── Technology Brief (NEW - optional)
└── Contact/Design Partner Form (existing, updated CTA)
```

---

## AFTER IMPLEMENTATION

1. Test on mobile and desktop
2. Verify video loads correctly
3. Check all images display properly
4. Email Will at Google: "Website updated with product demo, screenshots, and founder information. Ready for re-review."

---

## REFERENCE

**Google's Requirements** (from email):
- Business Description: What they do, problems they solve, target audience ✅ (existing)
- Team Information: Key members and relevant experience ❌ (ADD)
- Products: What they're building with images/videos/demos ❌ (ADD)
- Development stage: Current stage of product ❌ (ADD)
- All info must be publicly visible (no login walls) ✅ (existing)
