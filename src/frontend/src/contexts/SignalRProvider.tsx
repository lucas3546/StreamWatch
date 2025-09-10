import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../utils/config";
import { SignalRContext } from "./SignalRContext";
import * as signalR from "@microsoft/signalr";

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );

  const initConnection = useCallback(async () => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(BASE_URL + "/hubs/streamwatch", {
        accessTokenFactory: () => localStorage.getItem("jwt") || "",
      })
      .withAutomaticReconnect()
      .build();

    await conn.start();
    console.log("✅ SignalR connected");
    setConnection(conn);
    return conn;
  }, []);

  useEffect(() => {
    initConnection().catch((err) =>
      console.error("❌ Error connecting to SignalR:", err),
    );

    return () => {
      connection?.stop();
    };
  }, [initConnection]);

  const reloadConnection = useCallback(async () => {
    if (connection) {
      await connection.stop(); // dispara OnDisconnectedAsync en el backend
      setConnection(null);
    }
    await initConnection();
  }, [connection, initConnection]);

  return (
    <SignalRContext.Provider value={{ connection, reloadConnection }}>
      {children}
    </SignalRContext.Provider>
  );
};
