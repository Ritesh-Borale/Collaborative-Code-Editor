import React, { createContext, useState, useContext,useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [allFiles, setAllFiles] = useState(new Set(["Hello.txt"])); 
    const [fileContents, setFileContents] = useState({["Hello.txt"]:
        `
A Collaborative Code Editor is a powerful tool that allows multiple developers to write, debug, and collaborate on 
code in real time from different locations. 🌍💻 

This editor integrates a real-time coding environment, enabling seamless editing, live updates, and instant 
sharing of code changes with team members. 💡 

Along with coding, the platform enhances teamwork by featuring a chat functionality 💬, 
allowing developers to communicate directly, discuss code, and troubleshoot issues as they arise. 

To take collaboration to the next level, the editor also includes an AI integration 🤖 
that can assist developers by offering smart code suggestions, automatic error detection, 
and even refactoring code for optimal performance. 

A built-in whiteboard 📝 provides a space for brainstorming, sketching ideas, and 
visually explaining complex algorithms or structures, making it easier for the team to align on project goals. 

Together, these features make the Collaborative Code Editor an indispensable tool for 
efficient, interactive, and productive software development. 🚀
        `}); 


    return (
        <UserContext.Provider value={{ allFiles, setAllFiles, fileContents, setFileContents }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
