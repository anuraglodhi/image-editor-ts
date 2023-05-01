import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Editor from "./Editor";
import { store } from "./app/store";
import { Provider } from "react-redux";
import Share from "./Share";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Share />,
  },
  {
    path: "/editor",
    element: <Editor />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
