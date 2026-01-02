# KERALA COURT VAKALATHNAMA - STRICT FORMAT SPECIFICATION
**Date:** December 31, 2025  
**Status:** ✅ IMPLEMENTED - Court-Compliant Format

---

## ⚠️ CRITICAL: FIXED-LAYOUT LEGAL DOCUMENT

This is **NOT** a responsive or flowing document.  
This is a **COURT-ACCEPTED LEGAL FORM** with **EXACT** formatting requirements.

**DO NOT:**
- Modify layout
- Change spacing
- Reword legal text
- Remove dotted lines
- Make it responsive
- Compress or wrap differently

---

## 📄 DOCUMENT STRUCTURE

### **OUTPUT: ONE PDF, EXACTLY TWO PAGES**

```
┌─────────────────────────────────────┐
│         PAGE 1 (FULL PAGE)          │
│      VAKALATHNAMA BODY              │
│                                     │
│  Complete legal document content   │
│                                     │
└─────────────────────────────────────┘

┌──────────────┬──────────────────────┐
│              │      PAGE 2          │
│   LEFT       │      DOCKET          │
│   HALF       │    (RIGHT HALF)      │
│              │                      │
│  BLANK       │  Case details        │
│  SPACE       │  Party names         │
│              │  VAKALATHNAMA        │
│              │  Signature           │
│              │  ADVOCATE            │
└──────────────┴──────────────────────┘
```

**Page Order:** MUST be preserved  
**Page Count:** ALWAYS 2 pages  
**Merging:** PROHIBITED

---

## 📋 PAGE 1: FULL PAGE VAKALATH BODY

### **Layout (Top to Bottom):**

1. **"IN THE COURT OF"**
   - Centered
   - Own line
   - Font: Bold, 12pt

2. **Court Name**
   - Centered
   - UPPERCASE
   - Next line after court header
   - Font: Bold, 12pt

3. **Case Number**
   - Centered
   - Own line
   - Format: `[TYPE] No. [NUM] of [YEAR]`
   - Font: Bold, 11pt

4. **Party Roles List (RIGHT-ALIGNED VERTICAL)**
   ```
   Plaintiff              ← Right side
   Petitioner            ← Right side
   Appellant             ← Right side
   Complainant           ← Right side
   
   Defendant             ← Right side
   Respondent            ← Right side
   Cr. Petitioner        ← Right side
   Accused               ← Right side
   ```
   - X position: 495 (right-aligned)
   - Selected role: **Bold + Underlined**
   - Other roles: Regular font
   - Spacing: 15px vertical

5. **Party Names (Simple Format)**
   ```
   [Name 1]    —
   [Name 2]    —
   ```
   - X position: 120 (left side)
   - Dash at: 270
   - Font: Regular, 11pt

6. **I/We Declaration with Dotted Lines**
   ```
   I/We [name] aged [age] [father/husband] resident at [address]
   .................................................................
   PIN [pin] [mobile]
   .................................................................
   ```
   - Dotted underlines: 4px spacing, 2px segments
   - Font: Regular, 10pt
   - **DO NOT remove dotted lines**

7. **"do hereby appoint and retain"**
   - Centered
   - Own line
   - Font: Regular, 11pt

8. **Advocate Name**
   - Centered
   - Font: Regular, 11pt

9. **Standard Legal Authorization Text**
   - **DO NOT MODIFY THIS TEXT**
   - Fully justified (except last line)
   - Font: Regular, 10pt
   - Line spacing: 12px
   - Width: Page width - 100px

10. **Date**
    ```
    Signed this the [14th] day of [November] [2025]
    ```
    - Format with ordinal suffix (st, nd, rd, th)
    - Font: Regular, 10pt

11. **Signature Section (Two Columns)**
    ```
    Witnesses:                Known parties and signed before me
                                          Advocate
    1. [Name]
    2. [Name]
    ```
    - Left column: Witnesses list
    - Right column: Advocate acceptance
    - Font: Regular/Bold, 9-10pt

