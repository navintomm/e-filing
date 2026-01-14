# Draft Suit System - Complete Architecture Document

## 🎯 System Overview

**Purpose**: Single-input, multi-document drafting system for advocates  
**Scope**: Drafting ONLY (NOT e-filing)  
**Workflow**: Kerala e-Filing inspired  
**Output**: 10+ court documents from one data entry session

---

## 📋 MANDATORY FLOW SEQUENCE

```
1. Basic Details
   ↓
2. Party / Plaint Details
   ↓
3. Schedule Details
   ↓
4. Document Details
   ↓
5. Interlocutory Applications
   ↓
6. Upload Judgements
   ↓
7. Generate Documents (Automatic)
   ↓
8. Preview & Edit in Google Docs
   ↓
9. Save as DOC & PDF in Google Drive
```

**CRITICAL RULE**: Document generation BLOCKED until Steps 1-6 are completed.

---

## 🔹 STEP 1: BASIC DETAILS

### UI Design Pattern
- Kerala e-Filing inspired layout
- Progressive disclosure
- Conditional field rendering
- Real-time validation

### Required Fields

| Field | Type | Options | Conditional Logic |
|-------|------|---------|-------------------|
| **District** | Dropdown | All Kerala Districts | - |
| **Court** | Dropdown | Courts in selected District | Depends on District |
| **Case Type** | Dropdown | OS, OP, CS, etc. | - |
| **Vakalath / Memo** | Radio | Vakalathnama, Memo | - |
| **Party Signature** | Toggle | Yes/No | Required if Vakalathnama |
| **Applicant Status** | Dropdown | Complainant, Petitioner, Plaintiff, Applicant, Defendant, Respondent, Opposite Party, Other | - |

### Removed Fields (From e-Filing)
- ❌ Subject
- ❌ Applicant Type
- ❌ Filing Fee
- ❌ Payment Gateway
- ❌ E-Stamp
- ❌ Case Number (auto-assigned)

### Data Model
```typescript
interface BasicDetails {
  district: string;
  court: string;
  caseType: string;
  vakalathType: 'vakalathnama' | 'memo';
  partySignatureRequired: boolean;
  applicantStatus: ApplicantStatus;
  year: number;
  caseNumber?: string; // Optional for drafting
}

type ApplicantStatus = 
  | 'complainant'
  | 'petitioner'
  | 'plaintiff'
  | 'applicant'
  | 'defendant'
  | 'respondent'
  | 'opposite_party'
  | 'other';
```

### Validation Rules
```typescript
const basicDetailsValidation = {
  district: { required: true },
  court: { required: true, dependsOn: 'district' },
  caseType: { required: true },
  vakalathType: { required: true },
  partySignatureRequired: { 
    required: true, 
    condition: 'vakalathType === "vakalathnama"' 
  },
  applicantStatus: { required: true }
};
```

---

## 🔹 STEP 2: PARTY / PLAINT DETAILS

### Purpose
Collect comprehensive plaint information that will be reused across:
- Plaint document
- Affidavit
- IAs
- Dockets

### Required Fields

#### Party Information
```typescript
interface Party {
  id: string;
  name: string;
  parentage: string; // S/o, D/o, W/o
  age: number;
  occupation: string;
  address: {
    building: string;
    street: string;
    locality: string;
    district: string;
    state: string;
    pincode: string;
  };
  role: 'plaintiff' | 'defendant';
  order: number; // 1st plaintiff, 2nd plaintiff, etc.
}

interface PlaintDetails {
  parties: {
    plaintiffs: Party[];
    defendants: Party[];
  };
  causeOfAction: {
    dateOfCause: Date;
    placeOfCause: string;
    description: string; // Rich text, 2000+ chars
  };
  jurisdiction: {
    territorialJurisdiction: string;
    pecuniaryJurisdiction: string;
    subjectMatterJurisdiction: string;
  };
  factsOfCase: {
    chronology: ChronologicalFact[];
    summary: string;
  };
  reliefSought: Relief[];
  valuation: {
    marketValue: number;
    reliefValue: number;
    courtFeeCalculation: string;
  };
}

interface ChronologicalFact {
  id: string;
  date: Date;
  description: string;
  order: number;
}

interface Relief {
  id: string;
  type: 'declaration' | 'injunction' | 'damages' | 'possession' | 'specific_performance' | 'other';
  description: string;
  order: number;
}
```

