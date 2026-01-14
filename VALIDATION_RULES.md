# Draft Suit System - Validation Rules & Conditional Logic

## 🎯 Purpose
This document defines all validation rules, conditional rendering logic, and business rules for the Draft Suit System.

---

## 📋 STEP 1: BASIC DETAILS VALIDATION

### Field-Level Validation

```typescript
import { z } from 'zod';

export const basicDetailsSchema = z.object({
  district: z.string().min(1, "District is required"),
  
  court: z.string().min(1, "Court is required"),
  
  caseType: z.string().min(1, "Case type is required"),
  
  vakalathType: z.enum(['vakalathnama', 'memo'], {
    errorMap: () => ({ message: "Please select Vakalathnama or Memo" })
  }),
  
  partySignatureRequired: z.boolean(),
  
  applicantStatus: z.enum([
    'complainant',
    'petitioner',
    'plaintiff',
    'applicant',
    'defendant',
    'respondent',
    'opposite_party',
    'other'
  ], {
    errorMap: () => ({ message: "Please select applicant status" })
  }),
  
  year: z.number()
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Invalid year"),
  
  caseNumber: z.string().optional()
});

// Type inference
export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;
```

### Conditional Logic

#### Rule 1: Court Dropdown Depends on District
```typescript
interface ConditionalLogic {
  field: 'court';
  dependsOn: 'district';
  logic: () => {
    const selectedDistrict = watch('district');
    const availableCourts = COURT_MAP[selectedDistrict] || [];
    
    // Reset court selection when district changes
    if (selectedDistrict !== previousDistrict) {
      setValue('court', '');
    }
    
    return availableCourts;
  };
}
```

**Implementation**:
```tsx
const selectedDistrict = watch('district');
const courts = selectedDistrict ? COURT_MAP[selectedDistrict] : [];

useEffect(() => {
  setValue('court', ''); // Reset when district changes
}, [selectedDistrict]);
```

#### Rule 2: Party Signature Field Depends on Vakalath Type
```typescript
interface ConditionalLogic {
  field: 'partySignatureRequired';
  dependsOn: 'vakalathType';
  logic: () => {
    const vakalathType = watch('vakalathType');
    
    if (vakalathType === 'vakalathnama') {
      // Field is required and visible
      return { required: true, visible: true };
    } else {
      // Field is hidden
      setValue('partySignatureRequired', false);
      return { required: false, visible: false };
    }
  };
}
```

**Implementation**:
```tsx
const vakalathType = watch('vakalathType');
const showPartySignature = vakalathType === 'vakalathnama';

{showPartySignature && (
  <div>
    <label>Party Signature Required?</label>
    <input type="checkbox" {...register('partySignatureRequired')} />
  </div>
)}
```

### Step Completion Validation
```typescript
export function validateBasicDetails(data: Partial<BasicDetailsFormData>): boolean {
  try {
    basicDetailsSchema.parse(data);
    return true;
  } catch (error) {
    return false;
  }
}
```

---

## 📋 STEP 2: PARTY & PLAINT DETAILS VALIDATION

### Party Validation

```typescript
export const addressSchema = z.object({
  building: z.string().min(1, "Building/House is required"),
  street: z.string().min(1, "Street is required"),
  locality: z.string().min(1, "Locality is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string()
    .length(6, "Pincode must be 6 digits")
    .regex(/^\d{6}$/, "Pincode must contain only digits")
});

export const partySchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  parentageType: z.enum(['son_of', 'daughter_of', 'wife_of', 'husband_of']),
  parentName: z.string().min(3, "Parent name is required"),
  age: z.number()
    .min(1, "Age must be at least 1")
    .max(150, "Invalid age"),
  occupation: z.string().min(2, "Occupation is required"),
  address: addressSchema,
  role: z.enum(['plaintiff', 'defendant']),
  order: z.number().min(1)
});

export const partyDetailsSchema = z.object({
  plaintiffs: z.array(partySchema)
    .min(1, "At least one plaintiff is required"),
  defendants: z.array(partySchema)
    .min(1, "At least one defendant is required")
});
```

