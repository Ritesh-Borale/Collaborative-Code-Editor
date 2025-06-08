import React, { useState, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { Excalidraw } from "@excalidraw/excalidraw";

// Add this line at the top of the file, after imports
window.process = { env: { NODE_ENV: process.env.NODE_ENV } };

const Whiteboard = () => {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const excalidrawRef = useRef(null);

    const handleChange = useCallback((elements, state) => {
        // Only update if necessary
        if (excalidrawAPI && elements) {
            excalidrawAPI.updateScene({ elements });
        }
    }, [excalidrawAPI]);

    const handleClear = () => {
        if (excalidrawAPI) {
            excalidrawAPI.resetScene();
        }
    };

    const handleExport = async () => {
        if (!excalidrawAPI) return;

        const blob = await excalidrawAPI.exportToBlob({
            mimeType: "image/png",
            quality: 1,
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "whiteboard-export.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-screen flex text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <div className="bg-gray-800 p-4 flex gap-4">
                    <button 
                        onClick={handleClear}
                        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                    >
                        Clear Board
                    </button>
                    <button 
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    >
                        Export as PNG
                    </button>
                </div>
                <div className="flex-1 bg-white">
                    <Excalidraw
                        ref={excalidrawRef}
                        onChange={handleChange}
                        onMount={setExcalidrawAPI}
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    );
};

export default Whiteboard;
// import React, { useState, useRef, useCallback, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import { Excalidraw } from "@excalidraw/excalidraw";
// import { useSocket } from "../context/socket.context"; // Use your existing socket context
// import { useParams } from "react-router-dom"; // Assuming you get roomId from URL

// // Add this line at the top of the file, after imports
// window.process = { env: { NODE_ENV: process.env.NODE_ENV } };

// const Whiteboard = () => {
//     const [excalidrawAPI, setExcalidrawAPI] = useState(null);
//     const { socket } = useSocket(); // Use your existing socket context
//     const { roomId } = useParams(); // Get roomId from URL params
//     const excalidrawRef = useRef(null);
//     const isUpdatingFromSocket = useRef(false);
//     const [isConnected, setIsConnected] = useState(false);

//     // Initialize whiteboard collaboration when component mounts
//     useEffect(() => {
//         if (!socket || !roomId) return;

//         // Check connection status
//         setIsConnected(socket.connected);

//         // Request current whiteboard state when component mounts
//         socket.emit('get-whiteboard-state', { roomId });

//         // Listen for whiteboard updates from other users
//         const handleWhiteboardUpdate = (data) => {
//             if (excalidrawAPI && !isUpdatingFromSocket.current) {
//                 isUpdatingFromSocket.current = true;
//                 try {
//                     excalidrawAPI.updateScene({ 
//                         elements: data.elements || [],
//                         appState: data.appState || {}
//                     });
//                     console.log(`Whiteboard updated by ${data.username}`);
//                 } catch (error) {
//                     console.error('Error updating whiteboard:', error);
//                 }
//                 setTimeout(() => {
//                     isUpdatingFromSocket.current = false;
//                 }, 50);
//             }
//         };

//         // Listen for initial whiteboard state when joining
//         const handleWhiteboardState = (data) => {
//             if (excalidrawAPI && data.elements) {
//                 try {
//                     excalidrawAPI.updateScene({ 
//                         elements: data.elements,
//                         appState: data.appState || {}
//                     });
//                     console.log('Received whiteboard state');
//                 } catch (error) {
//                     console.error('Error setting whiteboard state:', error);
//                 }
//             }
//         };

//         // Listen for whiteboard clear events
//         const handleWhiteboardCleared = (data) => {
//             if (excalidrawAPI) {
//                 excalidrawAPI.resetScene();
//                 console.log(`Whiteboard cleared by ${data.clearedBy}`);
//             }
//         };

//         // Optional: Listen for cursor updates
//         const handleCursorUpdate = (data) => {
//             // You can implement cursor display here if needed
//             console.log(`Cursor from ${data.username}:`, data.x, data.y);
//         };

//         // Connection status listeners
//         const handleConnect = () => setIsConnected(true);
//         const handleDisconnect = () => setIsConnected(false);

//         // Add event listeners
//         socket.on('whiteboard-update', handleWhiteboardUpdate);
//         socket.on('whiteboard-state', handleWhiteboardState);
//         socket.on('whiteboard-cleared', handleWhiteboardCleared);
//         socket.on('whiteboard-cursor-update', handleCursorUpdate);
//         socket.on('connect', handleConnect);
//         socket.on('disconnect', handleDisconnect);

//         // Cleanup listeners when component unmounts
//         return () => {
//             socket.off('whiteboard-update', handleWhiteboardUpdate);
//             socket.off('whiteboard-state', handleWhiteboardState);
//             socket.off('whiteboard-cleared', handleWhiteboardCleared);
//             socket.off('whiteboard-cursor-update', handleCursorUpdate);
//             socket.off('connect', handleConnect);
//             socket.off('disconnect', handleDisconnect);
//         };
//     }, [socket, roomId, excalidrawAPI]);

//     const handleChange = useCallback((elements, appState) => {
//         // Avoid infinite loops when updating from socket
//         if (isUpdatingFromSocket.current) return;

//         // Broadcast changes to other users
//         if (socket && elements && roomId) {
//             // Throttle updates to avoid overwhelming the server
//             clearTimeout(window.whiteboardUpdateTimeout);
//             window.whiteboardUpdateTimeout = setTimeout(() => {
//                 socket.emit('whiteboard-change', {
//                     roomId,
//                     elements,
//                     appState: {
//                         // Only send essential appState properties to reduce data
//                         viewBackgroundColor: appState.viewBackgroundColor,
//                         currentItemStrokeColor: appState.currentItemStrokeColor,
//                         currentItemBackgroundColor: appState.currentItemBackgroundColor,
//                         currentItemFillStyle: appState.currentItemFillStyle,
//                         currentItemStrokeWidth: appState.currentItemStrokeWidth,
//                     }
//                 });
//             }, 100); // Throttle to every 100ms
//         }
//     }, [socket, roomId]);

//     const handleClear = () => {
//         if (excalidrawAPI) {
//             excalidrawAPI.resetScene();
//             // Broadcast clear action to other users
//             if (socket && roomId) {
//                 socket.emit('whiteboard-clear', { roomId });
//             }
//         }
//     };

//     const handleExport = async () => {
//         if (!excalidrawAPI) return;

//         try {
//             const blob = await excalidrawAPI.exportToBlob({
//                 mimeType: "image/png",
//                 quality: 1,
//             });

//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.download = `whiteboard-${roomId}-${Date.now()}.png`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Error exporting whiteboard:', error);
//         }
//     };

//     // Optional: Handle cursor movement
//     const handlePointerUpdate = useCallback((payload) => {
//         if (socket && roomId && payload.pointer) {
//             // Throttle cursor updates
//             clearTimeout(window.cursorUpdateTimeout);
//             window.cursorUpdateTimeout = setTimeout(() => {
//                 socket.emit('whiteboard-cursor', {
//                     roomId,
//                     x: payload.pointer.x,
//                     y: payload.pointer.y,
//                     color: '#3b82f6' // Blue cursor
//                 });
//             }, 50); // Throttle cursor to every 50ms
//         }
//     }, [socket, roomId]);

//     return (
//         <div className="h-screen flex text-white">
//             <Sidebar />
//             <div className="flex-1 flex flex-col">
//                 <div className="bg-gray-800 p-4 flex gap-4 items-center">
//                     {/* Room ID Display */}
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm">Room:</span>
//                         <span className="bg-blue-600 px-2 py-1 rounded text-xs font-mono">
//                             {roomId}
//                         </span>
//                     </div>

//                     <button 
//                         onClick={handleClear}
//                         className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
//                         disabled={!isConnected}
//                     >
//                         Clear Board
//                     </button>
//                     <button 
//                         onClick={handleExport}
//                         className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
//                     >
//                         Export as PNG
//                     </button>

//                     {/* Connection Status */}
//                     <div className="ml-auto flex items-center gap-2">
//                         <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                         <span className="text-sm">
//                             {isConnected ? 'Connected' : 'Disconnected'}
//                         </span>
//                     </div>
//                 </div>
//                 <div className="flex-1 bg-white">
//                     <Excalidraw
//                         ref={excalidrawRef}
//                         onChange={handleChange}
//                         onMount={(api) => {
//                             setExcalidrawAPI(api);
//                             // Request whiteboard state after Excalidraw is mounted
//                             if (socket && roomId) {
//                                 socket.emit('get-whiteboard-state', { roomId });
//                             }
//                         }}
//                         onPointerUpdate={handlePointerUpdate} // Optional cursor tracking
//                         theme="dark"
//                         initialData={{
//                             appState: {
//                                 viewBackgroundColor: "#1e1e1e",
//                                 currentItemStrokeColor: "#ffffff",
//                                 currentItemBackgroundColor: "transparent",
//                             }
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Whiteboard;