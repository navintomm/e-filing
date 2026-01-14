# Draft Suit System - Developer Implementation Plan

## 🎯 Goal
Build a production-ready, multi-step suit drafting system that generates 12+ court documents from a single data entry session.

---

## 📋 PHASE 1: PROJECT SETUP & FOUNDATION

### Task 1.1: TypeScript Type Definitions
**File**: `types/suit.ts`

```typescript
// Create all interfaces from architecture document
// Includes: BasicDetails, Party, PlaintDetails, Schedule, etc.
```

**Checklist**:
- [ ] Create `types/suit.ts`
- [ ] Define all 20+ interfaces
- [ ] Export all types
- [ ] Add JSDoc comments
- [ ] Test with TypeScript compiler

**Estimated Time**: 4 hours

---

### Task 1.2: Redux Store Setup
**Files**: 
- `store/suit-draft-slice.ts`
- `store/index.ts`

```typescript
// Implement complete Redux slice with all actions
// Include auto-save middleware
```

**Checklist**:
- [ ] Create suit draft slice
- [ ] Implement all actions (20+)
- [ ] Add selectors
- [ ] Configure auto-save middleware (30s interval)
- [ ] Add persistence (localStorage)
- [ ] Write unit tests

**Estimated Time**: 6 hours

---

### Task 1.3: Project Structure
**Action**: Create all folders and placeholder files

```bash
mkdir -p app/suit/{new,draft/[draftId],saved}
mkdir -p lib/{generators,templates/kerala-templates,validators,integrations,utils}
mkdir -p components/suit
mkdir -p components/shared
mkdir -p components/preview
```

**Checklist**:
- [ ] Create folder structure
- [ ] Add placeholder files
- [ ] Set up barrel exports
- [ ] Configure path aliases in `tsconfig.json`

**Estimated Time**: 1 hour

---

### Task 1.4: Validation Framework
**Files**: `lib/validators/*.ts`

```typescript
// Zod schemas for each step
import { z } from 'zod';

const basicDetailsSchema = z.object({
  district: z.string().min(1, "District is required"),
  court: z.string().min(1, "Court is required"),
  // ... all fields
});
```

**Checklist**:
- [ ] Install Zod: `npm install zod`
- [ ] Create schema for each step (6 schemas)
- [ ] Create validator functions
- [ ] Add custom error messages
- [ ] Test all validators

**Estimated Time**: 5 hours

---

## 📋 PHASE 2: STEP 1 - BASIC DETAILS FORM

### Task 2.1: Data Files for Dropdowns
**File**: `lib/data/kerala-courts.ts`

```typescript
export const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  // ... all 14 districts
];

export const COURT_MAP: Record<string, string[]> = {
  "Thiruvananthapuram": [
    "Principal District and Sessions Court",
    "Additional District Court I",
    // ...
  ],
  // ... all districts
};

export const CASE_TYPES = [
  { value: "OS", label: "Original Suit" },
  { value: "OP", label: "Original Petition" },
  { value: "CS", label: "Civil Suit" },
  // ...
];
```

**Checklist**:
- [ ] Research all Kerala districts
- [ ] List all courts per district
- [ ] Define all case types
- [ ] Export constants
- [ ] Add test data

**Estimated Time**: 3 hours (research heavy)

---

### Task 2.2: Basic Details Form Component
**File**: `components/suit/BasicDetailsForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function BasicDetailsForm() {
  const { register, watch, formState } = useForm({
    resolver: zodResolver(basicDetailsSchema)
  });
  
  const selectedDistrict = watch('district');
  const vakalathType = watch('vakalathType');
  
  // Conditional rendering for courts based on district
  // Conditional rendering for party signature based on vakalath type
  
  return (
    <form>
      {/* Kerala e-Filing inspired layout */}
    </form>
  );
}
```

**Checklist**:
- [ ] Install react-hook-form: `npm install react-hook-form @hookform/resolvers`
- [ ] Create form component
- [ ] Implement conditional logic (district → court)
- [ ] Implement conditional logic (vakalathnama → party signature)
- [ ] Add real-time validation
- [ ] Style to match Kerala e-Filing
- [ ] Add "Next" button with validation check
- [ ] Test all scenarios

**Estimated Time**: 8 hours

---

