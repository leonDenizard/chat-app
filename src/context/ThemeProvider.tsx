import { createContext, useContext, useEffect, useState, type ReactNode } from "react"


type Theme = "light" | "dark"

interface ThemeContextProps{
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

interface ThemeProviderProps{
    children: ReactNode
}
export function ThemeProvider({children}: ThemeProviderProps){

    const [theme, setTheme] = useState<Theme>(() => {

        const savedTheme = localStorage.getItem("theme") as Theme

        if(savedTheme) return savedTheme

        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    })

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")
        root.classList.add(theme)

        localStorage.setItem("theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme( theme === "light" ? "dark" : "light")
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme(): ThemeContextProps {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  
  return context;
}