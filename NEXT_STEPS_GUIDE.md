# 🚀 DRAFT SUIT SYSTEM - NEXT STEPS GUIDE

## 📍 WHERE WE ARE NOW

**Current Status**: 31% Complete  
**Last Completed**: Phase 2 (Step 1 Form) + Started Phase 3 (AddressForm component)  
**Next Task**: Complete Phase 3, Task 3.1 - Party Manager Component

---

## ✅ WHAT'S BEEN DONE (Quick Recap)

1. ✅ All TypeScript types defined
2. ✅ Complete Redux store with auto-save
3. ✅ 27 validation schemas (Zod)
4. ✅ Kerala courts data (14 districts, 90+ courts)
5. ✅ Step 1: Basic Details Form (fully functional)
6. ✅ Wizard UI with progress indicator
7. ✅ AddressForm component (for party addresses)

---

## 🎯 IMMEDIATE NEXT STEPS

### **Phase 3, Task 3.1: Party Manager - CONTINUE** (12 hours remaining)

**Goal**: Allow users to add plaintiffs and defendants with full details

**What's Done**:
- [x] `AddressForm.tsx` - Address subform ✅

**What's Needed** (3 more components):

#### 1. **PartyForm.tsx** (4 hours) - ADD/EDIT MODAL
Create a modal/dialog component for adding or editing a party.

**Features needed**:
- Name input (validation: letters/spaces/dots only, 3-200 chars)
- Parentage type dropdown (son of/daughter of/wife of/husband of)
- Parent name input
- Age input (1-150)
- Occupation input
- Address form (reuse AddressForm component)
- Role (plaintiff/defendant) - set automatically based on which list
- Save/Cancel buttons
- Real-time validation with React Hook Form + Zod

**File**: `components/suit/PartyForm.tsx`

**Validation**: Use `partySchema` from `lib/validators/party-validator.ts`

#### 2. **PartyList.tsx** (4 hours) - DISPLAY WITH DRAG-DROP
Create a component to display the list of parties with drag-and-drop reordering.

**Features needed**:
- Display all parties in a list
- Each party card shows: Name, Age, Occupation, City
- Auto-numbering display (1st Plaintiff, 2nd Plaintiff, etc.)
- Edit button (opens PartyForm in edit mode)
- Delete button (with confirmation)
- Drag handle for reordering
- Uses `react-beautiful-dnd` for drag-drop
- Empty state when no parties

**File**: `components/suit/PartyList.tsx`

**Redux integration**: 
- Dispatch `removeParty()` on delete
- Dispatch `reorderParties()` on drag-drop
- Use `selectPlaintiffs()` and `selectDefendants()` selectors

#### 3. **PartyManager.tsx** (4 hours) - MAIN ORCHESTRATOR
Create the main component that manages both plaintiffs and defendants sections.

**Features needed**:
- Two sections: Plaintiffs and Defendants
- "Add Plaintiff" button (opens PartyForm with role = 'plaintiff')
- "Add Defendant" button (opens PartyForm with role = 'defendant')
- PartyList for plaintiffs
- PartyList for defendants
- Validation summary (at least 1 plaintiff and 1 defendant required)
- Navigation buttons (Back/Next)
- Next button disabled until both lists have at least 1 party

**File**: `components/suit/PartyManager.tsx`

**Redux integration**:
- Dispatch `addParty()` when party added
- Dispatch `updateParty()` when party edited
- Use `validatePartyDetails()` before allowing next step

---

## 📝 STEP-BY-STEP IMPLEMENTATION GUIDE

### **Step 1: Create PartyForm.tsx** (Start Here!)

```typescript
// components/suit/PartyForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partySchema, type PartyFormData } from '@/lib/validators';
import { AddressForm } from './AddressForm';

interface PartyFormProps {
  party?: PartyFormData; // For edit mode
  role: 'plaintiff' | 'defendant';
  onSave: (party: PartyFormData) => void;
  onCancel: () => void;
}

export function PartyForm({ party, role, onSave, onCancel }: PartyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: party || {
      id: crypto.randomUUID(),
      name: '',
      parentageType: 'son_of',
      parentName: '',
      age: 30,
      occupation: '',
      address: {
        building: '',
        street: '',
        locality: '',
        district: '',
        state: 'Kerala',
        pincode: ''
      },
      role,
      order: 1
    }
  });
  
  return (
    <div className="party-form-modal">
      {/* TODO: Add modal UI */}
      {/* TODO: Add all form fields */}
      {/* TODO: Integrate AddressForm */}
      {/* TODO: Add Save/Cancel buttons */}
    </div>
  );
}
```

