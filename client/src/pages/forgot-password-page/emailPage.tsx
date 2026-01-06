import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import cpt_logo_large from "@/assets/cpt_logo_extended.svg";
import { Button } from "@/components/ui/Button";
import sampleImage from "@/assets/sampleImage.png";
import { useSendResetEmailMutation } from "../../store/auth/authApi";

interface LocationState {
  email: string;
}

const EmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const email = state?.email || "your email";

  const [sendResetEmail, { isLoading }] = useSendResetEmailMutation();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleBackToLogin = () => navigate("/login");

  const handleResendEmail = async () => {
    if (isLoading || cooldown > 0) return;

    try {
      await sendResetEmail({ email }).unwrap();
      // alert("Reset email resent");
      setCooldown(60);
    } catch {
      alert("Failed to resend email");
    }
  };

  const isDisabled = isLoading || cooldown > 0;

  const getResendText = () => {
    if (isLoading) return "Sending...";
    if (cooldown > 0) return `Resend in ${cooldown}s`;
    return "Click to resend";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-50">
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col items-center justify-center px-4 md:px-0">
        <div className="flex h-10 w-[165px] items-center justify-center gap-2 mb-6 sm:mb-8">
          <img
            src={cpt_logo_large}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center w-full max-w-[384px]">
          <h2 className="text-center font-semibold text-[24px] text-gray-900">
            Check your email
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            We sent a password reset link to{" "}
            <span className="font-medium">{email}</span>
          </p>

          <Button
            type="button"
            variant="purple"
            className="w-full mt-6 text-white"
            onClick={handleBackToLogin}
          >
            Back to Log in
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Don't receive email?{" "}
            <span
              className={`${isDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-purple-600 cursor-pointer hover:underline"
                }`}
              onClick={handleResendEmail}
            >
              {getResendText()}
            </span>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex w-full md:w-1/2 h-full bg-zinc-100 flex-col items-center justify-center gap-10 px-4 md:px-12 py-6 cursor-pointer"
        onClick={() => navigate("/newPassword")}
      >
        <img
          src={sampleImage}
          alt="Sample"
          className="w-full max-w-md h-64 md:h-72 object-cover rounded-lg shadow-lg"
        />
        <div className="flex flex-col gap-3 w-full max-w-md text-center">
          <h3 className="text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h3>
          <p className="text-sm text-gray-600">
            Sign in to track the candidate progress in the job.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
