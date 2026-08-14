import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/index.css";

const qc = new QueryClient({ defaultOptions:{ queries:{ staleTime:1000*60*2, retry:1 } } });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        <ThemeProvider>
          <App/>
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style:{
              fontFamily:"Inter, sans-serif",
              fontSize:"14px",
              borderRadius:"8px",
            },
          }}/>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
