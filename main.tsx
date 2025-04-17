import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Google Fonts
const addGoogleFonts = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
};

// Set document title
const setDocumentTitle = () => {
  const title = document.createElement('title');
  title.textContent = 'هدايا - مفاجآت | GIFT IT';
  document.head.appendChild(title);
};

// Initialize app
const initialize = () => {
  addGoogleFonts();
  setDocumentTitle();
  createRoot(document.getElementById("root")!).render(<App />);
};

initialize();
