/**
 * Kerala Courts Data
 * 
 * Complete data for Kerala districts, courts, case types, and applicant statuses.
 * Used in Basic Details Form dropdowns.
 * 
 * Based on Kerala Judicial Department structure.
 */

/**
 * All 14 Kerala Districts
 */
export const KERALA_DISTRICTS = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod"
] as const;

/**
 * Court Type
 */
export interface Court {
    name: string;
    type: 'district' | 'munsiff' | 'judicial_magistrate' | 'family' | 'motor_accident' | 'other';
    jurisdiction?: string;
}

/**
 * Courts by District
 * Comprehensive listing of all principal courts in each district
 */
export const COURT_MAP: Record<string, Court[]> = {
    "Thiruvananthapuram": [
        { name: "Principal District and Sessions Court, Thiruvananthapuram", type: "district" },
        { name: "Additional District Court I, Thiruvananthapuram", type: "district" },
        { name: "Additional District Court II, Thiruvananthapuram", type: "district" },
        { name: "Munsiff Court, Thiruvananthapuram", type: "munsiff" },
        { name: "Principal Munsiff Court, Thiruvananthapuram", type: "munsiff" },
        { name: "Family Court, Thiruvananthapuram", type: "family" },
        { name: "Motor Accident Claims Tribunal, Thiruvananthapuram", type: "motor_accident" }
    ],

    "Kollam": [
        { name: "Principal District and Sessions Court, Kollam", type: "district" },
        { name: "Additional District Court, Kollam", type: "district" },
        { name: "Munsiff Court, Kollam", type: "munsiff" },
        { name: "Principal Munsiff Court, Kollam", type: "munsiff" },
        { name: "Family Court, Kollam", type: "family" },
        { name: "Motor Accident Claims Tribunal, Kollam", type: "motor_accident" }
    ],

    "Pathanamthitta": [
        { name: "Principal District and Sessions Court, Pathanamthitta", type: "district" },
        { name: "Additional District Court, Pathanamthitta", type: "district" },
        { name: "Munsiff Court, Pathanamthitta", type: "munsiff" },
        { name: "Family Court, Pathanamthitta", type: "family" }
    ],

    "Alappuzha": [
        { name: "Principal District and Sessions Court, Alappuzha", type: "district" },
        { name: "Additional District Court, Alappuzha", type: "district" },
        { name: "Munsiff Court, Alappuzha", type: "munsiff" },
        { name: "Principal Munsiff Court, Alappuzha", type: "munsiff" },
        { name: "Family Court, Alappuzha", type: "family" },
        { name: "Motor Accident Claims Tribunal, Alappuzha", type: "motor_accident" }
    ],

    "Kottayam": [
        { name: "Principal District and Sessions Court, Kottayam", type: "district" },
        { name: "Additional District Court I, Kottayam", type: "district" },
        { name: "Additional District Court II, Kottayam", type: "district" },
        { name: "Munsiff Court, Kottayam", type: "munsiff" },
        { name: "Principal Munsiff Court, Kottayam", type: "munsiff" },
        { name: "Family Court, Kottayam", type: "family" },
        { name: "Motor Accident Claims Tribunal, Kottayam", type: "motor_accident" }
    ],

    "Idukki": [
        { name: "Principal District and Sessions Court, Idukki", type: "district" },
        { name: "Additional District Court, Idukki", type: "district" },
        { name: "Munsiff Court, Idukki", type: "munsiff" },
        { name: "Family Court, Idukki", type: "family" }
    ],

    "Ernakulam": [
        { name: "Principal District and Sessions Court, Ernakulam", type: "district" },
        { name: "Additional District Court I, Ernakulam", type: "district" },
        { name: "Additional District Court II, Ernakulam", type: "district" },
        { name: "Additional District Court III, Ernakulam", type: "district" },
        { name: "Additional District Court IV, Ernakulam", type: "district" },
        { name: "Munsiff Court, Ernakulam", type: "munsiff" },
        { name: "Principal Munsiff Court, Ernakulam", type: "munsiff" },
        { name: "Family Court I, Ernakulam", type: "family" },
        { name: "Family Court II, Ernakulam", type: "family" },
        { name: "Motor Accident Claims Tribunal I, Ernakulam", type: "motor_accident" },
        { name: "Motor Accident Claims Tribunal II, Ernakulam", type: "motor_accident" }
    ],

    "Thrissur": [
        { name: "Principal District and Sessions Court, Thrissur", type: "district" },
        { name: "Additional District Court I, Thrissur", type: "district" },
        { name: "Additional District Court II, Thrissur", type: "district" },
        { name: "Munsiff Court, Thrissur", type: "munsiff" },
        { name: "Principal Munsiff Court, Thrissur", type: "munsiff" },
        { name: "Family Court, Thrissur", type: "family" },
        { name: "Motor Accident Claims Tribunal, Thrissur", type: "motor_accident" }
    ],

    "Palakkad": [
        { name: "Principal District and Sessions Court, Palakkad", type: "district" },
        { name: "Additional District Court I, Palakkad", type: "district" },
        { name: "Additional District Court II, Palakkad", type: "district" },
        { name: "Munsiff Court, Palakkad", type: "munsiff" },
        { name: "Principal Munsiff Court, Palakkad", type: "munsiff" },
        { name: "Family Court, Palakkad", type: "family" },
        { name: "Motor Accident Claims Tribunal, Palakkad", type: "motor_accident" }
    ],

    "Malappuram": [
        { name: "Principal District and Sessions Court, Malappuram", type: "district" },
        { name: "Additional District Court I, Malappuram", type: "district" },
        { name: "Additional District Court II, Malappuram", type: "district" },
        { name: "Munsiff Court, Malappuram", type: "munsiff" },
        { name: "Principal Munsiff Court, Malappuram", type: "munsiff" },
        { name: "Family Court, Malappuram", type: "family" },
        { name: "Motor Accident Claims Tribunal, Malappuram", type: "motor_accident" }
    ],

    "Kozhikode": [
        { name: "Principal District and Sessions Court, Kozhikode", type: "district" },
        { name: "Additional District Court I, Kozhikode", type: "district" },
        { name: "Additional District Court II, Kozhikode", type: "district" },
        { name: "Additional District Court III, Kozhikode", type: "district" },
        { name: "Munsiff Court, Kozhikode", type: "munsiff" },
        { name: "Principal Munsiff Court, Kozhikode", type: "munsiff" },
        { name: "Family Court, Kozhikode", type: "family" },
        { name: "Motor Accident Claims Tribunal, Kozhikode", type: "motor_accident" }
    ],

    "Wayanad": [
        { name: "Principal District and Sessions Court, Wayanad", type: "district" },
        { name: "Additional District Court, Wayanad", type: "district" },
        { name: "Munsiff Court, Wayanad", type: "munsiff" },
        { name: "Family Court, Wayanad", type: "family" }
    ],

    "Kannur": [
        { name: "Principal District and Sessions Court, Kannur", type: "district" },
        { name: "Additional District Court I, Kannur", type: "district" },
        { name: "Additional District Court II, Kannur", type: "district" },
        { name: "Munsiff Court, Kannur", type: "munsiff" },
        { name: "Principal Munsiff Court, Kannur", type: "munsiff" },
        { name: "Family Court, Kannur", type: "family" },
        { name: "Motor Accident Claims Tribunal, Kannur", type: "motor_accident" }
    ],

    "Kasaragod": [
        { name: "Principal District and Sessions Court, Kasaragod", type: "district" },
        { name: "Additional District Court, Kasaragod", type: "district" },
        { name: "Munsiff Court, Kasaragod", type: "munsiff" },
        { name: "Family Court, Kasaragod", type: "family" }
    ]
};

