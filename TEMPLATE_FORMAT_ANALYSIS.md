# Template Format Analysis & Update
**Date:** December 31, 2025

## Analysis of Actual Kerala Court Template

Based on the scanned Vakalathnama template provided, here are the key formatting elements:

### **PAGE 1 - Main Vakalathnama**

#### 1. **Header Section**
- **Left side:** "IN THE COURT OF"
- **Right side (same line):** "[Case Type] No. ___ of [Year]"
- Both on the SAME horizontal line

#### 2. **Party Type Reference (Right Side)**
A vertical list showing all possible party types (for reference):
- Plaintiff
- Petitioner
- Appellant
- Complainant
- *(blank line)*
- Defendant
- Respondent
- Cr. Petitioner
- Accused

**Note:** The applicable types are underlined in the actual document

#### 3. **Party Names Section**
Simple format with party names and dashes:
```
      Savantha    —
      
      Suresh      —
```

#### 4. **Personal Details Paragraph**
Starts with "I/We" followed by complete details in paragraph format:
```
I/We Sumantha R aged 42 years w/o Veerainghan resident at
Anjili Pathanamthitta PIN 689645 Thrissur 9865334256
.................................................................
```
- Written with dotted underlines (simulating fill-in-the-blank)
- Includes: Name, Age, Father/Husband name, Address, PIN, Mobile

#### 5. **Appointment Line**
```
do hereby appoint and retain    Rones V. Anil
```

#### 6. **Standard Legal Text**
Pre-printed paragraph (not editable) containing the standard legal language about powers granted to the advocate.

#### 7. **Date**
```
Signed this the 14th day of November 2025
```

#### 8. **Signature Section**
**Left side:**
```
Witnesses:
1. Dhiya (Bag)
2.
```

**Right side:**
```
Known parties and signed before me
Advocate
[Signature]
```

#### 9. **Advocate Details Box (Bottom Right)**
Blue bordered box containing:
- **RONES V. ANIL** (bold, centered)
- **ADVOCATE** (bold, centered)
- **Roll No: R/002988/2022**
- **AYANTHI, THRISSUR-03**
- **Mob: 7892641468**

---

### **PAGE 2 - Docket (Cover Page)**

#### Layout:
1. **Top left:** "Filed on: ___________"

2. **Header (Centered):**
   ```
   BEFORE THE COURT OF
   SUB COURT PATHANAMTHITTA
   ```

3. **Case Number (Centered):**
   ```
   OS No. ___ of 2025
   ```

4. **Parties (Centered):**
   ```
   Savantha  —  Plaintiff
   
   Suresh    —  Defendant
   ```

5. **Title (Large, Centered):**
   ```
   VAKALATHNAMA
   ```

6. **Subtitle (Centered):**
   ```
   on behalf of the Plaintiff
   ```

7. **Signature Section (Centered):**
   ```
   ____________________
   
   Accepted
   
   Rones v. Anil
   R/2988/2022
   ```

8. **Footer (Centered):**
   ```
   Address for service of summons
   
   ADVOCATE
   ```

---

## Key Differences from Current Generator

### ❌ **Current Implementation Issues:**

1. **Header Layout:** Case details appear below the court name, not on the same line
2. **No Party Type Reference:** Missing the reference list on the right side
3. **Party Format:** Uses detailed format instead of simple name + dash
4. **I/We Section:** Missing the paragraph-style personal details with dotted underlines
5. **Over-complicated:** Too much formatting, not matching the simple clean template
6. **Signature Layout:** Different from template
7. **Advocate Box:** Not styled with blue border and precise formatting
8. **Docket Format:** Current docket doesn't match the simple centered layout

### ✅ **New Implementation Features:**

1. ✅ Header on single line with case details right-aligned
2. ✅ Party type reference list on right side with underlines
3. ✅ Simple party names with dash format
4. ✅ I/We paragraph with dotted underlines for filled content
5. ✅ "do hereby appoint and retain" as separate line
6. ✅ Standard legal text as continuous paragraph
7. ✅ Proper date format with ordinal suffix
8. ✅ Two-column signature section (Witnesses | Known parties)
9. ✅ Blue bordered advocate details box
10. ✅ Clean, centered docket page matching template

---

## Implementation Plan

### Phase 1: Update Main Generator ✅
- Created new `generator-kerala-template.ts` with exact template format
- Matches all formatting from scanned template

### Phase 2: Update Form to Use New Generator
- Modify `app/vakalath/preview/page.tsx` to use new generator
- Ensure all form data is properly passed

### Phase 3: Testing
- Generate sample PDF with test data
- Compare with actual template
- Fine-tune spacing and alignment

### Phase 4: Refinements
- Add option to toggle between old/new template
- Ensure DOCX generation also matches format
- Update preview page to show similar layout

---

## Technical Notes

### Font Sizes Used:
- **Headers:** 12-14pt (Bold)
- **Body text:** 10-11pt (Regular)
- **Legal text:** 10pt (Regular)
- **Advocate box:** 7-11pt (Bold for name/title)
- **Docket title:** 18pt (Bold)

### Spacing:
- **Line height:** 12-18px depending on section
- **Section gaps:** 20-40px
- **Margins:** 50px all sides (approximately 0.7 inches)

### Colors:
- **Blue box:** RGB(0.9, 0.95, 1) background, RGB(0, 0, 0.8) border
- **All text:** Black RGB(0, 0, 0)

### Special Features:
- **Dotted underlines:** 4px dash, 2px line segments for I/We section
- **Party type underlines:** Solid 0.5px line under selected types
- **Blue box border:** 1.5px thickness

---

## Next Steps

1. **Replace current generator** with Kerala template version
2. **Test with actual form data**
3. **Adjust spacing** if needed based on actual output
4. **Get user feedback** on accuracy
5. **Update DOCX generator** to match PDF format
