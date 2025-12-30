# Preview Editing Features - Implementation Status

## ✅ COMPLETED: Foundation Components

### 1. **EditableSection.tsx** ✅
**Location:** `components/EditableSection.tsx`

**Features:**
- ✅ Click any text to edit inline
- ✅ Floating formatting toolbar appears on focus
- ✅ Bold/Italic toggle buttons
- ✅ Text alignment (Left/Center/Right/Justify)
- ✅ Font size increase/decrease
- ✅ Visual editing indicators
- ✅ Auto-save on blur

**Usage Example:**
```tsx
<EditableSection
    content="Court heading text"
    onChange={(newText) => setCourtHeading(newText)}
    isBold={true}
    alignment="center"
    fontSize={16}
    onFormatChange={(format) => handleFormatChange(format)}
/>
```

---

### 2. **EditableParagraphList.tsx** ✅
**Location:** `components/EditableParagraphList.tsx`

**Features:**
- ✅ Manage multiple paragraphs
- ✅ Add new paragraphs (at end or between existing)
- ✅ Delete paragraphs (with protection for last one)
- ✅ Drag handles for visual feedback
- ✅ Hover actions

**Usage Example:**
```tsx
<EditableParagraphList
    paragraphs={legalBodyParagraphs}
    onChange={(updated) => setLegalBodyParagraphs(updated)}
    title="Legal Body"
/>
```

---

### 3. **EditablePartyList.tsx** ✅
**Location:** `components/EditablePartyList.tsx`

**Features:**
- ✅ Add/remove parties dynamically
- ✅ Edit party details inline (name, age, address, status)
- ✅ Separate lists for petitioners/respondents
- ✅ Form validation
- ✅ Minimum 1 party protection

**Usage Example:**
```tsx
<EditablePartyList
    parties={petitioners}
    onChange={(updated) => setPetitioners(updated)}
    title="Our Clients"
    partyType="petitioner"
/>
```

---

### 4. **DocumentFormatting.tsx** ✅
**Location:** `components/DocumentFormatting.tsx`

**Features:**
- ✅ Undo/Redo buttons
- ✅ Font family selector
- ✅ Line spacing selector
- ✅ Save button
- ✅ Keyboard shortcut hints
- ✅ Sticky toolbar

**Usage Example:**
```tsx
<DocumentFormatting
    fontFamily={documentFont}
    lineSpacing={documentLineSpacing}
    canUndo={historyIndex > 0}
    canRedo={historyIndex < history.length - 1}
    onFontFamilyChange={(font) => setDocumentFont(font)}
    onLineSpacingChange={(spacing) => setLineSpacing(spacing)}
    onUndo={undo}
    onRedo={redo}
    onSave={saveDocument}
/>
```

---

## 📋 NEXT STEP: Integration into Preview Page

### What Needs to Be Done:

#### Step 1: Add State Management
Update `app/vakalath/preview/page.tsx` to include:

```typescript
// Document formatting state
const [documentFont, setDocumentFont] = useState('Times New Roman');
const [lineSpacing, setLineSpacing] = useState(1.5);

// Editable content state
const [courtHeading, setCourtHeading] = useState({ content: '', fontSize: 16, isBold: true });
const [caseDetails, setCaseDetails] = useState({ content: '', fontSize: 14 });
const [petitioners, setPetitioners] = useState<EditableParty[]>([]);
const [respondents, setRespondents] = useState<EditableParty[]>([]);
const [legalBody, setLegalBody] = useState<Paragraph[]>([]);
const [witnesses, setWitnesses] = useState({ content: '' });
const [signature, setSignature] = useState({ content: '' });

// Undo/Redo state
const [history, setHistory] = useState<DocumentState[]>([]);
const [historyIndex, setHistoryIndex] = useState(0);
```

#### Step 2: Replace Static HTML
Convert existing preview HTML to use editable components:

**Before:**
```tsx
<div className="text-center font-bold">
    BEFORE THE COURT OF {data.courtName.toUpperCase()}
</div>
```

**After:**
```tsx
<EditableSection
    content={courtHeading.content}
    onChange={(newContent) => setCourtHeading({ ...courtHeading, content: newContent })}
    isBold={courtHeading.isBold}
    fontSize={courtHeading.fontSize}
    alignment="center"
    onFormatChange={(format) => setCourtHeading({ ...courtHeading, ...format })}
/>
```

