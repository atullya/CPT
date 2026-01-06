import React, { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/Dialog";
import type {
  Job,
  CreateJobPayload,
  ContractType,
  OverlapRequirement,
  JobStatus,
} from "@/store/jobs/jobsTypes";
import { JobForm, validateField } from "./JobForm";

interface Errors {
  jobTitle?: string;
  jobDescription?: string;
  clientName?: string;
  clientTimezone?: string;
  experience?: string;
  searchRegion?: string;
  [key: string]: string | undefined;
}

interface CreateJobProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    formData: CreateJobPayload
  ) => Promise<{ success: boolean; error?: string }>;
  editJob?: Job | null;
  isEditMode?: boolean;
}

const CreateJob: React.FC<CreateJobProps> = ({
  open,
  onClose,
  onSubmit,
  editJob,
  isEditMode = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [clientLogo, setClientLogo] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedRegionDropdownOpen, setSelectedRegionDropdownOpen] =
    useState(false);
  const [selectedContractType, setSelectedContractType] = useState("Full-Time");
  const [selectedOverlap, setSelectedOverlap] = useState("Complete");
  const [selectedJobStatus, setSelectedJobStatus] = useState("Open");

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    clientName: "",
    clientTimezone: "",
    experience: "",
    remarks: "",
    dropdownOpen: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  useEffect(() => {
    setInternalOpen(open);

    if (open) {
      document.body.style.backgroundColor = "#FAFAFA";

      if (isEditMode && editJob) {
        setFormData({
          jobTitle: editJob.jobTitle || "",
          jobDescription: editJob.jobDescription || "",
          clientName: editJob.clientName || "",
          clientTimezone: editJob.clientTimezone || "",
          experience: editJob.minimumExperience || "",
          remarks: editJob.remarks || "",
          dropdownOpen: false,
        });

        setSelectedContractType(editJob.contractType || "Full-Time");
        setSelectedOverlap(editJob.overlapRequirement || "Complete");
        setSelectedJobStatus(editJob.status || "Open");
        setSelectedRegions(editJob.searchRegion ? [editJob.searchRegion] : []);
        setClientLogo(editJob.clientLogo || null);
        setHasStartedTyping(true);
      } else {
        setFormData({
          jobTitle: "",
          jobDescription: "",
          clientName: "",
          clientTimezone: "",
          experience: "",
          remarks: "",
          dropdownOpen: false,
        });

        setSelectedContractType("Full-Time");
        setSelectedOverlap("Complete");
        setSelectedJobStatus("Open");
        setSelectedRegions([]);
        setClientLogo(null);
        setErrors({});
        setHasStartedTyping(false);
      }
    } else {
      document.body.style.backgroundColor = "";
    }
  }, [open, isEditMode, editJob]);


  const handleCloseDialog = () => {
    document.body.style.backgroundColor = "";
    setInternalOpen(false);
    setErrors({});
    setIsSubmitting(false);
    setHasStartedTyping(false);

    if (!isEditMode) {
      setFormData({
        jobTitle: "",
        jobDescription: "",
        clientName: "",
        clientTimezone: "",
        experience: "",
        remarks: "",
        dropdownOpen: false,
      });
      setSelectedContractType("Full-Time");
      setSelectedOverlap("Complete");
      setSelectedJobStatus("Open");
      setSelectedRegions([]);
      setClientLogo(null);
    }

    onClose();
  };

  const handleInputChange = (id: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [id]: String(value) }));
    if (!hasStartedTyping) setHasStartedTyping(true);
  };

  const handleValidation = (field: string, value: string | boolean) => {
    const message = validateField(field, value, selectedRegions);
    setErrors((prev: Errors) => ({ ...prev, [field]: message }));
    return !message;
  };

  const handleSelectRegion = (region: string) => {
    setSelectedRegions((prev) => {
      const updatedRegions = prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region];

      if (updatedRegions.length === 0) {
        setErrors((prev) => ({
          ...prev,
          searchRegion: "Please select at least one region.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, searchRegion: "" }));
      }

      return updatedRegions;
    });

    if (!hasStartedTyping) setHasStartedTyping(true);
  };

  const handleLogoChange = (val: string | null) => {
    setClientLogo(val);
    if (!hasStartedTyping) setHasStartedTyping(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const fields = [
      "jobTitle",
      "jobDescription",
      "clientName",
      "clientTimezone",
      "experience",
    ];
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!handleValidation(field, value)) isValid = false;
    });

    if (selectedRegions.length === 0) {
      setErrors((prev: Errors) => ({
        ...prev,
        searchRegion: "Please select at least one region.",
      }));
      isValid = false;
    }

    if (!isValid) return;

    setIsSubmitting(true);

    const jobData = {
      ...(isEditMode && editJob && { id: editJob.id }),
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      clientName: formData.clientName,
      clientTimezone: formData.clientTimezone,
      minimumExperience: formData.experience,
      searchRegion: selectedRegions.length > 0 ? selectedRegions[0] : "",
      region: selectedRegions,
      contractType: selectedContractType as ContractType,
      overlapRequirement: selectedOverlap as OverlapRequirement,
      status: selectedJobStatus as JobStatus,
      clientLogo: clientLogo || undefined,
      remarks: formData.remarks || "",
    };

    try {
      const result = await onSubmit(jobData);

      if (result.success) {
        handleCloseDialog();
      } else {
        alert(
          result.error ||
          `Failed to ${isEditMode ? "update" : "create"} job. Please try again.`
        );
        console.error(
          `Failed to ${isEditMode ? "update" : "create"} job:`,
          result.error
        );
      }
    } catch (error) {
      alert(`An unexpected error occurred. Please try again.`);
      console.error("Unexpected error during job submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={internalOpen}
      onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
      title={isEditMode ? "Edit Job" : "Add New Job"}
      onSave={handleSubmit}
      saveText={isEditMode ? "Update Job" : "Create Job"}
      isSaving={isSubmitting}
      saveEnabled={hasStartedTyping}
      contentClassName="w-[95vw] sm:w-[90vw] sm:max-w-[640px] h-[90vh] sm:h-[85vh] max-h-[560px] bg-white rounded-xl shadow-lg flex flex-col p-0 mx-auto"
      headerClassName="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4"
      bodyClassName="px-4 sm:px-6 py-4 sm:py-6"
      footerClassName="px-4 sm:px-6 py-4"
      cancelButtonClass="w-20 h-[37px] min-h-9 px-1 py-[7.5px] text-sm"
      saveButtonClass={`w-[105px] h-[37px] min-h-9 px-1 py-[7.5px] text-sm rounded-lg transition-all duration-200 ${hasStartedTyping
        ? "bg-[#7C3AED]! text-white! hover:bg-violet-700!"
        : "bg-[#9f9fa3]! text-white! cursor-not-allowed!"
        }`}
    >
      <JobForm
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleValidation={handleValidation}
        clientLogo={clientLogo}
        handleLogoChange={handleLogoChange}
        selectedRegions={selectedRegions}
        handleSelectRegion={handleSelectRegion}
        selectedRegionDropdownOpen={selectedRegionDropdownOpen}
        setSelectedRegionDropdownOpen={setSelectedRegionDropdownOpen}
        selectedContractType={selectedContractType}
        setSelectedContractType={setSelectedContractType}
        selectedOverlap={selectedOverlap}
        setSelectedOverlap={setSelectedOverlap}
        selectedJobStatus={selectedJobStatus}
        setSelectedJobStatus={setSelectedJobStatus}
        isEditMode={isEditMode}
        setFormData={setFormData}
      />
    </FormDialog>
  );
};

export default CreateJob;