### UI Components
- **Party Manager**: Add/Edit/Remove multiple plaintiffs/defendants
- **Timeline Builder**: Chronological fact entry with date picker
- **Jurisdiction Wizard**: Auto-suggest based on case type
- **Relief Builder**: Template-based relief clauses with customization
- **Valuation Calculator**: Auto-calculate court fees

### Reusability Map
| Input | Used In |
|-------|---------|
| Party Details | Plaint, Vakalath, All Dockets, Affidavit |
| Cause of Action | Plaint, IAs |
| Jurisdiction | Plaint |
| Facts | Plaint, Affidavit |
| Relief | Plaint, IAs |
| Valuation | Suit Valuation Document, Court Fee Calculation |

---

## 🔹 STEP 3: SCHEDULE DETAILS

### Purpose
Capture property/asset details for Schedule documents

### Data Model
```typescript
interface Schedule {
  id: string;
  scheduleName: string; // 'A', 'B', 'C', etc.
  type: 'property' | 'movable' | 'document' | 'other';
  description: string;
  measurements?: {
    area: number;
    unit: 'sqft' | 'sqm' | 'cent' | 'acre';
    dimensions?: string;
  };
  boundaries?: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  surveyNumber?: string;
  registrationDetails?: {
    documentNumber: string;
    year: number;
    sro: string;
  };
  order: number;
}

interface ScheduleDetails {
  schedules: Schedule[];
}
```

### UI Features
- **Schedule Builder**: Add multiple schedules (A, B, C, etc.)
- **Boundary Mapper**: Visual N-S-E-W input
- **Survey Number Parser**: Auto-format survey numbers
- **Template Library**: Pre-filled property description templates

### Generated Documents
1. **Plaint Schedule Section**: Embedded in main plaint
2. **Schedule Annexure**: Separate detailed schedule document
3. **Schedule in Docket**: Summary for docket reference

---

## 🔹 STEP 4: DOCUMENT DETAILS

### Purpose
List all supporting documents to be filed with the suit

### Data Model
```typescript
interface DocumentItem {
  id: string;
  serialNumber: number;
  description: string;
  documentType: 'original' | 'certified_copy' | 'xerox' | 'affidavit';
  date?: Date;
  pageCount?: number;
  isMarked: boolean; // Marked as EX-A1, EX-A2, etc.
  markingLabel?: string;
  order: number;
}

interface DocumentDetails {
  documents: DocumentItem[];
  totalPages: number; // Auto-calculated
}
```

### UI Components
- **Document List Manager**: Drag-to-reorder, add/delete
- **Page Counter**: Auto-sum total pages
- **Marking System**: Auto-generate EX-A1, EX-A2, etc.
- **Document Type Templates**: Quick-add common documents

### Generated Documents
1. **Plaint Document List**: Formatted list embedded in plaint
2. **Document Docket**: Master docket for all documents
3. **Individual Document Dockets**: One docket per document

---

## 🔹 STEP 5: INTERLOCUTORY APPLICATIONS

### Purpose
Create multiple IAs with the suit (e.g., IA for injunction, IA for condonation)

### Data Model
```typescript
interface InterlocutoryApplication {
  id: string;
  iaNumber: string; // IA 1/2025, IA 2/2025, etc.
  title: string;
  purpose: string;
  grounds: string[];
  reliefRequested: string;
  urgency?: 'urgent' | 'normal';
  facts: string; // Can reference main plaint facts
  affidavitRequired: boolean;
  order: number;
}

interface IADetails {
  applications: InterlocutoryApplication[];
}
```

### UI Features
- **IA Builder**: Step-by-step IA creation
- **Fact Importer**: Import facts from main plaint
- **Template Library**: Common IAs (injunction, stay, etc.)
- **Affidavit Auto-Generation**: Convert IA to affidavit format

### Generated Documents (Per IA)
1. **IA Document**: The application itself
2. **IA Docket**: Docket for the IA
3. **IA Affidavit**: Auto-generated supporting affidavit

---

## 🔹 STEP 6: UPLOAD JUDGEMENTS

### Purpose
Attach reference case laws and judgements

### Data Model
```typescript
interface Judgement {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  relevantParagraphs?: string;
  fileUrl?: string; // PDF upload
  order: number;
}

interface JudgementDetails {
  judgements: Judgement[];
}
```

### UI Features
- **Citation Parser**: Auto-parse standard citation formats
- **PDF Upload**: Store in Google Drive
- **Quick Reference**: Add to document list automatically

