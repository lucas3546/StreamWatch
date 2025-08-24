import FormContainer from "../components/forms/FormContainer";

export default function SettingsPage() {
  return (
    <FormContainer>
      <div className="flex flex-col mx-auto">
        <h2 className="text-3xl text-center">Settings</h2>

        <div className="flex items-center gap-2">
          <input type="checkbox" />
          <p>Contenido NSFW</p>
        </div>
      </div>
    </FormContainer>
  );
}
