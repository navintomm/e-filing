import { useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { VakalathFormValues } from "@/lib/vakalath-validators";
import { Plus, Trash2, User } from "lucide-react";
import { FormInput } from "@/components/FormInput";
import { APP_STATUS } from "@/lib/constants";

interface PartyDetailsProps {
    control: Control<VakalathFormValues>;
    register: UseFormRegister<VakalathFormValues>;
    errors: FieldErrors<VakalathFormValues>;
}

export function PartyDetails({ control, register, errors }: PartyDetailsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "parties",
    });

    const addParty = (role: string) => {
        append({
            role,
            name: "",
            age: "",
            fatherOrHusbandName: "",
            address: "",
            pincode: "",
            mobile: "",
            email: "",
        });
    };

    const petitioners = fields.map((field, index) => ({ ...field, originalIndex: index })).filter(p =>
        p.role?.toLowerCase().includes('petitioner') ||
        p.role?.toLowerCase().includes('plaintiff') ||
        p.role?.toLowerCase().includes('complainant') ||
        p.role?.toLowerCase().includes('applicant')
    );
    const respondents = fields.map((field, index) => ({ ...field, originalIndex: index })).filter(p =>
        p.role?.toLowerCase().includes('respondent') ||
        p.role?.toLowerCase().includes('defendant') ||
        p.role?.toLowerCase().includes('opposite')
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Manage Parties</h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => addParty("Petitioner")}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                        <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
                        Add Our Client
                    </button>
                    <button
                        type="button"
                        onClick={() => addParty("Respondent")}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
                        Add Other Party
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Petitioners List */}
                <div className="border rounded-lg bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-4 h-4 mr-2" /> Our Clients
                    </h4>
                    {petitioners.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">No clients added yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {petitioners.map((field) => (
                                <div key={field.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative group">
                                    <button
                                        type="button"
                                        onClick={() => remove(field.originalIndex)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 gap-y-3">
                                        <div>
                                            <label htmlFor={`parties.${field.originalIndex}.role`} className="block text-sm font-medium leading-6 text-gray-900">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`parties.${field.originalIndex}.role`}
                                                {...register(`parties.${field.originalIndex}.role`)}
                                                className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            >
                                                <option value="">Select Status</option>
                                                {APP_STATUS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.parties?.[field.originalIndex]?.role && (
                                                <p className="mt-1 text-sm text-red-600">{errors.parties?.[field.originalIndex]?.role?.message}</p>
                                            )}
                                        </div>
                                        <FormInput
                                            label="Name"
                                            name={`parties.${field.originalIndex}.name`}
                                            register={register}
                                            error={errors.parties?.[field.originalIndex]?.name}
                                            placeholder="Client Name"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <FormInput
                                                label="Age"
                                                name={`parties.${field.originalIndex}.age`}
                                                register={register}
                                                error={errors.parties?.[field.originalIndex]?.age}
                                                placeholder="Age"
                                            />
                                            <FormInput
                                                label="Mobile"
                                                name={`parties.${field.originalIndex}.mobile`}
                                                register={register}
                                                error={errors.parties?.[field.originalIndex]?.mobile}
                                                placeholder="Mobile"
                                            />
                                        </div>
                                        <FormInput
                                            label="Address"
                                            name={`parties.${field.originalIndex}.address`}
                                            register={register}
                                            error={errors.parties?.[field.originalIndex]?.address}
                                            placeholder="Address"
                                            textarea
                                        />
                                        <FormInput
                                            label="Pincode"
                                            name={`parties.${field.originalIndex}.pincode`}
                                            register={register}
                                            error={errors.parties?.[field.originalIndex]?.pincode}
                                            placeholder="e.g., 682001"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Respondents List */}
                <div className="border rounded-lg bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-4 h-4 mr-2" /> Other Parties
                    </h4>
                    {respondents.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">No other parties added yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {respondents.map((field) => (
                                <div key={field.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 relative group">
                                    <button
                                        type="button"
                                        onClick={() => remove(field.originalIndex)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 gap-y-3">
                                        <div>
                                            <label htmlFor={`parties.${field.originalIndex}.role`} className="block text-sm font-medium leading-6 text-gray-900">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`parties.${field.originalIndex}.role`}
                                                {...register(`parties.${field.originalIndex}.role`)}
                                                className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            >
                                                <option value="">Select Status</option>
                                                {APP_STATUS.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.parties?.[field.originalIndex]?.role && (
                                                <p className="mt-1 text-sm text-red-600">{errors.parties?.[field.originalIndex]?.role?.message}</p>
                                            )}
                                        </div>
                                        <FormInput
                                            label="Name"
                                            name={`parties.${field.originalIndex}.name`}
                                            register={register}
                                            error={errors.parties?.[field.originalIndex]?.name}
                                            placeholder="Other Party Name"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
