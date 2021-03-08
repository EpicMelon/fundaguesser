import socketioClient from "socket.io-client";
import { SOCKET_URL } from "./config";

import React from "react";

export const socket = socketioClient(SOCKET_URL, {reconnect: true});
export const SocketContext = React.createContext();