import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { VakalathFormValues } from './validators';

/**
 * KERALA COURT VAKALATHNAMA - PROFESSIONAL VERSION 7.0
 * Features:
 * - A4 Paper, 1" Margins
 * - 14pt Body, 16pt Headings (Times New Roman)
 * - 1.5 Line Spacing
 * - Justified Alignment
 * - NO Dotted lines for names (Clean professional look)
 * - Dynamic Pluralization (I/We, me/us logic)
 */

const MARGIN = 72; // 1 inch
const BODY_SIZE = 14;
const HEADING_SIZE = 16;
const LINE_HEIGHT = BODY_SIZE * 1.5;

export async function generatePDF(data: VakalathFormValues, forcedFontSize: number = BODY_SIZE): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Filter parties
    const pets = data.parties.filter(p => p.role?.toLowerCase().includes('petitioner') || p.role?.toLowerCase().includes('plaintiff') || p.role?.toLowerCase().includes('appellant') || p.role?.toLowerCase().includes('complainant'));
    const resps = data.parties.filter(p => !pets.includes(p));

    const isPluralPets = pets.length > 1;
    const petRole = pets[0]?.role || 'Petitioner';
    const petRoleLabel = isPluralPets ? (petRole.endsWith('y') ? petRole.slice(0, -1) + 'ies' : petRole + 's') : petRole;

    const isPluralResps = resps.length > 1;
    const respRole = resps[0]?.role || 'Respondent';
    const respRoleLabel = isPluralResps ? (respRole.endsWith('y') ? respRole.slice(0, -1) + 'ies' : respRole + 's') : respRole;

    // ===========================================
    // PAGE 1: MAIN VAKALATH BODY
    // ===========================================
    const page1 = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page1.getSize();
    let y = height - MARGIN;

    // Heading & Case Details
    page1.drawText('IN THE COURT OF', { x: MARGIN, y, font: fontBold, size: HEADING_SIZE });
    const caseText = `${data.caseType} No. ${data.caseNumber || '_______'} of ${data.year}`;
    page1.drawText(caseText, { x: width - MARGIN - fontBold.widthOfTextAtSize(caseText, BODY_SIZE), y, font: fontBold, size: BODY_SIZE });
    y -= LINE_HEIGHT;
    page1.drawText(data.courtName.toUpperCase(), { x: MARGIN, y, font: fontBold, size: HEADING_SIZE });
    y -= LINE_HEIGHT * 1.5;

    // Party List (Horizontal way)
    const renderPartyParagraph = (role: string, parties: any[], currentY: number) => {
        const rolePrefix = `${role}: `;
        const namesString = parties.map((p, i) => `${i + 1}. ${p.name}${p.age ? ' (' + p.age + ')' : ''}`).join('; ');
        const fullText = rolePrefix + namesString;

        const partyWords = fullText.split(' ');
        let partyLine = '';
        let localY = currentY;
        for (const word of partyWords) {
            if (font.widthOfTextAtSize(partyLine + word, 12) < maxWidth) partyLine += word + ' ';
            else {
                page1.drawText(partyLine.trim(), { x: MARGIN, y: localY, font: (partyLine.startsWith(rolePrefix) ? fontBold : font), size: 12 });
                localY -= 14;
                partyLine = word + ' ';
            }
        }
        page1.drawText(partyLine.trim(), { x: MARGIN, y: localY, font, size: 12 });
        return localY - 14;
    };

    y = renderPartyParagraph(petRoleLabel, pets, y);
    y -= 5;
    page1.drawText('Vs.', { x: width / 2 - 10, y, font: fontBold, size: 12 });
    y -= 14;
    y = renderPartyParagraph(respRoleLabel, resps, y);
    y -= LINE_HEIGHT;

    // VAKALATHNAMA Title
    const title = 'VAKALATHNAMA';
    page1.drawText(title, { x: (width - fontBold.widthOfTextAtSize(title, HEADING_SIZE)) / 2, y, font: fontBold, size: HEADING_SIZE });
    y -= LINE_HEIGHT;

    // Appoint Line
    const pronoun = isPluralPets ? 'We' : 'I';
    const objectPronoun = isPluralPets ? 'us' : 'me';
    const appointLabel = `do hereby appoint and retain`;
    page1.drawText(appointLabel, { x: (width - fontBold.widthOfTextAtSize(appointLabel, BODY_SIZE)) / 2, y, font: fontBold, size: BODY_SIZE });
    y -= LINE_HEIGHT;

    // Advocate Name in Appoint
    const advName = data.advocateName.toUpperCase();
    page1.drawText(advName, { x: (width - font.widthOfTextAtSize(advName, BODY_SIZE)) / 2, y, font, size: BODY_SIZE });
    y -= LINE_HEIGHT * 1.5;

    // Legal Paragraph with dynamic logic
    const legalText = `Advocate to appear for ${objectPronoun} in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed there in ${pronoun.toLowerCase()} empower the said Advocate/s to compromise any suit or proceeding on ${isPluralPets ? 'our' : 'my'} behalf and to appear in all miscellaneous proceeding in the above suit or matter till all decreases or order are fully, satisfied or adjusted and to produce in court ${isPluralPets ? 'our' : 'my'} money document or valuable security on ${isPluralPets ? 'our' : 'my'} behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to ${objectPronoun} in the above suit or matter and ${pronoun} do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on ${isPluralPets ? 'our' : 'my'} behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and ${pronoun.toLowerCase()} do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on ${objectPronoun} done by ${objectPronoun} in person.`;

    const maxWidth = width - MARGIN * 2;
    const words = legalText.split(' ');
    let line = '';
    const lines = [];
    for (const word of words) {
        if (font.widthOfTextAtSize(line + word, BODY_SIZE) < maxWidth) line += word + ' ';
        else { lines.push(line.trim()); line = word + ' '; }
    }
    lines.push(line.trim());

    lines.forEach((l, idx) => {
        const isLastLine = idx === lines.length - 1;
        if (isLastLine) {
            page1.drawText(l, { x: MARGIN, y, font, size: BODY_SIZE });
        } else {
            // Justification: spread spaces
            const lineWords = l.split(' ');
            if (lineWords.length > 1) {
                const totalTextWidth = font.widthOfTextAtSize(l.replace(/\s/g, ''), BODY_SIZE);
                const totalSpaceWidth = maxWidth - totalTextWidth;
                const spaceWidth = totalSpaceWidth / (lineWords.length - 1);

                let currentX = MARGIN;
                for (let i = 0; i < lineWords.length; i++) {
                    page1.drawText(lineWords[i], { x: currentX, y, font, size: BODY_SIZE });
                    currentX += font.widthOfTextAtSize(lineWords[i], BODY_SIZE) + spaceWidth;
                }
            } else {
                page1.drawText(l, { x: MARGIN, y, font, size: BODY_SIZE });
            }
        }
        y -= LINE_HEIGHT;
    });

    y -= LINE_HEIGHT;
    const today = new Date();
    page1.drawText(`Signed this the ${today.getDate()}th day of ${today.toLocaleString('en-IN', { month: 'long' })}, ${today.getFullYear()}.`, { x: MARGIN, y, font, size: BODY_SIZE });

    y -= LINE_HEIGHT * 2;
    page1.drawText('Witnesses:', { x: MARGIN, y, font: fontBold, size: BODY_SIZE });
    page1.drawText(`${petRoleLabel}:`, { x: width - MARGIN - 100, y, font: fontBold, size: BODY_SIZE });
    y -= LINE_HEIGHT;

    const witnessLines = data.witnesses.split('\n');
    witnessLines.forEach((w, i) => {
        page1.drawText(`${i + 1}. ${w}`, { x: MARGIN, y, font, size: BODY_SIZE });
        y -= LINE_HEIGHT;
    });

    page1.drawText('Signature: ........................', { x: width - MARGIN - 150, y, font, size: BODY_SIZE });

    // ===========================================
    // PAGE 2: DOCKET (RIGHT HALF)
    // ===========================================
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    const docketX = width / 2 + 20;
    const docketWidth = width / 2 - MARGIN;
    const dCenter = width / 2 + width / 4;
    let y2 = height - MARGIN;

    page2.drawText(`Filed on: ${today.toLocaleDateString('en-IN')}`, { x: docketX, y: y2, font, size: 12 });
    y2 -= LINE_HEIGHT * 2;

    const btc = 'BEFORE THE COURT OF';
    page2.drawText(btc, { x: dCenter - fontBold.widthOfTextAtSize(btc, 16) / 2, y: y2, font: fontBold, size: 16 });
    y2 -= LINE_HEIGHT;
    page2.drawText(data.courtName.toUpperCase(), { x: dCenter - fontBold.widthOfTextAtSize(data.courtName.toUpperCase(), 16) / 2, y: y2, font: fontBold, size: 16 });
    y2 -= LINE_HEIGHT * 2;

    const caseId = `${data.caseType} No. ${data.caseNumber || '_______'} / ${data.year}`;
    page2.drawText(caseId, { x: dCenter - fontBold.widthOfTextAtSize(caseId, 16) / 2, y: y2, font: fontBold, size: 16 });
    y2 -= LINE_HEIGHT * 3;

    page2.drawText(`${pets[0]?.name}${pets.length > 1 ? ' & Others' : ''}`, { x: dCenter - font.widthOfTextAtSize(`${pets[0]?.name}${pets.length > 1 ? ' & Others' : ''}`, 14) / 2, y: y2, font, size: 14 });
    y2 -= 20;
    page2.drawText(`... ${petRoleLabel}`, { x: dCenter + 20, y: y2, font: fontBold, size: 12 });
    y2 -= LINE_HEIGHT * 2;
    page2.drawText('Vs.', { x: dCenter - 5, y: y2, font: fontBold, size: 12 });
    y2 -= LINE_HEIGHT * 2;
    page2.drawText(`${resps[0]?.name}${resps.length > 1 ? ' & Others' : ''}`, { x: dCenter - font.widthOfTextAtSize(`${resps[0]?.name}${resps.length > 1 ? ' & Others' : ''}`, 14) / 2, y: y2, font, size: 14 });
    y2 -= 20;
    page2.drawText(`... ${respRoleLabel}`, { x: dCenter + 20, y: y2, font: fontBold, size: 12 });

    y2 -= LINE_HEIGHT * 4;
    const vnTitle = 'VAKALATHNAMA';
    page2.drawText(vnTitle, { x: dCenter - fontBold.widthOfTextAtSize(vnTitle, 20) / 2, y: y2, font: fontBold, size: 20 });
    y2 -= LINE_HEIGHT * 4;

    page2.drawText('Accepted', { x: width - MARGIN - 80, y: y2, font, size: 14 });
    y2 -= 60;
    page2.drawText('ADVOCATE', { x: dCenter - 40, y: y2, font: fontBold, size: 16 });
    y2 -= 20;
    page2.drawText(data.advocateName.toUpperCase(), { x: dCenter - fontBold.widthOfTextAtSize(data.advocateName.toUpperCase(), 14) / 2, y: y2, font: fontBold, size: 14 });

    return await pdfDoc.save();
}

export async function generateDOCX(data: VakalathFormValues): Promise<Blob> {
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1 inch = 1440 twips
                    size: { width: 11906, height: 16838 } // A4
                }
            },
            children: [
                new Paragraph({ children: [new TextRun({ text: "IN THE COURT OF", bold: true, size: 32 })] }), // 32 half-points = 16pt
                new Paragraph({ children: [new TextRun({ text: data.courtName.toUpperCase(), bold: true, size: 32 })] }),
                new Paragraph({ text: "" }),
                new Paragraph({ text: `${data.caseType} No. ${data.caseNumber} of ${data.year}`, alignment: AlignmentType.RIGHT }),
            ]
        }]
    });
    return Packer.toBlob(doc);
}
