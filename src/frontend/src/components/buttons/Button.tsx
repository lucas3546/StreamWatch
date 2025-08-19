interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-3 py-0.5 border-white border-1 rounded-xl transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
