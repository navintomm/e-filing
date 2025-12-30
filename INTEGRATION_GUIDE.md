# Preview Page Integration - Complete Implementation  Guide

## ⚠️ IMPORTANT: Backup Created
A backup of your original preview page has been saved as:
`app/vakalath/preview/page.backup.tsx`

You can restore it anytime if needed.

---

## 🎯 Integration Approach

Due to the size and complexity of the preview page, I'll create a **modular integration plan** that you can implement step-by-step or all at once.

---

## Step 1: Add New Imports

Add these imports to the top of `app/vakalath/preview/page.tsx`:

```typescript
// Add after existing imports
import EditableSection from '@/components/EditableSection';
import EditableParagraphList from '@/components/EditableParagraphList';
import EditablePartyList, { EditableParty } from '@/components/EditablePartyList';
import DocumentFormatting from '@/components/Document Formatting';
```

---

## Step 2: Add New State Variables

Add these state variables after the existing ones:

```typescript
// Editable content state
const [editableData, setEditableData] = useState<{
    courtHeading: { content: string; fontSize: number; isBold: boolean; alignment: string };
    caseDetails: { content: string; fontSize: number };
    petitioners: EditableParty[];
    respondents: EditableParty[];
    documentTitle: { content: string; fontSize: number; isBold: boolean };
    witnesses: { content: string };
    signature: { content: string; alignment: string };
} | null>(null);

// Document formatting state  
const [documentFont, setDocumentFont] = useState('Times New Roman');
const [lineSpacing, setLineSpacing] = useState(1.5);

// Undo/Redo state
const [history, setHistory] = useState<any[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
```

---

## Step 3: Initialize Editable Data

Add this function to convert form data to editable format:

```typescript
const initializeEditableData = (formData: VakalathFormValues) => {
    const petitioners = formData.parties
        .filter(p => 
            p.role?.toLowerCase().includes('petitioner') ||
            p.role?.toLowerCase().includes('plaintiff') ||
            p.role?.toLowerCase().includes('complainant') ||
            p.role?.toLowerCase().includes('applicant')
        )
        .map((p, i) => ({
            id: `pet-${i}`,
            name: p.name,
            role: p.role,
            status: p.status,
            age: p.age,
            address: p.address,
            pincode: p.pincode,
        }));

    const respondents = formData.parties
        .filter(p => 
            p.role?.toLowerCase().includes('respondent') ||
            p.role?.toLowerCase().includes('defendant') ||
            p.role?.toLowerCase().includes('opposite party')
        )
        .map((p, i) => ({
            id: `res-${i}`,
            name: p.name,
            role: p.role,
            status: p.status,
            age: p.age,
            address: p.address,
            pincode: p.pincode,
        }));

    const isHighCourt = formData.courtName.toLowerCase().includes('high court');
    const courtHeadingText = isHighCourt
        ? `IN THE HIGH COURT OF KERALA AT ERNAKULAM\n${formData.courtName.toUpperCase()}`
        : `BEFORE THE COURT OF ${formData.courtName.toUpperCase()}, ${formData.district.toUpperCase()}`;

    setEditableData({
        courtHeading: {
            content: courtHeadingText,
            fontSize: 16,
            isBold: true,
            alignment: 'center',
        },
        caseDetails: {
            content: `${formData.caseType} No. ${formData.caseNumber} of ${formData.year}`,
            fontSize: 14,
        },
        petitioners,
        respondents,
        documentTitle: {
            content: formData.documentType === 'Memo of Appearance' ? 'MEMO OF APPEARANCE' : 'VAKALATHNAMA',
            fontSize: 16,
            isBold: true,
        },
        witnesses: {
            content: formData.witnesses || '',
        },
        signature: {
            content: `Advocate for ${petitioners[0]?.role || 'Petitioner'}(s)\n${formData.advocateName}\nEnrollment No: ${formData.enrollmentNumber}\n${formData.advocateAddress}`,
            alignment: 'right',
        },
    });

    // Save initial state to history
    saveToHistory({
        courtHeading: { content: courtHeadingText, fontSize: 16, isBold: true, alignment: 'center' },
        // ... rest of the state
    });
};
```

---