/**
 * Case Type Information
 */
export interface CaseTypeInfo {
    code: string;
    name: string;
    description: string;
    applicableCourts: ('district' | 'munsiff' | 'family' | 'motor_accident')[];
}

/**
 * All Case Types in Kerala
 */
export const CASE_TYPES: CaseTypeInfo[] = [
    {
        code: "OS",
        name: "Original Suit",
        description: "Civil suits of original jurisdiction",
        applicableCourts: ["district", "munsiff"]
    },
    {
        code: "OP",
        name: "Original Petition",
        description: "Original petitions filed in civil courts",
        applicableCourts: ["district", "munsiff"]
    },
    {
        code: "CS",
        name: "Civil Suit",
        description: "General civil suits",
        applicableCourts: ["district", "munsiff"]
    },
    {
        code: "AS",
        name: "Appeal Suit",
        description: "Appeals from lower courts",
        applicableCourts: ["district"]
    },
    {
        code: "RP",
        name: "Review Petition",
        description: "Petitions for review of judgments",
        applicableCourts: ["district", "munsiff"]
    },
    {
        code: "EA",
        name: "Execution Application",
        description: "Applications for execution of decrees",
        applicableCourts: ["district", "munsiff"]
    },
    {
        code: "WP",
        name: "Writ Petition",
        description: "Writ petitions (in High Court jurisdiction)",
        applicableCourts: ["district"]
    },
    {
        code: "MC",
        name: "Miscellaneous Case",
        description: "Miscellaneous petitions and applications",
        applicableCourts: ["district", "munsiff"]
    },
    {
        code: "MCOP",
        name: "Motor Accident Claims Petition",
        description: "Claims for motor accident compensation",
        applicableCourts: ["motor_accident"]
    },
    {
        code: "FP",
        name: "Family Petition",
        description: "Family court matters",
        applicableCourts: ["family"]
    }
];

