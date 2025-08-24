import * as React from "react";
import { useState } from "react";
import FormContainer from "../components/forms/FormContainer";
import { register, type RegisterRequest } from "../services/accountService";
import type { ProblemDetails } from "../components/types/ProblemDetails";
import { FieldError } from "../components/errors/FieldError";

export default function RegisterPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      const token = await register(data);
      console.log(token);
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
        className="flex flex-col w-[34%] text-left gap-2 mx-auto"
      >
        <h2 className="text-3xl text-center">Register</h2>

        <label className="">Username:</label>
        <input
          type="text"
          name="username"
          className="border-1 border-white rounded-sm"
        ></input>
        <FieldError errors={fieldErrors} name="username" />

        <label className="">Email:</label>
        <input
          type="email"
          name="email"
          className="border-1 border-white rounded-sm"
        ></input>
        <FieldError errors={fieldErrors} name="email" />

        <label className="">Password:</label>
        <input
          type="password"
          name="password"
          className="border-1 border-white rounded-sm"
        ></input>
        <FieldError errors={fieldErrors} name="password" />

        <label className="">Confirm password:</label>
        <input
          type="password"
          name="confirmpassword"
          className="border-1 border-white rounded-sm"
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

        <button className="bg-gray-700 rounded-sm mx-auto px-3 text-lg hover:bg-gray-500">
          Create account
        </button>
      </form>
    </FormContainer>
  );
}
