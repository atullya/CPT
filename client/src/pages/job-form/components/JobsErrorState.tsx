import React from 'react';
import { Button } from "@/components/ui/Button";

interface JobsErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

const JobsErrorState: React.FC<JobsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex justify-center items-center min-h-96">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg text-center">
          <p className="font-semibold mb-2">Error loading jobs</p>
          <p className="text-sm mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onRetry} variant="outline">
              Retry
            </Button>
            {error?.includes('Authentication') && (
              <Button onClick={() => (window.location.href = '/login')} variant="default">
                Go to Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsErrorState;
