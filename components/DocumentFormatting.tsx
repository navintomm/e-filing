/**
 * Global Document Formatting Controls
 * 
 * Provides document-wide formatting options
 */

import { Type, AlignJustify, Maximize2, Undo, Redo, Save } from 'lucide-react';

interface DocumentFormattingProps {
    fontFamily: string;
    lineSpacing: number;
    canUndo: boolean;
    canRedo: boolean;
    onFontFamilyChange: (fontFamily: string) => void;
    onLineSpacingChange: (spacing: number) => void;
    onUndo: () => void;
    onRedo: () => void;
    onSave: () => void;
}

const FONT_FAMILIES = [
    'Times New Roman',
    'Arial',
    'Calibri',
    'Georgia',
    'Courier New',
    'Verdana',
];

const LINE_SPACING_OPTIONS = [
    { value: 1.0, label: 'Single' },
    { value: 1.15, label: '1.15' },
    { value: 1.5, label: '1.5' },
    { value: 2.0, label: 'Double' },
    { value: 2.5, label: '2.5' },
];

export default function DocumentFormatting({
    fontFamily,
    lineSpacing,
    canUndo,
    canRedo,
    onFontFamilyChange,
    onLineSpacingChange,
    onUndo,
    onRedo,
    onSave,
}: DocumentFormattingProps) {
    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Left Section - Undo/Redo/Save */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`p-2 rounded ${canUndo
                                ? 'hover:bg-gray-100 text-gray-700'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={onRedo}
                        disabled={!canRedo}
                        className={`p-2 rounded ${canRedo
                                ? 'hover:bg-gray-100 text-gray-700'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2" />

                    <button
                        type="button"
                        onClick={onSave}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Save Changes (Ctrl+S)"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </button>
                </div>

                {/* Middle Section - Formatting Controls */}
                <div className="flex items-center gap-4">
                    {/* Font Family */}
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-600" />
                        <select
                            value={fontFamily}
                            onChange={(e) => onFontFamilyChange(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {FONT_FAMILIES.map((font) => (
                                <option key={font} value={font} style={{ fontFamily: font }}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-px h-6 bg-gray-300" />

                    {/* Line Spacing */}
                    <div className="flex items-center gap-2">
                        <AlignJustify className="w-4 h-4 text-gray-600" />
                        <select
                            value={lineSpacing}
                            onChange={(e) => onLineSpacingChange(parseFloat(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {LINE_SPACING_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right Section - Additional Actions */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        Press Ctrl+S to save
                    </span>
                </div>
            </div>
        </div>
    );
}
