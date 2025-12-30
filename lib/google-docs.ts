/**
 * Google Docs API Integration
 * 
 * This module provides programmatic document creation and formatting
 * using Google Docs API with OAuth 2.0 authentication
 */

// Load gapi from CDN - already loaded in google-drive.ts
declare global {
    interface Window {
        gapi: any;
    }
}

/**
 * Document formatting constants matching Kerala Court requirements
 */
export const COURT_FORMAT = {
    FONT_FAMILY: 'Times New Roman',
    MALAYALAM_FONT: 'Noto Serif Malayalam',
    FONT_SIZE: {
        HEADING: 16,
        BODY: 14,
        MALAYALAM_TITLE: 14,
        MALAYALAM_BODY: 12,
        SMALL: 12,
    },
    LINE_SPACING: 150, // 1.5 line spacing (percentage)
    ALIGNMENT: {
        LEFT: 'START',
        CENTER: 'CENTER',
        RIGHT: 'END',
        JUSTIFIED: 'JUSTIFIED',
    },
    PAGE_SIZE: {
        WIDTH: 595, // A4 width in points (~8.27 inches)
        HEIGHT: 842, // A4 height in points (~11.69 inches)
    },
    MARGINS: {
        TOP: 72,    // 1 inch in points
        BOTTOM: 72,
        LEFT: 72,
        RIGHT: 72,
    },
};

/**
 * Create a new Google Doc with formatted content
 */
