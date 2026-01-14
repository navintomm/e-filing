# Draft Suit System - Visual Flow & Quick Start Guide

## 🎯 SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRAFT SUIT SYSTEM                             │
│              (Kerala e-Filing Inspired)                          │
│                                                                  │
│  Purpose: Generate 12+ court documents from single data entry   │
│  Scope: DRAFTING ONLY (Not e-filing)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 COMPLETE WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────┐
│  USER CLICKS "DRAFT NEW SUIT"                                           │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 1: BASIC DETAILS                                                  │
│  ─────────────────────────                                              │
│  Input:                                                                 │
│  • District (Dropdown)                                                  │
│  • Court (Dropdown - filtered by district)                             │
│  • Case Type (OS, OP, CS, etc.)                                         │
│  • Vakalath Type (Vakalathnama / Memo)                                  │
│  • Party Signature Required? (if Vakalathnama)                          │
│  • Applicant Status (Plaintiff/Defendant/etc.)                          │
│                                                                         │
│  Validation: All fields required                                        │
│  Output: BasicDetails object                                            │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Next] (blocked if validation fails)
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 2: PARTY / PLAINT DETAILS                                         │
│  ───────────────────────────────                                        │
│  Input:                                                                 │
│  • Plaintiffs (Multiple):                                               │
│    - Name, Age, Parentage, Occupation, Full Address                    │
│  • Defendants (Multiple):                                               │
│    - Name, Age, Parentage, Occupation, Full Address                    │
│  • Cause of Action:                                                     │
│    - Date, Place, Description                                           │
│  • Jurisdiction:                                                        │
│    - Territorial, Pecuniary, Subject Matter                            │
│  • Facts of Case:                                                       │
│    - Chronological Events (Timeline Builder)                           │
│    - Summary                                                            │
│  • Relief Sought:                                                       │
│    - Type (Declaration/Injunction/Damages/etc.)                        │
│    - Description                                                        │
│  • Valuation:                                                           │
│    - Market Value, Relief Value, Court Fee                             │
│                                                                         │
│  Validation: At least 1 plaintiff, 1 defendant, 1 relief                │
│  Output: PartyDetails + PlaintDetails objects                           │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Next]
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 3: SCHEDULE DETAILS                                               │
│  ─────────────────────────                                              │
│  Input:                                                                 │
│  • Schedules (Multiple - A, B, C, etc.):                                │
│    - Type (Property/Movable/Document/Other)                            │
│    - Description                                                        │
│    - Measurements (Area, Unit, Dimensions)                             │
│    - Boundaries (North, South, East, West)                             │
│    - Survey Number                                                      │
│    - Registration Details                                              │
│                                                                         │
│  Validation: At least 1 schedule (if property case)                     │
│  Output: ScheduleDetails object                                         │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Next]
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 4: DOCUMENT DETAILS                                               │
│  ─────────────────────────                                              │
│  Input:                                                                 │
│  • Documents (Multiple):                                                │
│    - Description                                                        │
│    - Type (Original/Certified Copy/Xerox/Affidavit)                    │
│    - Date                                                               │
│    - Page Count                                                         │
│    - Marking (Auto: EX-A1, EX-A2, etc.)                                │
│                                                                         │
│  Features:                                                              │
│  • Drag-to-reorder                                                      │
│  • Auto-numbering                                                       │
│  • Total page calculation                                              │
│                                                                         │
│  Validation: At least 1 document                                        │
│  Output: DocumentDetails object                                         │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Next]
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 5: INTERLOCUTORY APPLICATIONS                                     │
│  ───────────────────────────────────                                    │
│  Input:                                                                 │
│  • IAs (Multiple - IA 1/2025, IA 2/2025, etc.):                         │
│    - Title                                                              │
│    - Purpose                                                            │
│    - Grounds (Multiple points)                                         │
│    - Relief Requested                                                   │
│    - Urgency (Urgent/Normal)                                           │
│    - Facts (Can import from main plaint)                               │
│                                                                         │
│  Features:                                                              │
│  • Template library (Injunction, Stay, etc.)                           │
│  • Fact importer                                                        │
│  • Auto-generate affidavit                                             │
│                                                                         │
│  Validation: Optional (can skip)                                        │
│  Output: IADetails object                                               │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Next]
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 6: UPLOAD JUDGEMENTS                                              │
│  ──────────────────────────                                             │
│  Input:                                                                 │
│  • Judgements (Multiple):                                               │
│    - Case Name                                                          │
│    - Citation                                                           │
│    - Court                                                              │
│    - Year                                                               │
│    - PDF Upload (optional)                                             │
│    - Relevant Paragraphs                                               │
│                                                                         │
│  Features:                                                              │
│  • Citation parser                                                      │
│  • PDF upload to Google Drive                                          │
│                                                                         │
│  Validation: Optional (can skip)                                        │
│  Output: JudgementDetails object                                        │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Generate Documents] (blocked if Steps 1-6 invalid)
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 7: GENERATE DOCUMENTS (AUTOMATIC)                                 │
│  ────────────────────────────────────────                               │
│  Process:                                                               │
│  1. Validate all inputs ✓                                               │
│  2. Compile templates with data                                         │
│  3. Generate 12+ documents:                                             │
│                                                                         │
│     ┌─────────────────────────────────────┐                            │
│     │ 1. Vakalath + Docket                │ ← basicDetails, partyDetails│
│     │ 2. Plaint                            │ ← all data                 │
│     │ 3. Suit Valuation                   │ ← valuation                 │
│     │ 4. Schedule Annexure                │ ← scheduleDetails           │
│     │ 5. Plaint Document List             │ ← documentDetails           │
│     │ 6. Plaint Docket                    │ ← basic + party + docs      │
│     │ 7. Plaint Affidavit                 │ ← basic + party + facts     │
│     │ 8. Interlocutory Applications       │ ← iaDetails                 │
│     │ 9. IA Dockets (1 per IA)            │ ← iaDetails                 │
│     │ 10. Combined Document Docket        │ ← all docs + IAs            │
│     │ 11. Individual Doc Dockets          │ ← each document             │
│     │ 12. Batta Memo                      │ ← basic + party             │
│     └─────────────────────────────────────┘                            │
│                                                                         │
│  4. Convert to DOCX & PDF                                               │
│  5. Upload to Google Drive                                              │
│                                                                         │
│  Progress: 0% ████████████████████ 100%                                 │
│  Status: Generating... (≈30-60 seconds)                                 │
│                                                                         │
│  Output: 12+ GeneratedDocument objects                                  │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Success]
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 8: PREVIEW & EDIT IN GOOGLE DOCS                                  │
│  ───────────────────────────────────────                                │
│  Display:                                                               │
│  ┌───────────────────────────────────────────────────────────────┐     │
│  │  Document List:                                                │     │
│  │  ✓ Vakalath + Docket                    [Preview] [Edit]      │     │
│  │  ✓ Plaint                               [Preview] [Edit]      │     │
│  │  ✓ Suit Valuation                       [Preview] [Edit]      │     │
│  │  ✓ Schedule Annexure                    [Preview] [Edit]      │     │
│  │  ... (all 12 documents)                                       │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  Features:                                                              │
│  • Click [Preview] → Opens in iframe                                    │
│  • Click [Edit] → Opens Google Docs in new tab                          │
│  • Live editing in Google Docs                                          │
│  • Changes auto-saved to Google Drive                                   │
│                                                                         │
│  Allowed Edits:                                                         │
│  ✓ Text content                                                         │
│  ✓ Minor formatting (bold, italic, underline)                           │
│  ✓ Add/remove paragraphs                                                │
│  ✗ Layout changes (BLOCKED)                                             │
│  ✗ Margin adjustments (BLOCKED)                                         │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │ [Proceed to Download]
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 9: SAVE AS DOC & PDF IN GOOGLE DRIVE                              │
│  ───────────────────────────────────────────────────                    │
│  Download Options:                                                      │
│  ┌───────────────────────────────────────────────────────────────┐     │
│  │  Format:                                                       │     │
│  │  ( ) PDF only                                                  │     │
│  │  ( ) DOCX only                                                 │     │
│  │  (•) Both PDF + DOCX                                           │     │
│  │                                                                │     │
│  │  Packaging:                                                    │     │
│  │  ( ) Individual files                                          │     │
│  │  (•) ZIP all files                                             │     │
│  │  ( ) ZIP by category                                           │     │
│  │                                                                │     │
│  │  [Download All] [Download Selected]                           │     │
│  └───────────────────────────────────────────────────────────────┘     │
│                                                                         │
│  Google Drive Structure:                                                │
│  📁 Vakalath Drafts                                                     │
│    └─ 📁 OS_225_2025                                                    │
│        ├─ 📁 01_Vakalath                                                │
│        │   ├─ OS_225_2025_Vakalath.pdf                                 │
│        │   └─ OS_225_2025_Vakalath.docx                                │
│        ├─ 📁 02_Plaint                                                  │
│        │   ├─ OS_225_2025_Plaint.pdf                                   │
│        │   └─ OS_225_2025_Plaint.docx                                  │
│        ├─ 📁 03_Schedules                                               │
│        ├─ 📁 04_IAs                                                     │
│        ├─ 📁 05_Dockets                                                 │
│        └─ 📁 06_Supporting_Documents                                    │
│                                                                         │
│  Output: Downloaded files + Google Drive links                          │
└─────────────────┬───────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ COMPLETE - READY TO FILE IN COURT MANUALLY                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX FLOW

