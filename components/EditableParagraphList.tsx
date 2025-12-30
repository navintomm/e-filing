/**
 * Editable Paragraph List Component
 * 
 * Manages a list of paragraphs that can be added, removed, and reordered
 */

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import EditableSection from './EditableSection';

interface Paragraph {
    id: string;
    content: string;
    isBold?: boolean;
    isItalic?: boolean;
    alignment?: 'left' | 'center' | 'right' | 'justify';
    fontSize?: number;
}

interface EditableParagraphListProps {
    paragraphs: Paragraph[];
    onChange: (paragraphs: Paragraph[]) => void;
    title?: string;
}

export default function EditableParagraphList({
    paragraphs,
    onChange,
    title,
}: EditableParagraphListProps) {
    const updateParagraph = (id: string, updates: Partial<Paragraph>) => {
        const updated = paragraphs.map(p =>
            p.id === id ? { ...p, ...updates } : p
        );
        onChange(updated);
    };

    const addParagraph = (afterId?: string) => {
        const newParagraph: Paragraph = {
            id: `para-${Date.now()}`,
            content: '',
            alignment: 'justify',
            fontSize: 14,
        };

        if (afterId) {
            const index = paragraphs.findIndex(p => p.id === afterId);
            const updated = [
                ...paragraphs.slice(0, index + 1),
                newParagraph,
                ...paragraphs.slice(index + 1),
            ];
            onChange(updated);
        } else {
            onChange([...paragraphs, newParagraph]);
        }
    };

    const removeParagraph = (id: string) => {
        if (paragraphs.length <= 1) {
            alert('Cannot delete the last paragraph');
            return;
        }
        const updated = paragraphs.filter(p => p.id !== id);
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            {title && (
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        type="button"
                        onClick={() => addParagraph()}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Paragraph
                    </button>
                </div>
            )}

            {paragraphs.map((para, index) => (
                <div key={para.id} className="relative group">
                    {/* Drag Handle */}
                    <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    </div>

                    {/* Editable Section */}
                    <EditableSection
                        content={para.content}
                        onChange={(content) => updateParagraph(para.id, { content })}
                        isBold={para.isBold}
                        isItalic={para.isItalic}
                        alignment={para.alignment}
                        fontSize={para.fontSize}
                        onFormatChange={(format) => updateParagraph(para.id, format)}
                        className="min-h-[40px]"
                    />

                    {/* Action Buttons */}
                    <div className="absolute -right-20 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                            type="button"
                            onClick={() => addParagraph(para.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Insert paragraph after"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => removeParagraph(para.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete paragraph"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