### Plaint Details Validation

```typescript
export const causeOfActionSchema = z.object({
  dateOfCause: z.date(),
  placeOfCause: z.string().min(3, "Place is required"),
  description: z.string()
    .min(100, "Description must be at least 100 characters")
    .max(5000, "Description is too long")
});

export const jurisdictionSchema = z.object({
  territorialJurisdiction: z.string()
    .min(50, "Please provide detailed territorial jurisdiction"),
  pecuniaryJurisdiction: z.string()
    .min(50, "Please provide detailed pecuniary jurisdiction"),
  subjectMatterJurisdiction: z.string()
    .min(50, "Please provide detailed subject matter jurisdiction")
});

export const chronologicalFactSchema = z.object({
  id: z.string(),
  date: z.date(),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  order: z.number()
});

export const factsOfCaseSchema = z.object({
  chronology: z.array(chronologicalFactSchema)
    .min(1, "At least one chronological fact is required"),
  summary: z.string()
    .min(100, "Summary must be at least 100 characters")
    .max(3000, "Summary is too long")
});

export const reliefSchema = z.object({
  id: z.string(),
  type: z.enum([
    'declaration',
    'injunction',
    'damages',
    'possession',
    'specific_performance',
    'other'
  ]),
  description: z.string()
    .min(20, "Relief description must be detailed"),
  order: z.number()
});

export const valuationSchema = z.object({
  marketValue: z.number()
    .min(0, "Market value cannot be negative"),
  reliefValue: z.number()
    .min(0, "Relief value cannot be negative"),
  courtFeeCalculation: z.string()
    .min(20, "Please explain court fee calculation"),
  courtFee: z.number()
    .min(0, "Court fee cannot be negative")
    .optional()
});

export const plaintDetailsSchema = z.object({
  causeOfAction: causeOfActionSchema,
  jurisdiction: jurisdictionSchema,
  factsOfCase: factsOfCaseSchema,
  reliefSought: z.array(reliefSchema)
    .min(1, "At least one relief is required"),
  valuation: valuationSchema
});
```

### Conditional Logic

#### Rule 3: Auto-sort Chronological Facts by Date
```typescript
useEffect(() => {
  const facts = watch('factsOfCase.chronology');
  const sorted = [...facts].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Re-assign order numbers
  sorted.forEach((fact, index) => {
    fact.order = index + 1;
  });
  
  setValue('factsOfCase.chronology', sorted);
}, [watch('factsOfCase.chronology')]);
```

#### Rule 4: Auto-calculate Court Fee
```typescript
useEffect(() => {
  const marketValue = watch('valuation.marketValue');
  const reliefValue = watch('valuation.reliefValue');
  
  // Kerala Court Fee calculation logic
  const totalValue = Math.max(marketValue, reliefValue);
  let courtFee = 0;
  
  // Simplified calculation (actual rules are more complex)
  if (totalValue <= 50000) {
    courtFee = totalValue * 0.05; // 5%
  } else if (totalValue <= 500000) {
    courtFee = 2500 + (totalValue - 50000) * 0.04; // 4%
  } else {
    courtFee = 20500 + (totalValue - 500000) * 0.03; // 3%
  }
  
  setValue('valuation.courtFee', Math.round(courtFee));
}, [watch('valuation.marketValue'), watch('valuation.reliefValue')]);
```

#### Rule 5: Party Numbering (Ordinal Assignment)
```typescript
useEffect(() => {
  const plaintiffs = watch('partyDetails.plaintiffs');
  
  // Auto-assign order numbers
  plaintiffs.forEach((plaintiff, index) => {
    plaintiff.order = index + 1;
  });
  
  setValue('partyDetails.plaintiffs', plaintiffs);
}, [watch('partyDetails.plaintiffs')]);
```

