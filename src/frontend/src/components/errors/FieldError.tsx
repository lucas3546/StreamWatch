interface FieldErrorProps {
  errors: Record<string, string[]> | null;
  name: string;
}

export function FieldError({ errors, name }: FieldErrorProps) {
  if (!errors) return null;

  // cambiar las keys de los errores del backend a minusculas
  const normalizedErrors = Object.fromEntries(
    Object.entries(errors).map(([k, v]) => [k.toLowerCase(), v]),
  );

  const fieldErrors = normalizedErrors[name.toLowerCase()];
  if (!fieldErrors) return null;

  return (
    <>
      {fieldErrors.map((msg, i) => (
        <p key={i} className="text-red-500 text-sm">
          {msg}
        </p>
      ))}
    </>
  );
}