### Task 2.3: Step Wizard Component
**File**: `components/suit/SuitWizard.tsx`

```typescript
export function SuitWizard() {
  const currentStep = useAppSelector(state => state.suitDraft.currentStep);
  
  const steps = [
    { id: 1, name: "Basic Details", component: BasicDetailsForm },
    { id: 2, name: "Party / Plaint Details", component: PartyDetailsForm },
    // ... all 6 steps
  ];
  
  const CurrentStepComponent = steps[currentStep - 1].component;
  
  return (
    <div>
      <StepIndicator steps={steps} currentStep={currentStep} />
      <CurrentStepComponent />
      <NavigationButtons />
    </div>
  );
}
```

**Checklist**:
- [ ] Create wizard container
- [ ] Implement step navigation
- [ ] Add step indicator UI
- [ ] Implement "Next" / "Back" logic
- [ ] Block "Next" if validation fails
- [ ] Add progress persistence
- [ ] Style navigation

**Estimated Time**: 6 hours

---

## 📋 PHASE 3: STEP 2 - PARTY & PLAINT DETAILS

### Task 3.1: Party Manager Component
**File**: `components/suit/PartyManager.tsx`

```typescript
export function PartyManager({ type }: { type: 'plaintiff' | 'defendant' }) {
  const parties = useAppSelector(state => 
    type === 'plaintiff' 
      ? state.suitDraft.currentDraft?.partyDetails.plaintiffs 
      : state.suitDraft.currentDraft?.partyDetails.defendants
  );
  
  return (
    <div>
      <h3>{type === 'plaintiff' ? 'Plaintiffs' : 'Defendants'}</h3>
      {parties?.map(party => (
        <PartyCard key={party.id} party={party} />
      ))}
      <button onClick={() => dispatch(addParty({ type, party: newParty }))}>
        Add {type}
      </button>
    </div>
  );
}
```

**Checklist**:
- [ ] Create party form fields
- [ ] Implement add/edit/delete
- [ ] Add drag-to-reorder functionality
- [ ] Implement party numbering (1st, 2nd, etc.)
- [ ] Add address auto-complete
- [ ] Validate required fields
- [ ] Test with multiple parties

**Estimated Time**: 10 hours

---

### Task 3.2: Timeline Builder (Chronological Facts)
**File**: `components/suit/TimelineBuilder.tsx`

```typescript
export function TimelineBuilder() {
  const [facts, setFacts] = useState<ChronologicalFact[]>([]);
  
  return (
    <div className="timeline">
      {facts.map((fact, index) => (
        <TimelineItem key={fact.id} fact={fact} index={index} />
      ))}
      <button onClick={addFact}>Add Event</button>
    </div>
  );
}
```

**Checklist**:
- [ ] Create timeline UI
- [ ] Add date picker integration
- [ ] Implement rich text editor for descriptions
- [ ] Add drag-to-reorder
- [ ] Auto-sort by date
- [ ] Style as visual timeline

**Libraries needed**: 
```bash
npm install react-datepicker react-quill
```

**Estimated Time**: 8 hours

---

### Task 3.3: Relief Builder
**File**: `components/suit/ReliefBuilder.tsx`

```typescript
const RELIEF_TEMPLATES = {
  declaration: "A declaration that...",
  injunction: "A permanent injunction restraining...",
  damages: "Damages amounting to Rs. ...",
  // ... more templates
};

export function ReliefBuilder() {
  const [reliefs, setReliefs] = useState<Relief[]>([]);
  
  const addRelief = (type: ReliefType) => {
    const template = RELIEF_TEMPLATES[type];
    setReliefs([...reliefs, { type, description: template }]);
  };
  
  return (
    <div>
      <ReliefTemplateSelector onSelect={addRelief} />
      <ReliefList reliefs={reliefs} />
    </div>
  );
}
```

**Checklist**:
- [ ] Create relief templates
- [ ] Implement template selector
- [ ] Add custom relief option
- [ ] Implement edit/delete
- [ ] Add reordering
- [ ] Validate at least one relief

**Estimated Time**: 6 hours

---

### Task 3.4: Jurisdiction Wizard
**File**: `components/suit/JurisdictionWizard.tsx`