### Integration
- Listed in **Document List**
- **NOT modified or rewritten**
- Original PDFs preserved
- Referenced in Legal Arguments section

---

## 🔹 STEP 7: GENERATE DOCUMENTS (AUTOMATIC)

### Document Generation Pipeline

```typescript
interface GenerationPipeline {
  step: number;
  documentName: string;
  template: string;
  dataSource: string[];
  generator: GeneratorFunction;
  outputFormat: 'docx' | 'pdf' | 'both';
}

const GENERATION_SEQUENCE: GenerationPipeline[] = [
  {
    step: 1,
    documentName: 'Vakalath + Docket',
    template: 'vakalath-kerala-template',
    dataSource: ['basicDetails', 'partyDetails'],
    generator: generateVakalath,
    outputFormat: 'both'
  },
  {
    step: 2,
    documentName: 'Plaint',
    template: 'plaint-kerala-template',
    dataSource: ['basicDetails', 'partyDetails', 'plaintDetails', 'scheduleDetails'],
    generator: generatePlaint,
    outputFormat: 'both'
  },
  {
    step: 3,
    documentName: 'Suit Valuation',
    template: 'valuation-template',
    dataSource: ['basicDetails', 'plaintDetails.valuation'],
    generator: generateValuation,
    outputFormat: 'both'
  },
  {
    step: 4,
    documentName: 'Schedule Annexure',
    template: 'schedule-template',
    dataSource: ['scheduleDetails'],
    generator: generateSchedule,
    outputFormat: 'both'
  },
  {
    step: 5,
    documentName: 'Plaint Document List',
    template: 'document-list-template',
    dataSource: ['documentDetails'],
    generator: generateDocumentList,
    outputFormat: 'both'
  },
  {
    step: 6,
    documentName: 'Plaint Docket',
    template: 'plaint-docket-template',
    dataSource: ['basicDetails', 'partyDetails', 'documentDetails'],
    generator: generatePlaintDocket,
    outputFormat: 'both'
  },
  {
    step: 7,
    documentName: 'Plaint Affidavit',
    template: 'affidavit-template',
    dataSource: ['basicDetails', 'partyDetails', 'plaintDetails'],
    generator: generateAffidavit,
    outputFormat: 'both'
  },
  {
    step: 8,
    documentName: 'Interlocutory Applications',
    template: 'ia-template',
    dataSource: ['basicDetails', 'iaDetails'],
    generator: generateIAs,
    outputFormat: 'both'
  },
  {
    step: 9,
    documentName: 'IA Dockets',
    template: 'ia-docket-template',
    dataSource: ['basicDetails', 'iaDetails'],
    generator: generateIADockets,
    outputFormat: 'both'
  },
  {
    step: 10,
    documentName: 'Combined Document Docket',
    template: 'combined-docket-template',
    dataSource: ['basicDetails', 'documentDetails', 'iaDetails'],
    generator: generateCombinedDocket,
    outputFormat: 'both'
  },
  {
    step: 11,
    documentName: 'Individual Document Dockets',
    template: 'individual-docket-template',
    dataSource: ['basicDetails', 'documentDetails'],
    generator: generateIndividualDockets,
    outputFormat: 'both'
  },
  {
    step: 12,
    documentName: 'Batta Memo',
    template: 'batta-memo-template',
    dataSource: ['basicDetails', 'partyDetails'],
    generator: generateBattaMemo,
    outputFormat: 'both'
  }
];
```

### Template Engine Rules

#### ✅ ALLOWED
- **Placeholder injection**: `{{party.name}}`
- **Conditional sections**: `{{#if hasSchedule}}...{{/if}}`
- **Loop rendering**: `{{#each defendants}}...{{/each}}`
- **Date formatting**: `{{formatDate date}}`
- **Number formatting**: `{{formatCurrency value}}`

#### ❌ PROHIBITED
- AI text rewriting
- Changing template layout
- Removing dotted lines
- Modifying margins/spacing
- Responsive design changes
- Any layout restructuring

### Vakalath Special Rules
```typescript
interface VakalathSpecifications {
  totalPages: 2;
  page1: {
    content: 'full_vakalath_body';
    margins: { top: '1in', right: '1in', bottom: '1in', left: '1in' };
  };
  page2: {
    leftHalf: 'BLANK'; // Absolutely empty
    rightHalf: 'DOCKET_ONLY';
    margins: { top: '1in', right: '1in', bottom: '1in', left: '4.25in' }; // Left margin = page width / 2
  };
  dottedLines: 'preserve'; // Never remove
  textAlignment: 'on_dotted_lines'; // Text must sit ON lines, not above/below
}
```

