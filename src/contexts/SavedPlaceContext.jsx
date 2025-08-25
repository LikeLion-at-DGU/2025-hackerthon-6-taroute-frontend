import React, { createContext, useContext } from 'react';
import useLoadSavedPlace from '../hooks/plan/LoadSavedPlace';

const SavedPlaceContext = createContext();

export const SavedPlaceProvider = ({ children }) => {
    const savedPlaceHook = useLoadSavedPlace();
    
    return (
        <SavedPlaceContext.Provider value={savedPlaceHook}>
            {children}
        </SavedPlaceContext.Provider>
    );
};

export const useSavedPlaceContext = () => {
    const context = useContext(SavedPlaceContext);
    if (!context) {
        throw new Error('useSavedPlaceContext must be used within SavedPlaceProvider');
    }
    return context;
};
