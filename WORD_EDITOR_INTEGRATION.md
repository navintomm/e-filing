# Word-like Editor Integration - Simple Guide

## ✅ What I Built

A **Microsoft Word-like editor** for your preview page with:

✅ **Full contentEditable document** - Click anywhere and type  
✅ **Word-style toolbar** - Bold, Italic, Underline, Alignment, etc.  
✅ **Keyboard shortcuts** - Ctrl+B, Ctrl+I, Ctrl+S, Ctrl+Z, etc.  
✅ **Real-time editing** - Changes as you type  
✅ **A4 paper view** - Looks like a real document  
✅ **Save/Download buttons** - PDF and DOCX export  

---

## 📁 Files Created

### 1. **WordEditor.tsx**
`components/WordEditor.tsx`

**The main Word-like editor component**

**Features:**
- Full Microsoft Word-style toolbar
- ContentEditable document
- Undo/Redo
- Font family selector (Times New Roman, Arial, etc.)
- Font size selector (8-24pt)
- Text formatting (Bold, Italic, Underline)
- Alignment (Left, Center, Right, Justify)
- Lists (Bullet, Numbered)
- Save button with unsaved changes indicator
- Download PDF/DOCX buttons

### 2. **html-generator.ts**
`lib/html-generator.ts`

**Converts your form data to HTML for the editor**

**Functions:**
- `generateEditableHTML(data)` - Creates formatted HTML from form data
- `extractHTMLContent(html)` - Extracts plain text for processing

---

## 🚀 How to Integrate (3 Easy Steps)

### Step 1: Import the Components

Add to `app/vakalath/preview/page.tsx`:

```typescript
import WordEditor from '@/components/WordEditor';
import { generateEditableHTML } from '@/lib/html-generator';
```

### Step 2: Generate HTML Content

Add this state and effect:

```typescript
const [editableHTML, setEditableHTML] = useState('');

useEffect(() => {
    if (data) {
        const html = generateEditableHTML(data);
        setEditableHTML(html);
    }
}, [data]);
```

### Step 3: Replace Preview with Editor

Replace the entire preview content div with:

```tsx
{data && editableHTML && (
    <WordEditor
        initialContent={editableHTML}
        onSave={(content) => {
            // Save edited content
            setEditableHTML(content);
            handleSaveChanges();
        }}
        onDownloadPDF={handleDownloadPDF}
        onDownloadDOCX={handleDownloadDOCX}
    />
)}
```

---

## 🎯 Complete Integration Example

Here's what your preview page should look like:

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VakalathFormValues } from "@/lib/validators";
import { generatePDF, generateDOCX } from "@/lib/generator";
import WordEditor from '@/components/WordEditor';
import { generateEditableHTML } from '@/lib/html-generator';
import BackButton from "@/components/BackButton";

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [data, setData] = useState<VakalathFormValues | null>(null);
    const [loading, setLoading] = useState(true);
    const [editableHTML, setEditableHTML] = useState('');

    useEffect(() => {
        const fetchDraft = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "drafts", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const formData = docSnap.data() as VakalathFormValues;
                    setData(formData);
                    
                    // Generate editable HTML
                    const html = generateEditableHTML(formData);
                    setEditableHTML(html);
                }
            } catch (error) {
                console.error("Error fetching draft:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDraft();
    }, [id]);

    const handleSaveChanges = async () => {
        if (!id || !data) return;
        try {
            await updateDoc(doc(db, "drafts", id), {
                ...data,
                editedContent: editableHTML, // Save the edited HTML
            });
            alert('Document saved successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save document');
        }
    };

    const handleDownloadPDF = async () => {
        if (!data) return;
        const blob = await generatePDF(data, false);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Vakalath_${data.district}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadDOCX = async () => {
        if (!data) return;
        const blob = await generateDOCX(data);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Vakalath_${data.district}.docx`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Loading preview...</div>
        </div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-red-600">Draft not found</div>
        </div>;
    }

    return (
        <div className="h-screen flex flex-col">
            <div className="p-4 bg-gray-50 border-b">
                <BackButton />
            </div>
            
            <WordEditor
                initialContent={editableHTML}
                onSave={(content) => {
                    setEditableHTML(content);
                    handleSaveChanges();
                }}
                onDownloadPDF={handleDownloadPDF}
                onDownloadDOCX={handleDownloadDOCX}
            />
        </div>
    );
}
```

---

## ✨ Features You Get

### 1. **Click Anywhere and Type**
- Just like Word
- No need to select sections
- Full document is editable

### 2. **Formatting Toolbar**
```
[Undo] [Redo] | [Font] [Size] | [B] [I] [U] | [⬅] [⬆] [➡] [≡] | [• List] [1. List]
```

### 3. **Keyboard Shortcuts**
- **Ctrl+B** - Bold
- **Ctrl+I** - Italic
- **Ctrl+U** - Underline
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Ctrl+S** - Save

### 4. **Auto-Save Indicator**
- Button shows "Save" when changes exist
- Shows "Saved" when up-to-date
- Changes color to indicate status

### 5. **Document View**
- A4 paper size
- Proper margins
- Looks like a real document
- Shadow effect for depth

---

## 🎨 How It Looks

```
┌─────────────────────────────────────────────┐
│ [Save] [Saved]           [PDF] [DOCX]       │
├─────────────────────────────────────────────┤
│ [⎌] [⎌] | [Times New Roman ▼] [14 ▼] |     │
│ [B] [I] [U] | [⬅] [⬆] [➡] [≡] | [•] [1]    │
├─────────────────────────────────────────────┤
│                                             │
│    ┌───────────────────────────────┐       │
│    │                               │       │
│    │  BEFORE THE COURT OF...       │       │
│    │                               │       │
│    │  Click anywhere to edit       │       │
│    │  and type like in Word        │       │
│    │                               │       │
│    │  Bold, Italic, Underline      │       │
│    │  Change alignment, add lists  │       │
│    │                               │       │
│    └───────────────────────────────┘       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Next Steps

### Option 1: Quick Test (Recommended)
1. Just add the 3 lines from "Step 1-3" above
2. Test it immediately
3. Refine as needed

### Option 2: Full Replacement
I can completely replace your current preview page with this Word-like editor.

---

## 💡 Advantages Over Previous Approach

| Feature | Section-by-Section | Word-like Editor |
|---------|-------------------|------------------|
| Editing | Click each section | Click anywhere |
| Feel | Custom | Like Microsoft Word |
| Learning Curve | New interface | Familiar to users |
| Flexibility | Limited | Full freedom |
| Complexity | More complex | Simpler |
| Professional | Yes | Very professional |

---

## 🚀 Ready to Integrate?

**Would you like me to:**

**A)** Replace your current preview page completely withthe Word-like editor ⭐ **RECOMMENDED**

**B)** Show you a side-by-side comparison first

**C)** Create a demo page so you can test it

**Let me know and I'll proceed!** 🎯

---

## 📝 Notes

- The editor uses browser's built-in contentEditable
- All standard Word shortcuts work
- Spell check is enabled automatically
- Content saves as HTML (easy to export to PDF/DOCX)
- Very lightweight - no heavy dependencies
