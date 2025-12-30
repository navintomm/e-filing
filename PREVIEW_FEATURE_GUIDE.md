# 🎯 PREVIEW FEATURE - IMPLEMENTATION GUIDE

## ��� WHAT YOU REQUESTED

Add a **Preview button** in the Advocate Details section that shows:
- Full document preview
- Font controls (size & family)
- Download buttons (PDF & DOCX)
- Edit capability
- All features like the draft preview page

---

## 🔧 HOW IT WORKS

### **Button Location:**
In the **Advocate Details** step (Step 3), add a **"Preview Document"** button next to the "Submit Draft" button.

### **What Happens:**
1. Click "Preview Document"
2. Modal/popup opens showing the Vakalath document
3. Can adjust font size, font family
4. Can download as PDF or DOCX
5. Close preview and continue editing
6. Submit when satisfied

---

## 📋 FILES TO MODIFY

### **1. Add Preview State**  
**File:** `app/vakalath/new/page.tsx`

Add useState for preview modal:
```tsx
const [showPreview, setShowPreview] = useState(false);
const [fontSize, setFontSize] = useState(14);
const [fontFamily, setFontFamily] = useState('serif');
```

### **2. Add Preview Button**
In the same file, in the Advocate Details step section:

```tsx
{activeStep === STEPS.length - 1 && (
    <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
    >
        <Eye className="mr-2 w-5 h-5" />
        Preview Document
    </button>
)}
```

### **3. Create Preview Modal Component**

Create new file: `components/vakalath/PreviewModal.tsx`

