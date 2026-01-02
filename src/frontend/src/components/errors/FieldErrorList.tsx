interface FieldErrorListProps {
  errors: Record<string, string[]> | null;
}

export function FieldErrorList({ errors }: FieldErrorListProps) {
  if (!errors) return null;

  const entries = Object.entries(errors);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      {entries.map(([field, messages]) => (
        <div key={field} className="">
          <span className="font-medium text-red-700">{field}:</span>
          <ul className="ml-4 text-red-600 list-disc">
            {messages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
