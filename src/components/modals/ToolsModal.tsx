import React, { createContext, useState, useContext, ReactNode } from 'react';

// Yeh batata hai ki context mein kya-kya hoga
type ToolsContextType = {
    activeTools: string[]; // Active tools ki list, jaise ['employeeMgmt', 'khataMgmt']
    toggleTool: (toolKey: string) => void; // Tool ko chalu/band karne wala function
};

// Default value
const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

// Provider component jo poore app ko yeh data dega
export const ToolsProvider = ({ children }: { children: ReactNode }) => {
    // Shuru mein, hum 'employeeMgmt' tool ko active rakhenge, taaki user ko dikhe
    const [activeTools, setActiveTools] = useState<string[]>(['employeeMgmt']);

    const toggleTool = (toolKey: string) => {
        setActiveTools(prevTools => {
            if (prevTools.includes(toolKey)) {
                // Agar tool pehle se active hai, to use hata do (deactivate)
                return prevTools.filter(t => t !== toolKey);
            } else {
                // Agar tool active nahi hai, to use jod do (activate)
                return [...prevTools, toolKey];
            }
        });
    };

    return (
        <ToolsContext.Provider value={{ activeTools, toggleTool }}>
            {children}
        </ToolsContext.Provider>
    );
};

// Hook jisse hum aasani se context ka istemal kar sakenge
export const useTools = () => {
    const context = useContext(ToolsContext);
    if (!context) {
        throw new Error('useTools must be used within a ToolsProvider');
    }
    return context;
};
