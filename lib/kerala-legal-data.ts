// Kerala Legal System Data for Dropdowns

// 14 Districts of Kerala
export const KERALA_DISTRICTS = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod',
] as const;

// Courts by District
export const COURTS_BY_DISTRICT: Record<string, string[]> = {
    'Thiruvananthapuram': [
        'High Court of Kerala',
        'District and Sessions Court, Thiruvananthapuram',
        'Munsiff Court, Thiruvananthapuram',
        'Judicial First Class Magistrate Court, Thiruvananthapuram',
        'Family Court, Thiruvananthapuram',
        'Motor Accidents Claims Tribunal, Thiruvananthapuram',
    ],
    'Kollam': [
        'District and Sessions Court, Kollam',
        'Munsiff Court, Kollam',
        'Munsiff Court, Karunagappally',
        'Judicial First Class Magistrate Court, Kollam',
        'Motor Accidents Claims Tribunal, Kollam',
    ],
    'Pathanamthitta': [
        'District and Sessions Court, Pathanamthitta',
        'Munsiff Court, Pathanamthitta',
        'Munsiff Court, Thiruvalla',
        'Judicial First Class Magistrate Court, Pathanamthitta',
        'Motor Accidents Claims Tribunal, Pathanamthitta',
    ],
    'Alappuzha': [
        'District and Sessions Court, Alappuzha',
        'Munsiff Court, Alappuzha',
        'Munsiff Court, Cherthala',
        'Munsiff Court, Mavelikkara',
        'Judicial First Class Magistrate Court, Alappuzha',
        'Family Court, Alappuzha',
        'Motor Accidents Claims Tribunal, Alappuzha',
    ],
    'Kottayam': [
        'District and Sessions Court, Kottayam',
        'Munsiff Court, Kottayam',
        'Munsiff Court, Pala',
        'Munsiff Court, Changanassery',
        'Judicial First Class Magistrate Court, Kottayam',
        'Motor Accidents Claims Tribunal, Kottayam',
    ],
    'Idukki': [
        'District and Sessions Court, Idukki',
        'Munsiff Court, Thodupuzha',
        'Munsiff Court, Munnar',
        'Judicial First Class Magistrate Court, Idukki',
        'Motor Accidents Claims Tribunal, Idukki',
    ],
    'Ernakulam': [
        'High Court of Kerala (Ernakulam Bench)',
        'District and Sessions Court, Ernakulam',
        'Munsiff Court, Ernakulam',
        'Munsiff Court, Muvattupuzha',
        'Munsiff Court, Aluva',
        'Munsiff Court, Kothamangalam',
        'Munsiff Court, Perumbavoor',
        'Judicial First Class Magistrate Court, Ernakulam',
        'Family Court, Ernakulam',
        'Motor Accidents Claims Tribunal, Ernakulam',
        'Commercial Court, Ernakulam',
    ],
    'Thrissur': [
        'District and Sessions Court, Thrissur',
        'Munsiff Court, Thrissur',
        'Munsiff Court, Irinjalakuda',
        'Munsiff Court, Chalakudy',
        'Judicial First Class Magistrate Court, Thrissur',
        'Family Court, Thrissur',
        'Motor Accidents Claims Tribunal, Thrissur',
    ],
    'Palakkad': [
        'District and Sessions Court, Palakkad',
        'Munsiff Court, Palakkad',
        'Munsiff Court, Ottappalam',
        'Munsiff Court, Chittur',
        'Munsiff Court, Mannarkkad',
        'Judicial First Class Magistrate Court, Palakkad',
        'Motor Accidents Claims Tribunal, Palakkad',
    ],
    'Malappuram': [
        'District and Sessions Court, Malappuram',
        'Munsiff Court, Malappuram',
        'Munsiff Court, Manjeri',
        'Munsiff Court, Tirur',
        'Munsiff Court, Perinthalmanna',
        'Munsiff Court, Ponnani',
        'Judicial First Class Magistrate Court, Malappuram',
        'Family Court, Malappuram',
        'Motor Accidents Claims Tribunal, Malappuram',
    ],
    'Kozhikode': [
        'District and Sessions Court, Kozhikode',
        'Munsiff Court, Kozhikode',
        'Munsiff Court, Vadakara',
        'Munsiff Court, Koyilandy',
        'Judicial First Class Magistrate Court, Kozhikode',
        'Family Court, Kozhikode',
        'Motor Accidents Claims Tribunal, Kozhikode',
    ],
    'Wayanad': [
        'District and Sessions Court, Wayanad',
        'Munsiff Court, Kalpetta',
        'Munsiff Court, Mananthavady',
        'Munsiff Court, Sultan Bathery',
        'Judicial First Class Magistrate Court, Wayanad',
        'Motor Accidents Claims Tribunal, Wayanad',
    ],
    'Kannur': [
        'District and Sessions Court, Kannur',
        'Munsiff Court, Kannur',
        'Munsiff Court, Thalassery',
        'Munsiff Court, Taliparamba',
        'Munsiff Court, Payyannur',
        'Judicial First Class Magistrate Court, Kannur',
        'Family Court, Kannur',
        'Motor Accidents Claims Tribunal, Kannur',
    ],
    'Kasaragod': [
        'District and Sessions Court, Kasaragod',
        'Munsiff Court, Kasaragod',
        'Munsiff Court, Hosdurg',
        'Judicial First Class Magistrate Court, Kasaragod',
        'Motor Accidents Claims Tribunal, Kasaragod',
    ],
};

