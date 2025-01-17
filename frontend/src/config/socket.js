import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

let socketInstance;

export const initializeSocket = (roomId) => {
    if (!socketInstance) {
        socketInstance = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: localStorage.getItem('token'),
            },
            query: {
                roomId,
            },
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            toast.error('Connection lost. Retrying...');
        });

        socketInstance.on('reconnect', () => {
            console.log('Socket reconnected');
            toast.success('Reconnected to server.');
        });
    }
    return socketInstance;
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error('Socket not initialized. Call initializeSocket first.');
        return;
    }
    socketInstance.emit(eventName, data);
};

export const receiveMessage = (eventName, callback) => {
    if (!socketInstance) {
        console.error('Socket not initialized. Call initializeSocket first.');
        return;
    }
    socketInstance.on(eventName, callback);
};