### **Step 2: Create PartyList.tsx**

```typescript
// components/suit/PartyList.tsx

'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppDispatch } from '@/store/hooks';
import { removeParty, reorderParties } from '@/store/suit-draft-slice';
import type { Party } from '@/types/suit';

interface PartyListProps {
  parties: Party[];
  role: 'plaintiff' | 'defendant';
  onEdit: (party: Party) => void;
}

export function PartyList({ parties, role, onEdit }: PartyListProps) {
  const dispatch = useAppDispatch();
  
  // TODO: Implement drag-drop logic
  // TODO: Implement party cards
  // TODO: Implement delete with confirmation
  
  return (
    <div className="party-list">
      {/* TODO: Add DragDropContext and Droppable */}
      {/* TODO: Map parties to Draggable cards */}
    </div>
  );
}
```

### **Step 3: Create PartyManager.tsx**

```typescript
// components/suit/PartyManager.tsx

'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addParty, updateParty } from '@/store/suit-draft-slice';
import { selectPlaintiffs, selectDefendants } from '@/store/selectors';
import { PartyForm } from './PartyForm';
import { PartyList } from './PartyList';

export function PartyManager() {
  const dispatch = useAppDispatch();
  const plaintiffs = useAppSelector(selectPlaintiffs);
  const defendants = useAppSelector(selectDefendants);
  
  const [showForm, setShowForm] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [formRole, setFormRole] = useState<'plaintiff' | 'defendant'>('plaintiff');
  
  // TODO: Implement add/edit/save logic
  // TODO: Add "Add Plaintiff" button
  // TODO: Add "Add Defendant" button
  // TODO: Integrate PartyList for both roles
  // TODO: Add validation check (at least 1 of each)
  // TODO: Add navigation buttons
  
  return (
    <div className="party-manager">
      {/* TODO: Add UI */}
    </div>
  );
}
```

### **Step 4: Integrate into SuitWizard**

```typescript
// components/suit/SuitWizard.tsx

// Add import
import { PartyManager } from './PartyManager';

// Update renderStep() switch case
case 2:
  return <PartyManager />;
```

---

## 🎯 AFTER PARTY MANAGER (Task 3.2 & 3.3)

### **Task 3.2: Plaint Details Form** (18 hours)

Components to create:
1. `CauseOfActionForm.tsx` - Date, place, description
2. `JurisdictionForm.tsx` - 3 types of jurisdiction
3. `FactsTimelineBuilder.tsx` - Chronological facts with dates
4. `ReliefBuilder.tsx` - Multiple relief items
5. `ValuationCalculator.tsx` - Property value, court fee calc
6. `PlaintDetailsForm.tsx` - Main orchestrator

### **Task 3.3: Schedule Builder** (15 hours)

Components to create:
1. `ScheduleForm.tsx` - Single schedule add/edit
2. `BoundariesForm.tsx` - N-S-E-W boundaries
3. `MeasurementsForm.tsx` - Area, unit, dimensions
4. `ScheduleList.tsx` - Display all schedules (A, B, C...)
5. `ScheduleManager.tsx` - Main orchestrator

---

## ⏱️ TIME ESTIMATES

**Remaining in Phase 3** (42 hours):
- PartyForm.tsx: 4 hours
- PartyList.tsx: 4 hours
- PartyManager.tsx: 4 hours
- Plaint Details Form: 18 hours
- Schedule Builder: 15 hours

**After Phase 3** (129 hours):
- Phase 4 (Steps 4-6): 20 hours
- Phase 5 (Document Generation): 52 hours
- Phase 6 (Google Integration): 23 hours
- Phase 7 (Testing & Polish): 34 hours

**Total Remaining**: 171 hours (~10-12 weeks for 2 developers)

---

## 📚 RESOURCES & REFERENCES