export async function createGoogleDoc(
    title: string,
    content: {
        heading?: string;
        sections: Array<{
            title?: string;
            text: string;
            alignment?: string;
            isBold?: boolean;
            underline?: boolean;
        }>;
    },
    folderId?: string
): Promise<{ success: boolean; documentId?: string; documentUrl?: string; error?: string }> {
    try {
        if (typeof window === 'undefined') {
            return { success: false, error: 'Must run in browser' };
        }

        // Ensure user is authenticated
        const auth = window.gapi.auth2.getAuthInstance();
        if (!auth || !auth.isSignedIn.get()) {
            return { success: false, error: 'User not authenticated' };
        }

        const accessToken = auth.currentUser.get().getAuthResponse().access_token;

        // Step 1: Create the document
        const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
            }),
        });

        if (!createResponse.ok) {
            throw new Error(`Failed to create document: ${createResponse.statusText}`);
        }

        const document = await createResponse.json();
        const documentId = document.documentId;

        // Step 2: Format the document using batchUpdate
        const requests = buildFormattingRequests(content);

        const updateResponse = await fetch(
            `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requests }),
            }
        );

        if (!updateResponse.ok) {
            throw new Error(`Failed to format document: ${updateResponse.statusText}`);
        }

        // Step 3: Move to folder if specified
        if (folderId) {
            await fetch(
                `https://www.googleapis.com/drive/v3/files/${documentId}?addParents=${folderId}&fields=id,parents`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
        }

        return {
            success: true,
            documentId,
            documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
        };
    } catch (error: any) {
        console.error('Error creating Google Doc:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Build batchUpdate requests for document formatting
 */
function buildFormattingRequests(content: {
    heading?: string;
    sections: Array<{
        title?: string;
        text: string;
        alignment?: string;
        isBold?: boolean;
        underline?: boolean;
        isMalayalam?: boolean;
    }>;
}): any[] {
    const requests: any[] = [];

    // Set Page Style (A4 and 1\" Margins)
    requests.push({
        updateDocumentStyle: {
            documentStyle: {
                pageSize: {
                    width: { magnitude: COURT_FORMAT.PAGE_SIZE.WIDTH, unit: 'PT' },
                    height: { magnitude: COURT_FORMAT.PAGE_SIZE.HEIGHT, unit: 'PT' },
                },
                marginTop: { magnitude: COURT_FORMAT.MARGINS.TOP, unit: 'PT' },
                marginBottom: { magnitude: COURT_FORMAT.MARGINS.BOTTOM, unit: 'PT' },
                marginLeft: { magnitude: COURT_FORMAT.MARGINS.LEFT, unit: 'PT' },
                marginRight: { magnitude: COURT_FORMAT.MARGINS.RIGHT, unit: 'PT' },
            },
            fields: 'pageSize,marginTop,marginBottom,marginLeft,marginRight',
        },
    });

    let currentIndex = 1; // Start at index 1 (after title)

    // Insert heading if provided
    if (content.heading) {
        requests.push({
            insertText: {
                location: { index: currentIndex },
                text: content.heading + '\n\n',
            },
        });

        requests.push({
            updateParagraphStyle: {
                range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + content.heading.length,
                },
                paragraphStyle: {
                    alignment: COURT_FORMAT.ALIGNMENT.CENTER,
                },
                fields: 'alignment',
            },
        });

        requests.push({
            updateTextStyle: {
                range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + content.heading.length,
                },
                textStyle: {
                    bold: true,
                    fontSize: {
                        magnitude: COURT_FORMAT.FONT_SIZE.HEADING,
                        unit: 'PT',
                    },
                    weightedFontFamily: {
                        fontFamily: COURT_FORMAT.FONT_FAMILY,
                    },
                },
                fields: 'bold,fontSize,weightedFontFamily',
            },
        });

        currentIndex += content.heading.length + 2;
    }

    // Insert sections
    for (const section of content.sections) {
        // Section title if provided
        if (section.title) {
            requests.push({
                insertText: {
                    location: { index: currentIndex },
                    text: section.title + '\n',
                },
            });

            requests.push({
                updateTextStyle: {
                    range: {
                        startIndex: currentIndex,
                        endIndex: currentIndex + section.title.length,
                    },
                    textStyle: {
                        bold: true,
                        underline: section.underline || false,
                        fontSize: {
                            magnitude: COURT_FORMAT.FONT_SIZE.BODY,
                            unit: 'PT',
                        },
                        weightedFontFamily: {
                            fontFamily: COURT_FORMAT.FONT_FAMILY,
                        },
                    },
                    fields: 'bold,underline,fontSize,weightedFontFamily',
                },
            });

            currentIndex += section.title.length + 1;
        }

        // Section text
        requests.push({
            insertText: {
                location: { index: currentIndex },
                text: section.text + '\n\n',
            },
        });

        requests.push({
            updateParagraphStyle: {
                range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + section.text.length,
                },
                paragraphStyle: {
                    alignment: section.alignment || COURT_FORMAT.ALIGNMENT.JUSTIFIED,
                    lineSpacing: COURT_FORMAT.LINE_SPACING,
                },
                fields: 'alignment,lineSpacing',
            },
        });

        requests.push({
            updateTextStyle: {
                range: {
                    startIndex: currentIndex,
                    endIndex: currentIndex + section.text.length,
                },
                textStyle: {
                    bold: section.isBold || false,
                    underline: section.underline || false,
                    fontSize: {
                        magnitude: section.isMalayalam ? COURT_FORMAT.FONT_SIZE.MALAYALAM_BODY : COURT_FORMAT.FONT_SIZE.BODY,
                        unit: 'PT',
                    },
                    weightedFontFamily: {
                        fontFamily: section.isMalayalam ? COURT_FORMAT.MALAYALAM_FONT : COURT_FORMAT.FONT_FAMILY,
                    },
                },
                fields: 'bold,underline,fontSize,weightedFontFamily',
            },
        });

        currentIndex += section.text.length + 2;
    }

    return requests;
}

/**
 * Create or get a folder in Google Drive
 */
export async function getOrCreateFolder(
    folderName: string,
    parentFolderId?: string
): Promise<{ success: boolean; folderId?: string; error?: string }> {
    try {
        if (typeof window === 'undefined') {
            return { success: false, error: 'Must run in browser' };
        }

        const auth = window.gapi.auth2.getAuthInstance();
        if (!auth || !auth.isSignedIn.get()) {
            return { success: false, error: 'User not authenticated' };
        }

        const accessToken = auth.currentUser.get().getAuthResponse().access_token;

        // Search for existing folder
        let searchQuery = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
        if (parentFolderId) {
            searchQuery += ` and '${parentFolderId}' in parents`;
        }

        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name)`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        const searchData = await searchResponse.json();

        // Return existing folder if found
        if (searchData.files && searchData.files.length > 0) {
            return { success: true, folderId: searchData.files[0].id };
        }

        // Create new folder
        const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: parentFolderId ? [parentFolderId] : undefined,
            }),
        });

        const folder = await createResponse.json();
        return { success: true, folderId: folder.id };
    } catch (error: any) {
        console.error('Error with folder:', error);
        return { success: false, error: error.message };
    }
}
