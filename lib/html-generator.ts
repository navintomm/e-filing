/**
 * Convert Vakalath form data into formatted HTML for Word-like editor
 * PROFESSIONAL VERSION 7.0
 */

import { VakalathFormValues } from './validators';

export function generateEditableHTML(data: VakalathFormValues): string {
    const pets = data.parties.filter(p => p.role?.toLowerCase().includes('petitioner') || p.role?.toLowerCase().includes('plaintiff') || p.role?.toLowerCase().includes('appellant') || p.role?.toLowerCase().includes('complainant'));
    const resps = data.parties.filter(p => !pets.includes(p));

    const isPluralPets = pets.length > 1;
    const petRole = pets[0]?.role || 'Petitioner';
    const petRoleLabel = isPluralPets ? (petRole.endsWith('y') ? petRole.slice(0, -1) + 'ies' : petRole + 's') : petRole;

    const isPluralResps = resps.length > 1;
    const respRole = resps[0]?.role || 'Respondent';
    const respRoleLabel = isPluralResps ? (respRole.endsWith('y') ? respRole.slice(0, -1) + 'ies' : respRole + 's') : respRole;

    const pronoun = isPluralPets ? 'We' : 'I';
    const objectPronoun = isPluralPets ? 'us' : 'me';
    const possessive = isPluralPets ? 'our' : 'my';

    const legalText = `Advocate to appear for ${objectPronoun} in the above suit, appeal or petition and to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application for execution of any decree or order passed there in ${pronoun.toLowerCase()} empower the said Advocate/s to compromise any suit or proceeding on ${possessive} behalf and to appear in all miscellaneous proceeding in the above suit or matter till all decrease or order are fully, satisfied or adjusted and to produce in court ${possessive} money document or valuable security on ${possessive} behalf to apply on or their return and to receive back the same, to apply or obtain copy of all documents in the record of the proceeding, to draw any moneys that may be payable to ${objectPronoun} in the above suit or matter and ${pronoun} do further empower the said advocate/s to file any appeal reference or revision on any decree or order passed in the above suit or matter and to accept on ${possessive} behalf service of notice of all or any appeal or petitions filed in any court of appeal, reference or revision with regard to the said suit or matter before the disposal of the same in the Honorable Court and ${pronoun.toLowerCase()} do hereby agree that everything lawfully done or made by the said advocate/s in the conduct of suit or matter shall be valid and binding on ${objectPronoun} done by ${objectPronoun} in person.`;

    const html = `
        <div style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.5; color: black; max-width: 800px; margin: 0 auto; padding: 1in; background: white; text-align: justify;">
            
            <!-- PAGE 1: MAIN BODY -->
            <div style="min-height: 10in; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                    <div style="font-weight: bold; font-size: 16pt;">IN THE COURT OF</div>
                    <div style="font-weight: bold; font-size: 14pt;">${data.caseType} No. ${data.caseNumber || '_______'} of ${data.year}</div>
                </div>
                <div style="font-weight: bold; font-size: 16pt; margin-bottom: 25px;">${data.courtName.toUpperCase()}</div>

                <div style="margin-bottom: 15px; text-align: left; font-size: 12pt;">
                    <span style="font-weight: bold;">${petRoleLabel}: </span>
                    ${pets.map((p, i) => `${i + 1}. ${p.name}${p.age ? ' (' + p.age + ')' : ''}`).join('; ')}
                </div>

                <div style="text-align: center; font-weight: bold; margin: 5px 0;">Vs.</div>

                <div style="margin-bottom: 25px; text-align: left; font-size: 12pt;">
                    <span style="font-weight: bold;">${respRoleLabel}: </span>
                    ${resps.map((p, i) => `${i + 1}. ${p.name}${p.age ? ' (' + p.age + ')' : ''}`).join('; ')}
                </div>

                <div style="text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 10px;">VAKALATHNAMA</div>
                
                <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px;">do hereby appoint and retain</div>
                <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 25px;">${data.advocateName.toUpperCase()}</div>

                <div style="margin-bottom: 25px;">
                    ${legalText}
                </div>

                <div style="margin-bottom: 30px;">
                    Signed this the ${new Date().getDate()}th day of ${new Date().toLocaleString('en-IN', { month: 'long' })}, ${new Date().getFullYear()}.
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <div style="font-weight: bold; margin-bottom: 10px;">Witnesses:</div>
                        ${data.witnesses.split('\n').map((w, i) => `
                            <div style="margin-bottom: 5px;">${i + 1}. ${w}</div>
                        `).join('')}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; margin-bottom: 40px;">Signature of ${petRole}:</div>
                        <div>...............................................</div>
                    </div>
                </div>
            </div>

            <!-- PAGE BREAK -->
            <hr style="border: none; border-top: 2px dashed #ccc; margin: 50px 0;"/>

            <!-- PAGE 2: DOCKET (RIGHT HALF) -->
            <div style="min-height: 10in; display: flex;">
                <div style="width: 50%;"></div>
                <div style="width: 50%; padding-left: 30px; text-align: center; border-left: 1px dashed #eee;">
                    <div style="text-align: left; margin-bottom: 30px; font-size: 12pt;">
                        Filed on: ${new Date().toLocaleDateString('en-IN')}
                    </div>

                    <div style="font-weight: bold; font-size: 16pt; margin-bottom: 20px;">
                        BEFORE THE COURT OF<br/>
                        ${data.courtName.toUpperCase()}
                    </div>

                    <div style="font-weight: bold; font-size: 14pt; margin-bottom: 30px;">
                        ${data.caseType} No. ${data.caseNumber || '_______'} / ${data.year}
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="font-weight: bold;">${pets[0]?.name}${pets.length > 1 ? ' & Others' : ''}</div>
                        <div style="font-size: 12pt; margin-top: 5px;">... ${petRoleLabel}</div>
                    </div>

                    <div style="margin-bottom: 20px; font-weight: bold;">Vs.</div>

                    <div style="margin-bottom: 30px;">
                        <div style="font-weight: bold;">${resps[0]?.name}${resps.length > 1 ? ' & Others' : ''}</div>
                        <div style="font-size: 12pt; margin-top: 5px;">... ${respRoleLabel}</div>
                    </div>

                    <div style="font-weight: bold; font-size: 20pt; margin-bottom: 40px;">VAKALATHNAMA</div>

                    <div style="text-align: right; margin-bottom: 40px; padding-right: 20px;">Accepted</div>

                    <div style="margin-top: 50px;">
                        <div style="font-size: 11pt; margin-bottom: 10px;">Address for service of summons</div>
                        <div style="font-weight: bold; font-size: 16pt;">ADVOCATE</div>
                        <div style="font-weight: bold; font-size: 14pt; margin-top: 5px;">${data.advocateName.toUpperCase()}</div>
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
