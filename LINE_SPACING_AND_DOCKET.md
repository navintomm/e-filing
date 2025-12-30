# Line Spacing Feature Added + Docket Template Reference ✅

**Date**: December 26, 2025  
**Status**: ✅ Implemented

---

## 🎯 What Was Added

### **1. Line Spacing Control in Preview Modal**

Added interactive line spacing controls to the document preview/editing interface.

**Location**: Preview Modal toolbar (alongside font size and font family)

---

## ✨ Line Spacing Feature Details

### **UI Controls**:
```
┌───────────────────────────────────────────────┐
│ [A-]  14px  [A+]  | [-] 1.5x [+] | Font Family │
│ ↑Font Size        ↑Line Spacing               │
└───────────────────────────────────────────────┘
```

### **Functionality**:
- **Decrease Button** (`-`): Reduces line height by 0.1
- **Increase Button** (`+`): Increases line height by 0.1
- **Display**: Shows current line spacing (e.g., "1.5x")
- **Range**: 1.0x to 2.5x
- **Icon**: AlignLeft icon for visual clarity

### **Implementation**:
```tsx
// State management
const [lineHeight, setLineHeight] = useState(1.5);

// Control buttons
<button onClick={() => setLineHeight(Math.max(1.0, lineHeight - 0.1))}>-</button>
<span>{lineHeight.toFixed(1)}x</span>
<button onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}>+</button>

// Apply to document
<div style={{ fontSize: `${fontSize}px`, fontFamily, lineHeight }}>
```

---

## 📄 Docket Template Reference

### **What is the Docket?**

The docket is the **back page** of a Vakalath document used in District Courts.

### **Template Structure**:

```
                                    Filed on: _______________
                                    
                                    
            BEFORE THE COURT OF
        _______________________________________




                                    No. _______ of 202___




                VAKALATHNAMA



                                                    Accepted




                                    Address for service of summons


                                    ADVOCATE
                                    
                                    [Advocate Name]
                                    [Advocate Address]
                                    Pin: [Pincode]
                                    Ph: [Mobile Number]
```

### **Template Code Location**:
**File**: `lib/generator.ts` (Lines 374-443)

### **Key Elements**:
1. **Filed on Date**: Top-right (manual entry field)
2. **Court Name**: Centered header with underline
3. **Case Number**: Top-right placeholder
4. **Title**: "VAKALATHNAMA" centered
5. **Accepted**: Right-aligned
6. **Address Section**: Bottom-right aligned with:
   - "ADVOCATE" label (bold)
   - Advocate name
   - Advocate address
   - Pincode (from first petitioner)
   - Phone number

### **Auto-fills From**:
- `data.advocateName`
- `data.advocateAddress`
- `data.advocateMobile`
- `petitioners[0].pincode` (if available)

### **Formatting**:
- All text is **right-aligned** except "BEFORE THE COURT OF" and "VAKALATHNAMA" (centered)
- Uses same font and margins as main document
- Professional spacing following court standards

---

## 🎨 Complete Preview Toolbar Features

Now the toolbar has **4 controls**:

| Control | Icon | Function | Range |
|---------|------|----------|-------|
| **Font Size** | Type (A icon) | Adjust text size | 10px - 20px |
| **Line Spacing** | AlignLeft | Adjust line height | 1.0x - 2.5x |
| **Font Family** | Dropdown | Change font | Times/Arial/Courier |
| **Download** | FileDown | Export PDF/DOCX | - |

---

## 📊 Line Spacing Use Cases

### **Common Values**:
- **1.0**: Single spacing (compact)
- **1.15**: Slight spacing (modern documents)
- **1.5**: Standard legal spacing ✅ (default)
- **2.0**: Double spacing (draft/review)
- **2.5**: Maximum spacing (large print/accessibility)

### **Benefits**:
1. ✅ **Readability**: Adjust for easier reading
2. ✅ **Court Requirements**: Match specific court preferences
3. ✅ **Accessibility**: Larger spacing for vision needs
4. ✅ **Print Optimization**: Adjust before printing
5. ✅ **Real-time Preview**: See changes immediately

---

## 🔧 Technical Implementation

### **File Modified**:
`components/vakalath/PreviewModal.tsx`

### **Changes Made**:
1. Added `useState` for `lineHeight` (default 1.5)
2. Imported `AlignLeft` icon from lucide-react
3. Added line spacing control buttons in toolbar
4. Applied `lineHeight` to document style

### **Code Added**:
```tsx
// Import
import { useState } from "react";
import { AlignLeft } from "lucide-react";

// State
const [lineHeight, setLineHeight] = useState(1.5);

// UI Control
<div className="flex items-center gap-2">
    <AlignLeft className="w-4 h-4 text-gray-600" />
    <button onClick={() => setLineHeight(Math.max(1.0, lineHeight - 0.1))}>
        -
    </button>
    <span className="text-sm font-medium">{lineHeight.toFixed(1)}x</span>
    <button onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}>
        +
    </button>
</div>

// Apply to document
style={{ fontSize: `${fontSize}px`, fontFamily, lineHeight }}
```

---

## ✅ Summary

### **Docket**:
- ✅ Template exists in `lib/generator.ts`
- ✅ Automatically generated when "Include Docket" is checked
- ✅ Follows Kerala court standards
- ✅ Right-aligned professional format

### **Line Spacing**:
- ✅ Added to preview modal toolbar
- ✅ Range: 1.0x to 2.5x (increments of 0.1)
- ✅ Real-time preview updates
- ✅ Alongside font size and font family controls
- ✅ Uses AlignLeft icon for visual clarity

---

**Both features are now fully functional!** 🎉

Users can:
1. Enable docket pages for District Courts ✅
2. Adjust line spacing in real-time while previewing ✅
