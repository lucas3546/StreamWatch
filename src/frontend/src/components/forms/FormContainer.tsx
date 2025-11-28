import type { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div
      className="
        w-full
        p-2
        flex flex-col gap-2
        sm:max-w-3xl sm:mx-auto sm:my-6
        sm:bg-neutral-900/60 sm:backdrop-blur-md sm:border sm:border-neutral-700 sm:rounded-xl sm:shadow-md
        overflow-y-auto
      "
    >
      {children}
    </div>
  );
}
