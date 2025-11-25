import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./custom_style/scrollbar.css"
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
    <Analytics/>
  </ThemeProvider>
);
