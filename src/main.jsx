import React from "react";
import ReactDOM from "react-dom/client";
import FileDownload from "./FileDownload";
import FileData from "./data/FileData";
import "./App.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FileDownload fileData={FileData} />
  </React.StrictMode>
);