```
┌──────────────────────────────────────────────────────────────┐
│  Navigation Bar                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [Logo] Draft Suit System      [Save Draft] [Logout]   │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  Step Indicator (Always Visible)                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ① Basic ─ ② Party ─ ③ Schedule ─ ④ Docs ─ ⑤ IAs ─    │  │
│  │   [✓]      [✓]      [✓]         [•]      [ ]          │  │
│  │                                                         │  │
│  │ ⑥ Judgements ─ ⑦ Generate ─ ⑧ Preview ─ ⑨ Download    │  │
│  │   [ ]           [ ]          [ ]         [ ]          │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  Main Content Area                                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  [Current Step Form/Component]                         │  │
│  │                                                         │  │
│  │  • Progressive disclosure                              │  │
│  │  • Real-time validation                                │  │
│  │  • Helpful error messages                              │  │
│  │  • Conditional field rendering                         │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  Navigation Buttons                                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  [← Back]                            [Next →]          │  │
│  │  (always enabled)      (disabled if validation fails)  │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│  Footer                                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Auto-save: ✓ Saved 2 minutes ago                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 QUICK START FOR DEVELOPERS

### Prerequisites
```bash
# Install Node.js 18+
# Install npm or yarn
# Have Google Cloud account
```

### 1. Clone/Setup Project
```bash
cd "c:\Users\NAVIN TOM BABU\Desktop\Vakalath Drafting & e-Filing"
npm install
```

### 2. Install Additional Dependencies
```bash
npm install zod react-hook-form @hookform/resolvers handlebars \
  html-docx-js puppeteer googleapis jszip react-datepicker \
  react-quill react-beautiful-dnd
