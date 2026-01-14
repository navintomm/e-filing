import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { VakalathFormValues, Party as VakalathParty } from './vakalath-validators';
import { DraftSuitData, Party as SuitParty, DocumentItem, GeneratedDocument as GeneratedDocType } from '@/types/suit';

/**
 * KERALA COURT VAKALATHNAMA - EXACT TEMPLATE MATCH
 * Based on scanned template with handwritten input
 * Features:
 * - Matches the exact format of Kerala court templates
 * - Professional layout with proper spacing
 * - Includes docket page format
 */

const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const MARGIN_TOP = 50;
const PAGE_WIDTH = 595.28; // A4 width
const PAGE_HEIGHT = 841.89; // A4 height

// Standard legal text - same as in the template
const STANDARD_LEGAL_TEXT = `Advocate to appear for me/us in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed there in I/we empower the said Advocate/s to compromise any suit or proceeding on my/ our behalf and to appear in all miscellaneous proceeding in the above suit or matter till all decreases or order are fully, satisfied or adjusted and to produce in court my money document or valuable security on my/our behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to me/us in the above suit or matter and I/We do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on my/ our behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and I/we do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on me/us done by me/us in person`;

export async function generatePDF(data: VakalathFormValues): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Separate parties
    const petitioners = data.parties.filter((p: VakalathParty) =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('appellant') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    );
    const respondents = data.parties.filter((p: VakalathParty) => !petitioners.includes(p));

    const isPluralPetitioner = petitioners.length > 1;
    const pronoun = isPluralPetitioner ? 'We' : 'I';
    const pronounLower = isPluralPetitioner ? 'we' : 'I';
    const objectPronoun = isPluralPetitioner ? 'us' : 'me';
    const possessivePronoun = isPluralPetitioner ? 'our' : 'my';

    // Get party roles
    const petitionerRole = petitioners[0]?.role || 'Plaintiff';
    const respondentRole = respondents[0]?.role || 'Defendant';

    // ===========================================
    // PAGE 1: MAIN VAKALATHNAMA
    // ===========================================
    const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    // Header - "IN THE COURT OF" on left, Case details on right (SAME LINE)
    page1.drawText('IN THE COURT OF', {
        x: MARGIN_LEFT,
        y,
        font: fontBold,
        size: 12,
        color: rgb(0, 0, 0)
    });

    const caseText = `${data.caseType} No.        of ${data.year}`;
    const caseTextWidth = fontBold.widthOfTextAtSize(caseText, 11);
    page1.drawText(caseText, {
        x: PAGE_WIDTH - MARGIN_RIGHT - caseTextWidth,
        y,
        font: fontBold,
        size: 11,
        color: rgb(0, 0, 0)
    });

    y -= 25;

    // Party Type Reference List (Right side) - Just for reference
    const partyTypesY = y;
    const partyTypes = [
        'Plaintiff',
        'Petitioner',
        'Appellant',
        'Complainant',
        '',
        'Defendant',
        'Respondent',
        'Cr. Petitioner',
        'Accused'
    ];

    let refY = partyTypesY;
    partyTypes.forEach((type: string) => {
        if (type) {
            const typeWidth = font.widthOfTextAtSize(type, 10);
            page1.drawText(type, {
                x: PAGE_WIDTH - MARGIN_RIGHT - typeWidth,
                y: refY,
                font: type === petitionerRole || type === respondentRole ? fontBold : font,
                size: 10,
                color: rgb(0, 0, 0)
            });
            // Underline if it matches the actual role
            if (type === petitionerRole || type === respondentRole) {
                page1.drawLine({
                    start: { x: PAGE_WIDTH - MARGIN_RIGHT - typeWidth, y: refY - 2 },
                    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: refY - 2 },
                    thickness: 0.5,
                    color: rgb(0, 0, 0)
                });
            }
        }
        refY -= 15;
    });

    // Party Names (Simple format)
    y -= 20;
    petitioners.forEach((p: VakalathParty) => {
        page1.drawText(p.name, {
            x: MARGIN_LEFT + 100,
            y,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });
        page1.drawText('—', {
            x: MARGIN_LEFT + 250,
            y,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });
        y -= 18;
    });

    y -= 5;
    respondents.forEach((p: VakalathParty) => {
        page1.drawText(p.name, {
            x: MARGIN_LEFT + 100,
            y,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });
        page1.drawText('—', {
            x: MARGIN_LEFT + 250,
            y,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });
        y -= 18;
    });

    y -= 15;

    // "I/We" section with personal details
    const firstPetitioner = petitioners[0];
    if (firstPetitioner) {
        let personalDetails = `${pronoun}`;

        // Add all petitioner names
        petitioners.forEach((p: VakalathParty, idx: number) => {
            if (idx === 0) {
                personalDetails += ` ${p.name}`;
                if (p.age) personalDetails += ` aged ${p.age}`;
                if (p.fatherOrHusbandName) personalDetails += ` ${p.fatherOrHusbandName}`;
            } else {
                personalDetails += `, ${p.name}`;
                if (p.age) personalDetails += ` aged ${p.age}`;
                if (p.fatherOrHusbandName) personalDetails += ` ${p.fatherOrHusbandName}`;
            }
        });

        // Add address
        if (firstPetitioner.address) {
            personalDetails += ` ${isPluralPetitioner ? 'residents' : 'resident'} at ${firstPetitioner.address}`;
        }
        if (firstPetitioner.pincode) {
            personalDetails += ` PIN ${firstPetitioner.pincode}`;
        }
        if (firstPetitioner.mobile) {
            personalDetails += ` ${firstPetitioner.mobile}`;
        }

        // Draw the personal details with dotted underline (simulating handwritten fill-in)
        const maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - 20;
        const words = personalDetails.split(' ');
        let line = 'I/We';
        const lineStartX = MARGIN_LEFT;

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = line + ' ' + word;
            const testWidth = font.widthOfTextAtSize(testLine, 10);

            if (testWidth > maxWidth) {
                // Draw current line with dotted underline
                const lineY = y;
                page1.drawText(line, {
                    x: lineStartX,
                    y: lineY,
                    font,
                    size: 10,
                    color: rgb(0, 0, 0)
                });

                // Dotted underline
                const lineWidth = font.widthOfTextAtSize(line, 10);
                for (let dx = 0; dx < lineWidth; dx += 4) {
                    page1.drawLine({
                        start: { x: lineStartX + dx, y: lineY - 2 },
                        end: { x: lineStartX + dx + 2, y: lineY - 2 },
                        thickness: 0.5,
                        color: rgb(0, 0, 0)
                    });
                }

                y -= 14;
                line = word;
            } else {
                line = testLine;
            }
        }

        // Draw last line
        if (line) {
            page1.drawText(line, {
                x: lineStartX,
                y,
                font,
                size: 10,
                color: rgb(0, 0, 0)
            });
            const lineWidth = font.widthOfTextAtSize(line, 10);
            for (let dx = 0; dx < lineWidth; dx += 4) {
                page1.drawLine({
                    start: { x: lineStartX + dx, y: y - 2 },
                    end: { x: lineStartX + dx + 2, y: y - 2 },
                    thickness: 0.5,
                    color: rgb(0, 0, 0)
                });
            }
            y -= 14;
        }
    }

    y -= 10;

    // "do hereby appoint and retain"
    page1.drawText('do hereby appoint and retain', {
        x: MARGIN_LEFT,
        y,
        font: fontBold,
        size: 11,
        color: rgb(0, 0, 0)
    });

    y -= 18;

    // Advocate name (centered or prominent)
    const advocateNameWidth = font.widthOfTextAtSize(data.advocateName, 11);
    page1.drawText(data.advocateName, {
        x: (PAGE_WIDTH - advocateNameWidth) / 2,
        y,
        font,
        size: 11,
        color: rgb(0, 0, 0)
    });

    y -= 25;

    // Standard legal text
    const legalTextMaxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const legalWords = STANDARD_LEGAL_TEXT.split(' ');
    let legalLine = '';

    for (const word of legalWords) {
        const testLine = legalLine + (legalLine ? ' ' : '') + word;
        const testWidth = font.widthOfTextAtSize(testLine, 10);

        if (testWidth > legalTextMaxWidth) {
            page1.drawText(legalLine, {
                x: MARGIN_LEFT,
                y,
                font,
                size: 10,
                color: rgb(0, 0, 0)
            });
            y -= 12;
            legalLine = word;
        } else {
            legalLine = testLine;
        }
    }

    if (legalLine) {
        page1.drawText(legalLine, {
            x: MARGIN_LEFT,
            y,
            font,
            size: 10,
            color: rgb(0, 0, 0)
        });
        y -= 12;
    }

    y -= 20;

    // Date
    const today = new Date();
    const dateStr = `Signed this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;
    page1.drawText(dateStr, {
        x: MARGIN_LEFT,
        y,
        font,
        size: 10,
        color: rgb(0, 0, 0)
    });

    y -= 40;

    // Signature section
    page1.drawText('Witnesses:', {
        x: MARGIN_LEFT,
        y,
        font: fontBold,
        size: 10,
        color: rgb(0, 0, 0)
    });

    page1.drawText('Known parties and signed before me', {
        x: PAGE_WIDTH - MARGIN_RIGHT - 200,
        y,
        font,
        size: 9,
        color: rgb(0, 0, 0)
    });

    y -= 15;
    page1.drawText('Advocate', {
        x: PAGE_WIDTH - MARGIN_RIGHT - 100,
        y,
        font,
        size: 9,
        color: rgb(0, 0, 0)
    });

    y -= 25;

    // Witnesses list
    const witnessLines = data.witnesses.split('\n').filter((w: string) => w.trim());
    witnessLines.forEach((witness: string, idx: number) => {
        page1.drawText(`${idx + 1}. ${witness}`, {
            x: MARGIN_LEFT,
            y,
            font,
            size: 10,
            color: rgb(0, 0, 0)
        });
        y -= 18;
    });

    // Add blank witness lines if needed
    for (let i = witnessLines.length; i < 2; i++) {
        page1.drawText(`${i + 1}.`, {
            x: MARGIN_LEFT,
            y,
            font,
            size: 10,
            color: rgb(0, 0, 0)
        });
        y -= 18;
    }

    // Advocate details box (bottom right)
    const boxX = PAGE_WIDTH - MARGIN_RIGHT - 180;
    const boxY = 120;
    const boxWidth = 170;
    const boxHeight = 80;

    // Blue rectangle
    page1.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        borderColor: rgb(0, 0, 0.8),
        borderWidth: 1.5,
        color: rgb(0.9, 0.95, 1)
    });

    // Advocate details inside box
    let boxTextY = boxY + boxHeight - 15;
    const centerInBox = (text: string, size: number, fontType: any) => {
        const textWidth = fontType.widthOfTextAtSize(text, size);
        return boxX + (boxWidth - textWidth) / 2;
    };

    page1.drawText(data.advocateName.toUpperCase(), {
        x: centerInBox(data.advocateName.toUpperCase(), 11, fontBold),
        y: boxTextY,
        font: fontBold,
        size: 11,
        color: rgb(0, 0, 0.8)
    });
    boxTextY -= 14;

    page1.drawText('ADVOCATE', {
        x: centerInBox('ADVOCATE', 10, fontBold),
        y: boxTextY,
        font: fontBold,
        size: 10,
        color: rgb(0, 0, 0.8)
    });
    boxTextY -= 12;

    page1.drawText(`Roll No: ${data.enrollmentNumber}`, {
        x: centerInBox(`Roll No: ${data.enrollmentNumber}`, 8, font),
        y: boxTextY,
        font,
        size: 8,
        color: rgb(0, 0, 0.8)
    });
    boxTextY -= 11;

    // Address - wrap if needed
    const addressWords = data.advocateAddress.split(' ');
    let addressLine = '';
    addressWords.forEach((word: string) => {
        const testLine = addressLine + (addressLine ? ' ' : '') + word;
        if (font.widthOfTextAtSize(testLine, 7) < boxWidth - 10) {
            addressLine = testLine;
        } else {
            page1.drawText(addressLine, {
                x: centerInBox(addressLine, 7, font),
                y: boxTextY,
                font,
                size: 7,
                color: rgb(0, 0, 0.8)
            });
            boxTextY -= 9;
            addressLine = word;
        }
    });
    if (addressLine) {
        page1.drawText(addressLine, {
            x: centerInBox(addressLine, 7, font),
            y: boxTextY,
            font,
            size: 7,
            color: rgb(0, 0, 0.8)
        });
        boxTextY -= 9;
    }

    page1.drawText(`Mob: ${data.advocateMobile}`, {
        x: centerInBox(`Mob: ${data.advocateMobile}`, 8, font),
        y: boxTextY,
        font,
        size: 8,
        color: rgb(0, 0, 0.8)
    });

    // ===========================================
    // PAGE 2: DOCKET
    // ===========================================
    if (data.includeDocket) {
        const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        let y2 = PAGE_HEIGHT - MARGIN_TOP;

        // RIGHT HALF CENTERED HELPER
        // Standard legal fold: Docket occupies right half (3 inches width on 8.5" or half of A4)
        const RIGHT_HALF_START = PAGE_WIDTH / 2;
        const RIGHT_HALF_WIDTH = PAGE_WIDTH / 2;

        const drawRightCentered = (text: string, size: number, fontRef: any, currentY: number, isBold = false) => {
            const textWidth = fontRef.widthOfTextAtSize(text, size);
            // Center the text within the right 50% of the page
            const xOffset = RIGHT_HALF_START + (RIGHT_HALF_WIDTH - textWidth) / 2;
            page2.drawText(text, {
                x: xOffset,
                y: currentY,
                font: isBold ? fontBold : font,
                size,
                color: rgb(0, 0, 0)
            });
        };

        // "Filed on:" (on the right half as well)
        const filedOnText = 'Filed on: ________________';
        drawRightCentered(filedOnText, 10, font, y2);

        y2 -= 50;

        // "BEFORE THE COURT OF"
        drawRightCentered('BEFORE THE COURT OF', 14, fontBold, y2, true);

        y2 -= 25;

        // Court name
        drawRightCentered(data.courtName.toUpperCase(), 11, font, y2);

        y2 -= 35;

        // Case number
        const caseNum = `${data.caseType} No.        of ${data.year}`;
        drawRightCentered(caseNum, 11, font, y2);

        y2 -= 40;

        // Parties with roles
        petitioners.forEach((p: VakalathParty, idx: number) => {
            if (idx === 0 || petitioners.length <= 2) {
                const partyLine = `${p.name}  —  ${petitionerRole}`;
                drawRightCentered(partyLine, 10, font, y2);
                y2 -= 18;
            }
        });
        if (petitioners.length > 2) {
            const othersLine = `& ${petitioners.length - 1} Others`;
            drawRightCentered(othersLine, 10, font, y2);
            y2 -= 18;
        }

        y2 -= 10;

        respondents.forEach((p: VakalathParty, idx: number) => {
            if (idx === 0 || respondents.length <= 2) {
                const partyLine = `${p.name}  —  ${respondentRole}`;
                drawRightCentered(partyLine, 10, font, y2);
                y2 -= 18;
            }
        });
        if (respondents.length > 2) {
            const othersLine = `& ${respondents.length - 1} Others`;
            drawRightCentered(othersLine, 10, font, y2);
            y2 -= 18;
        }

        y2 -= 40;

        // "VAKALATHNAMA" title
        drawRightCentered('VAKALATHNAMA', 18, fontBold, y2, true);

        y2 -= 30;

        // "on behalf of the [role]"
        drawRightCentered(`on behalf of the ${petitionerRole}`, 10, font, y2);

        y2 -= 80;

        // Signature line
        drawRightCentered('____________________', 11, font, y2);

        y2 -= 20;

        // "Accepted"
        drawRightCentered('Accepted', 10, font, y2);

        y2 -= 30;

        // Advocate name
        drawRightCentered(data.advocateName, 11, font, y2);

        y2 -= 18;

        // Enrollment number
        drawRightCentered(data.enrollmentNumber, 9, font, y2);

        y2 -= 40;

        // "ADVOCATE"
        drawRightCentered('ADVOCATE', 14, fontBold, y2, true);
    }

    return await pdfDoc.save();
}

/**
 * GENERATE VAKALATHNAMA FROM DRAFT SUIT DATA
 */
export async function generateVakalathFromDraft(data: DraftSuitData): Promise<Uint8Array> {
    // Transform DraftSuitData to VakalathFormValues (Mock advocate info for now)
    const transformData: VakalathFormValues = {
        courtName: data.basicDetails.court,
        caseType: data.basicDetails.caseType,
        year: data.basicDetails.year.toString(),
        district: data.basicDetails.district,
        caseNumber: data.basicDetails.caseNumber || '',
        documentType: data.basicDetails.vakalathType === 'vakalathnama' ? 'Vakalathnama' : 'Memo of Appearance',
        witnesses: '1. ________________\n2. ________________', // Placeholders
        includeDocket: true,
        partySignature: data.basicDetails.partySignatureRequired ? 'Yes' : 'Not Required',
        advocateName: 'ADVOCATE NAME', // This should come from user profile
        enrollmentNumber: 'K/123/2020',
        advocateAddress: 'Advocate Chambers, Court Complex',
        advocateMobile: '9876543210',
        parties: [
            ...data.partyDetails.plaintiffs.map(p => ({
                name: p.name,
                role: 'Plaintiff',
                age: p.age.toString(),
                fatherOrHusbandName: p.parentName,
                address: `${p.address.building}, ${p.address.street}, ${p.address.locality}`,
                mobile: '',
                email: ''
            })),
            ...data.partyDetails.defendants.map(p => ({
                name: p.name,
                role: 'Defendant',
                age: p.age.toString(),
                fatherOrHusbandName: p.parentName,
                address: `${p.address.building}, ${p.address.street}, ${p.address.locality}`,
                mobile: '',
                email: ''
            }))
        ],
        acts: [],
        applications: []
    };

    return generatePDF(transformData);
}

/**
 * GENERATE LIST OF PARTIES PDF
 */
export async function generateListOfPartiesPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    // Header
    const title = 'LIST OF PARTIES';
    page.drawText(title, {
        x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(title, 14)) / 2,
        y,
        font: fontBold,
        size: 14
    });
    y -= 40;

    // Court Details
    page.drawText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, {
        x: MARGIN_LEFT,
        y,
        font: fontBold,
        size: 11
    });
    y -= 15;
    page.drawText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, {
        x: MARGIN_LEFT,
        y,
        font,
        size: 11
    });
    y -= 40;

    // Plaintiffs
    page.drawText('PLAINTIFFS:', { x: MARGIN_LEFT, y, font: fontBold, size: 11 });
    y -= 20;
    data.partyDetails.plaintiffs.forEach((p: SuitParty, idx: number) => {
        const text = `${idx + 1}. ${p.name}, ${p.age} years, ${p.parentageType.replace('_', ' ')} ${p.parentName}, Residing at ${p.address.building}, ${p.address.street}, ${p.address.locality}, ${p.address.district}, PIN: ${p.address.pincode}`;
        const lines = wrapText(text, PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, font, 10);
        lines.forEach(line => {
            page.drawText(line, { x: MARGIN_LEFT + 20, y, font, size: 10 });
            y -= 15;
        });
        y -= 10;
    });

    // Defendants
    y -= 20;
    page.drawText('DEFENDANTS:', { x: MARGIN_LEFT, y, font: fontBold, size: 11 });
    y -= 20;
    data.partyDetails.defendants.forEach((p: SuitParty, idx: number) => {
        const text = `${idx + 1}. ${p.name}, ${p.age} years, ${p.parentageType.replace('_', ' ')} ${p.parentName}, Residing at ${p.address.building}, ${p.address.street}, ${p.address.locality}, ${p.address.district}, PIN: ${p.address.pincode}`;
        const lines = wrapText(text, PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, font, 10);
        lines.forEach(line => {
            page.drawText(line, { x: MARGIN_LEFT + 20, y, font, size: 10 });
            y -= 15;
        });
        y -= 10;
    });

    return await pdfDoc.save();
}

/**
 * GENERATE LIST OF DOCUMENTS PDF
 */
export async function generateListOfDocumentsPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    // Header
    const title = 'LIST OF DOCUMENTS / EXHIBITS';
    page.drawText(title, {
        x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(title, 14)) / 2,
        y,
        font: fontBold,
        size: 14
    });
    y -= 40;

    // Table Header
    const headers = ['Sl No.', 'Date', 'Description of Document', 'Marking', 'Pages'];
    const colX = [MARGIN_LEFT, MARGIN_LEFT + 50, MARGIN_LEFT + 120, MARGIN_LEFT + 380, MARGIN_LEFT + 450];

    headers.forEach((h, i) => {
        page.drawText(h, { x: colX[i], y, font: fontBold, size: 10 });
    });
    y -= 5;
    page.drawLine({ start: { x: MARGIN_LEFT, y }, end: { x: PAGE_WIDTH - MARGIN_RIGHT, y }, thickness: 1 });
    y -= 20;

    // Document Rows
    data.documentDetails.documents.forEach((doc: DocumentItem) => {
        page.drawText(doc.serialNumber.toString(), { x: colX[0], y, font, size: 10 });
        page.drawText(doc.date ? new Date(doc.date).toLocaleDateString() : '---', { x: colX[1], y, font, size: 10 });

        const descLines = wrapText(doc.description, 250, font, 10);
        let currentY = y;
        descLines.forEach(line => {
            page.drawText(line, { x: colX[2], y: currentY, font, size: 10 });
            currentY -= 12;
        });

        page.drawText(doc.markingLabel || '---', { x: colX[3], y, font, size: 10 });
        page.drawText(doc.pageCount?.toString() || '0', { x: colX[4], y, font, size: 10 });

        y = Math.min(y - 20, currentY - 8);

        // Add new page if needed
        if (y < 100) {
            // New page logic here if necessary
        }
    });

    return await pdfDoc.save();
}

/**
 * GENERATE SUIT VALUATION PDF
 */
export async function generateValuationPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const title = 'SUIT VALUATION & COURT FEE CERTIFICATE';
    page.drawText(title, {
        x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(title, 14)) / 2,
        y,
        font: fontBold,
        size: 14
    });
    y -= 50;

    const v = data.plaintDetails.valuation;
    const valuationText = [
        `1. Market Value of the Subject Matter: Rs. ${v.marketValue.toLocaleString()}`,
        `2. Value for the purpose of Court Fee: Rs. ${v.reliefValue.toLocaleString()}`,
        `3. Court Fee payable: Rs. ${v.courtFee?.toLocaleString() || '---'}`,
        '',
        'Calculation Method:',
        v.courtFeeCalculation
    ];

    valuationText.forEach(text => {
        const lines = wrapText(text, PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, font, 11);
        lines.forEach(line => {
            page.drawText(line, { x: MARGIN_LEFT, y, font, size: 11 });
            y -= 18;
        });
    });

    return await pdfDoc.save();
}

/**
 * HELPER: Wrap text
 */
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/**
 * GENERATE PLAINT PDF
 */
export async function generatePlaintPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Helper to add new page and reset Y
    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const checkNewPage = (neededSpace: number) => {
        if (y < MARGIN_TOP + neededSpace) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            y = PAGE_HEIGHT - MARGIN_TOP;
        }
    };

    const drawTextWrapped = (text: string, size: number, isBold: boolean = false, indent: number = 0) => {
        const maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - indent;
        const fontRef = isBold ? fontBold : font;
        const lines = wrapText(text, maxWidth, fontRef, size);

        lines.forEach(line => {
            checkNewPage(15);
            page.drawText(line, {
                x: MARGIN_LEFT + indent,
                y,
                font: fontRef,
                size,
                color: rgb(0, 0, 0)
            });
            y -= size + 5;
        });
        y -= 5;
    };

    const drawCenterText = (text: string, size: number, isBold: boolean = false) => {
        const fontRef = isBold ? fontBold : font;
        const textWidth = fontRef.widthOfTextAtSize(text, size);
        checkNewPage(20);
        page.drawText(text, {
            x: (PAGE_WIDTH - textWidth) / 2,
            y,
            font: fontRef,
            size,
            color: rgb(0, 0, 0)
        });
        y -= size + 8;
    };

    // --- PLAINT HEADER ---
    drawCenterText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, 12, true);
    drawCenterText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, 11);

    y -= 10;

    // --- PARTIES ---
    drawTextWrapped('BETWEEN:', 11, true);

    data.partyDetails.plaintiffs.forEach((p, i) => {
        drawTextWrapped(`${i + 1}. ${p.name}, ${p.age} years, ${p.parentageType.replace('_', ' ')} ${p.parentName}, Residing at ${p.address.building}, ${p.address.locality}, ${p.address.district}.`, 11, false, 20);
    });

    drawTextWrapped('... Plaintiff(s)', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 150);

    drawCenterText('AND', 11, true);

    data.partyDetails.defendants.forEach((p, i) => {
        drawTextWrapped(`${i + 1}. ${p.name}, ${p.age} years, ${p.parentageType.replace('_', ' ')} ${p.parentName}, Residing at ${p.address.building}, ${p.address.locality}, ${p.address.district}.`, 11, false, 20);
    });

    drawTextWrapped('... Defendant(s)', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 150);

    y -= 20;

    // --- TITLE ---
    drawCenterText('PLAINT FILED BY THE PLAINTIFF UNDER ORDER VII RULE 1 OF THE', 11, true);
    drawCenterText('CODE OF CIVIL PROCEDURE', 11, true);

    y -= 15;

    // --- BODY ---
    let paraNum = 1;

    // 1. Address for Service (Plaintiff)
    drawTextWrapped(`${paraNum}. The address for service of the plaintiff is that of his counsel ${data.basicDetails.court}, ${data.basicDetails.district}.`, 11);
    paraNum++;

    // 2. Address for Service (Defendant)
    drawTextWrapped(`${paraNum}. The address for service of the defendant is as shown in the cause title above.`, 11);
    paraNum++;

    // 3. Facts
    data.plaintDetails.factsOfCase.chronology.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(fact => {
        const dateStr = new Date(fact.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        drawTextWrapped(`${paraNum}. On ${dateStr}: ${fact.description}`, 11);
        paraNum++;
    });

    // Summary of Facts
    if (data.plaintDetails.factsOfCase.summary) {
        drawTextWrapped(`${paraNum}. ${data.plaintDetails.factsOfCase.summary}`, 11);
        paraNum++;
    }

    // 4. Cause of Action
    const coaDate = new Date(data.plaintDetails.causeOfAction.dateOfCause).toLocaleDateString('en-GB');
    drawTextWrapped(`${paraNum}. The cause of action for the above suit arose on ${coaDate} at ${data.plaintDetails.causeOfAction.placeOfCause} where ${data.plaintDetails.causeOfAction.description}.`, 11);
    paraNum++;

    // 5. Jurisdiction
    drawTextWrapped(`${paraNum}. ${data.plaintDetails.jurisdiction.territorialJurisdiction} Hence this Hon'ble Court has territorial jurisdiction to try this suit.`, 11);
    paraNum++;
    drawTextWrapped(`${paraNum}. ${data.plaintDetails.jurisdiction.pecuniaryJurisdiction} Hence this Hon'ble Court has pecuniary jurisdiction to try this suit.`, 11);
    paraNum++;

    // 6. Valuation
    const v = data.plaintDetails.valuation;
    drawTextWrapped(`${paraNum}. The suit is valued at Rs. ${v.marketValue.toLocaleString()} for the purpose of jurisdiction and court fee is paid as per Section _______ of the Kerala Court Fees and Suits Valuation Act.`, 11);
    paraNum++;

    // 7. Reliefs (Prayer)
    checkNewPage(100);
    drawCenterText('RELIEFS SOUGHT', 11, true);
    drawTextWrapped('The plaintiff mainly prays for the following reliefs:', 11);

    data.plaintDetails.reliefSought.forEach((relief, i) => {
        const reliefTitle = relief.type.charAt(0).toUpperCase() + relief.type.slice(1).replace('_', ' ');
        drawTextWrapped(`${String.fromCharCode(97 + i)}. ${reliefTitle}: ${relief.description}`, 11, false, 20);
    });

    drawTextWrapped(`${String.fromCharCode(97 + data.plaintDetails.reliefSought.length)}. To grant such other reliefs that this Hon'ble Court may deem fit and proper in the circumstances of the case.`, 11, false, 20);

    y -= 30;

    // --- SIGNATURES ---
    checkNewPage(100);
    const today = new Date();
    const dateStr = `Dated this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;

    drawTextWrapped(dateStr, 11);

    y -= 40;

    drawTextWrapped('Advocate for Plaintiff', 11, true, 0);
    drawTextWrapped('Plaintiff', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);

    y -= 20;

    // --- VERIFICATION ---
    checkNewPage(150);
    drawCenterText('VERIFICATION', 11, true);

    const pName = data.partyDetails.plaintiffs[0]?.name || 'Plaintiff';
    drawTextWrapped(`I, ${pName}, the plaintiff above named do hereby verify that the facts stated in paragraphs 1 to ${paraNum - 1} are true to the best of my knowledge, information and belief.`, 11);

    y -= 40;

    drawTextWrapped(dateStr, 11);

    y -= 40;
    drawTextWrapped('Plaintiff', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);

    return await pdfDoc.save();
}

/**
 * GENERATE AFFIDAVIT PDF
 */
export async function generateAffidavitPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const checkNewPage = (neededSpace: number) => {
        if (y < MARGIN_TOP + neededSpace) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            y = PAGE_HEIGHT - MARGIN_TOP;
        }
    };

    const drawCenterText = (text: string, size: number, isBold: boolean = false) => {
        const fontRef = isBold ? fontBold : font;
        const textWidth = fontRef.widthOfTextAtSize(text, size);
        page.drawText(text, { x: (PAGE_WIDTH - textWidth) / 2, y, font: fontRef, size, color: rgb(0, 0, 0) });
        y -= size + 8;
    };

    const drawTextWrapped = (text: string, size: number, isBold: boolean = false, indent: number = 0) => {
        const maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - indent;
        const fontRef = isBold ? fontBold : font;
        const lines = wrapText(text, maxWidth, fontRef, size);
        lines.forEach(line => {
            checkNewPage(15);
            page.drawText(line, { x: MARGIN_LEFT + indent, y, font: fontRef, size, color: rgb(0, 0, 0) });
            y -= size + 5;
        });
        y -= 5;
    };

    // --- HEADER ---
    drawCenterText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, 12, true);
    drawCenterText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, 11);
    y -= 20;

    // --- PARTIES ---
    const petitionerName = data.partyDetails.plaintiffs[0]?.name || '...';
    const respondentName = data.partyDetails.defendants[0]?.name || '...';

    drawTextWrapped(`${petitionerName}`, 11, true);
    drawTextWrapped('... Plaintiff/Petitioner', 11, false, PAGE_WIDTH - MARGIN_RIGHT - 150);
    drawCenterText('AND', 11, true);
    drawTextWrapped(`${respondentName}`, 11, true);
    drawTextWrapped('... Defendant/Respondent', 11, false, PAGE_WIDTH - MARGIN_RIGHT - 150);

    y -= 30;

    // --- TITLE ---
    drawCenterText('AFFIDAVIT', 14, true);
    y -= 20;

    // --- CONTENT ---
    const p = data.partyDetails.plaintiffs[0];
    const pDetails = p ? `${p.name}, aged ${p.age}, ${p.parentageType.replace('_', ' ')} ${p.parentName}, residing at ${p.address.building}, ${p.address.street}, ${p.address.locality}` : 'The Deponent';

    drawTextWrapped(`I, ${pDetails}, do hereby solemnly affirm and state as follows:`, 11);

    y -= 15;

    drawTextWrapped('1. I am the plaintiff in the above suit and I am well conversant with the facts of the case.', 11);
    y -= 10;

    drawTextWrapped('2. The accompanying Plaint has been filed by me for the reliefs stated therein.', 11);
    y -= 10;

    drawTextWrapped('3. The facts stated in the accompanying Plaint are true and correct to the best of my knowledge, information, and belief.', 11);
    y -= 10;

    drawTextWrapped('4. It is just and necessary that the accompanying Plaint be accepted on file and appropriate orders be passed.', 11);

    y -= 40;

    // --- SIGNATURE WITH DEPONENT ---
    drawTextWrapped('All the facts stated above are true and correct.', 11);

    y -= 15;
    const today = new Date();
    const dateStr = `Dated this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;
    drawTextWrapped(dateStr, 11);

    y -= 50;
    drawTextWrapped('DEPONENT', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);

    y -= 30;
    drawTextWrapped('Solemnly affirmed and signed before me by the deponent on this day at counsel office/court premises.', 10, false);

    y -= 50;
    drawTextWrapped('ADVOCATE', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);

    return await pdfDoc.save();
}