### **Key Documentation**
- **Architecture**: `DRAFT_SUIT_SYSTEM_ARCHITECTURE.md`
- **Implementation Plan**: `IMPLEMENTATION_PLAN.md`
- **Validation Rules**: `VALIDATION_RULES.md`
- **Project Summary**: `DRAFT_SUIT_PROJECT_SUMMARY.md`

### **Code References**
- **Redux Actions**: `store/suit-draft-slice.ts` (lines 60-250)
- **Party Validator**: `lib/validators/party-validator.ts`
- **Types**: `types/suit.ts` (Party interface)
- **Selectors**: `store/selectors.ts` (selectPlaintiffs, selectDefendants)

### **Libraries to Use**
- `react-beautiful-dnd` - Drag and drop
- `react-hook-form` - Form management
- `zod` - Validation
- `@hookform/resolvers` - React Hook Form + Zod integration

---

## ✅ SUCCESS CRITERIA (For Party Manager)

### **Functionality**
- [ ] Can add plaintiff with all details
- [ ] Can add defendant with all details
- [ ] Can edit existing party
- [ ] Can delete party (with confirmation)
- [ ] Can reorder parties by dragging
- [ ] Auto-numbering updates on reorder
- [ ] Address validation works
- [ ] Name format validation works
- [ ] Age range validation works (1-150)
- [ ] Pincode validation works (6 digits)
- [ ] At least 1 plaintiff required to proceed
- [ ] At least 1 defendant required to proceed
- [ ] Next button disabled until requirements met

### **Redux Integration**
- [ ] addParty action dispatched correctly
- [ ] updateParty action dispatched correctly
- [ ] removeParty action dispatched correctly
- [ ] reorderParties action dispatched correctly
- [ ] Party data persists in Redux store
- [ ] Auto-save triggers after changes
- [ ] Data survives browser refresh

### **UI/UX**
- [ ] Form modal opens/closes smoothly
- [ ] Party cards look professional
- [ ] Drag handles are visible and functional
- [ ] Error messages display clearly
- [ ] Empty states show helpful message
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation, ARIA labels)

---

## 🚀 HOW TO PROCEED

### **Option 1: Continue Now** (Recommended)
I can continue building the remaining 3 components:
- PartyForm.tsx (4 hours)
- PartyList.tsx (4 hours)
- PartyManager.tsx (4 hours)

This will complete Task 3.1 and make Step 2 functional.

### **Option 2: Test What's Built**
Before continuing, we could:
- Test Step 1 in the browser
- Verify auto-save is working
- Check localStorage persistence
- Review the wizard UI

### **Option 3: Review & Plan**
We could:
- Review the architecture documents
- Adjust the implementation plan
- Discuss any concerns or questions

---

## 💬 RECOMMENDATION

**I recommend Option 1: Continue Now**

We have great momentum and solid foundations. Completing the Party Manager will give you:
- ✅ Fully functional Steps 1-2 (2 out of 9)
- ✅ 22% of Step completion (vs 11% now)
- ✅ Complete party management system
- ✅ Reusable components for other forms

After Party Manager, the remaining forms follow similar patterns, so development will accelerate.

---

## ❓ QUESTIONS TO CONFIRM

Before I proceed with building the 3 remaining components, please confirm:

1. **Drag-Drop**: Should parties be reorderable by dragging? (Uses react-beautiful-dnd)
2. **Modal vs Inline**: Should PartyForm open in a modal/dialog or inline?
3. **Delete Confirmation**: Should there be "Are you sure?" confirmation before deleting?
4. **Auto-Save**: Should party changes auto-save immediately or wait 30 seconds?

**Default Assumptions** (if no preference):
- ✅ Yes to drag-drop
- ✅ Modal for PartyForm
- ✅ Confirmation before delete
- ✅ 30-second auto-save (consistent with Step 1)

---

## 🎯 LET'S CONTINUE!

Ready to build the remaining 3 components and complete the Party Manager?

**Say "proceed" and I'll create**:
1. PartyForm.tsx (full implementation)
2. PartyList.tsx (with drag-drop)
3. PartyManager.tsx (orchestrator)
4. Integration with SuitWizard

This will make Step 2 fully functional! 🚀

---

*Created: 2026-01-03 16:11*  
*Status: Ready to Continue*  
*Next: PartyForm.tsx*
