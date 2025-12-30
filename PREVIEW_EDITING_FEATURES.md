# Advanced Preview Editing Features - Implementation Guide

## 🎯 Overview

You've requested a comprehensive set of editing features for the preview page. This document outlines the implementation plan and provides step-by-step instructions.

---

## ✅ Phase 1: Foundation (COMPLETED)

### Files Created:

#### 1. `components/EditableSection.tsx`
**Purpose:** Reusable component for inline editing of text sections

**Features Implemented:**
- ✅ Click any text to edit inline
- ✅ Bold/Italic formatting buttons
- ✅ Text alignment (Left/Center/Right/Justify)
- ✅ Font size adjustment (+/- buttons)
- ✅ Floating toolbar on focus
- ✅ Auto-save on blur
- ✅ Visual feedback (outline, highlight)

**Usage:**
```tsx
<EditableSection
    content="Your text here"
    onChange={(newContent) => handleChange(newContent)}
    isBold={false}
    isItalic={false}
    alignment="justify"
    fontSize={14}
    onFormatChange={(format) => handleFormatChange(format)}
/>
```

---

#### 2. `components/EditableParagraphList.tsx`
**Purpose:** Manage lists of paragraphs with add/remove capabilities

**Features Implemented:**
- ✅ Add new paragraphs
- ✅ Insert paragraphs between existing ones
- ✅ Delete paragraphs (with minimum 1 paragraph protection)
- ✅ Drag handles for reordering (visual only for now)
- ✅ Hover actions (Add/Delete buttons)

**Usage:**
```tsx
<EditableParagraphList
    paragraphs={paragraphState}
    onChange={(updated) => setParagraphState(updated)}
    title="Legal Body"
/>
```

---

## 📋 Phase 2: Integration with Preview Page (NEXT STEP)

### What We Need to Do:

1. **Update Preview Page State**
   - Convert current text content to editable paragraph structure
   - Add state management for each editable section

2. **Replace Static Text with Editable Components**
   - Court heading → EditableSection
   - Case details → EditableSection
   - Parties list → EditableParagraphList
   - Legal body → EditableParagraphList
   - Witnesses → EditableSection
   - Advocate details → EditableSection

3. **Add Global Formatting Controls**
   - Font family selector (Times New Roman, Arial, etc.)
   - Line spacing adjustment
   - Margin controls
   - Page-level formatting

---

## 🎨 Phase 3: Advanced Features (TO BE IMPLEMENTED)

### 3.1 Spell Check Integration
```typescript
// Using browser's built-in spell check
<div
    contentEditable
    spellCheck={true}
    lang="en-IN" // Indian English
/>
```

### 3.2 Undo/Redo System
```typescript
// State history management
const [history, setHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(0);

const undo = () => {
    if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        restoreState(history[historyIndex - 1]);
    }
};

const redo = () => {
    if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        restoreState(history[historyIndex + 1]);
    }
};
```

### 3.3 Bullet Points/Numbering
- Add list formatting buttons to toolbar
- Support for ordered/unordered lists
- Nested lists capability

---

## 🔧 Phase 4: Content Management (TO BE IMPLEMENTED)

### 4.1 Dynamic Party Management
**Features:**
- Add/remove parties while in preview
- Edit party details inline
- Drag to reorder parties

**Component:**
```tsx
<EditablePartyList
    parties={data.parties}
    onChange={(updated) => updateParties(updated)}
    allowAdd={true}
    allowRemove={true}
    allowReorder={true}
/>
```

### 4.2 Date/Court Details Editor
**Features:**
- Inline edit court name
- Change case number
- Modify dates
- Update district

### 4.3 Witness Management
**Features:**
- Add/remove witnesses
- Edit witness names inline
- Format witness list

---

## 📐 Formatting Tools Details

### Font Family Options:
```typescript
const FONT_FAMILIES = [
    'Times New Roman',
    'Arial',
    'Calibri',
    'Georgia',
    'Courier New',
];
```

### Line Spacing Options:
```typescript
const LINE_SPACING = [
    { value: 1.0, label: 'Single' },
    { value: 1.15, label: '1.15' },
    { value: 1.5, label: '1.5' },
    { value: 2.0, label: 'Double' },
];
```

### Margin Controls:
```typescript
const MARGINS = {
    top: '1.5in',
    bottom: '1.5in',
    left: '1.75in',
    right: '1.0in',
};
```

---

## 🎯 Implementation Priority

### High Priority (Week 1):
1. ✅ Inline text editing (DONE)
2. ✅ Basic formatting toolbar (DONE)
3. ✅ Add/remove paragraphs (DONE)
4. ⏳ Integrate with preview page
5. ⏳ Save functionality

### Medium Priority (Week 2):
1. Undo/redo system
2. Font family selector
3. Line spacing control
4. Margin adjustment
5. Spell check

### Low Priority (Week 3):
1. Bullet points/numbering
2. Dynamic party editing
3. Drag-and-drop reordering
4. Advanced formatting options

---

## 💾 Data Structure

### Editable Document State:
```typescript
interface EditableDocument {
    sections: {
        courtHeading: EditableSection;
        caseDetails: EditableSection;
        parties: {
            petitioners: EditableParty[];
            respondents: EditableParty[];
        };
        title: EditableSection;
        legalBody: EditableParagraph[];
        witnesses: EditableSection;
        signature: EditableSection;
    };
    formatting: {
        fontFamily: string;
        lineSpacing: number;
        margins: Margins;
    };
    history: DocumentState[];
    historyIndex: number;
}
```

---

## 🔄 Save & Export Flow

### Auto-Save:
```typescript
// Save to Firestore every 30 seconds
useEffect(() => {
    const interval = setInterval(() => {
        if (hasChanges) {
            saveToFirestore(editableDocument);
        }
    }, 30000);
    return () => clearInterval(interval);
}, [hasChanges, editableDocument]);
```

### Export Options:
1. **PDF** - Generate from editable state
2. **DOCX** - Generate from editable state
3. **Google Docs** - Upload edited content

---

## 🎨 UI/UX Enhancements

### Visual Indicators:
- ✅ Hover state on editable sections
- ✅ "Click to edit" prompt
- ✅ Active editing outline
- ✅ Toolbar appears on focus

### Keyboard Shortcuts:
- **Ctrl+B** - Bold
- **Ctrl+I** - Italic
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Ctrl+S** - Save

---

## 🧪 Testing Checklist

- [ ] Click any paragraph to edit
- [ ] Format text (bold, italic)
- [ ] Change alignment
- [ ] Adjust font size
- [ ] Add new paragraph
- [ ] Delete paragraph
- [ ] Changes persist after save
- [ ] PDF export includes edits
- [ ] DOCX export includes edits
- [ ] Undo/redo works correctly

---

## 🚀 Next Steps

### To Continue Implementation:

1. **Integrate EditableSection into Preview Page:**
   - Replace static divs with EditableSection components
   - Add state management for all sections
   - Connect to save functionality

2. **Add Global Formatting Panel:**
   - Create a formatting sidebar
   - Add font family selector
   - Add line spacing controls
   - Add margin adjustment

3. **Implement Undo/Redo:**
   - Create history state management
   - Add keyboard shortcuts
   - Add undo/redo buttons to toolbar

4. **Test & Refine:**
   - Test all editing features
   - Ensure PDF/DOCX generation works with edits
   - Optimize performance

---

## 📞 Ready to Continue?

I've created the foundation components. When you're ready, I can:

1. **Integrate these components into your preview page**
2. **Add the remaining formatting tools**
3. **Implement undo/redo system**
4. **Add content management features**

**Which would you like me to work on next?**
