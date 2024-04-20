import io from "socket.io-client";
import { SOCKET_API } from "../utils/APIS";
import { createContext } from "react";

const socket = io(SOCKET_API);

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
