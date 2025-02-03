import { createContext, useRef, useEffect } from "react";
import { initializeSocket } from "../config/socket";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = initializeSocket();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    );
};