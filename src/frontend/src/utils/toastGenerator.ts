import { toast } from "react-toastify";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import type { ZodError } from "zod";
import { z } from "zod";

export async function generatePromiseToast<T>(
  executable: Promise<T>,
  successMessage: string,
): Promise<T> {
  const result = await toast.promise(
    executable,
    {
      pending: "Loading",
      success: successMessage,
      error: {
        render({ data }) {
          const problem = data as ProblemDetails;

          if (!problem.errors && !problem.detail) {
            return (
              "An unknow error has ocurred,\nStatus code: " + problem.status
            );
          }

          if (problem.errors) {
            const flattened = Object.values(problem.errors).flat().join("\n");
            return flattened;
          }

          return problem.detail;
        },
      },
    },
    {
      theme: "dark",
      position: "bottom-right",
      autoClose: 8000,
      style: {
        background: "rgb(26, 26, 31)",
        color: "white",
        borderRadius: "0px",
        fontSize: 12,
      },
    },
  );

  return result;
}

export function generateSuccessToast(message: string) {
  toast.success(message, {
    theme: "dark",
    position: "bottom-right",
    autoClose: 4000,
    style: {
      whiteSpace: "pre-line",
      fontSize: 12,
    },
  });
}

export function generateInfoToast(message: string) {
  toast.info(message, {
    theme: "dark",
    position: "bottom-right",
    autoClose: 4000,
    style: {
      whiteSpace: "pre-line",
      fontSize: 12,
    },
  });
}

export function generateProblemDetailsErrorToast(problem: ProblemDetails) {
  const message = problem.errors
    ? Object.values(problem.errors)
        .flat()
        .map((msg) => `- ${msg}`)
        .join("\n")
    : (problem.detail ?? "Unknown error");

  toast.error(message, {
    theme: "dark",
    position: "bottom-right",
    autoClose: 8000,
    style: {
      whiteSpace: "pre-line",
      fontSize: 12,
    },
  });
}

export function generateZodErrorsToast(error: ZodError) {
  const flattened = error.issues.map((e) => "- " + e.message).join("\n");

  toast.error(flattened, {
    theme: "dark",
    position: "bottom-right",
    autoClose: 8000,
    style: {
      whiteSpace: "pre-line",
      fontSize: 12,
    },
  });
}
