/**
 * Word-like Document Editor
 * 
 * Full contentEditable document with Microsoft Word-style toolbar
 */

import { useState, useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Undo,
    Redo,
    Save,
    Type,
    Printer,
    Download,
    ZoomIn,
    ZoomOut,
    Palette,
    Maximize2,
} from 'lucide-react';

interface WordEditorProps {
    initialContent: string;
    onSave: (content: string) => Promise<boolean> | boolean;
    onDownloadPDF: () => void;
    onDownloadDOCX: () => void;
}

export default function WordEditor({
    initialContent,
    onSave,
    onDownloadPDF,
    onDownloadDOCX,
}: WordEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState(initialContent);
    const [fontSize, setFontSize] = useState('14');
    const [fontFamily, setFontFamily] = useState('Times New Roman');
    const [hasChanges, setHasChanges] = useState(false);

    // New formatting options
    const [lineSpacing, setLineSpacing] = useState('1.5');
    const [margins, setMargins] = useState({
        top: '1.5in',
        bottom: '1.5in',
        left: '1.75in',
        right: '1.0in'
    });
    const [zoom, setZoom] = useState(100);
    const [textColor, setTextColor] = useState('#000000');

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
            editorRef.current.innerHTML = initialContent;
        }
    }, [initialContent]);

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleContentChange();
    };

    const handleContentChange = () => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        onSave(content);
        setHasChanges(false);
    };

    const handleFontSizeChange = (size: string) => {
        setFontSize(size);
        execCommand('fontSize', '7'); // Use size 7 and override with CSS
        const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
        fontElements?.forEach((el) => {
            (el as HTMLElement).style.fontSize = size + 'pt';
            el.removeAttribute('size');
        });
    };

    const handleFontFamilyChange = (family: string) => {
        setFontFamily(family);
        execCommand('fontName', family);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                execCommand('bold');
            }
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                execCommand('italic');
            }
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                execCommand('underline');
            }
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                execCommand('undo');
            }
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                execCommand('redo');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Toolbar - Word-like */}
            <div className="bg-white border-b border-gray-300 shadow-sm sticky top-0 z-50">
                {/* Top Row - File Actions */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-4 py-2 rounded ${hasChanges
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-600'
                                }`}
                            title="Save (Ctrl+S)"
                        >
                            <Save className="w-4 h-4" />
                            {hasChanges ? 'Save' : 'Saved'}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDownloadPDF}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <Download className="w-4 h-4" />
                            PDF
                        </button>
                        <button
                            onClick={onDownloadDOCX}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <Download className="w-4 h-4" />
                            DOCX
                        </button>
                    </div>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
                    {/* Undo/Redo */}
                    <button
                        onClick={() => execCommand('undo')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('redo')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Font Family */}
                    <select
                        value={fontFamily}
                        onChange={(e) => handleFontFamilyChange(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        style={{ fontFamily }}
                    >
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Arial">Arial</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Courier New">Courier New</option>
                    </select>

                    {/* Font Size */}
                    <select
                        value={fontSize}
                        onChange={(e) => handleFontSizeChange(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
                    >
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                    </select>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Text Formatting */}
                    <button
                        onClick={() => execCommand('bold')}
                        className="p-2 hover:bg-gray-100 rounded font-bold"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('italic')}
                        className="p-2 hover:bg-gray-100 rounded italic"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('underline')}
                        className="p-2 hover:bg-gray-100 rounded underline"
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Alignment */}
                    <button
                        onClick={() => execCommand('justifyLeft')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('justifyCenter')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('justifyRight')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('justifyFull')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Justify"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Lists */}
                    <button
                        onClick={() => execCommand('insertUnorderedList')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => execCommand('insertOrderedList')}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>
                </div>

                {/* New Row - Page Formatting */}
                <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-200 flex-wrap bg-gray-50">
                    {/* Line Spacing */}
                    <div className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-600">Line:</span>
                        <select
                            value={lineSpacing}
                            onChange={(e) => setLineSpacing(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-xs w-16"
                            title="Line Spacing"
                        >
                            <option value="1.0">1.0</option>
                            <option value="1.15">1.15</option>
                            <option value="1.5">1.5</option>
                            <option value="2.0">2.0</option>
                            <option value="2.5">2.5</option>
                            <option value="3.0">3.0</option>
                        </select>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Margins */}
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600 font-medium">Margins (in):</span>
                        <div className="flex gap-1">
                            <input
                                type="number"
                                value={parseFloat(margins.top)}
                                onChange={(e) => setMargins({ ...margins, top: e.target.value + 'in' })}
                                className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                                step="0.1"
                                min="0.5"
                                max="3"
                                title="Top Margin"
                                placeholder="T"
                            />
                            <input
                                type="number"
                                value={parseFloat(margins.bottom)}
                                onChange={(e) => setMargins({ ...margins, bottom: e.target.value + 'in' })}
                                className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                                step="0.1"
                                min="0.5"
                                max="3"
                                title="Bottom Margin"
                                placeholder="B"
                            />
                            <input
                                type="number"
                                value={parseFloat(margins.left)}
                                onChange={(e) => setMargins({ ...margins, left: e.target.value + 'in' })}
                                className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                                step="0.1"
                                min="0.5"
                                max="3"
                                title="Left Margin"
                                placeholder="L"
                            />
                            <input
                                type="number"
                                value={parseFloat(margins.right)}
                                onChange={(e) => setMargins({ ...margins, right: e.target.value + 'in' })}
                                className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                                step="0.1"
                                min="0.5"
                                max="3"
                                title="Right Margin"
                                placeholder="R"
                            />
                        </div>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Zoom */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setZoom(Math.max(50, zoom - 10))}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
                        <button
                            onClick={() => setZoom(Math.min(200, zoom + 10))}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    {/* Text Color */}
                    <div className="flex items-center gap-1">
                        <Palette className="w-4 h-4 text-gray-600" />
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => {
                                setTextColor(e.target.value);
                                execCommand('foreColor', e.target.value);
                            }}
                            className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                            title="Text Color"
                        />
                    </div>
                </div>
            </div>

            {/* Editor Content - Word-like Page */}
            <div className="flex-1 overflow-auto p-8 bg-gray-100">
                <div
                    className="max-w-[8.5in] mx-auto bg-white shadow-lg transition-transform"
                    style={{ transform: `scale(${zoom / 100})` }}
                >
                    {/* A4 Paper */}
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContentChange}
                        className="min-h-[11in] outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                            fontFamily: 'Times New Roman',
                            fontSize: '14pt',
                            lineHeight: lineSpacing,
                            textAlign: 'justify',
                            paddingTop: margins.top,
                            paddingBottom: margins.bottom,
                            paddingLeft: margins.left,
                            paddingRight: margins.right,
                        }}
                        spellCheck={true}
                    />
                </div>
            </div>
        </div>
    );
}
