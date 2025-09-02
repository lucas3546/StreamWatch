import { useParams } from "react-router";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  return <div>{roomId}</div>;
}