---

## 🔹 STEP 8: PREVIEW & EDIT IN GOOGLE DOCS

### Integration Flow
```typescript
interface GoogleDocsIntegration {
  uploadToGDrive: (document: GeneratedDocument) => Promise<string>; // Returns file ID
  openInGoogleDocs: (fileId: string) => Promise<string>; // Returns edit URL
  enableEditMode: (fileId: string) => Promise<void>;
  trackChanges: (fileId: string) => Promise<Change[]>;
  downloadEdited: (fileId: string) => Promise<Buffer>;
}
```

### Edit Capabilities
- ✅ Text content edits
- ✅ Minor formatting (bold, italic, underline)
- ✅ Add/remove paragraphs
- ❌ Layout changes
- ❌ Margin adjustments
- ❌ Template structure modifications

### UI Features
- **Split View**: Original template vs. Edited version
- **Change Tracker**: Highlight user modifications
- **Template Lock**: Prevent layout changes
- **Revert Option**: Restore original template

---

## 🔹 STEP 9: SAVE OUTPUT TO GOOGLE DRIVE

### File Naming Convention
```typescript
interface FileNaming {
  pattern: '{caseType}_{caseNumber}_{year}_{documentType}.{extension}';
  examples: [
    'OS_225_2025_Vakalath.pdf',
    'OS_225_2025_Vakalath.docx',
    'OS_225_2025_Plaint.pdf',
    'OS_225_2025_Plaint.docx',
    'OS_225_2025_IA1_Injunction.pdf',
    'OS_225_2025_Schedule_A.pdf',
    'OS_225_2025_Document_Docket.pdf'
  ];
}
```

### Folder Structure
```
Google Drive
└── Vakalath Drafts
    └── OS_225_2025
        ├── 01_Vakalath
        │   ├── OS_225_2025_Vakalath.pdf
        │   └── OS_225_2025_Vakalath.docx
        ├── 02_Plaint
        │   ├── OS_225_2025_Plaint.pdf
        │   └── OS_225_2025_Plaint.docx
        ├── 03_Schedules
        │   ├── OS_225_2025_Schedule_A.pdf
        │   └── OS_225_2025_Schedule_B.pdf
        ├── 04_IAs
        │   ├── OS_225_2025_IA1.pdf
        │   └── OS_225_2025_IA2.pdf
        ├── 05_Dockets
        │   ├── OS_225_2025_Plaint_Docket.pdf
        │   └── OS_225_2025_Combined_Docket.pdf
        └── 06_Supporting_Documents
            ├── OS_225_2025_Document_List.pdf
            └── OS_225_2025_Batta_Memo.pdf
```

### Download Options
```typescript
interface DownloadOptions {
  format: 'pdf' | 'docx' | 'both';
  packaging: 'individual' | 'zip_all' | 'zip_by_category';
  metadata: {
    includeTimestamp: boolean;
    includeSummary: boolean; // JSON summary of all inputs
  };
}
```

---

## 🚫 STRICT PROHIBITIONS

### Removed from Kerala e-Filing System
1. ❌ Court filing submission
2. ❌ Payment gateway integration
3. ❌ E-stamp duty calculation
4. ❌ Case status tracking
5. ❌ Court assignment
6. ❌ Hearing date scheduling
7. ❌ Notification system (to court)

### Never Allowed
1. ❌ AI rewriting of legal clauses
2. ❌ Changing template layouts
3. ❌ Responsive design for legal documents
4. ❌ Auto-complete of legal arguments
5. ❌ Client/case data sharing across users
6. ❌ Direct court integration

---

## 📊 COMPLETE DATA MODEL

```typescript
interface DraftSuitData {
  // Step 1
  basicDetails: BasicDetails;
  
  // Step 2
  partyDetails: {
    plaintiffs: Party[];
    defendants: Party[];
  };
  plaintDetails: PlaintDetails;
  
  // Step 3
  scheduleDetails: ScheduleDetails;
  
  // Step 4
  documentDetails: DocumentDetails;
  
  // Step 5
  iaDetails: IADetails;
  
  // Step 6
  judgementDetails: JudgementDetails;
  
  // System metadata
  metadata: {
    draftId: string;
    createdAt: Date;
    updatedAt: Date;
    currentStep: number;
    completedSteps: number[];
    isComplete: boolean;
    generatedDocuments?: GeneratedDocument[];
  };
}

interface GeneratedDocument {
  id: string;
  name: string;
  type: string;
  googleDocsUrl?: string;
  googleDriveFileId?: string;
  downloadUrl?: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  generatedAt?: Date;
}
```