```typescript
// Auto-suggest jurisdiction text based on case type
const JURISDICTION_TEMPLATES = {
  OS: {
    territorial: "This Hon'ble Court has territorial jurisdiction...",
    pecuniary: "The suit valuation is within the pecuniary jurisdiction...",
    subjectMatter: "This Hon'ble Court has jurisdiction over the subject matter..."
  },
  // ... other case types
};
```

**Checklist**:
- [ ] Create templates for common case types
- [ ] Implement auto-fill based on case type
- [ ] Allow manual editing
- [ ] Add helper text
- [ ] Validate all three jurisdictions

**Estimated Time**: 4 hours

---

### Task 3.5: Valuation Calculator
**File**: `components/suit/ValuationCalculator.tsx`

```typescript
export function ValuationCalculator() {
  const [marketValue, setMarketValue] = useState(0);
  const [reliefValue, setReliefValue] = useState(0);
  
  const courtFee = calculateCourtFee(marketValue, reliefValue);
  
  return (
    <div>
      <input 
        type="number" 
        placeholder="Market Value" 
        value={marketValue}
        onChange={(e) => setMarketValue(Number(e.target.value))}
      />
      <input 
        type="number" 
        placeholder="Relief Value" 
        value={reliefValue}
        onChange={(e) => setReliefValue(Number(e.target.value))}
      />
      <div>Calculated Court Fee: ₹{courtFee}</div>
    </div>
  );
}
```

**Checklist**:
- [ ] Research Kerala court fee calculation rules
- [ ] Implement calculation logic
- [ ] Add validation
- [ ] Display breakdown
- [ ] Format currency properly

**Estimated Time**: 5 hours

---

## 📋 PHASE 4: STEP 3 - SCHEDULE DETAILS

### Task 4.1: Schedule Builder
**File**: `components/suit/ScheduleBuilder.tsx`

```typescript
export function ScheduleBuilder() {
  const schedules = useAppSelector(state => state.suitDraft.currentDraft?.scheduleDetails.schedules);
  
  return (
    <div>
      <h3>Schedules</h3>
      {schedules?.map(schedule => (
        <ScheduleCard key={schedule.id} schedule={schedule} />
      ))}
      <button onClick={addSchedule}>Add Schedule</button>
    </div>
  );
}
```

**Checklist**:
- [ ] Create schedule form
- [ ] Auto-assign letters (A, B, C...)
- [ ] Implement property type selector
- [ ] Add boundary mapper (N-S-E-W visual)
- [ ] Add measurement calculator
- [ ] Add survey number parser
- [ ] Test with multiple schedules

**Estimated Time**: 8 hours

---

### Task 4.2: Boundary Mapper UI
**File**: `components/suit/BoundaryMapper.tsx`

```typescript
// Visual N-S-E-W input
export function BoundaryMapper({ boundaries, onChange }) {
  return (
    <div className="boundary-grid">
      <div className="north">
        <input placeholder="North boundary" value={boundaries.north} />
      </div>
      <div className="west-east">
        <input placeholder="West" value={boundaries.west} />
        <div className="center">Property</div>
        <input placeholder="East" value={boundaries.east} />
      </div>
      <div className="south">
        <input placeholder="South boundary" value={boundaries.south} />
      </div>
    </div>
  );
}
```

**Checklist**:
- [ ] Create visual layout
- [ ] Style with CSS Grid
- [ ] Implement two-way binding
- [ ] Add validation

**Estimated Time**: 4 hours

---

## 📋 PHASE 5: STEP 4 - DOCUMENT DETAILS

### Task 5.1: Document List Manager
**File**: `components/suit/DocumentListManager.tsx`

```typescript
export function DocumentListManager() {
  const documents = useAppSelector(state => state.suitDraft.currentDraft?.documentDetails.documents);
  
  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="documents">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {documents?.map((doc, index) => (
                <Draggable key={doc.id} draggableId={doc.id} index={index}>
                  {(provided) => (
                    <DocumentItem document={doc} provided={provided} />
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
```

**Libraries needed**:
```bash
npm install react-beautiful-dnd
```

**Checklist**:
- [ ] Implement drag-and-drop
- [ ] Auto-number documents
- [ ] Auto-generate markings (EX-A1, EX-A2...)
- [ ] Add page count field
- [ ] Calculate total pages
- [ ] Validate at least one document

**Estimated Time**: 6 hours

---

## 📋 PHASE 6: STEP 5 - INTERLOCUTORY APPLICATIONS

