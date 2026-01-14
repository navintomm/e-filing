# 🧪 QA Test Plan: Draft Suit System (Steps 1-6)

## Test Objectives
1. Verify all 6 implemented steps function correctly
2. Test data persistence across steps
3. Validate form validations and error handling
4. Ensure Redux state management works properly
5. Check UI/UX consistency
6. Identify any breaking issues or bugs

---

## Test Environment
- **URL:** http://localhost:3000/suit/new
- **Browser:** Chrome (latest)
- **Device:** Desktop
- **Test Date:** 2026-01-04

---

## Test Cases

### TC1: Application Load & Initial State
**Priority:** Critical
- [ ] Application loads without errors
- [ ] Step 1 is displayed by default
- [ ] Step indicator shows correct step (1/9)
- [ ] No console errors on load

### TC2: Step 1 - Basic Details
**Priority:** Critical
- [ ] All form fields are present (District, Court, Case Type, etc.)
- [ ] Validation prevents empty submission
- [ ] District selection populates court dropdown
- [ ] "Next" button navigates to Step 2
- [ ] Data persists when navigating back to Step 1

### TC3: Step 2 - Party Details
**Priority:** Critical
- [ ] "Add Plaintiff" button opens modal
- [ ] All party fields are present and required
- [ ] Form validation shows errors on invalid input
- [ ] Submit button is enabled (fix applied)
- [ ] Party appears in list after saving
- [ ] Can add multiple plaintiffs/defendants
- [ ] Can edit existing party
- [ ] Can delete party (with confirmation)
- [ ] "Next" button requires at least 1 plaintiff and 1 defendant

### TC4: Step 3 - Schedule Details
**Priority:** High
- [ ] "Add Schedule" button opens modal
- [ ] Schedule type selection changes available fields
- [ ] Property type shows boundaries and measurements
- [ ] Schedule appears in list after saving
- [ ] Schedule gets auto-labeled (A, B, C...)
- [ ] Can skip step (schedules are optional)
- [ ] "Next" button works

### TC5: Step 4 - Document Details
**Priority:** Critical
- [ ] "Add Document" button opens modal
- [ ] All document fields work correctly
- [ ] "Mark as Exhibit" checkbox functions
- [ ] Exhibit numbering is sequential (EX-A1, EX-A2)
- [ ] Unmarked documents don't get exhibit numbers
- [ ] If Doc 1 is unmarked, Doc 2 (marked) becomes EX-A1
- [ ] Can edit and delete documents
- [ ] Total pages calculation works

### TC6: Step 5 - Interlocutory Applications
**Priority:** Medium
- [ ] Info banner shows "Optional Step"
- [ ] "Add Application" button opens modal
- [ ] IA number auto-generates (e.g., "IA 1/2025")
- [ ] "Add Ground" button creates new ground field
- [ ] Can remove grounds (except first one)
- [ ] Urgency selection works
- [ ] Affidavit checkbox works
- [ ] "Skip this Step" button appears when no IAs
- [ ] Can save and edit IAs

### TC7: Step 6 - Judgements
**Priority:** Medium
- [ ] Info banner shows "Optional Step"
- [ ] "Add Precedent" button opens modal
- [ ] Year field validates (1950 to current year)
- [ ] Optional fields marked clearly
- [ ] File URL validates as proper URL
- [ ] Can save, edit, delete judgements
- [ ] "Skip this Step" button appears when no judgements

### TC8: Navigation & Persistence
**Priority:** Critical
- [ ] Can navigate forward through all 6 steps
- [ ] Can navigate backward without losing data
- [ ] Clicking step indicator allows jumping to completed steps
- [ ] Data persists after browser refresh (localStorage)
- [ ] "Back" button works on each step

### TC9: Validation & Error Handling
**Priority:** High
- [ ] Required field validation works
- [ ] Field-specific validations (email, phone, etc.) work
- [ ] Error messages are clear and helpful
- [ ] Form doesn't submit with validation errors
- [ ] Success feedback on save operations

### TC10: Redux State Management
**Priority:** Critical
- [ ] Redux DevTools shows correct state
- [ ] Actions dispatch correctly
- [ ] State updates reflect in UI immediately
- [ ] No state leaks or mutations
- [ ] Selectors return correct data

---

## Code Review Checklist

### Architecture & Structure
- [ ] Components follow consistent naming conventions
- [ ] Proper separation of concerns (Manager/Form/List pattern)
- [ ] No duplicate code
- [ ] Consistent import ordering

### Redux & State Management
- [ ] All reducers handle null/undefined safely
- [ ] No direct state mutations
- [ ] Selectors use proper memoization
- [ ] Type safety maintained throughout

### Form Handling
- [ ] react-hook-form used consistently
- [ ] Zod validation properly integrated
- [ ] Error messages user-friendly
- [ ] Form reset logic correct

### TypeScript & Type Safety
- [ ] No 'any' types (except necessary workarounds)
- [ ] Proper type imports
- [ ] Type inference working correctly
- [ ] No TypeScript errors in build

### Styling & UX
- [ ] Consistent styling across components
- [ ] Responsive design works
- [ ] Accessibility considerations (labels, ARIA)
- [ ] Loading states where needed

---

## Test Results

### Automated Checks
```bash
# Build check
npm run build

# Type check
npx tsc --noEmit

# Lint check (if configured)
npm run lint
```

### Manual Testing Results
_To be filled during testing..._

---

## Bug Report Template
**Bug ID:** 
**Severity:** Critical / High / Medium / Low
**Step:** 
**Description:** 
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:** 
**Actual Result:** 
**Screenshot/Video:** 
**Fix Required:** Yes / No
