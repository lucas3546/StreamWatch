import { createContext } from "react";
import * as signalR from "@microsoft/signalr";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  reloadConnection: () => Promise<void>;
}

export const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  reloadConnection: async () => {},
});