### Task 6.1: IA Builder
**File**: `components/suit/IABuilder.tsx`

```typescript
const IA_TEMPLATES = {
  injunction: {
    title: "Application for Temporary Injunction",
    purpose: "To restrain the defendants from...",
    grounds: [
      "Prima facie case",
      "Balance of convenience",
      "Irreparable injury"
    ]
  },
  // ... more templates
};

export function IABuilder() {
  return (
    <div>
      <IATemplateSelector />
      <IAList />
    </div>
  );
}
```

**Checklist**:
- [ ] Create IA templates (5-10 common types)
- [ ] Implement add/edit/delete
- [ ] Auto-number IAs (IA 1/2025, IA 2/2025...)
- [ ] Add fact importer (from main plaint)
- [ ] Implement grounds builder
- [ ] Add urgency flag

**Estimated Time**: 8 hours

---

## 📋 PHASE 7: STEP 6 - UPLOAD JUDGEMENTS

### Task 7.1: Judgement Uploader
**File**: `components/suit/JudgementUploader.tsx`

```typescript
export function JudgementUploader() {
  const handleFileUpload = async (file: File) => {
    // Upload to Google Drive
    const fileId = await uploadToGoogleDrive(file);
    // Save metadata
    dispatch(addJudgement({ fileUrl: fileId, ... }));
  };
  
  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      <JudgementList />
    </div>
  );
}
```

**Checklist**:
- [ ] Implement file upload UI
- [ ] Add citation parser
- [ ] Connect to Google Drive API
- [ ] Store file metadata
- [ ] Display uploaded judgements
- [ ] Add remove option

**Estimated Time**: 6 hours

---

## 📋 PHASE 8: DOCUMENT GENERATION SYSTEM

### Task 8.1: Template Engine Setup
**File**: `lib/templates/template-engine.ts`

```typescript
import Handlebars from 'handlebars';

export class TemplateEngine {
  private templates: Map<string, HandlebarsTemplateDelegate>;
  
  constructor() {
    this.registerHelpers();
    this.loadTemplates();
  }
  
  registerHelpers() {
    Handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleDateString('en-IN');
    });
    
    Handlebars.registerHelper('ordinal', (num) => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = num % 100;
      return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    });
    
    // ... more helpers
  }
  
  compile(templateName: string, data: any): string {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);
    return template(data);
  }
}
```

**Libraries needed**:
```bash
npm install handlebars
```

**Checklist**:
- [ ] Install Handlebars
- [ ] Create template engine class
- [ ] Register custom helpers (formatDate, ordinal, etc.)
- [ ] Implement template loading
- [ ] Add error handling
- [ ] Write unit tests

**Estimated Time**: 6 hours

---

### Task 8.2: Create HTML Templates
**Files**: `lib/templates/kerala-templates/*.html`

**Template List**:
1. `vakalath.html` - 2-page vakalath with docket
2. `plaint.html` - Full plaint structure
3. `valuation.html` - Suit valuation
4. `schedule.html` - Schedule annexure
5. `document-list.html` - List of documents
6. `docket.html` - Generic docket template
7. `affidavit.html` - Plaint affidavit
8. `ia.html` - Interlocutory application
9. `batta-memo.html` - Batta memo

**Example Template Structure**:
```html
<!-- vakalath.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    @page { size: A4; margin: 1in; }
    .dotted-line { border-bottom: 1px dotted #000; }
  </style>
</head>
<body>
  <!-- Page 1 -->
  <div class="page page-1">
    <div class="vakalath-body">
      <p>IN THE COURT OF <span class="dotted-line">{{court}}</span></p>
      <p>VAKALATHNAMA</p>
      <!-- ... full vakalath content with placeholders -->
    </div>
  </div>
  
  <!-- Page 2 -->
  <div class="page page-2">
    <div class="left-half"></div> <!-- BLANK -->
    <div class="right-half">
      <!-- DOCKET ONLY -->
      <div class="docket">
        <p>{{caseType}} No. {{caseNumber}}/{{year}}</p>
        {{#each plaintiffs}}
          <p>{{this.name}} ... Plaintiff</p>
        {{/each}}
        <p>Vs.</p>
        {{#each defendants}}
          <p>{{this.name}} ... Defendant</p>
        {{/each}}
      </div>
    </div>
  </div>
</body>
</html>
```