### Business Rules

#### Rule 6: Plaintiff and Defendant Cannot Be Same Person
```typescript
export function validateNoDuplicateParties(
  plaintiffs: Party[],
  defendants: Party[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  plaintiffs.forEach(plaintiff => {
    const isDuplicate = defendants.some(defendant => 
      defendant.name.toLowerCase() === plaintiff.name.toLowerCase() &&
      defendant.age === plaintiff.age
    );
    
    if (isDuplicate) {
      errors.push({
        field: 'parties',
        message: `${plaintiff.name} cannot be both plaintiff and defendant`,
        code: 'DUPLICATE_PARTY'
      });
    }
  });
  
  return errors;
}
```

---

## 📋 STEP 3: SCHEDULE DETAILS VALIDATION

```typescript
export const measurementsSchema = z.object({
  area: z.number().min(0, "Area cannot be negative"),
  unit: z.enum(['sqft', 'sqm', 'cent', 'acre']),
  dimensions: z.string().optional()
});

export const boundariesSchema = z.object({
  north: z.string().min(3, "North boundary is required"),
  south: z.string().min(3, "South boundary is required"),
  east: z.string().min(3, "East boundary is required"),
  west: z.string().min(3, "West boundary is required")
});

export const registrationDetailsSchema = z.object({
  documentNumber: z.string().min(1, "Document number is required"),
  year: z.number()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in future"),
  sro: z.string().min(3, "SRO is required")
});

export const scheduleSchema = z.object({
  id: z.string(),
  scheduleName: z.string()
    .regex(/^[A-Z]$/, "Schedule name must be a single letter (A-Z)"),
  type: z.enum(['property', 'movable', 'document', 'other']),
  description: z.string()
    .min(50, "Description must be detailed (minimum 50 characters)"),
  measurements: measurementsSchema.optional(),
  boundaries: boundariesSchema.optional(),
  surveyNumber: z.string().optional(),
  registrationDetails: registrationDetailsSchema.optional(),
  order: z.number()
});

export const scheduleDetailsSchema = z.object({
  schedules: z.array(scheduleSchema)
    .min(0, "No schedules required, but if added, must be valid")
});

// Conditional validation
export const scheduleDetailsConditionalSchema = z.object({
  schedules: z.array(scheduleSchema)
}).refine(
  (data) => {
    // If schedule is of type "property", boundaries and measurements are required
    return data.schedules.every(schedule => {
      if (schedule.type === 'property') {
        return schedule.boundaries && schedule.measurements;
      }
      return true;
    });
  },
  {
    message: "Property schedules must have boundaries and measurements"
  }
);
```

### Conditional Logic

#### Rule 7: Auto-assign Schedule Letters (A, B, C...)
```typescript
useEffect(() => {
  const schedules = watch('scheduleDetails.schedules');
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  schedules.forEach((schedule, index) => {
    schedule.scheduleName = letters[index];
    schedule.order = index + 1;
  });
  
  setValue('scheduleDetails.schedules', schedules);
}, [watch('scheduleDetails.schedules').length]);
```

#### Rule 8: Show/Hide Fields Based on Schedule Type
```tsx
const scheduleType = watch(`schedules.${index}.type`);

{scheduleType === 'property' && (
  <>
    <BoundaryMapper />
    <MeasurementInput />
    <SurveyNumberInput />
  </>
)}

{scheduleType === 'movable' && (
  <MovablePropertyDetails />
)}
```

---

## 📋 STEP 4: DOCUMENT DETAILS VALIDATION

