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