**Checklist**:
- [ ] Create all 9 templates
- [ ] Use Kerala court formatting standards
- [ ] Add proper CSS for printing
- [ ] Use `@page` rules for margins
- [ ] Implement 2-page Vakalath layout correctly
- [ ] Add placeholders for all data points
- [ ] Test with sample data
- [ ] Validate against court requirements

**Estimated Time**: 20 hours (critical, detailed work)

---

### Task 8.3: Document Generators
**Files**: `lib/generators/*.ts`

**Example Generator**:
```typescript
// lib/generators/vakalath-generator.ts
import { TemplateEngine } from '../templates/template-engine';
import { DraftSuitData } from '@/types/suit';

export async function generateVakalath(data: DraftSuitData): Promise<string> {
  const engine = new TemplateEngine();
  
  const templateData = {
    court: data.basicDetails.court,
    caseType: data.basicDetails.caseType,
    caseNumber: data.basicDetails.caseNumber || 'XXX',
    year: data.basicDetails.year,
    plaintiffs: data.partyDetails.plaintiffs,
    defendants: data.partyDetails.defendants,
    // ... map all required fields
  };
  
  return engine.compile('vakalath', templateData);
}
```

**Create generators for**:
1. ✅ Vakalath
2. ✅ Plaint
3. ✅ Suit Valuation
4. ✅ Schedule
5. ✅ Document List
6. ✅ Plaint Docket
7. ✅ Affidavit
8. ✅ IAs (loop for multiple)
9. ✅ IA Dockets
10. ✅ Combined Docket
11. ✅ Individual Dockets
12. ✅ Batta Memo

**Checklist**:
- [ ] Create 12 generator functions
- [ ] Implement data mapping for each
- [ ] Add error handling
- [ ] Test with real data
- [ ] Ensure template compliance

**Estimated Time**: 16 hours

---

### Task 8.4: Generation Pipeline
**File**: `lib/generators/pipeline.ts`

```typescript
export class GenerationPipeline {
  async generateAll(data: DraftSuitData): Promise<GeneratedDocument[]> {
    const documents: GeneratedDocument[] = [];
    
    // Generate sequentially with progress tracking
    for (const spec of GENERATION_SEQUENCE) {
      const html = await spec.generator(data);
      
      // Convert to DOCX
      const docx = await htmlToDocx(html);
      
      // Convert to PDF
      const pdf = await htmlToPdf(html);
      
      documents.push({
        id: uuidv4(),
        name: spec.documentName,
        type: spec.template,
        htmlContent: html,
        docxBuffer: docx,
        pdfBuffer: pdf,
        status: 'ready',
        generatedAt: new Date()
      });
      
      // Update progress
      this.updateProgress((documents.length / GENERATION_SEQUENCE.length) * 100);
    }
    
    return documents;
  }
  
  private updateProgress(percent: number) {
    // Dispatch Redux action or emit event
  }
}
```

**Libraries needed**:
```bash
npm install html-docx-js puppeteer
```

**Checklist**:
- [ ] Implement pipeline orchestrator
- [ ] Add progress tracking
- [ ] Implement HTML → DOCX conversion
- [ ] Implement HTML → PDF conversion
- [ ] Add error recovery
- [ ] Test with full dataset

**Estimated Time**: 10 hours

---

## 📋 PHASE 9: GOOGLE INTEGRATION

### Task 9.1: Google Cloud Setup
**Manual Steps**:
1. Create Google Cloud Project
2. Enable Google Drive API
3. Enable Google Docs API
4. Create OAuth 2.0 credentials
5. Set up service account

**Checklist**:
- [ ] Create GCP project
- [ ] Enable APIs
- [ ] Download credentials JSON
- [ ] Add to environment variables
- [ ] Test authentication

**Estimated Time**: 2 hours

---

### Task 9.2: Google Drive Integration
**File**: `lib/integrations/google-drive-api.ts`