```typescript
export const documentItemSchema = z.object({
  id: z.string(),
  serialNumber: z.number().min(1, "Serial number must be positive"),
  description: z.string()
    .min(10, "Document description must be at least 10 characters"),
  documentType: z.enum(['original', 'certified_copy', 'xerox', 'affidavit']),
  date: z.date().optional(),
  pageCount: z.number()
    .min(1, "Page count must be at least 1")
    .optional(),
  isMarked: z.boolean(),
  markingLabel: z.string().optional(),
  order: z.number()
});

export const documentDetailsSchema = z.object({
  documents: z.array(documentItemSchema)
    .min(1, "At least one document is required"),
  totalPages: z.number().min(0, "Total pages cannot be negative")
});
```

### Conditional Logic

#### Rule 9: Auto-number Documents
```typescript
useEffect(() => {
  const documents = watch('documentDetails.documents');
  
  documents.forEach((doc, index) => {
    doc.serialNumber = index + 1;
    doc.order = index + 1;
  });
  
  setValue('documentDetails.documents', documents);
}, [watch('documentDetails.documents')]);
```

#### Rule 10: Auto-generate Marking Labels
```typescript
useEffect(() => {
  const documents = watch('documentDetails.documents');
  
  documents.forEach((doc, index) => {
    if (doc.isMarked) {
      doc.markingLabel = `EX-A${index + 1}`;
    } else {
      doc.markingLabel = undefined;
    }
  });
  
  setValue('documentDetails.documents', documents);
}, [watch('documentDetails.documents')]);
```

#### Rule 11: Auto-calculate Total Pages
```typescript
useEffect(() => {
  const documents = watch('documentDetails.documents');
  
  const totalPages = documents.reduce((sum, doc) => {
    return sum + (doc.pageCount || 0);
  }, 0);
  
  setValue('documentDetails.totalPages', totalPages);
}, [watch('documentDetails.documents')]);
```

---

## 📋 STEP 5: INTERLOCUTORY APPLICATIONS VALIDATION

```typescript
export const interlocutoryApplicationSchema = z.object({
  id: z.string(),
  iaNumber: z.string()
    .regex(/^IA \d+\/\d{4}$/, "IA number format: IA 1/2025"),
  title: z.string()
    .min(10, "Title must be at least 10 characters"),
  purpose: z.string()
    .min(20, "Purpose must be detailed"),
  grounds: z.array(z.string().min(10, "Each ground must be detailed"))
    .min(1, "At least one ground is required"),
  reliefRequested: z.string()
    .min(20, "Relief must be detailed"),
  urgency: z.enum(['urgent', 'normal']),
  facts: z.string()
    .min(50, "Facts must be detailed"),
  affidavitRequired: z.boolean(),
  order: z.number()
});

export const iaDetailsSchema = z.object({
  applications: z.array(interlocutoryApplicationSchema)
    .min(0, "IAs are optional")
});
```

### Conditional Logic

#### Rule 12: Auto-generate IA Numbers
```typescript
useEffect(() => {
  const ias = watch('iaDetails.applications');
  const year = watch('basicDetails.year');
  
  ias.forEach((ia, index) => {
    ia.iaNumber = `IA ${index + 1}/${year}`;
    ia.order = index + 1;
  });
  
  setValue('iaDetails.applications', ias);
}, [watch('iaDetails.applications')]);
```

#### Rule 13: Import Facts from Main Plaint
```typescript
function importFactsToIA(iaIndex: number) {
  const plaintFacts = watch('plaintDetails.factsOfCase.summary');
  const currentIAFacts = watch(`iaDetails.applications.${iaIndex}.facts`);
  
  // Append plaint facts to IA facts
  const combinedFacts = currentIAFacts 
    ? `${currentIAFacts}\n\nFacts from main plaint:\n${plaintFacts}`
    : plaintFacts;
    
  setValue(`iaDetails.applications.${iaIndex}.facts`, combinedFacts);
}
```

#### Rule 14: Affidavit Required for Certain IA Types
```typescript
useEffect(() => {
  const iaTitle = watch(`iaDetails.applications.${index}.title`);
  
  // Auto-set affidavit requirement based on IA type
  if (iaTitle.toLowerCase().includes('injunction')) {
    setValue(`iaDetails.applications.${index}.affidavitRequired`, true);
  }
}, [watch(`iaDetails.applications.${index}.title`)]);
```