12. **Advocate Details Box (Bottom Right)**
    ```
    ╔═══════════════════════════════╗
    ║   [ADVOCATE NAME]             ║
    ║   ADVOCATE                    ║
    ║   Roll No: [number]           ║
    ║   [Address]                   ║
    ║   Mob: [phone]                ║
    ╚═══════════════════════════════╝
    ```
    - Position: Bottom right (x: 365, y: 100)
    - Size: 180 x 85 px
    - Border: Dark blue `rgb(0, 0, 0.8)`, 1.5px
    - Background: Light blue `rgb(0.9, 0.95, 1)`
    - Text: Centered within box, dark blue
    - Fonts: 7-11pt varying

---

## 📋 PAGE 2: DOCKET (RIGHT HALF ONLY)

### **CRITICAL LAYOUT RULE:**

```
┌───────────────┬───────────────┐
│               │               │
│    LEFT       │    RIGHT      │
│    HALF       │    HALF       │
│               │               │
│   BLANK       │   DOCKET      │
│   SPACE       │   CONTENT     │
│               │               │
│  (Empty)      │  (Content)    │
│               │               │
└───────────────┴───────────────┘
```

**X Coordinates:**
- Left half: 0 to 297.64 (BLANK)
- **Docket starts at:** 297.64 (PAGE_WIDTH / 2)
- **Docket center:** 446.46 (used for centering)
- **Docket width:** ~257 px

### **Docket Content (Top to Bottom in RIGHT HALF):**

1. **"Filed on:"**
   - Top of right half
   - X: docketStartX + 20
   - Font: Regular, 10pt

2. **"BEFORE THE COURT OF"**
   - Centered within RIGHT HALF
   - Font: Bold, 14pt

3. **Court Name**
   - Centered within RIGHT HALF
   - UPPERCASE
   - Font: Regular, 12pt

4. **Case Number**
   - Centered within RIGHT HALF
   - Format: `[TYPE] No. [NUM] of [YEAR]`
   - Font: Regular, 11pt

5. **Party Names with Roles**
   ```
   [Name]  —  Plaintiff
   [Name]  —  Defendant
   ```
   - Centered within RIGHT HALF
   - Shows first 2 parties
   - If more: "& [N] Others"
   - Font: Regular, 11pt

6. **"VAKALATHNAMA" Title**
   - Centered within RIGHT HALF
   - Font: Bold, 18pt (LARGE)

7. **"on behalf of the [role]"**
   - Centered within RIGHT HALF
   - Font: Regular, 10pt

8. **Signature Line**
   ```
   ____________________
   ```
   - Centered within RIGHT HALF
   - Font: Regular, 11pt

9. **"Accepted"**
   - Centered within RIGHT HALF
   - Font: Regular, 10pt

10. **Advocate Name**
    - Centered within RIGHT HALF
    - Font: Regular, 11pt

11. **Enrollment Number**
    - Centered within RIGHT HALF
    - Font: Regular, 9pt

12. **"Address for service of summons"**
    - Centered within RIGHT HALF
    - Font: Regular, 9pt

13. **"ADVOCATE"**
    - Centered within RIGHT HALF
    - Bottom of docket
    - Font: Bold, 14pt

---

## 🎨 EXACT SPECIFICATIONS

### **Page Dimensions:**
- **Width:** 595.28 px (A4)
- **Height:** 841.89 px (A4)
- **Margin:** 72 px (1 inch)

### **Fonts:**
- **Times Roman** (Regular)
- **Times Roman Bold** (Bold)

### **Font Sizes:**
- Headers: 12-14pt
- Body: 10-11pt
- Legal text: 10pt
- Advocate box: 7-11pt (varying)
- Docket title: 18pt

### **Colors:**
- **Text:** `rgb(0, 0, 0)` - Black
- **Advocate box border:** `rgb(0, 0, 0.8)` - Dark blue
- **Advocate box background:** `rgb(0.9, 0.95, 1)` - Light blue
- **Advocate box text:** `rgb(0, 0, 0.8)` - Dark blue

### **Line Spacing:**
- Legal text: 12px
- Party names: 18-20px
- Section gaps: 20-40px

### **Special Elements:**
- **Dotted underlines:** 4px dash spacing, 2px line segments
- **Party role underlines:** 0.5px solid

---

## 🚫 STRICT PROHIBITIONS

### **DO NOT:**

