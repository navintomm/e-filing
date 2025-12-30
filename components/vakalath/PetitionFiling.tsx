"use client";

import { useFieldArray, Control, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { VakalathFormValues } from "@/lib/validators";
import { Plus, Trash2, UploadCloud, File as FileIcon } from "lucide-react";
import { FormInput } from "@/components/FormInput";
import { FormCombobox } from "@/components/FormSelect";
import { ACTS } from "@/lib/constants";

interface PetitionFilingProps {
    control: Control<VakalathFormValues>;
    register: UseFormRegister<VakalathFormValues>;
    errors: FieldErrors<VakalathFormValues>;
    watch: UseFormWatch<VakalathFormValues>;
    setValue: UseFormSetValue<VakalathFormValues>;
}

export function PetitionFiling({ control, register, errors, watch, setValue }: PetitionFilingProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "applications",
    });

    // We can get parties from watch to populate Petitioner/Respondent dropdowns
    const parties = watch("parties") || [];
    const petitioners = parties.filter(p => p.role?.toLowerCase() === "petitioner").map(p => p.name);
    const respondents = parties.filter(p => p.role?.toLowerCase() === "respondent").map(p => p.name);

    return (
        <div className="space-y-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Petition / IA Filing</h3>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h4 className="text-base font-semibold text-gray-900 mb-2">Add New Application</h4>
                <p className="text-sm text-gray-500 mb-6">Enter the details below to add a new Petition/IA application.</p>

                <button
                    type="button"
                    onClick={() => append({
                        type: "",
                        prayer: "",
                        classification: "",
                        act: "",
                        section: "",
                        petitioner: "",
                        respondent: "",
                        fileName: ""
                    })}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                    <Plus className="-ml-0.5 mr-2 h-4 w-4" />
                    Start New Application Entry
                </button>
            </div>

            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h5 className="font-medium text-gray-900">Application #{index + 1}</h5>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormCombobox
                                label="Petition/IA Type"
                                name={`applications.${index}.type`}
                                register={register}
                                error={errors.applications?.[index]?.type}
                                options={["Original Petition", "Interlocutory Application (IA)", "Statement", "Objection"]}
                                placeholder="Select a type"
                            />

                            <FormInput
                                label="Classification"
                                name={`applications.${index}.classification`}
                                register={register}
                                error={errors.applications?.[index]?.classification}
                                placeholder="Select Classification"
                            />

                            <FormCombobox
                                label="Act"
                                name={`applications.${index}.act`}
                                register={register}
                                error={errors.applications?.[index]?.act}
                                options={ACTS}
                                placeholder="Select Act"
                            />

                            <FormInput
                                label="Section/Rule"
                                name={`applications.${index}.section`}
                                register={register}
                                error={errors.applications?.[index]?.section}
                                placeholder="e.g. Section 151"
                            />

                            <div className="col-span-full">
                                <FormInput
                                    label="Prayer"
                                    name={`applications.${index}.prayer`}
                                    register={register}
                                    error={errors.applications?.[index]?.prayer}
                                    placeholder="Enter the prayer..."
                                    textarea
                                />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">
                                    Document File <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <div className="text-center">
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                            <label htmlFor={`file-upload-${index}`} className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                                {watch(`applications.${index}.fileName`) ? (
                                                    <div className="flex items-center gap-2">
                                                        <FileIcon className="w-8 h-8 text-blue-500" />
                                                        <span className="text-gray-900">{watch(`applications.${index}.fileName`)}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                        <span className="mt-2 block">Upload a file</span>
                                                    </>
                                                )}
                                                <input
                                                    id={`file-upload-${index}`}
                                                    name={`file-upload-${index}`}
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setValue(`applications.${index}.fileName`, file.name);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {!watch(`applications.${index}.fileName`) && (
                                            <p className="text-xs leading-5 text-gray-600 mt-2">PDF up to 10MB</p>
                                        )}
                                    </div>
                                </div>
                                {errors.applications?.[index]?.fileName && (
                                    <p className="mt-2 text-sm text-red-600">{errors.applications?.[index]?.fileName?.message}</p>
                                )}
                            </div>

                            <FormCombobox
                                label="Petitioner"
                                name={`applications.${index}.petitioner`}
                                register={register}
                                error={errors.applications?.[index]?.petitioner}
                                options={petitioners.length ? petitioners : ["No petitioners added"]}
                                placeholder="Select Applicant"
                            />

                            <FormCombobox
                                label="Respondent"
                                name={`applications.${index}.respondent`}
                                register={register}
                                error={errors.applications?.[index]?.respondent}
                                options={respondents.length ? respondents : ["No respondents added"]}
                                placeholder="Select Respondent"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Include Docket Option */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="includeDocket"
                            {...register("includeDocket")}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>
                    <div className="ml-3">
                        <label htmlFor="includeDocket" className="font-medium text-gray-900">
                            Include Docket Page
                        </label>
                        <p className="text-sm text-gray-500">
                            Add a docket/back page with filing information (for District Courts only)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