---

## 📋 STEP 6: JUDGEMENT DETAILS VALIDATION

```typescript
export const judgementSchema = z.object({
  id: z.string(),
  caseName: z.string()
    .min(5, "Case name is required"),
  citation: z.string()
    .min(5, "Citation is required"),
  court: z.string()
    .min(3, "Court is required"),
  year: z.number()
    .min(1950, "Year must be 1950 or later")
    .max(new Date().getFullYear(), "Year cannot be in future"),
  relevantParagraphs: z.string().optional(),
  fileUrl: z.string().url().optional(),
  order: z.number()
});

export const judgementDetailsSchema = z.object({
  judgements: z.array(judgementSchema)
    .min(0, "Judgements are optional")
});
```

### Conditional Logic

#### Rule 15: Citation Parser
```typescript
function parseCitation(citation: string): Partial<Judgement> {
  // Example: "2020 (1) KLT 123" or "AIR 2020 SC 456"
  const patterns = {
    year: /\b(19|20)\d{2}\b/,
    court: /\b(SC|KHC|KLT|AIR|SCC)\b/
  };
  
  const yearMatch = citation.match(patterns.year);
  const courtMatch = citation.match(patterns.court);
  
  return {
    citation,
    year: yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear(),
    court: courtMatch ? courtMatch[0] : ''
  };
}
```

---

## 📋 STEP 7: COMPLETE DRAFT VALIDATION

### Final Validation Before Document Generation

```typescript
export function validateCompleteDraft(data: DraftSuitData): StepValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate Step 1
  try {
    basicDetailsSchema.parse(data.basicDetails);
  } catch (error) {
    errors.push({ field: 'basicDetails', message: 'Step 1 is incomplete' });
  }
  
  // Validate Step 2
  try {
    partyDetailsSchema.parse(data.partyDetails);
    plaintDetailsSchema.parse(data.plaintDetails);
  } catch (error) {
    errors.push({ field: 'partyDetails', message: 'Step 2 is incomplete' });
  }
  
  // Validate Step 3 (optional, but if present must be valid)
  if (data.scheduleDetails.schedules.length > 0) {
    try {
      scheduleDetailsConditionalSchema.parse(data.scheduleDetails);
    } catch (error) {
      errors.push({ field: 'scheduleDetails', message: 'Step 3 has errors' });
    }
  }
  
  // Validate Step 4
  try {
    documentDetailsSchema.parse(data.documentDetails);
  } catch (error) {
    errors.push({ field: 'documentDetails', message: 'Step 4 is incomplete' });
  }
  
  // Steps 5 & 6 are optional
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### Block Document Generation

```typescript
function canGenerateDocuments(state: SuitDraftUIState): boolean {
  if (!state.currentDraft) return false;
  
  const validation = validateCompleteDraft(state.currentDraft);
  
  return validation.isValid;
}
```

**UI Implementation**:
```tsx
const canGenerate = useAppSelector(state => 
  canGenerateDocuments(state.suitDraft)
);

<button 
  onClick={generateAllDocuments}
  disabled={!canGenerate || isGenerating}
>
  {canGenerate 
    ? "Generate All Documents" 
    : "Complete all required steps first"
  }
