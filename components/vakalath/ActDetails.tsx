import { useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { VakalathFormValues } from "@/lib/validators";
import { Plus, Trash2 } from "lucide-react";
import { FormInput } from "@/components/FormInput";
import { FormCombobox } from "@/components/FormSelect";
import { ACTS } from "@/lib/constants";

interface ActDetailsProps {
    control: Control<VakalathFormValues>;
    register: UseFormRegister<VakalathFormValues>;
    errors: FieldErrors<VakalathFormValues>;
}

export function ActDetails({ control, register, errors }: ActDetailsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "acts",
    });

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Act & Section</h3>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Add New Act</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">
                            Act <span className="text-red-500">*</span>
                        </label>
                        {/* Note: This is a bit tricky with react-hook-form array. 
                            Ideally, we have a separate "new act" state, then "add" triggers append.
                            But for simplicity here, I'll just add a button that appends an empty row 
                            and the user fills it in the list below. 
                            OR better: The 'top' form is a dummy form or a tracked state that gets pushed.
                            
                            Let's follow the image design: "Add New Act" inputs, then "Save" button to add to list.
                        */}
                        <p className="text-xs text-gray-500 mb-2">Click "Add Act" to create an entry.</p>
                    </div>
                    <div className="md:col-span-12">
                        <button
                            type="button"
                            onClick={() => append({ actName: "", section: "" })}
                            className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                            <Plus className="-ml-0.5 mr-2 h-4 w-4" />
                            Add Act
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">List of Acts & Sections</h4>
                {fields.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">No acts added yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormCombobox
                                        label="Act"
                                        name={`acts.${index}.actName`}
                                        register={register}
                                        error={errors.acts?.[index]?.actName}
                                        options={ACTS}
                                        placeholder="Select Act"
                                    />
                                    <FormInput
                                        label="Section"
                                        name={`acts.${index}.section`}
                                        register={register}
                                        error={errors.acts?.[index]?.section}
                                        placeholder="Section details"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="mt-8 text-red-600 hover:text-red-800 p-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
