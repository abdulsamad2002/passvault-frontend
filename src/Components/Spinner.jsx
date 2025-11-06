import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-10 h-10",
    large: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-[#E0E0E0] animate-spin`} />
        {/* <div className="absolute inset-0 blur-xl bg-[#E0E0E0] opacity-10 animate-pulse"></div> */}
      </div>
      <p className="text-[#E0E0E0] text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default Spinner;