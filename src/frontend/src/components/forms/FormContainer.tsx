import type { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="bg-black flex h-full sm:w-4/5 md:w-3/4 xl:w-3/4 mx-auto border-defaultbordercolor border-1 border-t-0 border-b-0 p-2 overflow-y-auto">
      {children}
    </div>
  );
}
