import type { IconType } from "react-icons";

interface IconProps {
  icon: IconType;
  size?: number;
}

export default function Icon({ icon: IconComp, size = 24 }: IconProps) {
  return <IconComp size={size} />;
}
