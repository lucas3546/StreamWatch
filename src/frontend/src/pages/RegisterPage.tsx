import * as React from "react";
import { useState } from "react";
import FormContainer from "../components/forms/FormContainer";
import { register, type RegisterRequest } from "../services/accountService";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import { FieldError } from "../components/errors/FieldError";
import { useUser } from "../contexts/UserContext";

export default function RegisterPage() {
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

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    //const confirmpassword = formData.get("confirmpassword") as string;

    const data: RegisterRequest = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await register(data);
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
        className="flex flex-col w-full text-left gap-2 mx-auto overflow-y-auto"
      >
        <h2 className="text-3xl text-center">Register</h2>

        <label className="w-full">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="E.g JohnDoe322"
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        ></input>
        <FieldError errors={fieldErrors} name="username" />

        <label className="w-full">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        ></input>
        <FieldError errors={fieldErrors} name="email" />

        <label className="w-full">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        ></input>
        <FieldError errors={fieldErrors} name="password" />

        <label className="w-full">Confirm password:</label>
        <input
          type="password"
          name="confirmpassword"
          placeholder="Enter your password"
          className="border border-white rounded-md w-full px-3 py-2 bg-neutral-700"
        ></input>

        <div className="flex items-start gap-2 mt-1">
          <input type="checkbox" name="terms" required className="mt-1" />
          <p className="text-sm leading-snug">
            I accept the terms and conditions and privacy policy of StreamWatch
          </p>
        </div>
        {generalError && (
          <p className="text-red-600 text-center mb-2">{generalError}</p>
        )}

        {isLoading ? (
          <button className="disabled bg-neutral-800 rounded-sm mx-auto p-2">
            Loading
          </button>
        ) : (
          <button className="bg-neutral-700 rounded-sm mx-auto p-2 hover:bg-gray-500 cursor-pointer">
            Sign Up
          </button>
        )}
      </form>
    </FormContainer>
  );
}
