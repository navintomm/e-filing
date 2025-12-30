/**
 * Editable Document Section Component
 * 
 * Allows inline editing of specific sections with formatting controls
 */

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Plus, Trash2 } from 'lucide-react';

interface EditableSectionProps {
    content: string;
    onChange: (newContent: string) => void;
    className?: string;
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right' | 'justify';
    fontSize?: number;
    onFormatChange?: (format: {
        isBold?: boolean;
        isItalic?: boolean;
        alignment?: 'left' | 'center' | 'right' | 'justify';
        fontSize?: number;
    }) => void;
}

export default function EditableSection({
    content,
    onChange,
    className = '',
    isBold = false,
    isItalic = false,
    alignment = 'left',
    fontSize = 14,
    onFormatChange,
}: EditableSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localContent, setLocalContent] = useState(content);
    const [showToolbar, setShowToolbar] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    const handleBlur = () => {
        setIsEditing(false);
        setShowToolbar(false);
        if (localContent !== content) {
            onChange(localContent);
        }
    };

    const handleFocus = () => {
        setIsEditing(true);
        setShowToolbar(true);
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setLocalContent(e.currentTarget.textContent || '');
    };

    const applyFormat = (format: string) => {
        document.execCommand(format, false);
        contentRef.current?.focus();
    };

    const toggleBold = () => {
        applyFormat('bold');
        onFormatChange?.({ isBold: !isBold });
    };

    const toggleItalic = () => {
        applyFormat('italic');
        onFormatChange?.({ isItalic: !isItalic });
    };

    const changeAlignment = (newAlignment: 'left' | 'center' | 'right' | 'justify') => {
        const alignmentMap = {
            left: 'justifyLeft',
            center: 'justifyCenter',
            right: 'justifyRight',
            justify: 'justifyFull',
        };
        applyFormat(alignmentMap[newAlignment]);
        onFormatChange?.({ alignment: newAlignment });
    };

    const changeFontSize = (delta: number) => {
        const newSize = fontSize + delta;
        if (newSize >= 8 && newSize <= 72) {
            onFormatChange?.({ fontSize: newSize });
        }
    };

    const getAlignmentClass = () => {
        const alignmentMap = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        };
        return alignmentMap[alignment];
    };

    return (
        <div className="relative group">
            {/* Formatting Toolbar - Shows on hover/focus */}
            {showToolbar && (
                <div className="absolute -top-12 left-0 z-50 flex items-center gap-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                    {/* Bold */}
                    <button
                        type="button"
                        onClick={toggleBold}
                        className={`p-2 rounded hover:bg-gray-100 ${isBold ? 'bg-gray-200' : ''}`}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>

                    {/* Italic */}
                    <button
                        type="button"
                        onClick={toggleItalic}
                        className={`p-2 rounded hover:bg-gray-100 ${isItalic ? 'bg-gray-200' : ''}`}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Alignment */}
                    <button
                        type="button"
                        onClick={() => changeAlignment('left')}
                        className={`p-2 rounded hover:bg-gray-100 ${alignment === 'left' ? 'bg-gray-200' : ''}`}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => changeAlignment('center')}
                        className={`p-2 rounded hover:bg-gray-100 ${alignment === 'center' ? 'bg-gray-200' : ''}`}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => changeAlignment('right')}
                        className={`p-2 rounded hover:bg-gray-100 ${alignment === 'right' ? 'bg-gray-200' : ''}`}
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => changeAlignment('justify')}
                        className={`p-2 rounded hover:bg-gray-100 ${alignment === 'justify' ? 'bg-gray-200' : ''}`}
                        title="Justify"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Font Size */}
                    <button
                        type="button"
                        onClick={() => changeFontSize(-2)}
                        className="p-2 rounded hover:bg-gray-100"
                        title="Decrease Font Size"
                    >
                        <Type className="w-3 h-3" />
                    </button>
                    <span className="text-xs px-2">{fontSize}pt</span>
                    <button
                        type="button"
                        onClick={() => changeFontSize(2)}
                        className="p-2 rounded hover:bg-gray-100"
                        title="Increase Font Size"
                    >
                        <Type className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Editable Content */}
            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`
                    ${className}
                    ${getAlignmentClass()}
                    ${isBold ? 'font-bold' : ''}
                    ${isItalic ? 'italic' : ''}
                    ${isEditing ? 'outline outline-2 outline-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
                    cursor-text
                    px-2 py-1 rounded
                    transition-all
                `}
                style={{ fontSize: `${fontSize}pt` }}
                dangerouslySetInnerHTML={{ __html: localContent }}
            />

            {/* Edit Indicator */}
            {!isEditing && (
                <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-400">Click to edit</span>
                </div>
            )}
        </div>
    );
}
