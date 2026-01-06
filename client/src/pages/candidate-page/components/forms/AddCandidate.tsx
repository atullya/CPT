import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AddCandidateDialog from "./CandidateForm";

interface AddCandidateButtonProps {
  job: any;
  onSuccess?: () => void;
  disabled?: boolean;
}

const AddCandidateButton: React.FC<AddCandidateButtonProps> = ({
  job,
  onSuccess,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={`w-[155px] h-[37px] flex items-center justify-center gap-2 rounded-lg text-[14px] ${disabled
          ? "bg-gray-400 text-gray-100 cursor-not-allowed hover:bg-gray-400"
          : "bg-[#7C3AED] text-white hover:bg-[#6d2ed8]"
          }`}
      >
        <UserPlus className="w-4 h-4" />
        Add Candidate
      </Button>

      <AddCandidateDialog
        open={open}
        onOpenChange={setOpen}
        job={job}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default AddCandidateButton;
