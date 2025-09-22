import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  className = "",
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-xl font-medium
        bg-blue-600 text-white
        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      {loading && (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
      )}
      {children}
    </button>
  );
}
