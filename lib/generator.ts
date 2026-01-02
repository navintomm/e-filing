import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { VakalathFormValues } from './validators';

/**
 * KERALA COURT VAKALATHNAMA - STRICT TEMPLATE
 * 
 * FIXED-LAYOUT, TWO-PAGE LEGAL DOCUMENT
 * - Page 1: FULL PAGE Vakalath Body
 * - Page 2: DOCKET (RIGHT HALF ONLY)
 * 
 * DO NOT modify layout, spacing, or text.
 * This is a court-accepted legal form.
 */

const PAGE_WIDTH = 595.28;  // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height in points
const MARGIN = 72;          // 1 inch margin

// Standard legal authorization text - DO NOT MODIFY
const STANDARD_LEGAL_TEXT = `Advocate to appear for me/us in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed there in I/we empower the said Advocate/s to compromise any suit or proceeding on my/ our behalf and to appear in all miscellaneous proceeding in the above suit or matter till all decreases or order are fully, satisfied or adjusted and to produce in court my money document or valuable security on my/our behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to me/us in the above suit or matter and I/We do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on my/ our behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and I/we do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on me/us done by me/us in person`;

export async function generatePDF(data: VakalathFormValues): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Separate parties into petitioners and respondents
    const petitioners = data.parties.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('appellant') ||
        p.role?.toLowerCase().includes('complainant')
    );
    const respondents = data.parties.filter(p => !petitioners.includes(p));

    const isPluralPetitioner = petitioners.length > 1;
    const pronoun = isPluralPetitioner ? 'We' : 'I';
    const pronounLower = isPluralPetitioner ? 'we' : 'I';

    // Get party roles
    const petitionerRole = petitioners[0]?.role || 'Plaintiff';
    const respondentRole = respondents[0]?.role || 'Defendant';

    // ========================================
    // PAGE 1: FULL PAGE VAKALATH BODY
    // ========================================
    const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - 60;

    // "BEFORE THE HONOURABLE" - centered, own line
    const courtHeader = 'BEFORE THE HONOURABLE';
    page1.drawText(courtHeader, {
        x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(courtHeader, 16)) / 2,
        y,
        font: fontBold,
        size: 16,
        color: rgb(0, 0, 0)
    });
    y -= 25;

    // Court name - centered
    const courtNameUpper = data.courtName.toUpperCase();
    page1.drawText(courtNameUpper, {
        x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(courtNameUpper, 16)) / 2,
        y,
        font: fontBold,
        size: 16,
        color: rgb(0, 0, 0)
    });
    y -= 30;

    // Case number - centered, own line
    const caseNumber = `${data.caseType} No. ${data.caseNumber || '___'} of ${data.year}`;
    page1.drawText(caseNumber, {
        x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(caseNumber, 14)) / 2,
        y,
        font: fontBold,
        size: 14,
        color: rgb(0, 0, 0)
    });
    y -= 40;

    // Party roles - RIGHT-ALIGNED (show only actual roles)
    const roleX = PAGE_WIDTH - 100; // Right-aligned X position
    let roleY = y;

    // Show petitioner role
    page1.drawText(petitionerRole, {
        x: roleX,
        y: roleY,
        font: fontBold,
        size: 10,
        color: rgb(0, 0, 0)
    });
    // Underline petitioner role
    page1.drawLine({
        start: { x: roleX, y: roleY - 2 },
        end: { x: roleX + fontBold.widthOfTextAtSize(petitionerRole, 10), y: roleY - 2 },
        thickness: 0.5,
        color: rgb(0, 0, 0)
    });
    roleY -= 30; // Space between roles

    // Show respondent role
    page1.drawText(respondentRole, {
        x: roleX,
        y: roleY,
        font: fontBold,
        size: 10,
        color: rgb(0, 0, 0)
    });
    // Underline respondent role
    page1.drawLine({
        start: { x: roleX, y: roleY - 2 },
        end: { x: roleX + fontBold.widthOfTextAtSize(respondentRole, 10), y: roleY - 2 },
        thickness: 0.5,
        color: rgb(0, 0, 0)
    });

    // Party names - with conditional numbering
    const partyNamesX = 120;
    let partyY = y;

    // Petitioners - number if multiple
    petitioners.forEach((p, index) => {
        const nameText = petitioners.length > 1 ? `${index + 1}) ${p.name}` : p.name;
        page1.drawText(nameText, {
            x: partyNamesX,
            y: partyY,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        page1.drawText('—', {
            x: partyNamesX + 180,
            y: partyY,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        partyY -= 22;
    });

    partyY -= 10;

    // Respondents - number if multiple
    respondents.forEach((p, index) => {
        const nameText = respondents.length > 1 ? `${index + 1}) ${p.name}` : p.name;
        page1.drawText(nameText, {
            x: partyNamesX,
            y: partyY,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        page1.drawText('—', {
            x: partyNamesX + 180,
            y: partyY,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        partyY -= 22;
    });

    y = Math.min(y - 150, partyY - 20);

    // Build the complete paragraph as one continuous text
    const firstPet = petitioners[0];
    let completeParagraph = '';

    if (firstPet) {
        // I/We declaration
        completeParagraph = `${pronoun} `;

        if (isPluralPetitioner) {
            // Multiple petitioners - number each with complete details
            petitioners.forEach((p, i) => {
                if (i > 0) completeParagraph += ', ';
                completeParagraph += `${i + 1}) ${p.name}`;
                if (p.age) completeParagraph += ` aged ${p.age}`;
                if (p.fatherOrHusbandName) completeParagraph += ` ${p.fatherOrHusbandName}`;
                if (p.address) completeParagraph += ` resident at ${p.address}`;
                if (p.pincode) completeParagraph += ` PIN ${p.pincode}`;
            });
        } else {
            // Single petitioner - no numbering
            completeParagraph += firstPet.name;
            if (firstPet.age) completeParagraph += ` aged ${firstPet.age}`;
            if (firstPet.fatherOrHusbandName) completeParagraph += ` ${firstPet.fatherOrHusbandName}`;
            if (firstPet.address) completeParagraph += ` resident at ${firstPet.address}`;
            if (firstPet.pincode) completeParagraph += ` PIN ${firstPet.pincode}`;
        }

        // Add "do hereby appoint and retain" + advocate name + legal text - all in one flow
        completeParagraph += ' do hereby appoint and retain ' + data.advocateName + ' ' + STANDARD_LEGAL_TEXT;
    }

    // Draw the complete paragraph as fully justified text
    const maxWidth = PAGE_WIDTH - 100;
    const words = completeParagraph.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (font.widthOfTextAtSize(testLine, 14) > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    // Draw each line with justification
    lines.forEach((line, idx) => {
        const isLastLine = idx === lines.length - 1;
        if (isLastLine) {
            // Last line - left aligned
            page1.drawText(line, {
                x: 50,
                y,
                font,
                size: 14,
                color: rgb(0, 0, 0)
            });
        } else {
            // Justify by spacing words
            const lineWords = line.split(' ');
            if (lineWords.length > 1) {
                const totalTextWidth = font.widthOfTextAtSize(line.replace(/\s+/g, ''), 14);
                const spaceWidth = (maxWidth - totalTextWidth) / (lineWords.length - 1);
                let currentX = 50;
                lineWords.forEach(word => {
                    page1.drawText(word, {
                        x: currentX,
                        y,
                        font,
                        size: 14,
                        color: rgb(0, 0, 0)
                    });
                    currentX += font.widthOfTextAtSize(word, 14) + spaceWidth;
                });
            } else {
                page1.drawText(line, {
                    x: 50,
                    y,
                    font,
                    size: 14,
                    color: rgb(0, 0, 0)
                });
            }
        }
        y -= 18; // Increased line spacing for 14pt font
    });

    y -= 15; // Small space after paragraph

    // Date
    const today = new Date();
    const dateStr = `Signed this the ${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;
    page1.drawText(dateStr, {
        x: 50,
        y,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y -= 25; // Space before signatures

    // Signature section - bottom aligned
    page1.drawText('Witnesses:', {
        x: 50,
        y,
        font: fontBold,
        size: 14,
        color: rgb(0, 0, 0)
    });

    page1.drawText('Known parties and signed before me', {
        x: PAGE_WIDTH - 300,
        y,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });
    y -= 25;
    page1.drawText('Advocate', {
        x: PAGE_WIDTH - 200,
        y,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y -= 15;
    const witnessLines = data.witnesses.split('\n').filter(w => w.trim());
    witnessLines.forEach((w, i) => {
        const witnessText = witnessLines.length > 1 ? `${i + 1}. ${w}` : w;
        page1.drawText(witnessText, {
            x: 50,
            y,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        y -= 22;
    });

    // Blue box removed as per user request

    // ========================================
    // PAGE 2: DOCKET (RIGHT HALF ONLY)
    // ========================================
    const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Docket occupies RIGHT HALF only with significant padding to avoid fold interference
    const docketStartX = PAGE_WIDTH / 2 + 90; // 90pt (approx 1.25") padding from the fold
    const docketWidth = PAGE_WIDTH - docketStartX - 40; // 40pt margin from right edge
    const docketCenterX = docketStartX + docketWidth / 2;

    // Move content further DOWN the page
    let y2 = PAGE_HEIGHT - 80;

    // "Filed on:" - centered in right half
    const filedOnText = 'Filed on:';
    page2.drawText(filedOnText, {
        x: docketCenterX - font.widthOfTextAtSize(filedOnText, 14) / 2,
        y: y2,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y2 -= 60;

    // "BEFORE THE HONOURABLE" - centered in shifted RIGHT section
    const beforeCourt = 'BEFORE THE HONOURABLE';
    page2.drawText(beforeCourt, {
        x: docketCenterX - fontBold.widthOfTextAtSize(beforeCourt, 12) / 2,
        y: y2,
        font: fontBold,
        size: 12,
        color: rgb(0, 0, 0)
    });

    y2 -= 30;

    // Court name - centered in shifted RIGHT section
    const docketCourtName = data.courtName.toUpperCase();
    page2.drawText(docketCourtName, {
        x: docketCenterX - fontBold.widthOfTextAtSize(docketCourtName, 10) / 2,
        y: y2,
        font: fontBold,
        size: 10,
        color: rgb(0, 0, 0)
    });

    y2 -= 35;

    // Case number - centered in RIGHT HALF
    const docketCase = `${data.caseType} No. ${data.caseNumber || '___'} of ${data.year}`;
    page2.drawText(docketCase, {
        x: docketCenterX - fontBold.widthOfTextAtSize(docketCase, 14) / 2,
        y: y2,
        font: fontBold,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y2 -= 40;

    // Parties - centered in RIGHT HALF
    petitioners.slice(0, 2).forEach((p) => {
        const partyText = `${p.name}  —  ${petitionerRole}`;
        page2.drawText(partyText, {
            x: docketCenterX - font.widthOfTextAtSize(partyText, 14) / 2,
            y: y2,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        y2 -= 22;
    });
    if (petitioners.length > 2) {
        const othersText = `& ${petitioners.length - 1} Others`;
        page2.drawText(othersText, {
            x: docketCenterX - font.widthOfTextAtSize(othersText, 12) / 2,
            y: y2,
            font,
            size: 12,
            color: rgb(0, 0, 0)
        });
        y2 -= 22;
    }

    y2 -= 10;

    respondents.slice(0, 2).forEach((r) => {
        const partyText = `${r.name}  —  ${respondentRole}`;
        page2.drawText(partyText, {
            x: docketCenterX - font.widthOfTextAtSize(partyText, 14) / 2,
            y: y2,
            font,
            size: 14,
            color: rgb(0, 0, 0)
        });
        y2 -= 22;
    });
    if (respondents.length > 2) {
        const othersText = `& ${respondents.length - 1} Others`;
        page2.drawText(othersText, {
            x: docketCenterX - font.widthOfTextAtSize(othersText, 12) / 2,
            y: y2,
            font,
            size: 12,
            color: rgb(0, 0, 0)
        });
        y2 -= 22;
    }

    y2 -= 40;

    // "VAKALATHNAMA" - centered in RIGHT HALF, large font
    const titleText = 'VAKALATHNAMA';
    page2.drawText(titleText, {
        x: docketCenterX - fontBold.widthOfTextAtSize(titleText, 18) / 2,
        y: y2,
        font: fontBold,
        size: 18,
        color: rgb(0, 0, 0)
    });

    y2 -= 30;

    // "on behalf of the [role]" - centered in RIGHT HALF
    const behalfText = `on behalf of the ${petitionerRole}`;
    page2.drawText(behalfText, {
        x: docketCenterX - font.widthOfTextAtSize(behalfText, 14) / 2,
        y: y2,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y2 -= 80;

    // Signature line - centered in RIGHT HALF
    const sigLine = '____________________';
    page2.drawText(sigLine, {
        x: docketCenterX - font.widthOfTextAtSize(sigLine, 14) / 2,
        y: y2,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y2 -= 20;

    // "Accepted" - centered in RIGHT HALF
    const acceptedText = 'Accepted';
    page2.drawText(acceptedText, {
        x: docketCenterX - font.widthOfTextAtSize(acceptedText, 14) / 2,
        y: y2,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y2 -= 20;

    // Advocate name - centered in RIGHT HALF
    page2.drawText(data.advocateName, {
        x: docketCenterX - font.widthOfTextAtSize(data.advocateName, 14) / 2,
        y: y2,
        font,
        size: 14,
        color: rgb(0, 0, 0)
    });

    y2 -= 15;

    // Enrollment - centered in RIGHT HALF
    page2.drawText(data.enrollmentNumber, {
        x: docketCenterX - font.widthOfTextAtSize(data.enrollmentNumber, 12) / 2,
        y: y2,
        font,
        size: 12,
        color: rgb(0, 0, 0)
    });

    y2 -= 20;

    // "Address for service of summons" - centered in RIGHT HALF
    const addrHeader = 'Address for service of summons';
    page2.drawText(addrHeader, {
        x: docketCenterX - font.widthOfTextAtSize(addrHeader, 12) / 2,
        y: y2,
        font,
        size: 12,
        color: rgb(0, 0, 0)
    });

    y2 -= 20;

    // "ADVOCATE" - centered in RIGHT HALF, bottom
    const advocateLabel = 'ADVOCATE';
    page2.drawText(advocateLabel, {
        x: docketCenterX - fontBold.widthOfTextAtSize(advocateLabel, 14) / 2,
        y: y2,
        font: fontBold,
        size: 14,
        color: rgb(0, 0, 0)
    });

    return await pdfDoc.save();
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

export async function generateDOCX(data: VakalathFormValues): Promise<Blob> {
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                    size: { width: 11906, height: 16838 }
                }
            },
            children: [
                new Paragraph({
                    children: [new TextRun({ text: "VAKALATHNAMA", bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER
                }),
            ]
        }]
    });
    return Packer.toBlob(doc);
}
