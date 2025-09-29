import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { login, type LoginRequest } from "../services/accountService";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import FormContainer from "../components/forms/FormContainer";
import { FieldError } from "../components/errors/FieldError";

export default function LoginPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { setJwt } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    }

    console.log("Formulario enviado");
  };

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full text-left gap-2 mx-auto"
      >
        <h2 className="text-3xl text-center">Login</h2>

        <label className="w-full">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="youremail@email.com"
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        ></input>
        <FieldError errors={fieldErrors} name="email" />

        <label className="w-full">Password:</label>
        <input
          type="password"
          name="password"
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        ></input>
        <FieldError errors={fieldErrors} name="password" />

        {generalError && (
          <p className="text-red-600 text-center mb-2">{generalError}</p>
        )}

        <button className="bg-gray-700 rounded-sm mx-auto px-3 text-lg hover:bg-gray-500">
          Sign In
        </button>
      </form>
    </FormContainer>
  );
}