```typescript
import { google } from 'googleapis';

export class GoogleDriveService {
  private drive;
  
  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    this.drive = google.drive({ version: 'v3', auth });
  }
  
  async uploadFile(
    fileName: string, 
    fileBuffer: Buffer, 
    mimeType: string
  ): Promise<string> {
    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType
      },
      media: {
        mimeType: mimeType,
        body: fileBuffer
      }
    });
    
    return response.data.id!;
  }
  
  async createFolder(folderName: string): Promise<string> {
    const response = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      }
    });
    
    return response.data.id!;
  }
  
  async downloadFile(fileId: string): Promise<Buffer> {
    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    
    return Buffer.from(response.data as ArrayBuffer);
  }
}
```

**Libraries needed**:
```bash
npm install googleapis
```

**Checklist**:
- [ ] Implement upload functionality
- [ ] Implement folder creation
- [ ] Implement download functionality
- [ ] Add permission management
- [ ] Test with dummy files

**Estimated Time**: 6 hours

---

### Task 9.3: Google Docs Integration
**File**: `lib/integrations/google-docs-api.ts`

```typescript
export class GoogleDocsService {
  private docs;
  
  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      scopes: ['https://www.googleapis.com/auth/documents']
    });
    
    this.docs = google.docs({ version: 'v1', auth });
  }
  
  async createDocument(title: string, content: string): Promise<string> {
    // Create blank doc
    const doc = await this.docs.documents.create({
      requestBody: { title }
    });
    
    // Insert content
    await this.docs.documents.batchUpdate({
      documentId: doc.data.documentId!,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content
            }
          }
        ]
      }
    });
    
    return doc.data.documentId!;
  }
  
  async getEditUrl(documentId: string): Promise<string> {
    return `https://docs.google.com/document/d/${documentId}/edit`;
  }
}
```

**Checklist**:
- [ ] Implement document creation
- [ ] Implement content insertion
- [ ] Add formatting support
- [ ] Generate edit URLs
- [ ] Test document creation

**Estimated Time**: 6 hours

---

### Task 9.4: Preview & Edit Interface
**File**: `components/preview/DocumentPreview.tsx`

```typescript
export function DocumentPreview({ documentId }: { documentId: string }) {
  const editUrl = `https://docs.google.com/document/d/${documentId}/edit`;
  
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h3>Preview & Edit</h3>
        <button onClick={() => window.open(editUrl, '_blank')}>
          Open in Google Docs
        </button>
      </div>
      <iframe 
        src={editUrl} 
        width="100%" 
        height="800px"
        frameBorder="0"
      />
    </div>
  );
}
```

**Checklist**:
- [ ] Create preview component
- [ ] Embed Google Docs iframe
- [ ] Add "Open in new tab" button
- [ ] Implement download buttons
- [ ] Style preview interface

**Estimated Time**: 4 hours

---

### Task 9.5: Download Manager
**File**: `components/preview/DownloadManager.tsx`

```typescript
export function DownloadManager({ documents }: { documents: GeneratedDocument[] }) {
  const downloadSingle = async (doc: GeneratedDocument, format: 'pdf' | 'docx') => {
    const buffer = format === 'pdf' ? doc.pdfBuffer : doc.docxBuffer;
    const blob = new Blob([buffer], { type: getMimeType(format) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name}.${format}`;
    a.click();
  };
  
  const downloadAll = async (format: 'pdf' | 'docx' | 'both') => {
    // Create ZIP file
    const JSZip = await import('jszip');
    const zip = new JSZip();
    
    documents.forEach(doc => {
      if (format === 'pdf' || format === 'both') {
        zip.file(`${doc.name}.pdf`, doc.pdfBuffer);
      }
      if (format === 'docx' || format === 'both') {
        zip.file(`${doc.name}.docx`, doc.docxBuffer);
      }
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suit-documents.zip';
    a.click();
  };
  
  return (
    <div>
      <button onClick={() => downloadAll('both')}>Download All (ZIP)</button>
      {documents.map(doc => (
        <DocumentDownloadCard key={doc.id} document={doc} onDownload={downloadSingle} />
      ))}
    </div>
  );
}
```

**Libraries needed**:
```bash
npm install jszip
```

**Checklist**:
- [ ] Implement single file download
- [ ] Implement ZIP download
- [ ] Add format selector (PDF/DOCX/Both)
- [ ] Show download progress
- [ ] Test with large files

**Estimated Time**: 5 hours

---

## 📋 PHASE 10: TESTING & POLISH

### Task 10.1: End-to-End Testing
**File**: `__tests__/e2e/suit-workflow.test.ts`

```typescript
describe('Complete Suit Drafting Workflow', () => {
  it('should complete full flow from start to download', async () => {
    // 1. Start new draft
    // 2. Fill basic details
    // 3. Add parties
    // 4. Add plaint details
    // 5. Add schedules
    // 6. Add documents
    // 7. Add IAs
    // 8. Upload judgements
    // 9. Generate documents
    // 10. Verify all 12 documents created
    // 11. Download files
  });
});
```

**Checklist**:
- [ ] Write E2E tests for happy path
- [ ] Test validation errors
- [ ] Test step navigation
- [ ] Test document generation
- [ ] Test Google integration
- [ ] Fix all failing tests

**Estimated Time**: 12 hours

---

### Task 10.2: Template Accuracy Review
**Manual Process**:
1. Generate sample suit with real data
2. Print all documents
3. Compare with actual court-filed documents
4. Check margins, spacing, fonts
5. Verify Vakalath 2-page layout
6. Verify docket formatting
7. Get advocate review

**Checklist**:
- [ ] Review all 12 templates
- [ ] Fix formatting issues
- [ ] Verify legal accuracy
- [ ] Get advocate sign-off

**Estimated Time**: 8 hours

---

### Task 10.3: Performance Optimization
**Areas**:
- Code splitting for steps
- Lazy loading components
- Optimize PDF generation
- Cache compiled templates
- Debounce auto-save

**Checklist**:
- [ ] Implement code splitting
- [ ] Add lazy loading
- [ ] Optimize generators
- [ ] Add caching
- [ ] Measure performance improvements

**Estimated Time**: 6 hours

---

### Task 10.4: Documentation
**Files**:
- `USER_GUIDE.md` - For advocates
- `DEVELOPER_GUIDE.md` - For developers
- `TEMPLATE_GUIDE.md` - For template customization
- `API_REFERENCE.md` - For integrations

**Checklist**:
- [ ] Write user guide
- [ ] Write developer guide
- [ ] Document templates
- [ ] Document APIs
- [ ] Create video tutorials

**Estimated Time**: 8 hours

---

## 📊 SUMMARY

### Total Estimated Time: **258 hours** (~6.5 weeks for 1 developer, or ~3 weeks for 2 developers)

### Breakdown by Phase:
- Phase 1: Foundation - 16 hours
- Phase 2: Step 1 - 17 hours
- Phase 3: Step 2 - 33 hours
- Phase 4: Step 3 - 12 hours
- Phase 5: Step 4 - 6 hours
- Phase 6: Step 5 - 8 hours
- Phase 7: Step 6 - 6 hours
- Phase 8: Document Generation - 52 hours
- Phase 9: Google Integration - 23 hours
- Phase 10: Testing & Polish - 34 hours

---

## 🚀 RECOMMENDED EXECUTION SEQUENCE

### Week 1-2: Foundation + Step 1
- Complete TypeScript setup
- Build Redux store
- Create Basic Details form
- Build wizard navigation

### Week 3-4: Steps 2-3
- Party & Plaint forms
- Timeline builder
- Relief builder
- Schedule builder

### Week 4-5: Steps 4-6
- Document list manager
- IA builder
- Judgement uploader

### Week 5-7: Document Generation (CRITICAL)
- Create all HTML templates
- Build all generators
- Implement generation pipeline
- Test extensively

### Week 8-9: Google Integration
- Set up Google Cloud
- Implement Drive/Docs APIs
- Build preview interface
- Build download manager

### Week 9-10: Testing & Polish
- E2E testing
- Template review
- Performance optimization
- Documentation

---

## ✅ DEVELOPER CHECKLIST

Before starting:
- [ ] Read architecture document
- [ ] Set up development environment
- [ ] Install all dependencies
- [ ] Configure Google Cloud project
- [ ] Get sample court documents for reference

During development:
- [ ] Follow Kerala e-Filing design patterns
- [ ] Never modify template layouts
- [ ] Test each component in isolation
- [ ] Write unit tests as you go
- [ ] Get advocate feedback early

Before deployment:
- [ ] All tests passing
- [ ] Templates reviewed by advocate
- [ ] Performance meets targets (< 60s generation)
- [ ] Documentation complete
- [ ] Backup/recovery tested

---

**END OF IMPLEMENTATION PLAN**
