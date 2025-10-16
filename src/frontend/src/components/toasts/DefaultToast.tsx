type Props = {
  title: string;
  text: string;
};

export default function DefaultToast({ title, text }: Props) {
  return (
    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
      <p className="font-bold">{title}</p>
      <p>{text}</p>
    </div>
  );
}
