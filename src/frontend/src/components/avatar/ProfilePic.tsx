import Avatar from "boring-avatars";

interface ProfilePicProps {
  userName: string | undefined;
  fileUrl?: string | undefined;
  size?: number;
  isSquare?: boolean;
}

export default function ProfilePic({
  userName,
  fileUrl,
  size = 24,
  isSquare = false,
}: ProfilePicProps) {
  return (
    <>
      {fileUrl ? (
        <div
          style={{ width: size, height: size }}
          className="overflow-hidden rounded-full"
        >
          <img
            src={fileUrl}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <Avatar
          size={size}
          name={userName || "Outgen"}
          colors={["#696358ff", "#b3a79fff", "#ff5252", "#c91e5a", "#3d2922"]}
          variant="bauhaus"
          square={isSquare}
          className="rounded-2xl"
        />
      )}
    </>
  );
}
