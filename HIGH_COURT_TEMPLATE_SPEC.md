# 🏛️ HIGH COURT vs DISTRICT COURT TEMPLATES

## 📋 KEY DIFFERENCES

### **DISTRICT COURT FORMAT (Current)**
```
BEFORE THE COURT OF [COURT NAME] [DISTRICT]

[CASE TYPE] No. [NUMBER] of [YEAR]

1. [Petitioner Name]
...Petitioner

And

1. [Respondent Name]
...Respondent

VAKALATHNAMA

I/We [names] resident(s) of: [address]
do hereby appoint and retain [Advocate Name]...
```

---

### **HIGH COURT FORMAT (New)**
```
IN THE HON'BLE HIGH COURT OF KERALA AT ERNAKULAM

MAT. APPEAL NO: [NUMBER] OF [YEAR]

[Petitioner Name]        -        Appellant

                Vs.

[Respondent Name]        -        Respondent

VAKALATHNAMA

I [name] aged [age] D/o [father] [address]
hereby appoint and retain Sri [Advocate],
Advocates, to appear for the petitioners in the above case
and to conduct and prosecute (or defend) the same and all
proceedings that may be taken in respect to my/our application
for execution of any decree or order passed therein...

[More detailed powers listed]

Dated this the [date]

                                    [Party Name]
                                    [ROLE]

WITNESSES


The executant, who is personally known to me has signed before me

Accepted
```

---

## 🔑 DETECTION LOGIC

**Use High Court format when:**
- `courtName` contains "High Court" (case-insensitive)
OR
- `courtName` === "Kerala High Court"

**Use District Court format when:**
- `courtName` contains "District Court"
OR  
- Any other court name

---

## 📝 HIGH COURT SPECIFIC FEATURES

### **1. Header**
- "IN THE HON'BLE HIGH COURT OF KERALA AT [LOCATION]"
- Underlined
- All caps

### **2. Case Number**
- Format: "[CASE TYPE] NO: [NUMBER] OF [YEAR]"
- Example: "MAT. APPEAL NO: 1141 OF 2025"

### **3. Parties Format**
```
[Name]     -     [Role (Appellant/Respondent)]

            Vs.

[Name]     -     [Role]
```
- Three columns with dashes
- Centered "Vs."
- Roles: Appellant/Respondent (not Petitioner/Respondent)

### **4. Body Text - More Detailed Powers**
Full text with detailed powers including:
- Appear for petitioners
- Conduct and prosecute (or defend)
- Application for execution
- Appear in miscellaneous proceedings
- Produce documents in court
- Apply for return/receive back documents
- Draw moneys payable
- Accept service of notice
- Agree everything lawfully done

### **5. Date Format**
- "Dated this the [day] day of [month], [year]"
- Example: "Dated this the 20th day of December, 2025"

### **6. Signature Section**
- Right-aligned
- Party name on one line
- Role on next line (ALL CAPS)
- Example:
  ```
  Ambika
  RESPONDENT
  ```

### **7. Witnesses**
- "WITNESSES" heading (underlined)
- Left side
- Below signature

### **8. Acceptance**
- "The executant, who is personally known to me has signed before me"
- "Accepted"

---

## 🔧 IMPLEMENTATION STEPS

### **Step 1: Update `lib/generator.ts`**

Add detection function:
```typescript
function isHighCourt(courtName: string): boolean {
    return courtName.toLowerCase().includes('high court');
}
```

### **Step 2: Create Two Generation Functions**

```typescript
if (isHighCourt(data.courtName)) {
    return generateHighCourtPDF(data, fontSize);
} else {
    return generateDistrictCourtPDF(data, fontSize);
}
```

### **Step 3: High Court Specific Elements**

**Header:**
```typescript
drawCentered(`IN THE HON'BLE HIGH COURT OF KERALA AT ${data.district.toUpperCase()}`, { font: fontBold, underline: true });
```

**Case Number:**
```typescript
drawCentered(`${data.caseType.toUpperCase()} NO: ${data.caseNumber} OF ${data.year}`, { font: fontBold });
```

**Parties (3-column layout):**
```typescript
// Calculate column positions
const col1X = MARGIN_LEFT;
const col2X = MARGIN_LEFT + (usableWidth / 2);
const col3X = MARGIN_LEFT + usableWidth - 100;

// First party
drawText(petitioners[0].name, col1X, {});
drawText('-', col2X, {});
drawText('Appellant', col3X, {});

// Vs.
drawCentered('Vs.', {});

// Second party
drawText(respondents[0].name, col1X, {});
drawText('-', col2X, {});
drawText('Respondent', col3X, {});
```

**Body with full powers:**
```typescript
const highCourtBodyText = `I ${petitioners[0].name} aged ${petitioners[0].age} D/o ${petitioners[0].fatherOrHusbandName} ${petitioners[0].address} hereby appoint and retain Sri ${data.advocateName}, Advocates, to appear for the petitioners in the above case and to conduct and prosecute (or defend) the same and all proceedings that may be taken in respect to my/our application for execution of any decree or order passed therein. I/We empower the said Advocates to appear in all miscellaneous proceedings in the above Suit or matter till all decrees or orders are fully satisfied or adjusted and to produce in court any money, document or valuable security on my/our behalf, to apply for their return and to receive back the same, to apply for and obtain copy of all documents in the record of the proceedings, to draw any moneys that may be payable to me/us in the above suit or matter and I/We do further empower my/our Advocates to accept on my/our behalf service of notice of all or any appeals or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter, before the disposal of the same in this Hon'ble Court. I/We do hereby agree that everything lawfully done or made by the said Advocates in the conduct of the suit or matter shall be as valid and binding on me/us if done by me/us in person.`;
```

**Date:**
```typescript
const date = new Date();
const day = date.getDate();
const month = date.toLocaleString('default', { month: 'long' });
const year = date.getFullYear();

drawJustified(`Dated this the ${day}th day of ${month}, ${year}`, {});
```

**Signature (right-aligned):**
```typescript
const partyName = petitioners[0].name;
const role = 'RESPONDENT'; // or APPELLANT based on party type

// Right align
drawText(partyName, MARGIN_LEFT + usableWidth - 150, {});
y -= LINE_HEIGHT;
drawText(role, MARGIN_LEFT + usableWidth - 150, { font: fontBold });
```

---

## ✅ TESTING

### **Test Cases:**

1. **High Court:**
   - Court Name: "High Court"
   - Should use High Court template
   
2. **High Court Ekm:**
   - Court Name: "Kerala High Court"  
   - District: "Ernakulam"
   - Should use High Court template

3. **District Court:**
   - Court Name: "District Court"
   - District: "Kollam"
   - Should use District Court template

---

## 📋 SUMMARY

**Changes Needed:**
1. ✅ Add detection function for High Court
2. ✅ Create separate PDF generation for High Court
3. ✅ Update header format
4. ✅ Update case number format
5. ✅ Change party layout to 3-column
6. ✅ Use detailed body text
7. ✅ Add proper date format
8. ✅ Right-align signatures
9. ✅ Add witnesses section
10. ✅ Add acceptance text

**Files to Update:**
- `lib/generator.ts` - Main PDF generation
- `components/vakalath/PreviewModal.tsx` - Preview display
- Test with both court types

---

Would you like me to implement these changes now?
