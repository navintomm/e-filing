// WizardFlow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
jest.mock('@/lib/firebase');
import { store } from '@/store';
import { SuitWizard } from './SuitWizard';

/**
 * Basic end‑to‑end test that walks through the wizard steps 1‑3.
 * It verifies that navigation works and that required validation prevents
 * proceeding when fields are empty.
 */
describe('SuitWizard flow', () => {
    test('can navigate through steps with valid data', async () => {
        render(
            <Provider store={store}>
                <SuitWizard />
            </Provider>
        );

        // Step 1 – Basic Details (already rendered)
        const nextBtn = screen.getByRole('button', { name: /Next:/i });
        // Fill required fields for Basic Details (simplified – assume inputs have test ids)
        // For this test we just click Next to trigger validation; the component
        // should prevent navigation if validation fails.
        // Check that button is disabled initially (validation pending)
        expect(nextBtn).toBeDisabled();

        // Fill required fields to satisfy validation
        const districtSelect = screen.getByLabelText(/District/i);
        fireEvent.change(districtSelect, { target: { value: 'Thiruvananthapuram' } });

        const courtSelect = screen.getByLabelText(/Court/i);
        fireEvent.change(courtSelect, { target: { value: 'Principal District and Sessions Court, Thiruvananthapuram' } });

        const caseTypeSelect = screen.getByLabelText(/Case Type/i);
        fireEvent.change(caseTypeSelect, { target: { value: 'OS' } });

        const statusSelect = screen.getByLabelText(/Applicant Status/i);
        fireEvent.change(statusSelect, { target: { value: 'plaintiff' } });

        // Wait for validation to enact and button to enable
        await waitFor(() => {
            expect(nextBtn).not.toBeDisabled();
        });
        fireEvent.click(nextBtn);

        // After successful step 1, Step 2 (Party Manager) should appear
        await waitFor(() => {
            expect(screen.getByText(/Party Details/i)).toBeInTheDocument();
        });

        // Add a plaintiff to satisfy Party step validation
        const addPlaintiffBtn = screen.getByRole('button', { name: /Add Plaintiff/i });
        fireEvent.click(addPlaintiffBtn);
        // Fill full Plaintiff details including Address
        const nameInput = screen.getByLabelText(/Full Name/i);
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });

        const parentageSelect = screen.getByLabelText(/Parentage Type/i);
        fireEvent.change(parentageSelect, { target: { value: 'son_of' } });

        const parentNameInput = screen.getByLabelText(/Parent\/Spouse Name/i);
        fireEvent.change(parentNameInput, { target: { value: 'Jane Doe' } });

        const ageInput = screen.getByLabelText(/^Age$/i);
        fireEvent.change(ageInput, { target: { value: '45' } });

        const occupationInput = screen.getByLabelText(/Occupation/i);
        fireEvent.change(occupationInput, { target: { value: 'Business' } });

        // Address Fields for Plaintiff
        fireEvent.change(screen.getByLabelText(/Building \/ House Name/i), { target: { value: 'Rose Villa' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: 'MG Road' } });
        fireEvent.change(screen.getByLabelText(/Locality/i), { target: { value: 'Palarivattom' } });
        fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'Ernakulam' } });
        fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: '682025' } });

        // Explicitly fill State (though it has default) just in case
        fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'Kerala' } });

        const addBtns = screen.getAllByRole('button', { name: /Add Plaintiff/i });
        const addBtn = addBtns[addBtns.length - 1]; // The one in the modal
        fireEvent.click(addBtn);

        // WAIT for the modal to close and the party to appear in the list.
        await waitFor(() => {
            // Check that the party name appears in the list
            expect(screen.getByText("John Doe")).toBeInTheDocument();
        });

        // Add a defendant to satisfy validation (1 Plaintiff, 1 Defendant required)
        const addDefBtn = screen.getByRole('button', { name: /Add Defendant/i });
        fireEvent.click(addDefBtn);

        // ... fill defendant details ...
        // (This part matches existing code effectively, just ensuring context)


        // Fill full Defendant details
        const defNameInput = screen.getByLabelText(/Full Name/i);
        fireEvent.change(defNameInput, { target: { value: 'Jane Smith' } });

        const defParentageSelect = screen.getByLabelText(/Parentage Type/i);
        fireEvent.change(defParentageSelect, { target: { value: 'daughter_of' } });

        const defParentNameInput = screen.getByLabelText(/Parent\/Spouse Name/i);
        fireEvent.change(defParentNameInput, { target: { value: 'John Smith' } });

        const defAgeInput = screen.getByLabelText(/^Age$/i);
        fireEvent.change(defAgeInput, { target: { value: '50' } });

        // Note: Occupation field is now required.
        // We need to match the Occupation input distinctively. 
        // Since we are likely in the second modal (or same modal reused), 
        // getting by LabelText /Occupation/i might be ambiguous if first one is still in DOM (though unlikely if modal closed).
        // Safest is to use getAll or assume first one is gone.
        // Given previous flow, let's try getByLabelText.
        const defOccupationInput = screen.getByLabelText(/Occupation/i);
        fireEvent.change(defOccupationInput, { target: { value: 'Driver' } });

        // Address Fields for Defendant
        // Note: Inputs might overlap if we don't scope, but since the previous modal closed, these should be the visible ones.
        // To be safe, we can use getAllByLabelText if needed, but usually the closed modal inputs are hidden/removed.
        fireEvent.change(screen.getByLabelText(/Building \/ House Name/i), { target: { value: 'Blue Tower' } });
        fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: 'Market Road' } });
        fireEvent.change(screen.getByLabelText(/Locality/i), { target: { value: 'Kaloor' } });
        fireEvent.change(screen.getByLabelText(/District/i), { target: { value: 'Ernakulam' } });
        fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: '682017' } });

        // Explicitly fill State
        // Since we are adding defendant, ensuring State is filled.
        // Assuming the input is visible.
        const defStateInputs = screen.getAllByLabelText(/State/i);
        const defStateInput = defStateInputs[defStateInputs.length - 1]; // Latest one likely
        fireEvent.change(defStateInput, { target: { value: 'Kerala' } });

        const saveDefBtns = screen.getAllByRole('button', { name: /Add Defendant/i });
        const saveDefBtn = saveDefBtns[saveDefBtns.length - 1];
        fireEvent.click(saveDefBtn);

        // Wait for modal to close and defendant to appear
        await waitFor(() => {
            expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        });

        // Proceed to next step (Plaint Details)
        const nextBtnStep2 = screen.getByRole('button', { name: /Next: Plaint Details →/i });
        fireEvent.click(nextBtnStep2);

        // Verify we transitioned to Plaint Details phase
        await waitFor(() => {
            expect(screen.queryByText(/Before proceeding, please add/i)).not.toBeInTheDocument(); // Validation error should be gone
            expect(screen.getByText("Facts of the Case")).toBeInTheDocument();
        });

        // --- Fill Plaint Details ---

        // 1. Cause of Action
        // Use findBy for the first element to ensure we wait for re-render if needed
        const dateInput = await screen.findByLabelText(/Date of Cause/i);
        fireEvent.change(dateInput, { target: { value: '2023-01-01' } });

        const placeInput = screen.getByLabelText(/Place of Cause/i);
        fireEvent.change(placeInput, { target: { value: 'Thiruvananthapuram' } });

        const causeDescInput = screen.getByLabelText(/Description of Cause of Action/i);
        fireEvent.change(causeDescInput, { target: { value: 'Breach of contract occurred on this date.' } });

        // 2. Jurisdiction
        const territorialInput = screen.getByLabelText(/Territorial Jurisdiction/i);
        fireEvent.change(territorialInput, { target: { value: 'Cause of action arose within the limits of this court.' } });

        const pecuniaryInput = screen.getByLabelText(/Pecuniary Jurisdiction/i);
        fireEvent.change(pecuniaryInput, { target: { value: 'Subject matter value is within the limits.' } });

        const subjectInput = screen.getByLabelText(/Subject Matter Jurisdiction/i);
        fireEvent.change(subjectInput, { target: { value: 'Civil nature suit.' } });

        // 3. Facts
        const factsInput = screen.getByLabelText(/Summary of Facts/i);
        const longFact = "This is a detailed summary of the facts of the case. ".repeat(5); // Ensure > 100 chars
        fireEvent.change(factsInput, { target: { value: longFact } });

        // 4. Relief
        const reliefTypeSelect = screen.getByLabelText(/Type of Relief/i);
        fireEvent.change(reliefTypeSelect, { target: { value: 'damages' } });

        const reliefDescInput = screen.getByLabelText(/Description of Relief/i);
        fireEvent.change(reliefDescInput, { target: { value: 'Claiming damages for the breach of contract.' } });

        // 5. Valuation
        const propValueInput = screen.getByLabelText(/Property\/Subject Matter Value/i);
        fireEvent.change(propValueInput, { target: { value: '500000' } });

        const reliefValueInput = screen.getByLabelText(/^Relief Value/i); // Strict start to avoid overlap?
        fireEvent.change(reliefValueInput, { target: { value: '50000' } });

        // Click Next to go to Step 3
        const nextBtnStep3 = screen.getByRole('button', { name: /Next: Schedules →/i });
        expect(nextBtnStep3).toBeEnabled();
        fireEvent.click(nextBtnStep3);

        // Verify Step 3 (Schedule Details) is active
        await waitFor(() => {
            expect(screen.getByText("Suit Schedules")).toBeInTheDocument();
        });

        // --- Fill Schedule Details ---
        // Open Add Schedule Modal
        const addScheduleBtn = screen.getByRole('button', { name: /Add Schedule/i });
        fireEvent.click(addScheduleBtn);

        // Fill Schedule Form
        // Wait for modal
        await waitFor(() => {
            expect(screen.getByText("Add Schedule Item")).toBeInTheDocument();
        });

        // Fill required fields
        const scheduleNameInput = screen.getByLabelText(/Schedule ID/i);
        fireEvent.change(scheduleNameInput, { target: { value: 'A' } });

        const descInput = screen.getByLabelText(/Description/i);
        const longDesc = "Schedule A Property Description - This must be at least 50 characters long to pass validation rules. Adding more text here.";
        fireEvent.change(descInput, { target: { value: longDesc } });

        // Property fields (since default type is property)
        // Survey Number
        const surveyInput = screen.getByLabelText(/Survey Number/i);
        fireEvent.change(surveyInput, { target: { value: '100/1' } });

        // Area & Unit
        const areaInput = screen.getByLabelText(/Area/i);
        fireEvent.change(areaInput, { target: { value: '10' } });

        // Boundaries
        const northInput = screen.getByLabelText(/North/i);
        fireEvent.change(northInput, { target: { value: 'Road' } });

        const southInput = screen.getByLabelText(/South/i);
        fireEvent.change(southInput, { target: { value: 'River' } });

        const eastInput = screen.getByLabelText(/East/i);
        fireEvent.change(eastInput, { target: { value: 'Wall' } });

        const westInput = screen.getByLabelText(/West/i);
        fireEvent.change(westInput, { target: { value: 'Fence' } });

        // Save Schedule
        // The modal button says "Add Schedule" too. We need to distinguish.
        // The modal button is inside the form.
        // Let's use getAllByRole or search within modal if possible, or just click the last one.
        // Wait for validation to pass and button to enable
        await waitFor(() => {
            const btns = screen.getAllByRole('button', { name: /Add Schedule/i });
            expect(btns[btns.length - 1]).toBeEnabled();
        });

        // Re-query to get fresh reference
        const freshBtns = screen.getAllByRole('button', { name: /Add Schedule/i });
        fireEvent.click(freshBtns[freshBtns.length - 1]);

        // Wait for modal to close and item to appear
        await waitFor(() => {
            expect(screen.getByText("Schedule A")).toBeInTheDocument();
            expect(screen.queryByText("Add Schedule Item")).not.toBeInTheDocument();
        });

        // Go to Step 4
        const nextBtnStep4 = screen.getByRole('button', { name: /Next: Document Details →/i });
        fireEvent.click(nextBtnStep4);

        // Verify Step 4 (Document Details)
        await waitFor(() => {
            expect(screen.getByText("List of Documents")).toBeInTheDocument();
        });

        // --- Fill Document Details ---
        const addDocBtn = screen.getByRole('button', { name: /Add Document/i });
        fireEvent.click(addDocBtn);

        // Fill Document Form
        await waitFor(() => {
            // Check for modal title specifically or careful selector
            const titles = screen.getAllByText(/Add Document/i);
            expect(titles.length).toBeGreaterThan(0);
            // Better: check for an element that is definitely in the modal
            expect(screen.getByLabelText(/Description of Document/i)).toBeInTheDocument();
        });

        const docDescInput = screen.getByLabelText(/Description of Document/i);
        fireEvent.change(docDescInput, { target: { value: 'Original Sale Deed 1234/2020' } });

        const docTypeSelect = screen.getByLabelText(/Type/i);
        fireEvent.change(docTypeSelect, { target: { value: 'original' } });

        const docDateInput = screen.getByLabelText(/Document Date/i);
        fireEvent.change(docDateInput, { target: { value: '2023-01-01' } });

        const isMarkedCheckbox = screen.getByLabelText(/Mark this document as an Exhibit/i);
        // Uncheck to avoid needing a marking label
        fireEvent.click(isMarkedCheckbox);

        // Save Document
        // Re-query "Add Document" button inside modal (at end of form)
        // Since there is "Add Document" on main page and "Add Document" in modal, we must be careful.
        // The modal is open, so last one likely.
        const allAddDocBtns = screen.getAllByRole('button', { name: /Add Document/i });
        const modalSaveDocBtn = allAddDocBtns[allAddDocBtns.length - 1];
        fireEvent.click(modalSaveDocBtn);

        // Wait for modal close
        await waitForElementToBeRemoved(() => screen.queryByRole('heading', { name: /Add Document/i }));
        expect(screen.getByText("Original Sale Deed 1234/2020")).toBeInTheDocument();

        // Go to Step 5
        const nextBtnStep5 = screen.getByRole('button', { name: /Next: Interlocutory Applications →/i });
        fireEvent.click(nextBtnStep5);

        // Verify Step 5
        // Will need to identify unique text for Step 5 (IA Manager)
        // Assuming "Interlocutory Applications" title or similar
        // We'll let the test fail here if text is wrong, giving us the next step clue.
        await waitFor(() => {
            // Basic check for now
            expect(screen.getByText(/Interlocutory Applications/i)).toBeInTheDocument();
        });
    });
});