---

## 🎨 UI/UX SPECIFICATIONS

### Design Principles
1. **Progressive Disclosure**: Show only current step
2. **Kerala e-Filing Visual Language**: Maintain familiar look
3. **Step Indicator**: Always visible, shows progress
4. **Form Validation**: Real-time with helpful messages
5. **Auto-save**: Save draft every 30 seconds
6. **Mobile Responsive**: For data entry (NOT for documents)

### Component Library Structure
```
components/
├── suit/
│   ├── BasicDetailsForm.tsx
│   ├── PartyManager.tsx
│   ├── PlaintDetailsForm.tsx
│   ├── ScheduleBuilder.tsx
│   ├── DocumentListManager.tsx
│   ├── IABuilder.tsx
│   ├── JudgementUploader.tsx
│   └── SuitWizard.tsx (Main orchestrator)
├── shared/
│   ├── StepIndicator.tsx
│   ├── FormField.tsx
│   ├── ValidationMessage.tsx
│   └── AutoSaveIndicator.tsx
└── preview/
    ├── DocumentPreview.tsx
    ├── GoogleDocsEmbed.tsx
    └── DownloadManager.tsx
```

---

## 🔄 STATE MANAGEMENT

```typescript
// Redux slice for suit drafting
interface SuitDraftState {
  currentDraft: DraftSuitData | null;
  currentStep: number;
  validationErrors: Record<number, ValidationError[]>;
  isSaving: boolean;
  isGenerating: boolean;
  generationProgress: number;
}

// Actions
const suitDraftActions = {
  startNewDraft: () => void;
  updateBasicDetails: (details: BasicDetails) => void;
  addParty: (party: Party) => void;
  updatePlaintDetails: (details: PlaintDetails) => void;
  addSchedule: (schedule: Schedule) => void;
  addDocument: (document: DocumentItem) => void;
  addIA: (ia: InterlocutoryApplication) => void;
  addJudgement: (judgement: Judgement) => void;
  proceedToNextStep: () => void;
  goBackToPreviousStep: () => void;
  saveProgress: () => Promise<void>;
  generateAllDocuments: () => Promise<void>;
  openInGoogleDocs: (documentId: string) => Promise<void>;
  downloadDocument: (documentId: string, format: 'pdf' | 'docx') => Promise<void>;
};
```

---

## 📁 PROJECT STRUCTURE

```
app/
├── suit/
│   ├── new/
│   │   └── page.tsx                  # Entry point: "Draft Suit" button
│   ├── draft/
│   │   ├── [draftId]/
│   │   │   ├── page.tsx             # Main wizard page
│   │   │   ├── basic-details/       # Step 1
│   │   │   ├── party-details/       # Step 2
│   │   │   ├── schedule-details/    # Step 3
│   │   │   ├── document-details/    # Step 4
│   │   │   ├── ia-details/          # Step 5
│   │   │   ├── judgement-upload/    # Step 6
│   │   │   ├── generate/            # Step 7
│   │   │   └── preview/             # Step 8 & 9
│   └── saved/
│       └── page.tsx                  # List of saved drafts

lib/
├── generators/
│   ├── vakalath-generator.ts
│   ├── plaint-generator.ts
│   ├── valuation-generator.ts
│   ├── schedule-generator.ts
│   ├── document-list-generator.ts
│   ├── docket-generator.ts
│   ├── affidavit-generator.ts
│   ├── ia-generator.ts
│   └── batta-memo-generator.ts
├── templates/
│   ├── kerala-templates/
│   │   ├── vakalath.html
│   │   ├── plaint.html
│   │   ├── valuation.html
│   │   ├── schedule.html
│   │   ├── docket.html
│   │   ├── affidavit.html
│   │   ├── ia.html
│   │   └── batta-memo.html
│   └── template-engine.ts
├── validators/
│   ├── basic-details-validator.ts
│   ├── party-validator.ts
│   ├── plaint-validator.ts
│   └── complete-suit-validator.ts
├── integrations/
│   ├── google-docs-api.ts
│   ├── google-drive-api.ts
│   └── pdf-generator.ts
└── utils/
    ├── file-naming.ts
    ├── date-formatter.ts
    └── legal-text-formatter.ts

types/
└── suit.ts                           # All TypeScript interfaces

store/
└── suit-draft-slice.ts               # Redux state management
```

