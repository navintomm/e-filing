import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import { VakalathFormValues } from './validators';

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
    const petitioners = data.parties.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('appellant') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    );
    const respondents = data.parties.filter(p => !petitioners.includes(p));

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
    partyTypes.forEach(type => {
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
    petitioners.forEach(p => {
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
    respondents.forEach(p => {
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
        petitioners.forEach((p, idx) => {
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
        let lineStartX = MARGIN_LEFT;

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
    const witnessLines = data.witnesses.split('\n').filter(w => w.trim());
    witnessLines.forEach((witness, idx) => {
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
    addressWords.forEach(word => {
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

        // "Filed on:"
        page2.drawText('Filed on:', {
            x: MARGIN_LEFT,
            y: y2,
            font,
            size: 10,
            color: rgb(0, 0, 0)
        });

        y2 -= 50;

        // "BEFORE THE COURT OF" centered
        const courtHeader = 'BEFORE THE COURT OF';
        page2.drawText(courtHeader, {
            x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(courtHeader, 14)) / 2,
            y: y2,
            font: fontBold,
            size: 14,
            color: rgb(0, 0, 0)
        });

        y2 -= 25;

        // Court name centered
        const courtNameUpper = data.courtName.toUpperCase();
        page2.drawText(courtNameUpper, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(courtNameUpper, 12)) / 2,
            y: y2,
            font,
            size: 12,
            color: rgb(0, 0, 0)
        });

        y2 -= 35;

        // Case number centered
        const caseNum = `${data.caseType} No.        of ${data.year}`;
        page2.drawText(caseNum, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(caseNum, 11)) / 2,
            y: y2,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });

        y2 -= 40;

        // Parties with roles
        petitioners.forEach((p, idx) => {
            if (idx === 0 || petitioners.length <= 2) {
                const partyLine = `${p.name}  —  ${petitionerRole}`;
                page2.drawText(partyLine, {
                    x: (PAGE_WIDTH - font.widthOfTextAtSize(partyLine, 11)) / 2,
                    y: y2,
                    font,
                    size: 11,
                    color: rgb(0, 0, 0)
                });
                y2 -= 18;
            }
        });
        if (petitioners.length > 2) {
            const othersLine = `& ${petitioners.length - 1} Others`;
            page2.drawText(othersLine, {
                x: (PAGE_WIDTH - font.widthOfTextAtSize(othersLine, 10)) / 2,
                y: y2,
                font,
                size: 10,
                color: rgb(0, 0, 0)
            });
            y2 -= 18;
        }

        y2 -= 10;

        respondents.forEach((p, idx) => {
            if (idx === 0 || respondents.length <= 2) {
                const partyLine = `${p.name}  —  ${respondentRole}`;
                page2.drawText(partyLine, {
                    x: (PAGE_WIDTH - font.widthOfTextAtSize(partyLine, 11)) / 2,
                    y: y2,
                    font,
                    size: 11,
                    color: rgb(0, 0, 0)
                });
                y2 -= 18;
            }
        });
        if (respondents.length > 2) {
            const othersLine = `& ${respondents.length - 1} Others`;
            page2.drawText(othersLine, {
                x: (PAGE_WIDTH - font.widthOfTextAtSize(othersLine, 10)) / 2,
                y: y2,
                font,
                size: 10,
                color: rgb(0, 0, 0)
            });
            y2 -= 18;
        }

        y2 -= 40;

        // "VAKALATHNAMA" title
        const title = 'VAKALATHNAMA';
        page2.drawText(title, {
            x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(title, 18)) / 2,
            y: y2,
            font: fontBold,
            size: 18,
            color: rgb(0, 0, 0)
        });

        y2 -= 30;

        // "on behalf of the [role]"
        const behalfText = `on behalf of the ${petitionerRole}`;
        page2.drawText(behalfText, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(behalfText, 10)) / 2,
            y: y2,
            font,
            size: 10,
            color: rgb(0, 0, 0)
        });

        y2 -= 80;

        // Signature line
        const sigLine = '____________________';
        page2.drawText(sigLine, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(sigLine, 11)) / 2,
            y: y2,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });

        y2 -= 20;

        // "Accepted"
        const acceptedText = 'Accepted';
        page2.drawText(acceptedText, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(acceptedText, 10)) / 2,
            y: y2,
            font,
            size: 10,
            color: rgb(0, 0, 0)
        });

        y2 -= 30;

        // Advocate name
        page2.drawText(data.advocateName, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(data.advocateName, 11)) / 2,
            y: y2,
            font,
            size: 11,
            color: rgb(0, 0, 0)
        });

        y2 -= 18;

        // Enrollment number
        page2.drawText(data.enrollmentNumber, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(data.enrollmentNumber, 9)) / 2,
            y: y2,
            font,
            size: 9,
            color: rgb(0, 0, 0)
        });

        y2 -= 30;

        // "Address for service of summons"
        const addressHeader = 'Address for service of summons';
        page2.drawText(addressHeader, {
            x: (PAGE_WIDTH - font.widthOfTextAtSize(addressHeader, 9)) / 2,
            y: y2,
            font,
            size: 9,
            color: rgb(0, 0, 0)
        });

        y2 -= 30;

        // "ADVOCATE"
        const advocateLabel = 'ADVOCATE';
        page2.drawText(advocateLabel, {
            x: (PAGE_WIDTH - fontBold.widthOfTextAtSize(advocateLabel, 14)) / 2,
            y: y2,
            font: fontBold,
            size: 14,
            color: rgb(0, 0, 0)
        });
    }

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
