import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store"; 
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅ import AuthProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>   {/* ✅ wrap App inside AuthProvider */}
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
