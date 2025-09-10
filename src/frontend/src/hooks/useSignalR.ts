// context/useSignalR.ts
import { useContext } from "react";
import { SignalRContext } from "../contexts/SignalRContext";

export const useSignalR = () => {
  return useContext(SignalRContext);
};