```

### 3. Set Up Google Cloud
```bash
# 1. Go to https://console.cloud.google.com
# 2. Create new project: "Draft Suit System"
# 3. Enable APIs:
#    - Google Drive API
#    - Google Docs API
# 4. Create Service Account
# 5. Download JSON credentials
# 6. Save as: google-credentials.json
```

### 4. Configure Environment
```bash
# Create .env.local
echo "GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
```

### 5. Create Folder Structure
```bash
mkdir -p app/suit/{new,draft/[draftId],saved}
mkdir -p lib/{generators,templates/kerala-templates,validators,integrations,utils}
mkdir -p components/{suit,shared,preview}
mkdir -p types
mkdir -p store
```

### 6. Copy Type Definitions
```bash
# Already created: types/suit.ts
# Verify it exists
```

### 7. Start Development Server
```bash
npm run dev
```

### 8. Begin Implementation
Follow the tasks in `IMPLEMENTATION_PLAN.md` sequentially:
1. Phase 1: Foundation (Week 1-2)
2. Phase 2: Step 1 Form (Week 2)
3. ... and so on

---

## 📝 DATA FLOW DIAGRAM

```
User Input (Steps 1-6)
       ↓
┌──────────────────────┐
│  Redux Store         │
│  ─────────────       │
│  • basicDetails      │
│  • partyDetails      │
│  • plaintDetails     │
│  • scheduleDetails   │
│  • documentDetails   │
│  • iaDetails         │
│  • judgementDetails  │
└──────────┬───────────┘
           │
           ↓ (Step 7)
