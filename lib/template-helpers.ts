import { Party } from './validators';

/**
 * Template Helper Utilities for Vakalath Document Generation
 * Handles singular/plural forms for parties, advocates, and pronouns
 */

/**
 * Get the proper plural form of a role
 * Handles irregular plurals and special cases
 */
export function getPluralForm(role: string): string {
    const lowerRole = role.toLowerCase();

    // Special irregular plurals
    const irregularPlurals: Record<string, string> = {
        'party': 'parties',
        'opposite party': 'opposite parties',
        'attorney': 'attorneys',
        'company': 'companies',
        'entity': 'entities',
    };

    if (irregularPlurals[lowerRole]) {
        // Preserve original capitalization
        const plural = irregularPlurals[lowerRole];
        return role.charAt(0) === role.charAt(0).toUpperCase()
            ? plural.charAt(0).toUpperCase() + plural.slice(1)
            : plural;
    }

    // Words ending with consonant + y → ies (party → parties)
    if (/[^aeiou]y$/i.test(role)) {
        return role.slice(0, -1) + (role.charAt(0) === role.charAt(0).toUpperCase() ? 'ies' : 'ies');
    }

    // Words ending with s, x, z, ch, sh → es
    if (/(s|x|z|ch|sh)$/i.test(role)) {
        return role + 'es';
    }

    // Default: just add 's'
    return role + 's';
}

/**
 * Get party label with proper singular/plural form
 * @param parties - Array of parties with the same role
 * @param defaultLabel - Fallback label if no parties
 * @returns Properly formatted label (e.g., "Petitioner" or "Petitioners")
 */
export function getPartyLabel(parties: Party[], defaultLabel: string): string {
    if (!parties.length) return defaultLabel;

    const role = parties[0].role;
    // Capitalize first letter
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

    return parties.length > 1 ? getPluralForm(formattedRole) : formattedRole;
}

/**
 * Get appropriate pronouns based on party count
 * @param count - Number of parties
 * @returns Object with subject, possessive, objective pronouns and verb form
 */
export function getPronouns(count: number): {
    subject: 'I' | 'We';
    possessive: 'my' | 'our';
    objective: 'me' | 'us';
    verb: 'do' | 'does';
} {
    const isPlural = count > 1;
    return {
        subject: isPlural ? 'We' : 'I',
        possessive: isPlural ? 'our' : 'my',
        objective: isPlural ? 'us' : 'me',
        verb: 'do', // Both singular and plural use 'do' in legal context
    };
}

/**
 * Parse advocate names from a comma-separated string
 * @param advocateNames - Single string that may contain multiple names
 * @returns Array of individual advocate names
 */
export function parseAdvocates(advocateNames: string): string[] {
    if (!advocateNames) return [];

    // Split by comma and clean up whitespace
    return advocateNames
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);
}

/**
 * Detect if advocate string represents multiple advocates
 * Checks for commas, "and", "&", or "Associates"
 */
export function hasMultipleAdvocates(advocateNames: string): boolean {
    if (!advocateNames) return false;

    // Check for comma-separated names
    if (advocateNames.includes(',')) return true;

    // Check for " and " between names (not part of firm name)
    const andPattern = /\b(and)\b/i;
    if (andPattern.test(advocateNames) && !advocateNames.toLowerCase().includes('associates')) {
        return true;
    }

    // Check for " & " between names (not part of firm name)
    if (advocateNames.includes(' & ') && !advocateNames.toLowerCase().includes('associates')) {
        return true;
    }

    return false;
}

/**
 * Get advocate label with proper singular/plural form
 * @param advocateNames - String containing advocate name(s)
 * @returns Object with label, prefix, and grammatical information
 */
export function getAdvocateLabel(advocateNames: string): {
    label: 'Advocate' | 'Advocates';
    labelLower: 'advocate' | 'advocates';
    prefix: 'the said Advocate' | 'the said Advocates';
    isPlural: boolean;
} {
    const isPlural = hasMultipleAdvocates(advocateNames);

    return {
        label: isPlural ? 'Advocates' : 'Advocate',
        labelLower: isPlural ? 'advocates' : 'advocate',
        prefix: isPlural ? 'the said Advocates' : 'the said Advocate',
        isPlural,
    };
}

/**
 * Format advocate names for display in documents
 * Handles multiple advocates gracefully
 * @param advocateNames - Raw advocate name string
 * @returns Formatted string for document display
 */
export function formatAdvocateNames(advocateNames: string): string {
    if (!advocateNames) return '';

    const advocates = parseAdvocates(advocateNames);

    if (advocates.length === 0) return '';
    if (advocates.length === 1) return advocates[0];
    if (advocates.length === 2) return `${advocates[0]} and ${advocates[1]}`;

    // For 3 or more advocates: "A, B, and C"
    const lastAdvocate = advocates[advocates.length - 1];
    const otherAdvocates = advocates.slice(0, -1).join(', ');
    return `${otherAdvocates}, and ${lastAdvocate}`;
}

/**
 * Get formatted party names as a comma-separated list
 * @param parties - Array of parties
 * @returns Formatted string of names
 */
export function formatPartyNames(parties: Party[]): string {
    if (!parties.length) return '';

    const names = parties.map(p => p.name);

    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;

    // For 3 or more: "A, B, and C"
    const lastName = names[names.length - 1];
    const otherNames = names.slice(0, -1).join(', ');
    return `${otherNames}, and ${lastName}`;
}

/**
 * Get grammatically correct article for advocate
 * @param advocateNames - Advocate name(s)
 * @returns 'the' or appropriate article
 */
export function getAdvocateArticle(advocateNames: string): string {
    // In legal context, typically use 'the said' or just name
    return 'the said';
}