/**
 * GENERATE IA PETITION PDF
 * Generates all IAs in a single PDF (separated by new pages)
 */
export async function generateIAPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // If no IAs, return empty PDF or handled by caller
    if (data.iaDetails.applications.length === 0) {
        const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawText('No Interlocutory Applications', { x: 50, y: PAGE_HEIGHT - 50, font, size: 12 });
        return await pdfDoc.save();
    }

    for (const ia of data.iaDetails.applications) {
        let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        let y = PAGE_HEIGHT - MARGIN_TOP;

        const checkNewPage = (neededSpace: number) => {
            if (y < MARGIN_TOP + neededSpace) {
                page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                y = PAGE_HEIGHT - MARGIN_TOP;
            }
        };

        const drawCenterText = (text: string, size: number, isBold: boolean = false) => {
            const fontRef = isBold ? fontBold : font;
            const textWidth = fontRef.widthOfTextAtSize(text, size);
            page.drawText(text, { x: (PAGE_WIDTH - textWidth) / 2, y, font: fontRef, size, color: rgb(0, 0, 0) });
            y -= size + 8;
        };

        const drawTextWrapped = (text: string, size: number, isBold: boolean = false, indent: number = 0) => {
            const maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - indent;
            const fontRef = isBold ? fontBold : font;
            const lines = wrapText(text, maxWidth, fontRef, size);
            lines.forEach(line => {
                checkNewPage(15);
                page.drawText(line, { x: MARGIN_LEFT + indent, y, font: fontRef, size, color: rgb(0, 0, 0) });
                y -= size + 5;
            });
            y -= 5;
        };

        // HEADER
        drawCenterText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, 12, true);
        drawCenterText(`I.A. No. ________ of ${data.basicDetails.year}`, 11, true);
        drawCenterText(`IN`, 11);
        drawCenterText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, 11);
        y -= 20;

        // PARTIES
        const petitionerName = data.partyDetails.plaintiffs[0]?.name || '...';
        const respondentName = data.partyDetails.defendants[0]?.name || '...';

        drawTextWrapped(`${petitionerName}`, 11, true);
        drawTextWrapped('... Petitioner/Plaintiff', 11, false, PAGE_WIDTH - MARGIN_RIGHT - 150);
        drawCenterText('AND', 11, true);
        drawTextWrapped(`${respondentName}`, 11, true);
        drawTextWrapped('... Respondent/Defendant', 11, false, PAGE_WIDTH - MARGIN_RIGHT - 150);

        y -= 20;

        // TITLE
        drawCenterText('PETITION FILED UNDER ___________________________', 11, true);
        drawCenterText('OF THE CODE OF CIVIL PROCEDURE', 11, true);
        y -= 20;

        // CONTENT
        drawTextWrapped(`For the reasons stated in the accompanying affidavit, it is humbly prayed that this Hon'ble Court may be pleased to:`, 11);
        y -= 10;

        drawTextWrapped(`${ia.reliefRequested}`, 11, true, 20);
        y -= 10;

        drawTextWrapped(`Otherwise, the petitioner will accept great hardships and loss.`, 11);

        y -= 40;

        // SIGNATURES
        const today = new Date();
        const dateStr = `Dated this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;
        drawTextWrapped(dateStr, 11);

        y -= 50;
        drawTextWrapped('Advocate for Petitioner', 11, true, 0);
        drawTextWrapped('Petitioner', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);
    }

    return await pdfDoc.save();
}

/**
 * GENERATE IA AFFIDAVIT PDF
 */
export async function generateIAAffidavitPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Filter IAs that require separate affidavit or check generic rule
    const requiredIAs = data.iaDetails.applications.filter(ia => ia.affidavitRequired);

    if (requiredIAs.length === 0) {
        const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        page.drawText('No IA Affidavits Required', { x: 50, y: PAGE_HEIGHT - 50, font, size: 12 });
        return await pdfDoc.save();
    }

    for (const ia of requiredIAs) {
        let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        let y = PAGE_HEIGHT - MARGIN_TOP;

        const checkNewPage = (neededSpace: number) => {
            if (y < MARGIN_TOP + neededSpace) {
                page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                y = PAGE_HEIGHT - MARGIN_TOP;
            }
        };

        const drawCenterText = (text: string, size: number, isBold: boolean = false) => {
            const fontRef = isBold ? fontBold : font;
            const textWidth = fontRef.widthOfTextAtSize(text, size);
            page.drawText(text, { x: (PAGE_WIDTH - textWidth) / 2, y, font: fontRef, size, color: rgb(0, 0, 0) });
            y -= size + 8;
        };

        const drawTextWrapped = (text: string, size: number, isBold: boolean = false, indent: number = 0) => {
            const maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - indent;
            const fontRef = isBold ? fontBold : font;
            const lines = wrapText(text, maxWidth, fontRef, size);
            lines.forEach(line => {
                checkNewPage(15);
                page.drawText(line, { x: MARGIN_LEFT + indent, y, font: fontRef, size, color: rgb(0, 0, 0) });
                y -= size + 5;
            });
            y -= 5;
        };

        // HEADER
        drawCenterText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, 12, true);
        drawCenterText(`I.A. No. ________ of ${data.basicDetails.year}`, 11, true);
        drawCenterText(`IN`, 11);
        drawCenterText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, 11);
        y -= 20;

        // PARTIES
        const petitionerName = data.partyDetails.plaintiffs[0]?.name || '...';
        const respondentName = data.partyDetails.defendants[0]?.name || '...';

        drawTextWrapped(`${petitionerName}`, 11, true);
        drawTextWrapped('... Petitioner/Plaintiff', 11, false, PAGE_WIDTH - MARGIN_RIGHT - 150);
        drawCenterText('AND', 11, true);
        drawTextWrapped(`${respondentName}`, 11, true);
        drawTextWrapped('... Respondent/Defendant', 11, false, PAGE_WIDTH - MARGIN_RIGHT - 150);

        y -= 30;

        // TITLE
        drawCenterText('AFFIDAVIT', 14, true);
        y -= 20;

        // CONTENT
        const p = data.partyDetails.plaintiffs[0];
        const pDetails = p ? `${p.name}, aged ${p.age}, ${p.parentageType.replace('_', ' ')} ${p.parentName}, residing at ${p.address.building}, ${p.address.street}, ${p.address.locality}` : 'The Deponent';

        drawTextWrapped(`I, ${pDetails}, do hereby solemnly affirm and state as follows:`, 11);
        y -= 15;

        // IA Facts parsing
        drawTextWrapped('1. I am the petitioner in the above IA and plaintiff in the above suit. I am well conversant with the facts of the case.', 11);
        y -= 10;

        drawTextWrapped(`2. ${ia.facts || 'The facts of the matter are as follows...'}`, 11);
        y -= 10;

        drawTextWrapped(`3. It is just and necessary that the prayers in the accompanying application be granted.`, 11);

        y -= 40;

        // SIGNATURE
        drawTextWrapped('All the facts stated above are true and correct.', 11);

        y -= 15;
        const today = new Date();
        const dateStr = `Dated this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;
        drawTextWrapped(dateStr, 11);

        y -= 50;
        drawTextWrapped('DEPONENT', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);

        y -= 30;
        drawTextWrapped('Solemnly affirmed and signed before me by the deponent on this day at counsel office/court premises.', 10, false);

        y -= 50;
        drawTextWrapped('ADVOCATE', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 100);
    }

    return await pdfDoc.save();
}

