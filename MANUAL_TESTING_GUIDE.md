# Manual Testing Guide (Final Completion: Steps 1-9)

The Draft Suit System is now fully implemented. Follow this guide for a complete end-to-end test.

---

## 🚀 Full Walkthrough

### 1. **Step 1: Basic Details**
- Select a district and court.
- Click **Next**.

### 2. **Step 2: Parties & Plaint**
- Add 1 Plaintiff and 1 Defendant.
- Click **Next: Plaint Details**.
- Fill the Plaint form. Click **Next**.

### 3. **Step 7: Generate**
- Advance through Steps 3-6 (optional) or skip them.
- Click **Generate All Documents**.
- Wait for the bar to reach 100%.

### 4. **Step 8: Preview**
- Review the center preview of the **Vakalathnama** and **Plaint**.
- Toggle between **Preview** and **Edit**.
- Click **Finalize & Download**.

### 5. **Step 9: Download (New!)**
- ✅ **Verification:** You should see a large green checkmark and "Drafting Complete!".
- ✅ **Actions:** 
    - Click **PDF** or **DOCX** buttons on any document. (Mock alerts should appear).
    - Click **Download All (.ZIP)**.
    - Click **Go to Dashboard** to exit the flow.

---

## ✅ Success Criteria
- [ ] No steps are skipped unexpectedly.
- [ ] Plaint details are captured correctly in Step 2.
- [ ] Generation reaches 100% and auto-advances.
- [ ] Preview correctly displays case data (Court Name, Plaintiff Name).
- [ ] Final Step 9 shows all generated documents with download options.
