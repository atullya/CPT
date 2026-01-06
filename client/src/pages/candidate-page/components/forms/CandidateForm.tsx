import React from "react";
import { FormDialog } from "@/components/ui/Dialog";
import { TextInput } from "@/components/ui/TextInput";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Textarea } from "@/components/ui/Textarea";
import type { Candidate } from "@/store/candidates/candidatesTypes";
import { useCandidateForm } from "../../hooks/useCandidateForm";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: any;
  onSuccess?: (candidateName?: string) => void;
  candidateToEdit?: Candidate;
}

const candidateTypes = ["Internal Employee", "Externally Sourced"];

const AddCandidateDialog: React.FC<AddCandidateDialogProps> = (props) => {
  const {
    open,
    onOpenChange,
    candidateToEdit
  } = props;

  const {
    formData,
    errors,
    hasStartedTyping,
    handleInputChange,
    handleValidation,
    handleSubmit,
    isSubmitting,
  } = useCandidateForm(props);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={candidateToEdit ? "Edit Candidate" : "Add New Candidate"}
      onSave={handleSubmit}
      saveText={candidateToEdit ? "Save Changes" : "Add Candidate"}
      isSaving={isSubmitting}
      saveEnabled={hasStartedTyping}
      contentClassName="w-[640px] max-w-none h-[480px] max-h-none"
      saveButtonClass={`w-32 ${hasStartedTyping
        ? "bg-[#7C3AED] text-white hover:bg-[#6d2ed8]"
        : "bg-gray-400 text-white cursor-not-allowed"
        }`}
    >
      <div className="flex flex-col gap-4 min-h-[400px]">
        <TextInput
          id="fullName"
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={handleInputChange}
          onBlur={() => handleValidation("fullName")}
          error={errors.fullName}
          required
        />
        <TextInput
          id="email"
          label="Email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={() => handleValidation("email")}
          error={errors.email}
          required
        />
        <TextInput
          id="phone"
          label="Phone Number"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleInputChange}
          onBlur={() => handleValidation("phone")}
          error={errors.phone}
          required={false}
        />
        <TextInput
          id="resumeUrl"
          label="Resume URL"
          placeholder="Enter resume URL "
          value={formData.resumeUrl}
          onChange={handleInputChange}
          onBlur={() => handleValidation("resumeUrl")}
          error={errors.resumeUrl}
          required
        />
        <RadioGroup
          label="Candidate Type"
          options={candidateTypes}
          selected={formData.candidateType}
          onChange={(val) => handleInputChange("candidateType", val)}
        />
        <Textarea
          id="remarks"
          label="Remarks"
          placeholder="Add remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          required={false}
        />
      </div>
    </FormDialog>
  );
};

export default AddCandidateDialog;