---

## 🔒 VALIDATION & ERROR HANDLING

### Step-by-Step Validation
```typescript
const stepValidators = {
  1: validateBasicDetails,
  2: validatePartyAndPlaint,
  3: validateSchedules,
  4: validateDocuments,
  5: validateIAs,
  6: validateJudgements
};

// Block "Next" button if current step invalid
const canProceedToNextStep = (currentStep: number, data: DraftSuitData): boolean => {
  const validator = stepValidators[currentStep];
  if (!validator) return false;
  
  const errors = validator(data);
  return errors.length === 0;
};

// Block document generation if any step incomplete
const canGenerateDocuments = (data: DraftSuitData): boolean => {
  return [1, 2, 3, 4, 5, 6].every(step => {
    const validator = stepValidators[step];
    return validator(data).length === 0;
  });
};
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [ ] Set up project structure
- [ ] Create TypeScript interfaces
- [ ] Set up Redux store
- [ ] Build step wizard component
- [ ] Implement auto-save

### Phase 2: Data Entry Forms (Week 3-5)
- [ ] Step 1: Basic Details form
- [ ] Step 2: Party & Plaint forms
- [ ] Step 3: Schedule builder
- [ ] Step 4: Document list manager
- [ ] Step 5: IA builder
- [ ] Step 6: Judgement uploader

### Phase 3: Template System (Week 6-7)
- [ ] Create Kerala-compliant HTML templates
- [ ] Build template engine (Handlebars/Mustache)
- [ ] Implement placeholder injection logic
- [ ] Create Vakalath 2-page layout
- [ ] Test all 12 document templates

### Phase 4: Document Generation (Week 8-9)
- [ ] Implement all 12 generators
- [ ] Build generation pipeline
- [ ] Add progress tracking
- [ ] Implement error handling
- [ ] Test with real data

### Phase 5: Google Integration (Week 10-11)
- [ ] Set up Google Cloud project
- [ ] Implement Drive API integration
- [ ] Implement Docs API integration
- [ ] Build preview interface
- [ ] Build download manager

### Phase 6: Testing & Polish (Week 12)
- [ ] End-to-end testing
- [ ] Template accuracy review
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment

---

## 📝 SAMPLE WORKFLOW

### Advocate Journey
```
1. Click "Draft New Suit"
   ↓
2. Fill Basic Details (District: Ernakulam, Court: Principal DS Court, Case: OS)
   ↓
3. Add Parties (2 Plaintiffs, 1 Defendant)
   ↓
4. Enter Plaint Details (Cause, Facts, Relief)
   ↓
5. Add Schedule A (Property details with boundaries)
   ↓
6. Add 5 documents to Document List
   ↓
7. Create IA for Temporary Injunction
   ↓
8. Upload 2 reference judgements
   ↓
9. Click "Generate All Documents"
   ↓
10. System generates 15 documents in 30 seconds
    ↓
11. Review in Google Docs, make minor edits
    ↓
12. Download all as ZIP (PDF + DOCX)
    ↓
13. Print and file in court manually
```

---

## ✅ SUCCESS CRITERIA

1. **Single Input**: Enter data once, use everywhere
2. **Zero AI Rewriting**: Only template injection
3. **Template Accuracy**: Matches Kerala court standards
4. **Complete Generation**: All 12+ documents created
5. **Editable Output**: Google Docs integration works
6. **Professional Files**: Proper naming, organization
7. **Fast Generation**: < 60 seconds for all documents
8. **Error-Free**: Validation prevents incomplete documents

---

## 🎓 DEVELOPER NOTES

### Key Technologies
- **Frontend**: Next.js 14+, React 18+, TypeScript
- **State**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **Templates**: Handlebars.js
- **Document**: docx.js for DOCX, jsPDF for PDF
- **Google APIs**: googleapis npm package
- **Storage**: Firebase Firestore (draft saving)

### Performance Considerations
- Lazy load form steps (code splitting)
- Memoize expensive template compilations
- Stream large document generations
- Use Web Workers for PDF generation
- Implement request debouncing for auto-save

### Security
- Sanitize all user inputs
- Prevent template injection attacks
- Secure Google OAuth tokens
- Encrypt sensitive draft data
- Implement role-based access control

---

**END OF ARCHITECTURE DOCUMENT**

This document serves as the complete technical specification for the Draft Suit System. All developers must refer to this before implementation.