❌ **Reword legal sentences**  
❌ **Auto-wrap or compress text differently**  
❌ **Change margins or spacing**  
❌ **Remove dotted lines**  
❌ **Convert into responsive layout**  
❌ **Fill the left half of page 2**  
❌ **Expand docket to full width**  
❌ **Center docket across full page**  
❌ **Merge pages**  
❌ **Change page count**  
❌ **Modify standard legal authorization text**  

### **ALWAYS:**

✅ **Generate EXACTLY 2 pages**  
✅ **Keep left half of page 2 BLANK**  
✅ **Center docket content within RIGHT HALF only**  
✅ **Preserve exact spacing**  
✅ **Preserve dotted underlines**  
✅ **Use right-aligned vertical party role list**  
✅ **Justify legal authorization text**  
✅ **Include blue advocate box on page 1**  

---

## 📐 CODE IMPLEMENTATION

### **Key Variables:**
```typescript
const PAGE_WIDTH = 595.28;    // A4 width
const PAGE_HEIGHT = 841.89;   // A4 height
const MARGIN = 72;            // 1 inch

// Page 2 Docket coordinates
const docketStartX = PAGE_WIDTH / 2;           // 297.64
const docketWidth = PAGE_WIDTH / 2 - 40;       // 257.64
const docketCenterX = docketStartX + docketWidth / 2; // 446.46
```

### **Centering in Right Half:**
```typescript
// CORRECT - Centers within RIGHT HALF
const textX = docketCenterX - font.widthOfTextAtSize(text, size) / 2;

// WRONG - Would center across full page
const textX = PAGE_WIDTH / 2 - font.widthOfTextAtSize(text, size) / 2;
```

### **Legal Text (DO NOT MODIFY):**
```typescript
const STANDARD_LEGAL_TEXT = `Advocate to appear for me/us in the above suit...`;
// This text is FIXED - never change it
```

---

## ✅ VERIFICATION CHECKLIST

### **Page 1:**
- [ ] "IN THE COURT OF" on own line, centered
- [ ] Court name on next line, centered, uppercase
- [ ] Case number on own line, centered
- [ ] Party roles RIGHT-ALIGNED vertical list
- [ ] Selected roles bold + underlined
- [ ] Party names with dash format
- [ ] I/We section with dotted underlines
- [ ] "do hereby appoint and retain" centered
- [ ] Advocate name centered
- [ ] Legal authorization text fully justified
- [ ] Date with ordinal suffix
- [ ] Two-column signature section
- [ ] Blue advocate box bottom right

### **Page 2:**
- [ ] LEFT HALF completely blank
- [ ] "Filed on:" in right half
- [ ] All content centered WITHIN right half
- [ ] "BEFORE THE COURT OF" visible
- [ ] Court name below it
- [ ] Case number below that
- [ ] Party names with roles
- [ ] "VAKALATHNAMA" in large bold font
- [ ] "on behalf of [role]"
- [ ] Signature line and "Accepted"
- [ ] Advocate name and enrollment
- [ ] "Address for service of summons"
- [ ] "ADVOCATE" at bottom

### **Overall:**
- [ ] EXACTLY 2 pages in PDF
- [ ] No content overflow or truncation
- [ ] No text wrapping errors
- [ ] All spacing preserved
- [ ] No responsive behavior
- [ ] Matches scanned template visually

---

## 🎯 VISUAL ACCURACY GOAL

**The generated PDF must be INDISTINGUISHABLE from the original scanned Kerala court vakalath format.**

This includes:
- Exact spacing between elements
- Precise alignment
- Dotted underline areas
- Full-page vakalath body
- RIGHT-HALF docket layout on page 2

**This is a court-accepted legal form. Visual accuracy is MANDATORY.**

---

## 📝 IMPLEMENTATION STATUS

✅ **Generator Updated:** `lib/generator.ts`  
✅ **Build Status:** SUCCESS  
✅ **TypeScript:** No errors  
✅ **Format:** STRICT compliance  
✅ **Pages:** ALWAYS 2  
✅ **Docket Layout:** RIGHT HALF ONLY  

---

*This specification must be followed EXACTLY. No deviations are permitted.*
