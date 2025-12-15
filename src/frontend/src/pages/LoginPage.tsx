import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { login, type LoginRequest } from "../services/accountService";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import FormContainer from "../components/forms/FormContainer";
import { FieldError } from "../components/errors/FieldError";
import { Link } from "react-router";

export default function LoginPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setJwt } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    //const confirmpassword = formData.get("confirmpassword") as string;

    const data: LoginRequest = {
      email: email,
      password: password,
    };

    try {
      const response = await login(data);
      setJwt(response.token);
      window.location.href = "/";
    } catch (err) {
      const problem = err as ProblemDetails;
      if (problem.errors) {
        setFieldErrors(problem.errors);
        return;
      }

      if (problem.detail) {
        setGeneralError(problem.detail);
        return;
      }
    } finally {
      setIsLoading(false);
    }

    console.log("Formulario enviado");
  };

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full text-left gap-2"
      >
        <h2 className="text-3xl text-center">Login</h2>

        <label className="w-full">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="youremail@email.com"
          className="w-full bg-neutral-800 border border-neutral-700
                     rounded-xl px-4 py-2 focus:outline-none
                     focus:ring-2 focus:ring-neutral-500"
        ></input>
        <FieldError errors={fieldErrors} name="email" />

        <label className="w-full">Password:</label>
        <input
          type="password"
          name="password"
          className="w-full bg-neutral-800 border border-neutral-700
                     rounded-xl px-4 py-2 focus:outline-none
                     focus:ring-2 focus:ring-neutral-500"
        ></input>
        <FieldError errors={fieldErrors} name="password" />
        <p>
          You don't have any account? Go to{" "}
          <Link to="/register" className="text-blue-400 underline">
            register
          </Link>{" "}
          page.
        </p>
        {generalError && (
          <p className="text-red-600 text-center mb-2">{generalError}</p>
        )}

        {isLoading ? (
          <button className="disabled bg-neutral-800 rounded-sm mx-auto p-2">
            Loading
          </button>
        ) : (
          <button className="bg-neutral-700 rounded-sm mx-auto p-2 hover:bg-gray-500 cursor-pointer">
            Login
          </button>
        )}
      </form>
    </FormContainer>
  );
}
