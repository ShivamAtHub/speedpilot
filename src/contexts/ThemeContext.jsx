import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light")

    useEffect(() => {
        // Load theme from storage
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.get(["theme"], (data) => {
                const savedTheme = data.theme || "light"
                setTheme(savedTheme)
                applyTheme(savedTheme)
            })
        } else {
            // Fallback for development
            const savedTheme = localStorage.getItem("theme") || "light"
            setTheme(savedTheme)
            applyTheme(savedTheme)
        }
    }, [])

    const applyTheme = (newTheme) => {
        const root = document.documentElement
        if (newTheme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        applyTheme(newTheme)

        // Save to storage
        if (typeof chrome !== "undefined" && chrome.storage?.sync) {
            chrome.storage.sync.set({ theme: newTheme })
        } else {
            localStorage.setItem("theme", newTheme)
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider")
    }
    return context
}

