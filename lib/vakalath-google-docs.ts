import { VakalathFormValues } from './validators';

/**
 * Build structured content for Google Docs API from Vakalath form data
 * PROFESSIONAL VERSION 7.0
 * Features: A4, 1" Margins, 14pt Body, 16pt Headings, 1.5 Spacing, Justified
 */
export function buildDocumentContent(formData: VakalathFormValues) {
    const pets = formData.parties.filter(p => p.role?.toLowerCase().includes('petitioner') || p.role?.toLowerCase().includes('plaintiff') || p.role?.toLowerCase().includes('appellant') || p.role?.toLowerCase().includes('complainant'));
    const resps = formData.parties.filter(p => !pets.includes(p));

    const isPluralPets = pets.length > 1;
    const petRole = pets[0]?.role || 'Petitioner';
    const petRoleLabel = isPluralPets ? (petRole.endsWith('y') ? petRole.slice(0, -1) + 'ies' : petRole + 's') : petRole;

    const isPluralResps = resps.length > 1;
    const respRole = resps[0]?.role || 'Respondent';
    const respRoleLabel = isPluralResps ? (respRole.endsWith('y') ? respRole.slice(0, -1) + 'ies' : respRole + 's') : respRole;

    const pronoun = isPluralPets ? 'We' : 'I';
    const objectPronoun = isPluralPets ? 'us' : 'me';
    const possessive = isPluralPets ? 'our' : 'my';

    const legalText = `Advocate to appear for ${objectPronoun} in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed there in ${pronoun.toLowerCase()} empower the said Advocate/s to compromise any suit or proceeding on ${possessive} behalf and to appear in all miscellaneous proceeding in the above suit or matter till all decreases or order are fully, satisfied or adjusted and to produce in court ${possessive} money document or valuable security on ${possessive} behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to ${objectPronoun} in the above suit or matter and ${pronoun} do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on ${possessive} behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and ${pronoun.toLowerCase()} do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on ${objectPronoun} done by ${objectPronoun} in person.`;

    const sections = [];

    // PAGE 1: MAIN BODY
    sections.push({
        text: 'IN THE COURT OF',
        alignment: 'START' as const,
        isBold: true,
    });

    sections.push({
        text: formData.courtName.toUpperCase(),
        alignment: 'START' as const,
        isBold: true,
    });

    sections.push({
        text: `\n${formData.caseType} No. ${formData.caseNumber || '_______'} of ${formData.year}`,
        alignment: 'END' as const,
        isBold: true,
    });

    // Party List
    let partyText = `\n${petRoleLabel}:\n`;
    pets.forEach((p, i) => {
        partyText += `${i + 1}. ${p.name}, ${p.age ? p.age + ' years, ' : ''}${p.fatherOrHusbandName || ''}, residing at ${p.address || ''}\n`;
    });

    partyText += '\nVs.\n';

    partyText += `${respRoleLabel}:\n`;
    resps.forEach((p, i) => {
        partyText += `${i + 1}. ${p.name}, ${p.age ? p.age + ' years, ' : ''}${p.fatherOrHusbandName || ''}, residing at ${p.address || ''}\n`;
    });

    sections.push({
        text: partyText,
        alignment: 'START' as const,
    });

    sections.push({
        text: '\nVAKALATHNAMA',
        alignment: 'CENTER' as const,
        isBold: true,
    });

    sections.push({
        text: `\n${legalText}`,
        alignment: 'JUSTIFIED' as const,
    });

    const today = new Date();
    sections.push({
        text: `\nSigned this the ${today.getDate()}th day of ${today.toLocaleString('en-IN', { month: 'long' })}, ${today.getFullYear()}.`,
        alignment: 'START' as const,
    });

    // Witnesses section
    let witnessText = '\nWitnesses:\n';
    formData.witnesses.split('\n').forEach((w, i) => {
        witnessText += `${i + 1}. ${w}\n`;
    });

    sections.push({
        text: witnessText,
        alignment: 'START' as const,
        isBold: true,
    });

    // Signature Area
    sections.push({
        text: `\nSignature of ${petRole}: ...............................................`,
        alignment: 'END' as const,
        isBold: true,
    });

    // PAGE 2: DOCKET (Simplified for Google Docs as it doesn't support easy "half-page" split vertically, but we approximate)
    sections.push({
        text: '\n\n---------------- PAGE BREAK (DOCKET PAGE) ----------------\n',
        alignment: 'CENTER' as const,
    });

    sections.push({
        text: `Filed on: ${today.toLocaleDateString('en-IN')}`,
        alignment: 'END' as const,
    });

    sections.push({
        text: `\nBEFORE THE COURT OF\n${formData.courtName.toUpperCase()}`,
        alignment: 'CENTER' as const,
        isBold: true,
    });

    sections.push({
        text: `\n${formData.caseType} No. ${formData.caseNumber} / ${formData.year}`,
        alignment: 'CENTER' as const,
        isBold: true,
    });

    sections.push({
        text: `\n${pets[0]?.name}${pets.length > 1 ? ' & Others' : ''}\n... ${petRoleLabel}`,
        alignment: 'CENTER' as const,
    });

    sections.push({
        text: '\nVs.',
        alignment: 'CENTER' as const,
    });

    sections.push({
        text: `\n${resps[0]?.name}${resps.length > 1 ? ' & Others' : ''}\n... ${respRoleLabel}`,
        alignment: 'CENTER' as const,
    });

    sections.push({
        text: '\nVAKALATHNAMA',
        alignment: 'CENTER' as const,
        isBold: true,
    });

    sections.push({
        text: '\nAccepted\n\nADVOCATE',
        alignment: 'END' as const,
        isBold: true,
    });

    sections.push({
        text: `\n${formData.advocateName.toUpperCase()}`,
        alignment: 'END' as const,
        isBold: true,
    });

    return {
        heading: 'VAKALATHNAMA',
        sections,
    };
}

/**
 * Create a formatted Vakalath document in Google Docs
 */
export async function createVakalathInGoogleDocs(formData: VakalathFormValues) {
    const googleDrive = await import('./google-drive');
    const googleDocs = await import('./google-docs');

    // Ensure user is signed in
    const isSignedIn = await googleDrive.signInToGoogle();
    if (!isSignedIn) {
        throw new Error('Please sign in to Google to create documents.');
    }

    // Prepare document info
    const firstPetitioner = formData.parties[0];
    const documentTitle = `Vakalath_${firstPetitioner?.name || 'Client'}_${formData.district}`;

    // Build structured content
    const content = buildDocumentContent(formData);

    // Create or get client folder
    const folderResult = await googleDocs.getOrCreateFolder(
        `Vakalath - ${firstPetitioner?.name || 'Client'}`,
        undefined // Root folder for now
    );

    // Create the Google Doc with formatting
    const result = await googleDocs.createGoogleDoc(
        documentTitle,
        content,
        folderResult.folderId
    );

    return {
        ...result,
        folderName: folderResult.folderId ? `Vakalath - ${firstPetitioner?.name}` : undefined,
        documentTitle,
    };
}
