/**
 * Editable Party List Component
 * 
 * Allows adding, removing, and editing parties in the preview
 */

import { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';

export interface EditableParty {
    id: string;
    name: string;
    role?: string;
    status?: string;
    age?: number;
    address?: string;
    pincode?: string;
}

interface EditablePartyListProps {
    parties: EditableParty[];
    onChange: (parties: EditableParty[]) => void;
    title: string;
    partyType: 'petitioner' | 'respondent';
}

export default function EditablePartyList({
    parties,
    onChange,
    title,
    partyType,
}: EditablePartyListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateParty = (id: string, field: keyof EditableParty, value: any) => {
        const updated = parties.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        onChange(updated);
    };

    const addParty = () => {
        const newParty: EditableParty = {
            id: `party-${Date.now()}`,
            name: '',
            role: partyType === 'petitioner' ? 'Petitioner' : 'Respondent',
        };
        onChange([...parties, newParty]);
        setEditingId(newParty.id);
    };

    const removeParty = (id: string) => {
        if (parties.length <= 1) {
            alert(`Cannot delete the last ${partyType}`);
            return;
        }
        const updated = parties.filter(p => p.id !== id);
        onChange(updated);
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {title}
                </h3>
                <button
                    type="button"
                    onClick={addParty}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add {partyType === 'petitioner' ? 'Petitioner' : 'Respondent'}
                </button>
            </div>

            <div className="space-y-3">
                {parties.map((party, index) => (
                    <div
                        key={party.id}
                        className="bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={party.name}
                                        onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Party name"
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={party.age || ''}
                                        onChange={(e) => updateParty(party.id, 'age', parseInt(e.target.value) || undefined)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Age"
                                    />
                                </div>

                                {/* Role/Status */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <input
                                        type="text"
                                        value={party.status || party.role || ''}
                                        onChange={(e) => updateParty(party.id, 'status', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Petitioner, Respondent"
                                    />
                                </div>

                                {/* Address */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        value={party.address || ''}
                                        onChange={(e) => updateParty(party.id, 'address', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Full address"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={() => removeParty(party.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove party"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
