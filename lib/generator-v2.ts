import { PDFDocument, StandardFonts, rgb, PDFPage } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { VakalathFormValues } from './validators';

// Standard legal text - same for all documents
const STANDARD_LEGAL_TEXT = `Advocate to appear for me/us in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed therein. I/we empower the said Advocate/s to compromise any suit or proceeding on my/our behalf and to appear in all miscellaneous proceedings in the above suit or matter till all decrees or orders are fully satisfied or adjusted and to produce in court my money document or valuable security on my/our behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to me/us in the above suit or matter. I/We do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on my/our behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and I/we do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on me/us as if done by me/us in person.`;

export async function generatePDF(data: VakalathFormValues, fontSize: number = 12): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Get petitioners
    const petitioners = data.parties.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    );
    const respondents = data.parties.filter(p =>
        p.role?.toLowerCase().includes('respondent') ||
        p.role?.toLowerCase().includes('defendant') ||
        p.role?.toLowerCase().includes('opposite')
    );

    const isPluralPetitioner = petitioners.length > 1;
    const pronoun = isPluralPetitioner ? "We" : "I";
    const pronounLower = isPluralPetitioner ? "we" : "I";

    // PAGE 1 - Main Vakalath Content
    const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
    let y = 800;

    const drawText = (text: string, x: number, yPos: number, options: any = {}) => {
        page1.drawText(text, {
            size: options.size || fontSize,
            font: options.font || font,
            x,
            y: yPos,
            color: rgb(0, 0, 0),
            ...options
        });
    };

    const drawCentered = (text: string, yPos: number, options: any = {}) => {
        const textWidth = (options.font || font).widthOfTextAtSize(text, options.size || fontSize);
        drawText(text, (595.28 - textWidth) / 2, yPos, options);
    };

    // Header
    drawCentered(`IN THE COURT OF ${data.courtName}`, y, { font: fontBold, size: fontSize + 2 });
    y -= 25;
    drawCentered(data.district.toUpperCase(), y, { font: fontBold, size: fontSize + 1 });
    y -= 30;

    drawCentered(`${data.caseType} No. ${data.caseNumber || '________'} of ${data.year}`, y, { font: fontBold, size: fontSize + 1 });
    y -= 40;

    // Parties (right aligned labels)
    const maxNameWidth = 300;
    petitioners.forEach((p, i) => {
        drawText(p.name, 150, y, { font: fontBold });
        const labelX = 450;
        if (i === 0) drawText("Plaintiff", labelX, y);
        y -= 18;
    });

    drawText("", 450, y);
    y -= 5;

    respondents.forEach((p, i) => {
        drawText(p.name, 150, y, { font: fontBold });
        if (i === 0) drawText("Defendant", 450, y);
        y -= 18;
    });

    y -= 30;

    // Opening statement with all names
    const petitionerNames = petitioners.map(p => p.name).join(', ');
    const openingLine = `${pronoun} ${petitionerNames} ${isPluralPetitioner ? 'residents' : 'resident'} of:`;
    drawText(openingLine, 50, y);
    y -= 20;

    // Details with proper wrapping
    petitioners.forEach((p, index) => {
        const detail = `${index + 1}. ${p.name}, ${p.age ? `aged ${p.age},` : ''} ${p.fatherOrHusbandName ? `${p.fatherOrHusbandName},` : ''} residing at ${p.address || '...'}`;
        const lines = wrapText(detail, 500, font, fontSize);
        lines.forEach(line => {
            drawText(line, 50, y, { size: fontSize });
            y -= 15;
        });
        y -= 5;
    });

    y -= 10;

    // "do hereby appoint and retain"
    drawText(`do hereby appoint and retain ${data.advocateName}`, 50, y, { font: fontBold });
    y -= 20;

    // Standard legal text
    const legalLines = wrapText(STANDARD_LEGAL_TEXT, 500, font, fontSize);
    legalLines.forEach(line => {
        if (y < 100) {
            y = 750; // Continue on same page if space
        }
        drawText(line, 50, y, { size: fontSize - 1 });
        y -= 14;
    });

    y -= 30;

    // Signature section
    const today = new Date();
    drawText(`Signed this the ${today.getDate()}th day of ${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`, 50, y);

    y -= 60;
    drawText("Witnesses:", 50, y, { font: fontBold });
    drawText("Known parties and signed before me", 350, y);
    y -= 15;
    drawText("Advocate", 420, y);

    y -= 30;
    drawText("1. _____________________", 50, y);
    y -= 25;
    drawText("2. _____________________", 50, y);

    y -= 40;

    // Advocate details
    drawCentered(data.advocateName.toUpperCase(), y, { font: fontBold, size: fontSize + 2 });
    y -= 20;
    drawCentered("ADVOCATE", y, { font: fontBold });
    y -= 15;
    drawCentered(`Roll No: ${data.enrollmentNumber}`, y);
    y -= 15;
    drawCentered(data.advocateAddress, y, { size: fontSize - 1 });
    y -= 15;
    drawCentered(`Mob: ${data.advocateMobile}`, y);

    // PAGE 2 - Cover/Acceptance Page
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    let y2 = 750;

    const drawText2 = (text: string, x: number, yPos: number, options: any = {}) => {
        page2.drawText(text, {
            size: options.size || fontSize,
            font: options.font || font,
            x,
            y: yPos,
            ...options
        });
    };

    const drawCentered2 = (text: string, yPos: number, options: any = {}) => {
        const textWidth = (options.font || font).widthOfTextAtSize(text, options.size || fontSize);
        drawText2(text, (595.28 - textWidth) / 2, yPos, options);
    };

    // Page 2 header
    drawText2("Filed on: __________________", 50, y2);
    y2 -= 40;

    drawCentered2(`BEFORE THE COURT OF ${data.courtName}`, y2, { font: fontBold, size: fontSize + 2 });
    y2 -= 25;
    drawCentered2(data.district.toUpperCase(), y2, { font: fontBold, size: fontSize + 1 });
    y2 -= 35;

    drawCentered2(`${data.caseType} No. ${data.caseNumber || '________'} of ${data.year}`, y2, { font: fontBold });
    y2 -= 50;

    // Parties (simple format for page 2)
    const petitionerRole = petitioners[0]?.role || 'Petitioner';
    petitioners.forEach((p, i) => {
        const text = `${p.name}     -     ${petitionerRole}`;
        drawText2(text, 150, y2);
        y2 -= 20;
    });

    y2 -= 10;

    respondents.forEach((p, i) => {
        const text = `${p.name}     -     Defendant`;
        drawText2(text, 150, y2);
        y2 -= 20;
    });

    y2 -= 50;

    // Title
    const docTitle = data.documentType === "Memo of Appearance" ? "MEMO OF APPEARANCE" : "VAKALATHNAMA";
    drawCentered2(docTitle, y2, { font: fontBold, size: fontSize + 4 });
    y2 -= 30;

    drawCentered2(`on behalf of the ${petitionerRole}`, y2, { size: fontSize - 1 });

    y2 -= 100;
    drawCentered2("____________________", y2);
    y2 -= 10;
    drawCentered2("Signature", y2, { size: fontSize - 2 });

    y2 -= 60;
    drawCentered2("Accepted", y2, { font: fontBold });

    y2 -= 40;
    drawCentered2(data.advocateName, y2, { font: fontBold });
    y2 -= 15;
    drawCentered2(data.enrollmentNumber, y2, { size: fontSize - 2 });

    y2 -= 50;
    drawCentered2("Address for service of summons", y2, { font: fontBold, size: fontSize - 1 });

    y2 -= 40;
    drawCentered2("ADVOCATE", y2, { font: fontBold });

    y2 -= 40;
    drawCentered2(data.advocateName.toUpperCase(), y2, { font: fontBold, size: fontSize + 1 });
    y2 -= 15;
    drawCentered2("ADVOCATE", y2);
    y2 -= 15;
    drawCentered2(`Roll No: ${data.enrollmentNumber}`, y2, { size: fontSize - 1 });
    y2 -= 15;
    drawCentered2(data.advocateAddress, y2, { size: fontSize - 2 });
    y2 -= 15;
    drawCentered2(`Mob: ${data.advocateMobile}`, y2, { size: fontSize - 2 });

    return pdfDoc.save();
}

// Helper function for text wrapping
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

export async function generateDOCX(data: VakalathFormValues): Promise<Blob> {
    const petitioners = data.parties.filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    );

    const isPluralPetitioner = petitioners.length > 1;
    const pronoun = isPluralPetitioner ? "We" : "I";
    const petitionerNames = petitioners.map(p => p.name).join(', ');

    const doc = new Document({
        sections: [{
            properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            children: [
                new Paragraph({
                    text: `BEFORE THE COURT OF ${data.courtName.toUpperCase()}`,
                    heading: HeadingLevel.HEADING_2,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: data.district.toUpperCase(),
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: `${data.caseType} No. ${data.caseNumber || '_______'} of ${data.year}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 400 },
                }),
                new Paragraph({
                    text: `${pronoun} ${petitionerNames} do hereby appoint and retain ${data.advocateName}, Advocate, to appear for me/us in the above suit, appeal or petition...`,
                    alignment: AlignmentType.JUSTIFIED,
                }),
                // Add more paragraphs as needed
            ],
        }],
    });

    return Packer.toBlob(doc);
}
