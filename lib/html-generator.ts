/**
 * KERALA COURT VAKALATHNAMA - HTML PREVIEW GENERATOR
 * 
 * Generates HTML preview that matches the PDF output from generator.ts
 * Updated to match strict Kerala template format
 */

import { VakalathFormValues } from './vakalath-validators';

// Standard legal authorization text - MUST MATCH PDF
const STANDARD_LEGAL_TEXT = `Advocate to appear for me/us in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed there in I/we empower the said Advocate/s to compromise any suit or proceeding on my/ our behalf and to appear in all miscellaneous proceeding in the above suit or matter till all decreases or order are fully, satisfied or adjusted and to produce in court my money document or valuable security on my/our behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to me/us in the above suit or matter and I/We do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on my/ our behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and I/we do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on me/us done by me/us in person`;

function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function generateEditableHTML(data: VakalathFormValues): string {
    // Separate parties
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

    // Build I/We declaration
    const firstPet = petitioners[0];
    let declaration = '';
    if (firstPet) {
        declaration = `${pronoun} `;
        petitioners.forEach((p, i) => {
            if (i > 0) declaration += ', ';
            declaration += p.name;
            if (p.age) declaration += ` aged ${p.age}`;
            if (p.fatherOrHusbandName) declaration += ` ${p.fatherOrHusbandName}`;
        });
        if (firstPet.address) {
            declaration += ` ${isPluralPetitioner ? 'residents' : 'resident'} at ${firstPet.address}`;
        }
        if (firstPet.pincode) declaration += ` PIN ${firstPet.pincode}`;
        // Note: Mobile removed as per user request
    }

    // Current date
    const today = new Date();
    const dateStr = `${today.getDate()}${getOrdinalSuffix(today.getDate())} day of ${today.toLocaleString('en-US', { month: 'long' })} ${today.getFullYear()}`;

    // Prepare witnesses with conditional numbering
    const witnessLines = data.witnesses.split('\n').filter(w => w.trim());
    const witnessesHTML = witnessLines.map((w, i) => {
        const witnessText = witnessLines.length > 1 ? `${i + 1}. ${w}` : w;
        return `<div style="margin-bottom: 8px;">${witnessText}</div>`;
    }).join('');

    const html = `
        <div style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.6; color: black; max-width: 8.5in; margin: 0 auto; padding: 0.7in; background: white;">
            
            <!-- PAGE 1: FULL PAGE VAKALATH BODY -->
            <div style="min-height: 10in; position: relative;">
                
                <!-- Header -->
                <div style="text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 5px;">
                    BEFORE THE HONOURABLE
                </div>
                <div style="text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 20px;">
                    ${data.courtName.toUpperCase()}
                </div>
                <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 30px;">
                    ${data.caseType} No. ${data.caseNumber || '___'} of ${data.year}
                </div>

                <!-- Party Roles (Right Side) and Party Names (Left Side) -->
                <div style="position: relative; margin-bottom: 30px;">
                    <!-- Party roles on right -->
                    <div style="position: absolute; right: 0; top: 0; text-align: right; font-size: 14pt;">
                        <div style="font-weight: bold; text-decoration: underline; margin-bottom: 10px;">${petitionerRole}</div>
                        <div style="font-weight: bold; text-decoration: underline; margin-top: 20px;">${respondentRole}</div>
                    </div>
                    
                    <!-- Party names on left -->
                    <div style="padding-left: 70px; font-size: 14pt;">
                        ${petitioners.map((p, i) => {
        const nameText = petitioners.length > 1 ? `${i + 1}) ${p.name}` : p.name;
        return `<div style="margin-bottom: 8px;">${nameText} <span style="margin-left: 100px;">—</span></div>`;
    }).join('\n')}
                        
                        <div style="margin: 15px 0;"></div>
                        
                        ${respondents.map((p, i) => {
        const nameText = respondents.length > 1 ? `${i + 1}) ${p.name}` : p.name;
        return `<div style="margin-bottom: 8px;">${nameText} <span style="margin-left: 100px;">—</span></div>`;
    }).join('\n')}
                    </div>
                </div>

                <!-- I/We Declaration with dotted underline -->
                <div style="margin: 25px 0; font-size: 14pt; border-bottom: 2px dotted #666; padding-bottom: 5px;">
                    ${declaration}
                </div>

                <!-- "do hereby appoint and retain" -->
                <div style="text-align: center; font-size: 14pt; margin: 20px 0;">
                    do hereby appoint and retain
                </div>

                <!-- Advocate name centered -->
                <div style="text-align: center; font-size: 14pt; font-weight: normal; margin-bottom: 25px;">
                    ${data.advocateName}
                </div>

                <!-- Standard legal text -->
                <div style="text-align: justify; font-size: 14pt; line-height: 1.5; margin-bottom: 25px;">
                    ${STANDARD_LEGAL_TEXT}
                </div>

                <!-- Date -->
                <div style="margin: 20px 0; font-size: 14pt;">
                    Signed this the ${dateStr}
                </div>

                <!-- Signature section (Two columns) -->
                <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 14pt;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; margin-bottom: 15px;">Witnesses:</div>
                        ${witnessesHTML}
                    </div>
                    <div style="flex: 1; text-align: right; font-size: 14pt;">
                        <div>Known parties and signed before me</div>
                        <div style="margin-top: 10px;">Advocate</div>
                    </div>
                </div>
            </div>

            <!-- PAGE BREAK -->
            <div style="page-break-after: always; border-top: 2px dashed #ccc; margin: 50px 0;"></div>

            <!-- PAGE 2: DOCKET (RIGHT HALF ONLY) -->
            <div style="min-height: 10in; display: flex;">
                <!-- Left half - BLANK -->
                <div style="width: 50%; border-right: 1px dashed #eee;"></div>
                
                <!-- Right half - DOCKET -->
                <div style="width: 50%; padding-left: 80px; padding-right: 20px; padding-top: 80px;">
                    <!-- Filed on -->
                    <div style="text-align: left; margin-bottom: 60px; font-size: 14pt;">
                        Filed on: _____________
                    </div>

                    <!-- Court header -->
                    <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 20px;">
                        BEFORE THE HONOURABLE
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 30px;">
                        ${data.courtName.toUpperCase()}
                    </div>

                    <!-- Case number -->
                    <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 35px;">
                        ${data.caseType} No. ${data.caseNumber || '___'} of ${data.year}
                    </div>

                    <!-- Parties -->
                    <div style="text-align: center; font-size: 14pt; margin-bottom: 10px;">
                        ${petitioners.slice(0, 2).map(p =>
        `<div style="margin-bottom: 8px;">${p.name} — ${petitionerRole}</div>`
    ).join('')}
                        ${petitioners.length > 2 ? `<div style="font-size: 12pt;">& ${petitioners.length - 1} Others</div>` : ''}
                    </div>

                    <div style="margin: 15px 0;"></div>

                    <div style="text-align: center; font-size: 14pt; margin-bottom: 35px;">
                        ${respondents.slice(0, 2).map(r =>
        `<div style="margin-bottom: 8px;">${r.name} — ${respondentRole}</div>`
    ).join('')}
                        ${respondents.length > 2 ? `<div style="font-size: 12pt;">& ${respondents.length - 1} Others</div>` : ''}
                    </div>

                    <!-- VAKALATHNAMA title -->
                    <div style="text-align: center; font-weight: bold; font-size: 18pt; margin: 35px 0 25px 0;">
                        VAKALATHNAMA
                    </div>

                    <!-- on behalf of -->
                    <div style="text-align: center; font-size: 14pt; margin-bottom: 60px;">
                        on behalf of the ${petitionerRole}
                    </div>

                    <!-- Signature line -->
                    <div style="text-align: center; margin-bottom: 15px;">
                        ____________________
                    </div>

                    <!-- Accepted -->
                    <div style="text-align: center; font-size: 14pt; margin-bottom: 25px;">
                        Accepted
                    </div>

                    <!-- Advocate name -->
                    <div style="text-align: center; font-size: 14pt; margin-bottom: 15px;">
                        ${data.advocateName}
                    </div>

                    <!-- Enrollment -->
                    <div style="text-align: center; font-size: 12pt; margin-bottom: 25px;">
                        ${data.enrollmentNumber}
                    </div>

                    <!-- Address for service -->
                    <div style="text-align: center; font-size: 12pt; margin-bottom: 25px;">
                        Address for service of summons
                    </div>

                    <!-- ADVOCATE footer -->
                    <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-top: 20px;">
                        ADVOCATE
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

/**
 * Extract plain text content from HTML (for saving/processing)
 */
export function extractHTMLContent(html: string): string {
    if (typeof window !== 'undefined') {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }
    return html;
}