┌──────────────────────┐
│  Template Engine     │
│  ────────────────    │
│  Handlebars.js       │
│                      │
│  Compile templates   │
│  with data           │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  HTML Output         │
│  (12+ documents)     │
└──────────┬───────────┘
           │
           ├─────────────────┐
           │                 │
           ↓                 ↓
┌──────────────────┐  ┌──────────────────┐
│  DOCX Generator  │  │  PDF Generator   │
│  (html-docx-js)  │  │  (puppeteer)     │
└──────────┬───────┘  └──────────┬───────┘
           │                     │
           └──────────┬──────────┘
                      ↓
           ┌──────────────────────┐
           │  Google Drive API    │
           │  ────────────────    │
           │  Upload files        │
           │  Create folders      │
           │  Get edit URLs       │
           └──────────┬───────────┘
                      │
                      ↓ (Step 8)
           ┌──────────────────────┐
           │  Google Docs         │
           │  Preview & Edit      │
           └──────────┬───────────┘
                      │
                      ↓ (Step 9)
           ┌──────────────────────┐
           │  Download Manager    │
           │  PDF + DOCX + ZIP    │
           └──────────────────────┘
```

---

## 🎯 CRITICAL SUCCESS FACTORS

### Template System (MOST IMPORTANT)
```
✓ Fixed layouts (never change)
✓ Kerala court compliant
✓ Dotted lines preserved
✓ Text aligned ON dotted lines
✓ Vakalath: 2 pages (page 2 = left blank, right docket)
✓ Proper margins: 1 inch all sides
✓ No AI rewriting
✓ Only placeholder injection
```

### Data Integrity
```
✓ Single source of truth (Redux)
✓ Type-safe (TypeScript)
✓ Validated at each step
✓ Auto-save every 30s
✓ Can resume draft anytime
```

### User Experience
```
✓ Kerala e-Filing look and feel
✓ Progressive disclosure
✓ Real-time validation
✓ Helpful error messages
✓ Fast (<60s) document generation
```

### Output Quality
```
✓ Professional file naming
✓ Organized folder structure
✓ Both PDF and DOCX formats
✓ Editable in Google Docs
✓ Print-ready immediately
```

---

## ⚠️ COMMON PITFALLS TO AVOID

### ❌ DON'T
1. ❌ Change template layouts
2. ❌ Use AI to rewrite legal text
3. ❌ Make documents responsive
4. ❌ Remove dotted lines
5. ❌ Skip validation
6. ❌ Allow document generation with incomplete data
7. ❌ Add filing/payment features
8. ❌ Modify Kerala court standards

### ✅ DO
1. ✅ Follow Kerala e-Filing design
2. ✅ Preserve template integrity
3. ✅ Implement all 9 steps
4. ✅ Test with real advocate data
5. ✅ Get advocate sign-off on templates
6. ✅ Block "Next" if validation fails
7. ✅ Auto-save frequently
8. ✅ Generate all 12 documents

---

## 📚 REFERENCE DOCUMENTS

1. **Architecture**: `DRAFT_SUIT_SYSTEM_ARCHITECTURE.md`
2. **Implementation Plan**: `IMPLEMENTATION_PLAN.md`
3. **Type Definitions**: `types/suit.ts`
4. **This Guide**: `QUICK_START_GUIDE.md`

---

## 🆘 TROUBLESHOOTING

### Issue: "Next" button not working
**Solution**: Check validation errors in Redux state

### Issue: Documents not generating
**Solution**: Verify all 6 steps completed and validated

### Issue: Google Docs not opening
**Solution**: Check Google API credentials and permissions

### Issue: Template formatting broken
**Solution**: Never modify template CSS, only inject data

### Issue: Auto-save not working
**Solution**: Check Redux middleware configuration

---

## 📞 SUPPORT

For questions during development:
1. Refer to architecture document
2. Check implementation plan
3. Review type definitions
4. Test with sample data

---

**READY TO START? Begin with Phase 1, Task 1.1 in the Implementation Plan!**
