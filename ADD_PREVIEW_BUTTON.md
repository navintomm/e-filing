#  🎯 PREVIEW BUTTON - QUICK IMPLEMENTATION

## ✅ WHAT I'VE DONE

Created `components/vakalath/PreviewModal.tsx` - A complete preview modal component!

---

## 🔧 NEXT STEPS - ADD TO YOUR FORM

### Step 1: Open `app/vakalath/new/page.tsx`

### Step 2: Add these imports at the top:
```tsx
import { Eye, X } from "lucide-react"; // Add Eye and X if not already there
import { PreviewModal } from "@/components/vakalath/PreviewModal";
```

### Step 3: Add state variables (around line 30):
```tsx
const [showPreview, setShowPreview] = useState(false);
const [fontSize, setFontSize] = useState(14);
const [fontFamily, setFontFamily] = useState('serif');
```

### Step 4: Find the "Submit Draft" button (around line 265)

It should look like:
```tsx
{activeStep === STEPS.length - 1 ? (
    <button type="submit"...>
        {isSubmitting ? "Submitting..." : "Submit Draft"}
        <Check className="ml-2 w-4 h-4" />
    </button>
```

### Step 5: ADD Preview button BEFORE Submit button:

```tsx
{activeStep === STEPS.length - 1 ? (
    <>
        {/* ADD THIS PREVIEW BUTTON */}
        <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-blue-700 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all shadow-sm"
        >
            <Eye className="mr-2 w-5 h-5" />
            Preview Document
        </button>

        {/* EXISTING SUBMIT BUTTON */}
        <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                </>
            ) : (
                <>
                    Submit Draft
                    <Check className="ml-2 w-5 h-5" />
                </>
            )}
        </button>
    </>
```

### Step 6: Add the PreviewModal component at the END of your JSX (before final closing tags):

Find the last `</div>` in your return statement and ADD BEFORE IT:

```tsx
{/* Preview Modal */}
<PreviewModal
    isOpen={showPreview}
    onClose={() => setShowPreview(false)}
    data={watch()} // Gets current form values
    fontSize={fontSize}
    setFontSize={setFontSize}
    fontFamily={fontFamily}
    setFontFamily={setFontFamily}
/>
```

---

## 🎉 THAT'S IT!

Now when users reach the Advocate Details step, they'll see:

```
[👁️ Preview Document]  [Submit Draft]
```

Clicking "Preview Document" opens a modal with:
- ✅ Full document preview
- ✅ Font size controls (A- / A+)
- ✅ Font family selector
- ✅ PDF download button
- ✅ DOCX download button
- ✅ Close button

---

## 🚀 TEST IT

1. Refresh your browser
2. Fill out the form through all 3 steps
3. In Advocate Details step, click "Preview Document"
4. See the preview modal!
5. Try font controls and downloads
6. Close and continue editing
7. Submit when ready!

Perfect workflow! 🎯