</button>
```

---

## 📋 NAVIGATION VALIDATION

### Can Proceed to Next Step?

```typescript
export function canProceedToNextStep(
  currentStep: number,
  data: DraftSuitData
): boolean {
  const validators: Record<number, (data: DraftSuitData) => boolean> = {
    1: (data) => basicDetailsSchema.safeParse(data.basicDetails).success,
    
    2: (data) => {
      const partyValid = partyDetailsSchema.safeParse(data.partyDetails).success;
      const plaintValid = plaintDetailsSchema.safeParse(data.plaintDetails).success;
      return partyValid && plaintValid;
    },
    
    3: (data) => {
      // Optional step, always allow proceeding
      return true;
    },
    
    4: (data) => documentDetailsSchema.safeParse(data.documentDetails).success,
    
    5: (data) => {
      // Optional step, always allow proceeding
      return true;
    },
    
    6: (data) => {
      // Optional step, always allow proceeding
      return true;
    }
  };
  
  const validator = validators[currentStep];
  return validator ? validator(data) : false;
}
```

**UI Implementation**:
```tsx
const canProceed = useAppSelector(state => 
  canProceedToNextStep(state.suitDraft.currentStep, state.suitDraft.currentDraft!)
);

<button 
  onClick={goToNextStep}
  disabled={!canProceed}
>
  Next
</button>
```

---

## 📋 CROSS-FIELD VALIDATION

### Rule 16: Cause of Action Date Must Be Before Today
```typescript
export const causeOfActionDateValidator = z.object({
  dateOfCause: z.date().max(new Date(), "Cause of action cannot be in future")
});
```

### Rule 17: Valuation Must Match Relief Type
```typescript
export function validateValuationMatchesRelief(
  relief: Relief[],
  valuation: Valuation
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const hasDamages = relief.some(r => r.type === 'damages');
  
  if (hasDamages && valuation.reliefValue === 0) {
    errors.push({
      field: 'valuation.reliefValue',
      message: 'Relief value required when seeking damages',
      code: 'VALUATION_MISMATCH'
    });
  }
  
  return errors;
}
```

### Rule 18: Property Case Must Have Schedules
```typescript
export function validatePropertyCaseHasSchedule(
  caseType: string,
  schedules: Schedule[]
): ValidationError[] {
  const propertyCaseTypes = ['OS', 'OP'];
  
  if (propertyCaseTypes.includes(caseType) && schedules.length === 0) {
    return [{
      field: 'schedules',
      message: 'Property cases typically require at least one schedule',
      code: 'MISSING_SCHEDULE'
    }];
  }
  
  return [];
}
```

---

## 📋 REAL-TIME VALIDATION DISPLAY

```tsx
function ValidationMessage({ field }: { field: string }) {
  const { formState: { errors } } = useFormContext();
  const error = errors[field];
  
  if (!error) return null;
  
  return (
    <div className="validation-error">
      <Icon name="alert-circle" />
      <span>{error.message}</span>
    </div>
  );
}

// Usage
<input {...register('district')} />
<ValidationMessage field="district" />
```

---

## 📋 SUMMARY OF ALL RULES

| Rule # | Field/Step | Type | Description |
|--------|-----------|------|-------------|
| 1 | Court | Conditional | Depends on District |
| 2 | Party Signature | Conditional | Required if Vakalathnama |
| 3 | Chronological Facts | Auto-sort | Sort by date |
| 4 | Court Fee | Auto-calculate | Based on valuation |
| 5 | Party Order | Auto-number | 1st, 2nd, 3rd... |
| 6 | Parties | Business | No duplicates |
| 7 | Schedule Name | Auto-assign | A, B, C... |
| 8 | Schedule Fields | Conditional | Property = boundaries + measurements |
| 9 | Document Serial | Auto-number | 1, 2, 3... |
| 10 | Document Marking | Auto-generate | EX-A1, EX-A2... |
| 11 | Total Pages | Auto-calculate | Sum of all pages |
| 12 | IA Number | Auto-generate | IA 1/2025, IA 2/2025... |
| 13 | IA Facts | Import | From main plaint |
| 14 | IA Affidavit | Auto-set | Based on IA type |
| 15 | Citation | Parse | Auto-fill from citation string |
| 16 | Cause Date | Validation | Cannot be future |
| 17 | Valuation | Cross-field | Must match relief type |
| 18 | Schedules | Business | Property cases need schedules |

---

**END OF VALIDATION & CONDITIONAL LOGIC SPECIFICATION**
