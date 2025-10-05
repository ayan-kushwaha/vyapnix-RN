// src/context/TabBarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TabBarContextType {
    isTabBarVisible: boolean;
    setTabBarVisible: (visible: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider = ({ children }: { children: ReactNode }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    return (
        <TabBarContext.Provider value={{ isTabBarVisible, setTabBarVisible: setIsTabBarVisible }}>
            {children}
        </TabBarContext.Provider>
    );
};

export const useTabBar = () => {
    const context = useContext(TabBarContext);
    if (!context) throw new Error("useTabBar must be used within TabBarProvider");
    return context;
};
