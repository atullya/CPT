import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import successImage from "@/assets/success.png";
import useLoader from "@/hooks/useLoader";

const PasswordSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  // Use the loader hook
  const { withLoader, LoadingComponent } = useLoader();

  const handleContinue = () => {
    withLoader(
      new Promise((resolve) =>
        setTimeout(() => {
          navigate("/login");
          resolve(true);
        }, 1500)
      )
    );
  };

  return (
    <LoadingComponent>
      <div className="flex min-h-screen w-full bg-[#F9FAFB] flex-col items-center justify-center px-4 py-8">
        <img
          src={successImage}
          alt="Success"
          className="w-full max-w-[389px] h-[119px] object-contain"
        />

        <h1 className="text-2xl sm:text-3xl font-semibold mt-4 text-center text-[#111827]">
          Password successfully updated
        </h1>

        <p className="text-[#6B7280] mt-2 text-center text-sm sm:text-base">
          You can now log in with your new password.
        </p>

        <Button
          type="button"
          variant="purple"
          className="mt-6 w-full max-w-[400px] text-center text-base"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </LoadingComponent>
  );
};

export default PasswordSuccessPage;