#### Step 3: Add Document Formatting Toolbar
```tsx
<DocumentFormatting
    fontFamily={documentFont}
    lineSpacing={lineSpacing}
    canUndo={canUndo}
    canRedo={canRedo}
    onFontFamilyChange={setDocumentFont}
    onLineSpacingChange={setLineSpacing}
    onUndo={handleUndo}
    onRedo={handleRedo}
    onSave={handleSaveChanges}
/>
```

#### Step 4: Implement Undo/Redo
```typescript
const saveToHistory = () => {
    const currentState = {
        courtHeading,
        caseDetails,
        petitioners,
        respondents,
        legalBody,
        witnesses,
        signature,
        documentFont,
        lineSpacing,
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
};

const handleUndo = () => {
    if (historyIndex > 0) {
        const previousState = history[historyIndex - 1];
        restoreState(previousState);
        setHistoryIndex(historyIndex - 1);
    }
};

const handleRedo = () => {
    if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        restoreState(nextState);
        setHistoryIndex(historyIndex + 1);
    }
};
```

#### Step 5: Update PDF/DOCX Generation
Ensure the edited content is used when generating documents:

```typescript
const handleDownloadPDF = async () => {
    // Use edited state instead of original data
    const editedData = {
        ...data,
        parties: [...petitioners, ...respondents],
        // ... other edited fields
    };
    
    const pdfBlob = await generatePDF(editedData, includeDocket);
    // ... download logic
};
```

---

## 🎨 Visual Preview

### Current Static View:
```
┌─────────────────────────────┐
│  COURT HEADING              │  ← Static text
│  Case Details               │  ← Static text
│  Parties List               │  ← Static text
│  Legal Body                 │  ← Static text
└─────────────────────────────┘
```

### New Editable View:
```
┌─────────────────────────────┐
│ [Undo][Redo] [Font] [Save]  │  ← Global toolbar
├─────────────────────────────┤
│  COURT HEADING  [✎]         │  ← Click to edit, toolbar appears
│  Case Details   [✎]         │  ← Inline editing
│  ┌─────────────────────┐    │
│  │ Petitioners [+Add]  │    │  ← Dynamic party list
│  │ 1. Name [Edit]  [X] │    │
│  │ 2. Name [Edit]  [X] │    │
│  └─────────────────────┘    │
│  Legal Body Paragraph 1 [✎] │  ← Editable paragraphs
│  [+ Insert] [Delete]        │
│  Legal Body Paragraph 2 [✎] │
└─────────────────────────────┘
```

---

## 🔧 Additional Features to Add

### Keyboard Shortcuts:
```typescript
useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            handleUndo();
        }
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            handleRedo();
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            handleSaveChanges();
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [historyIndex, history]);
```

### Auto-Save:
```typescript
useEffect(() => {
    const timer = setTimeout(() => {
        if (hasUnsavedChanges) {
            handleSaveChanges();
        }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearTimeout(timer);
}, [courtHeading, caseDetails, petitioners, respondents, legalBody]);
```

---

## 📊 Implementation Checklist

### Phase 1: Foundation ✅
- [x] Create EditableSection component
- [x] Create EditableParagraphList component
- [x] Create EditablePartyList component
- [x] Create DocumentFormatting component

### Phase 2: Integration (NEXT) ⏳
- [ ] Add state management to preview page
- [ ] Replace static HTML with editable components
- [ ] Add document formatting toolbar
- [ ] Implement undo/redo system
- [ ] Add keyboard shortcuts
- [ ] Update PDF/DOCX generation

### Phase 3: Testing & Refinement
- [ ] Test all editing features
- [ ] Test undo/redo
- [ ] Test save functionality
- [ ] Test PDF export with edits
- [ ] Test DOCX export with edits
- [ ] Performance optimization

---

## 🚀 Ready to Integrate?

All foundation components are built and ready. The next step is to integrate them into your preview page.

**Would you like me to:**
1. **Start integrating into preview page** (recommended)
2. **Add more features first** (spell check, margins, etc.)
3. **Show you a working example** with dummy data

**What would you prefer?** 🤔
