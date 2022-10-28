import { React, useEffect, useRef, useState } from "react";
import "./fileDownload.scss";
import PropTypes from "prop-types";

const FileDownload = ({fileData}) => {

  // Object to define file selection options.
  // UNAVAILABLE is used for files having a "scheduled" status.
  const SELECT = {
    UNAVAILABLE: -1,
    NOT_CHOSEN: 0,
    CHOSEN: 1,
  };

  // Variable for maximum amount of files that can be chosen.
  let maxFileSelectCount = 0;

  // Variable for initial file selection state tracking.
  const initialSelection = [];

  // Inspect file data for initial variable values.
  fileData.map((file, index)=> {
    if (file.status === "available") {
      initialSelection[index] = SELECT.NOT_CHOSEN;
      maxFileSelectCount = maxFileSelectCount + 1;
    } else {
      initialSelection[index] = SELECT.UNAVAILABLE;
    }
  });

  // Set initial state for file selection.
  const [fileSelection, setFileSelection] = useState(initialSelection);

  // References for file input boxes and "select all" checkbox.
  const fileSelectionRefs = useRef([]);
  const selectAllCheckboxRef = useRef();

  // Return the number of currently selected files.
  const getSelectedFileCount = () => {
    let count = 0;
    fileSelection.map((file) => {
      if (file === SELECT.CHOSEN) count = count + 1; 
    });
    return count;
  };
  
  // Use checkbox references to update file selection state.
  const handleFileSelection = () => {
    const updatedFileSelection = [];
    fileSelectionRefs.current.map((ref, index) => {
      if (!ref.disabled && ref.checked) {
        updatedFileSelection[index] = SELECT.CHOSEN;
      } else if (!ref.disabled && !ref.checked) {
        updatedFileSelection[index] = SELECT.NOT_CHOSEN;
      } else {
        updatedFileSelection[index] = fileSelection[index];
      }
    });
    setFileSelection(updatedFileSelection);
  };

  const handleSelectAll = () => {
    // Determine the state of file selections to set based on current state of 
    // the "select all" checkbox.
    let checkAllState = SELECT.NOT_CHOSEN;
    if (selectAllCheckboxRef.current.indeterminate) {
      checkAllState = SELECT.CHOSEN;
    } else if (selectAllCheckboxRef.current.checked === true) {
      checkAllState = SELECT.CHOSEN;
    } else {
      checkAllState = SELECT.NOT_CHOSEN;
    }

    // Update file selection state.
    const updatedFileSelection = [];
    fileSelection.map((file, index) => {
      if (file !== SELECT.UNAVAILABLE) {
        updatedFileSelection[index] = checkAllState;
      } else {
        updatedFileSelection[index] = fileSelection[index];
      }
    });
    setFileSelection(updatedFileSelection);
  };

  // Manages alert displayed for file downloads.
  const handleFileDownload = (event) => {
    event.preventDefault();
    let alertMessage = "The following files will be downloaded:";
    fileSelection.map((file, index) => {
      if (file === SELECT.CHOSEN) {
        alertMessage = alertMessage.concat("\n\nPath: ", fileData[index].path, "\nDevice: ", fileData[index].device);
      }
    });
    alert(alertMessage);
  };

  useEffect(()=> {
    // Handle state of the "Select all" checkbox which can't always be accomplished in the HTML render.
    switch (getSelectedFileCount()) {
    case maxFileSelectCount:
      selectAllCheckboxRef.current.indeterminate = false;
      selectAllCheckboxRef.current.checked = true;
      break;
    case 0:
      selectAllCheckboxRef.current.indeterminate = false;
      selectAllCheckboxRef.current.checked = false;
      break;
    default:
      selectAllCheckboxRef.current.indeterminate = true;
      selectAllCheckboxRef.current.checked = false;
      break;
    }
  }, [fileSelection]);

  return (
    <div className="FileDownload">
      <div className="actionBar">
        <span>
          <input 
            aria-label="Select all available files."
            onClick={handleSelectAll}
            ref={selectAllCheckboxRef}
            type="checkbox" 
          />
        </span>
        <span>{ getSelectedFileCount() === 0 ? "None Selected" : `Selected ${getSelectedFileCount()}`}</span>
        { getSelectedFileCount() === 0 ? "" : <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="1rem" viewBox="0 0 24 24">
            <path d="M16 11h5l-9 10-9-10h5v-11h8v11zm1 11h-10v2h10v-2z"/>
          </svg>
          <a href="#" onClick={handleFileDownload}>Download Selected</a></span>
        }
      </div>
      {/*
        NOTE: <table> is sometimes avoided, even when displaying tabular data. 
        Using <table> rather than other stylized containers will allow the elements 
        to natively inherit important aria roles.
      */}
      <table className="fileListing">
        <thead>
          <tr>
            <td></td>
            <td>Name</td>
            <td>Device</td>
            <td>Path</td>
            <td className="no-wrap">
              <svg height="1rem" width="2rem" aria-hidden="true" />
              Status
            </td>
          </tr>
        </thead>
        {/* 
          NOTE: an index is used for element keys in the following loop, which is
          not an ideal practice in React. A key like `${file.device}-${file.path}-${file-name}`
          could alternativelty be used if it could be trusted as a unique identifier.
        */}
        <tbody>
          {
            fileData.map((file, index) => {
              return (
                <tr
                  key={index} 
                  className={fileSelection[index] === SELECT.CHOSEN ? "selected" : ""} 
                > 
                  <td>
                    <input
                      aria-label={file.status !== "available" ? "File is not available for download" : null}
                      checked={fileSelection[index] === SELECT.CHOSEN}
                      disabled={file.status !== "available" ? "disabled" : null}
                      onChange={event => handleFileSelection(event)}
                      ref={(element) => {
                        fileSelectionRefs.current[index] = element;
                      }}
                      type="checkbox" 
                    />
                  </td>
                  <td>
                    {file.name}
                  </td>
                  <td>
                    {file.device}
                  </td>
                  <td>
                    {file.path}
                  </td>
                  <td className="no-wrap">
                    <svg height="1rem" width="2rem" aria-hidden="true" className="icon_availability">
                      {file.status === "available" ?
                        <circle cx="1rem" cy="0.5rem" r="0.5rem" />
                        :
                        null
                      }
                    </svg>
                    {file.status}
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

FileDownload.propTypes = {
  fileData: PropTypes.array.isRequired
};

export default FileDownload;
