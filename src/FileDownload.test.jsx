import React from "react";
import { describe, expect, it } from "vitest";
import {render} from "@testing-library/react";
import FileDownload from "./FileDownload.jsx";

// TODO: Import test data directly 
const data = [
  { name: "smss.exe", device: "Stark", path: "\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe", status: "scheduled" },
  { name: "netsh.exe", device: "Targaryen", path: "\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe", status: "available" },
  { name: "uxtheme.dll", device: "Lannister", path: "\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll", status: "available" },
  { name: "cryptbase.dll", device: "Martell", path: "\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll", status: "scheduled" },
  { name: "7za.exe", device: "Baratheon", path: "\\Device\\HarddiskVolume1\\temp\\7za.exe", status: "scheduled" }
];


describe("File Download:", () => {
  it ("Will initially have no files selected.", () => {
    const container = render(<FileDownload fileData={data}/>);
    expect(container.getByText("None Selected")).toBeTruthy();
    expect(container.queryByText("Download Selected")).not.toBeTruthy();
    const checkboxes = container.getAllByRole("checkbox");
    let anyChecked = false;
    checkboxes.forEach(box => {
      if (box.checked) anyChecked = true;
    });
    expect(anyChecked).toBe(false);
  
  });

  it ("Will have six table rows.", () => {
    const container = render(<FileDownload fileData={data}/>);
    const rows = container.getAllByRole("row");
    expect(rows).toHaveLength(6);
  });

  it ("Will have three disabled checkboxes and three enabled checkboxes.", () => {
    const container = render(<FileDownload fileData={data}/>);
    const checkboxes = container.getAllByRole("checkbox");
    let disabledCheckboxCount = 0;
    let enabledCheckboxCount = 0;
    checkboxes.forEach(box => {
      if (box.disabled) {
        disabledCheckboxCount = disabledCheckboxCount + 1;
      } else {
        enabledCheckboxCount = enabledCheckboxCount + 1;
      }
    });
    expect(disabledCheckboxCount).toBe(3);
    expect(enabledCheckboxCount).toBe(3);
  });
});