## Step 4: Implement Undo/Redo Functions

```typescript
const saveToHistory = (state: any) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
};

const handleUndo = () => {
    if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setEditableData(history[historyIndex - 1]);
    }
};

const handleRedo = () => {
    if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setEditableData(history[historyIndex + 1]);
    }
};
```

---

## Step 5: Add Keyboard Shortcuts

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

---

## Step 6: Update Save Function

Modify `handleSaveChanges` to save editable data:

```typescript
const handleSaveChanges = async () => {
    if (!id || !editableData) return;

    try {
        setIsSaving(true);

        // Convert editable data back to form data format
        const updatedData = {
            ...data!,
            parties: [...editableData.petitioners, ...editableData.respondents],
            witnesses: editableData.witnesses.content,
            // ... other fields
        };

        await updateDoc(doc(db, "drafts", id), updatedData);
        setData(updatedData);
        setHasUnsavedChanges(false);
        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Error saving:', error);
        alert('Failed to save changes');
    } finally {
        setIsSaving(false);
    }
};
```

---

## Step 7: Replace Static HTML with Editable Components

### Before (Static):
```tsx
<div className="text-center font-bold text-lg">
    BEFORE THE COURT OF {data.courtName.toUpperCase()}
</div>
```

### After (Editable):
```tsx
{editableData && (
    <EditableSection
        content={editableData.courtHeading.content}
        onChange={(newContent) => {
            const updated = { ...editableData, courtHeading: { ...editableData.courtHeading, content: newContent }};
            setEditableData(updated);
            saveToHistory(updated);
        }}
        isBold={editableData.courtHeading.isBold}
        fontSize={editableData.courtHeading.fontSize}
        alignment={editableData.courtHeading.alignment}
        onFormatChange={(format) => {
            const updated = { ...editableData, courtHeading: { ...editableData.courtHeading, ...format }};
            setEditableData(updated);
            saveToHistory(updated);
        }}
    />
)}
```

---

## Step 8: Add Document Formatting Toolbar

Add this at the top of your preview content:

```tsx
{editableData && (
    <DocumentFormatting
        fontFamily={documentFont}
        lineSpacing={lineSpacing}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onFontFamilyChange={(font) => {
            setDocumentFont(font);
            setHasUnsavedChanges(true);
        }}
       onLineSpacingChange={(spacing) => {
            setLineSpacing(spacing);
            setHasUnsavedChanges(true);
        }}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSaveChanges}
    />
)}
```

---

## ⚡ Quick Start: Simplified Integration

If the full integration is too complex, here's a **simplified version** that adds basic inline editing without undo/redo:

### Minimal Changes:

1. **Import EditableSection**:
```typescript
import EditableSection from '@/components/EditableSection';
```

2. **Add one editable field** (test with court heading):
```tsx
<EditableSection
    content={data.courtName}
    onChange={(newName) => setData({ ...data!, courtName: newName })}
    fontSize={16}
    isBold={true}
    alignment="center"
/>
```

3. **Test it** - click the court name to edit

4. **Gradually add more** editable sections once you're comfortable

---

## 🎯 Recommended Approach

### Option A: Full Integration (Comprehensive)
- All features at once
- Requires significant changes
- Best for production-ready solution

### Option B: Incremental Integration (Safer)
- Start with one editable field
- Test thoroughly
- Add more features gradually

### Option C: New Preview Page (Cleanest)
- Create `preview-editable.tsx` alongside current one
- Build from scratch with new components
- Switch when ready

---

## 🐛 Testing Checklist

After integration:
- [ ] Can click and edit text
- [ ] Formatting toolbar appears
- [ ] Bold/italic buttons work
- [ ] Alignment changes apply
- [ ] Font size adjusts
- [ ] Changes save to Firestore
- [ ] PDF export uses edited content
- [ ] DOCX export uses edited content
- [ ] Undo/redo works
- [ ] No console errors

---

## 📞 Next Steps

**Which approach would you like?**

1. **Full integration now** - I'll modify the preview page completely
2. **Incremental** - Start with just court heading editable
3. **New file** - Create preview-editable.tsx from scratch
4. **Show me an example first** - I'll create a demo component

**Let me know and I'll proceed!** 🚀