/**
 * Applicant Status Options
 */
export interface ApplicantStatusInfo {
    value: string;
    label: string;
    description: string;
    commonIn: string[];
}

export const APPLICANT_STATUS_OPTIONS: ApplicantStatusInfo[] = [
    {
        value: "plaintiff",
        label: "Plaintiff",
        description: "Party filing the suit",
        commonIn: ["OS", "CS"]
    },
    {
        value: "petitioner",
        label: "Petitioner",
        description: "Party filing the petition",
        commonIn: ["OP", "WP", "FP", "MCOP"]
    },
    {
        value: "complainant",
        label: "Complainant",
        description: "Party filing the complaint",
        commonIn: ["MC"]
    },
    {
        value: "applicant",
        label: "Applicant",
        description: "Party filing the application",
        commonIn: ["EA", "MC"]
    },
    {
        value: "defendant",
        label: "Defendant",
        description: "Party against whom suit is filed",
        commonIn: ["OS", "CS"]
    },
    {
        value: "respondent",
        label: "Respondent",
        description: "Party against whom petition is filed",
        commonIn: ["OP", "WP", "FP"]
    },
    {
        value: "opposite_party",
        label: "Opposite Party",
        description: "Party opposite to the applicant",
        commonIn: ["MCOP", "MC"]
    },
    {
        value: "other",
        label: "Other",
        description: "Other party roles",
        commonIn: []
    }
];

/**
 * Vakalath Type Options
 */
export interface VakalathTypeInfo {
    value: 'vakalathnama' | 'memo';
    label: string;
    description: string;
    requiresSignature: boolean;
}

export const VAKALATH_TYPES: VakalathTypeInfo[] = [
    {
        value: "vakalathnama",
        label: "Vakalathnama",
        description: "Full power of attorney document",
        requiresSignature: true
    },
    {
        value: "memo",
        label: "Memo of Appearance",
        description: "Limited appearance memo",
        requiresSignature: false
    }
];

/**
 * Helper Functions
 */

/**
 * Get courts for a specific district
 */
export function getCourtsForDistrict(district: string): Court[] {
    return COURT_MAP[district] || [];
}

/**
 * Get court names only (for dropdown)
 */
export function getCourtNamesForDistrict(district: string): string[] {
    return getCourtsForDistrict(district).map(court => court.name);
}

/**
 * Get case types for a specific court type
 */
export function getCaseTypesForCourt(courtType: string): CaseTypeInfo[] {
    const courtTypeKey = courtType.toLowerCase();

    return CASE_TYPES.filter(caseType =>
        caseType.applicableCourts.some(applicable =>
            courtTypeKey.includes(applicable)
        )
    );
}

/**
 * Get applicant statuses for a case type
 */
export function getApplicantStatusesForCaseType(caseType: string): ApplicantStatusInfo[] {
    return APPLICANT_STATUS_OPTIONS.filter(status =>
        status.commonIn.includes(caseType) || status.value === 'other'
    );
}

/**
 * Determine court type from court name
 */
export function getCourtType(courtName: string): string {
    if (courtName.includes("District and Sessions")) return "district";
    if (courtName.includes("Munsiff")) return "munsiff";
    if (courtName.includes("Family")) return "family";
    if (courtName.includes("Motor Accident")) return "motor_accident";
    return "other";
}

/**
 * Check if party signature is required
 */
export function isPartySignatureRequired(vakalathType: 'vakalathnama' | 'memo'): boolean {
    const type = VAKALATH_TYPES.find(t => t.value === vakalathType);
    return type?.requiresSignature || false;
}

/**
 * Get current year for dropdown
 */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}

/**
 * Get year range for dropdown (current year ± 5 years)
 */
export function getYearRange(): number[] {
    const currentYear = getCurrentYear();
    const years: number[] = [];

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push(i);
    }

    return years;
}