// Case Types
export const CASE_TYPES = [
    // Civil Cases
    { value: 'O.S.', label: 'O.S. - Original Suit', category: 'Civil' },
    { value: 'O.P.', label: 'O.P. - Original Petition', category: 'Civil' },
    { value: 'A.S.', label: 'A.S. - Appeal Suit', category: 'Civil' },
    { value: 'R.S.A.', label: 'R.S.A. - Regular Second Appeal', category: 'Civil' },
    { value: 'C.R.P.', label: 'C.R.P. - Civil Revision Petition', category: 'Civil' },
    { value: 'Misc.', label: 'Misc. - Miscellaneous', category: 'Civil' },
    { value: 'E.P.', label: 'E.P. - Execution Petition', category: 'Civil' },
    { value: 'Mat. Appeal', label: 'Mat. Appeal - Matrimonial Appeal', category: 'Civil' },

    // Writ Petitions (High Court)
    { value: 'W.P.(C)', label: 'W.P.(C) - Writ Petition (Civil)', category: 'Writ' },
    { value: 'W.P.(Crl.)', label: 'W.P.(Crl.) - Writ Petition (Criminal)', category: 'Writ' },
    { value: 'W.A.', label: 'W.A. - Writ Appeal', category: 'Writ' },

    // Criminal Cases
    { value: 'Crl.A.', label: 'Crl.A. - Criminal Appeal', category: 'Criminal' },
    { value: 'Crl.Rev.P.', label: 'Crl.Rev.P. - Criminal Revision Petition', category: 'Criminal' },
    { value: 'Crl.M.C.', label: 'Crl.M.C. - Criminal Miscellaneous Case', category: 'Criminal' },
    { value: 'S.C.', label: 'S.C. - Sessions Case', category: 'Criminal' },
    { value: 'C.C.', label: 'C.C. - Criminal Case', category: 'Criminal' },

    // Special Cases
    { value: 'M.A.C.P.', label: 'M.A.C.P. - Motor Accident Claims Petition', category: 'Special' },
    { value: 'F.C.', label: 'F.C. - Family Court Case', category: 'Special' },
    { value: 'Arb.P.', label: 'Arb.P. - Arbitration Petition', category: 'Special' },
    { value: 'Com.Suit', label: 'Com.Suit - Commercial Suit', category: 'Special' },
    { value: 'L.P.A.', label: 'L.P.A. - Letters Patent Appeal', category: 'Special' },
    { value: 'C.A.', label: 'C.A. - Contempt Application', category: 'Special' },
    { value: 'T.C.', label: 'T.C. - Testamentary Case', category: 'Special' },
    { value: 'I.A.', label: 'I.A. - Interlocutory Application', category: 'Special' },
] as const;

// Document Types
export const DOCUMENT_TYPES = [
    'Vakalathnama',
    'Affidavit',
    'Petition',
    'Application',
    'Counter Affidavit',
    'Reply Affidavit',
] as const;

// Helper function to get courts for a specific district
export function getCourtsForDistrict(district: string): string[] {
    return COURTS_BY_DISTRICT[district] || [];
}

// Helper function to get case types by category
export function getCaseTypesByCategory(category?: string) {
    if (!category) return CASE_TYPES;
    return CASE_TYPES.filter(ct => ct.category === category);
}
