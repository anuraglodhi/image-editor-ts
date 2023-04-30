import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Editor from "./Editor";
import { store } from "./app/store";
import { Provider } from "react-redux";
import Share from "./Share";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Share />
    </Provider>
  </React.StrictMode>
);
