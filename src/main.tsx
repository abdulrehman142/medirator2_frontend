import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Avoid React StrictMode double-mount in production-like flows so
// google.accounts.id.initialize() is not called twice.
createRoot(document.getElementById("root")!).render(<App />);
