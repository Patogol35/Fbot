import { useState } from "react";

import {
    ThemeProvider,
    CssBaseline,
} from "@mui/material";

import Chat from "./components/Chat";
import "./App.css";

import {
    lightTheme,
    darkTheme,
} from "./theme";

function App() {

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <ThemeProvider
            theme={
                darkMode
                    ? darkTheme
                    : lightTheme
            }
        >
            <CssBaseline />

            <div className="app">
                <Chat
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />
            </div>

        </ThemeProvider>
    );
}

export default App;