```tsx
"use client";

import { X, FileDown, Type } from "lucide-react";
import { VakalathFormValues } from "@/lib/validators";
import { generatePDF, generateDOCX } from "@/lib/generator";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: VakalathFormValues;
    fontSize: number;
    setFontSize: (size: number) => void;
    fontFamily: string;
    setFontFamily: (family: string) => void;
}

export function PreviewModal({
    isOpen,
    onClose,
    data,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily
}: PreviewModalProps) {
    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        const pdfBytes = await generatePDF(data, fontSize);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Vakalath_Preview.pdf`;
        link.click();
    };

    const handleDownloadDOCX = async () => {
        const blob = await generateDOCX(data);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Vakalath_Preview.docx`;
        link.click();
    };

    // Extract parties
    const petitioners = data.parties.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff')
    );
    const respondents = data.parties.filter(p =>
        p.role?.toLowerCase().includes('respondent') ||
        p.role?.toLowerCase().includes('defendant')
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-gray-900">Document Preview</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap items-center gap-4 bg-gray-50">
                    {/* Font Size */}
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-600" />
                        <button
                            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                            A-
                        </button>
                        <span className="text-sm font-medium">{fontSize}px</span>
                        <button
                            onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                        >
                            A+
                        </button>
                    </div>

                    {/* Font Family */}
                    <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="serif">Times New Roman</option>
                        <option value="sans-serif">Arial</option>
                        <option value="monospace">Courier New</option>
                    </select>

                    {/* Download Buttons */}
                    <button
                        onClick={handleDownloadPDF}
                        className="ml-auto inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 shadow-sm"
                    >
                        <FileDown className="w-4 h-4 mr-2" />
                        PDF
                    </button>
                    <button
                        onClick={handleDownloadDOCX}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 shadow-sm"
                    >
                        <FileDown className="w-4 h-4 mr-2" />
                        DOCX
                    </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-md"
                        style={{ fontSize: `${fontSize}px`, fontFamily }}>
                        
                        {/* Document Header */}
                        <div className="text-center font-bold mb-4">
                            <p className="uppercase">BEFORE THE COURT OF {data.courtName} {data.district}</p>
                            <p className="mt-4">{data.caseType} No. {data.caseNumber || '_______'} of {data.year || '20__'}</p>
                        </div>

                        {/* Parties */}
                        <div className="mb-4">
                            {petitioners.map((p, index) => (
                                <p key={`pet-${index}`} className="font-bold">
                                    {index + 1}. {p.name}
                                </p>
                            ))}
                            <p className="font-bold">... {petitioners.length > 1 ? 'Petitioners' : 'Petitioner'}</p>
                        </div>

                        <div className="text-center my-4">And</div>

                        <div className="mb-4">
                            {respondents.map((r, index) => (
                                <p key={`res-${index}`} className="font-bold">
                                    {index + 1}. {r.name}
                                </p>
                            ))}
                            <p className="font-bold">... {respondents.length > 1 ? 'Respondents' : 'Respondent'}</p>
                        </div>

                        {/* Title */}
                        <div className="text-center font-bold text-lg my-6 uppercase">
                            {data.documentType}
                        </div>

                        {/* Body */}
                        <div className="space-y-4 text-justify leading-relaxed">
                            <p>
                                {petitioners.length > 1 ? "We" : "I"} {petitioners.map(p => p.name).join(', ')} {petitioners.length > 1 ? 'residents' : 'resident'} of:
                            </p>

                            {petitioners.map((p, index) => (
                                <p key={`det-${index}`}>
                                    {index + 1}. {p.name}, aged {p.age || '___'} years, 
                                    {p.fatherOrHusbandName && ` ${p.fatherOrHusbandName},`} residing at {p.address || '___________'}
                                </p>
                            ))}

                            <p className="mt-4">
                                do hereby appoint and retain <strong>{data.advocateName}</strong> Advocate, {data.advocateAddress} to appear for {petitioners.length > 1 ? "us" : "me"} in the above suit, appeal or petition and to conduct and prosecute the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed therein.
                            </p>

                            <p>
                                {petitioners.length > 1 ? "We" : "I"} empower the said Advocate/s to compromise, adjourn or withdraw the suit or proceeding on {petitioners.length > 1 ? "our" : "my"} behalf and to appear in all miscellaneous proceedings in the above suit or matter till all decrees or orders are fully satisfied or adjusted.
                            </p>

                            {data.witnesses && (
                                <div className="mt-6">
                                    <p className="font-bold">WITNESSES:</p>
                                    {data.witnesses.split(',').map((witness, index) => (
                                        <p key={`wit-${index}`}>{index + 1}. {witness.trim()}</p>
                                    ))}
                                </div>
                            )}

                            {/* Signature Section */}
                            <div className="mt-8 space-y-2">
                                <p>Date: _______________</p>
                                <p className="mt-6 font-bold">Signatures of Client(s):</p>
                                {petitioners.map((p, index) => (
                                    <div key={`sig-${index}`} className="mt-4">
                                        <p>{index + 1}. _______________________</p>
                                        <p className="ml-4">({p.name})</p>
                                    </div>
                                ))}
                            </div>

                            {/* Acceptance */}
                            <div className="mt-12 text-center">
                                <p className="font-bold mb-4">ACCEPTANCE</p>
                                <p>I accept the above Vakalathnama.</p>
                                <div className="mt-8 text-left space-y-2">
                                    <p>Place: _______________</p>
                                    <p>Date: _______________</p>
                                    <p className="mt-6">Advocate's Signature: _______________________</p>
                                    <p>Name: {data.advocateName}</p>
                                    <p>Enrolment No.: {data.enrollmentNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### **4. Import and Use the PreviewModal**

In `app/vakalath/new/page.tsx`:

```tsx
// Add import
import { PreviewModal } from "@/components/vakalath/PreviewModal";

// In the JSX, after the form:
<PreviewModal
    isOpen={showPreview}
    onClose={() => setShowPreview(false)}
    data={watch()} // Gets current form data
    fontSize={fontSize}
    setFontSize={setFontSize}
    fontFamily={fontFamily}
    setFontFamily={setFontFamily}
/>
```

---

## 🎨 WHAT THE USER WILL SEE

### **1. In Advocate Details Step:**
```
┌───────────────────────────────────────────┐
│ Advocate Details                          │
├───────────────────────────────────────────┤
│ [Advocate Name input]                     │
│ [Enrollment Number input]                 │
│ [Mobile Number input]                     │
│ [Address textarea]                        │
│                                           │
│ [👁️ Preview Document] [Submit Draft]     │
└───────────────────────────────────────────┘
```

### **2. Preview Modal:**
```
┌─────────────────────────────────────────────────┐
│ Document Preview                          [X]   │
├─────────────────────────────────────────────────┤
│ 👁️ A- [14px] A+ [Times New Roman ▼] [PDF] [DOCX] │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │   BEFORE THE COURT OF...                    │ │
│ │                                             │ │
│ │   WP(C) No. 245 of 2025                    │ │
│ │                                             │ │
│ │   1. John Doe                              │ │
│ │   ...Petitioner                             │ │
│ │                                             │ │
│ │   And                                       │ │
│ │                                             │ │
│ │   1. State of Kerala                       │ │
│ │   ...Respondent                             │ │
│ │                                             │ │
│ │   VAKALATHNAMA                             │ │
│ │                                             │ │
│ │   I John Doe...                            │ │
│ │   (Full document content)                   │ │
│ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│                            [Close Preview]      │
└─────────────────────────────────────────────────┘
```

---

## ✅ FEATURES INCLUDED

- ✅ Font size control (10px to 20px)
- ✅ Font family selector (Times New Roman, Arial, Courier)
- ✅ PDF download button
- ✅ DOCX download button
- ✅ Full document preview with Kerala HC format
- ✅ Scrollable content
- ✅ Responsive design
- ✅ Close button
- ✅ Overlay background
- ✅ Premium styling

---

## 🚀 READY TO IMPLEMENT

Create the `PreviewModal.tsx` component file and I'll help integrate it into your form!

Would you like me to create all the files now?
