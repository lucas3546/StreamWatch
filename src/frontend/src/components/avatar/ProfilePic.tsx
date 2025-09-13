import { PUBLIC_BUCKET_URL } from "../../utils/config";
import Avatar from "boring-avatars";

interface ProfilePicProps {
  userName: string | undefined;
  fileName: string | undefined;
  size?: number;
}

export default function ProfilePic({
  userName,
  fileName,
  size = 24,
}: ProfilePicProps) {
  return (
    <>
      {fileName ? (
        <img
          src={PUBLIC_BUCKET_URL + fileName}
          alt={userName}
          height={size}
          width={size}
        />
      ) : (
        <Avatar
          size={size}
          name={userName || "Outgen"}
          colors={["#696358ff", "#b3a79fff", "#ff5252", "#c91e5a", "#3d2922"]}
          variant="bauhaus"
        />
      )}
    </>
  );
}