/**
 * GENERATE SYNOPSIS PDF
 */
export async function generateSynopsisPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const checkNewPage = (neededSpace: number) => {
        if (y < MARGIN_TOP + neededSpace) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            y = PAGE_HEIGHT - MARGIN_TOP;
        }
    };

    const drawCenterText = (text: string, size: number, isBold: boolean = false) => {
        const fontRef = isBold ? fontBold : font;
        const textWidth = fontRef.widthOfTextAtSize(text, size);
        page.drawText(text, { x: (PAGE_WIDTH - textWidth) / 2, y, font: fontRef, size, color: rgb(0, 0, 0) });
        y -= size + 8;
    };

    const drawTextWrapped = (text: string, size: number, isBold: boolean = false, indent: number = 0) => {
        const maxWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - indent;
        const fontRef = isBold ? fontBold : font;
        const lines = wrapText(text, maxWidth, fontRef, size);
        lines.forEach(line => {
            checkNewPage(15);
            page.drawText(line, { x: MARGIN_LEFT + indent, y, font: fontRef, size, color: rgb(0, 0, 0) });
            y -= size + 5;
        });
        y -= 5;
    };

    // HEADER
    drawCenterText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, 12, true);
    drawCenterText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, 11);

    y -= 10;

    // PARTIES (Brief)
    const pName = data.partyDetails.plaintiffs[0]?.name || 'Plaintiff';
    const dName = data.partyDetails.defendants[0]?.name || 'Defendant';

    drawTextWrapped(`${pName} ... Plaintiff`, 11, true);
    drawCenterText('Vs', 11, true);
    drawTextWrapped(`${dName} ... Defendant`, 11, true);

    y -= 25;
    drawCenterText('SYNOPSIS', 14, true);
    y -= 15;

    // CONTENT
    drawTextWrapped('The above suit is filed for ' + (data.basicDetails.caseType === 'OS' ? 'recovery of money/partition/injunction/etc.' : 'appropriate reliefs'), 11);
    y -= 10;

    if (data.plaintDetails.factsOfCase.summary) {
        drawTextWrapped('Brief Facts:', 11, true);
        drawTextWrapped(data.plaintDetails.factsOfCase.summary, 11);
        y -= 10;
    }

    // LIST OF DATES
    drawTextWrapped('Chronology of Events:', 11, true);
    y -= 5;

    const chronology = [...data.plaintDetails.factsOfCase.chronology].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (chronology.length > 0) {
        chronology.forEach(fact => {
            const dateStr = new Date(fact.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            // Draw date column and description column
            checkNewPage(15);
            const dateWidth = 100;
            page.drawText(dateStr, { x: MARGIN_LEFT, y, font: fontBold, size: 11 });

            // Wrap description
            const descLines = wrapText(fact.description, PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - dateWidth, font, 11);
            descLines.forEach((line, i) => {
                if (i > 0) checkNewPage(15);
                page.drawText(line, { x: MARGIN_LEFT + dateWidth, y, font, size: 11 });
                if (i < descLines.length - 1) y -= 15;
            });
            y -= 20;
        });
    } else {
        drawTextWrapped('No specific dates added.', 11);
    }

    y -= 40;

    const today = new Date();
    const dateStr = `Dated this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;
    drawTextWrapped(dateStr, 11);

    y -= 40;
    drawTextWrapped('Counsel for Plaintiff', 11, true, PAGE_WIDTH - MARGIN_RIGHT - 150);

    return await pdfDoc.save();
}

/**
 * GENERATE INDEX PDF
 */
export async function generateIndexPDF(data: DraftSuitData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const drawCenterText = (text: string, size: number, isBold: boolean = false) => {
        const fontRef = isBold ? fontBold : font;
        const textWidth = fontRef.widthOfTextAtSize(text, size);
        page.drawText(text, { x: (PAGE_WIDTH - textWidth) / 2, y, font: fontRef, size, color: rgb(0, 0, 0) });
        y -= size + 8;
    };

    // HEADER
    drawCenterText(`IN THE COURT OF THE ${data.basicDetails.court.toUpperCase()}`, 12, true);
    drawCenterText(`${data.basicDetails.caseType} No. ________ of ${data.basicDetails.year}`, 11);
    y -= 15;

    // PARTIES
    const pName = data.partyDetails.plaintiffs[0]?.name || 'Plaintiff';
    const dName = data.partyDetails.defendants[0]?.name || 'Defendant';

    drawCenterText(`${pName}  Vs  ${dName}`, 11, true);
    y -= 25;

    drawCenterText('INDEX', 14, true);
    y -= 20;

    // TABLE HEADER
    const col1X = MARGIN_LEFT;
    const col2X = MARGIN_LEFT + 50;
    const col3X = PAGE_WIDTH - MARGIN_RIGHT - 50;

    page.drawText('Sl. No.', { x: col1X, y, font: fontBold, size: 11 });
    page.drawText('Description of Paper', { x: col2X, y, font: fontBold, size: 11 });
    page.drawText('Page No.', { x: col3X, y, font: fontBold, size: 11 });
    y -= 5;
    page.drawLine({ start: { x: MARGIN_LEFT, y }, end: { x: PAGE_WIDTH - MARGIN_RIGHT, y }, thickness: 1 });
    y -= 15;

    // TABLE ROWS
    const items = [
        'Vakalathnama',
        'Plaint',
        'Affidavit',
        'List of Documents',
        ...data.documentDetails.documents.map((d, i) => `${i + 1}. ${d.description} (${d.documentType})`),
        'Court Fee Valuation Statement'
    ];

    if (data.iaDetails.applications.length > 0) {
        items.push('Interlocutory Application(s)');
        items.push('Affidavit in Support of IA');
    }

    items.forEach((item, index) => {
        if (y < 100 + 20) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            y = PAGE_HEIGHT - MARGIN_TOP;
        }

        page.drawText(`${index + 1}.`, { x: col1X + 10, y, font, size: 11 });
        page.drawText(item, { x: col2X, y, font, size: 11 });
        // Page numbers would be filled manually or calculated if we merged PDFs
        page.drawText('__', { x: col3X + 10, y, font, size: 11 });

        y -= 20;
    });

    y -= 40;
    const today = new Date();
    const dateStr = `Dated: ${today.getDate()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    page.drawText(dateStr, { x: MARGIN_LEFT, y, font, size: 11 });

    page.drawText('Counsel for Plaintiff', { x: PAGE_WIDTH - MARGIN_RIGHT - 120, y, font: fontBold, size: 11 });

    return await pdfDoc.save();
}

export async function generateDOCX(data: VakalathFormValues): Promise<Blob> {
    // Similar structure for DOCX
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                    size: { width: 11906, height: 16838 }
                }
            },
            children: [
                new Paragraph({ children: [new TextRun({ text: "VAKALATHNAMA", bold: true, size: 32 })] }),
                // Add more content as needed
            ]
        }]
    });
    return Packer.toBlob(doc);
}
