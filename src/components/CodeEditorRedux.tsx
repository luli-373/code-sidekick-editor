
import { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectContainers,
  updateComponentCode,
  addNewFile,
  addNewFolder,
  deleteFolder
} from "../reduxState/websiteBuilderSlice";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/markdown-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldgutter.css";
import { Download, ChevronRight, ChevronDown, Folder, FileText, Code, Save, ArrowLeft, FilePlus, FolderPlus } from "lucide-react";
import "./CodeEditor.css";
import reactElementToJSXString from "react-element-to-jsx-string";

interface FileData {
  containerId: string;
  componentId: string;
  name: string;
  content: string;
}

const CodeEditorRedux = () => {
  const dispatch = useDispatch();
  const containers = useSelector(selectContainers);

  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Initialize expanded folders when containers change
  useEffect(() => {
    if (containers && containers.length > 0) {
      // Expand all folders by default
      const expanded: Record<string, boolean> = {};
      containers.forEach((container) => {
        expanded[container.id] = true;
      });
      setExpandedFolders(expanded);
    }
  }, [containers]);

  // Get language mode based on file extension
  const getLanguageMode = (fileName: string) => {
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "jsx";
    if (fileName.endsWith(".html")) return "xml";
    if (fileName.endsWith(".css")) return "css";
    return "jsx"; // Default
  };

  // Convert React element to JSX string safely
  const convertToString = (element: any): string => {
    if (!element) return "";
    if (typeof element === "string") return element;
    
    try {
      return reactElementToJSXString(element, {
        showFunctions: true,
        useBooleanShorthandSyntax: true,
      });
    } catch (error) {
      console.error("Error converting element to JSX string:", error);
      return "// Error rendering component";
    }
  };

  // Handle file selection
  const handleFileSelect = (containerId: string, componentId: string) => {
    const container = containers.find((c) => c.id === containerId);
    if (container && container.component) {
      // Create a component template if no actual code exists
      let componentCode;
      if (typeof container.component.component === "string") {
        componentCode = container.component.component;
      } else {
        componentCode = `import React from 'react';

export default function ${container.component.type}() {
  return (
    <div className="${container.component.type.toLowerCase()}-component">
      <h2>${container.component.label || container.component.type}</h2>
      {/* Add your component content here */}
      ${convertToString(container.component.component)}
    </div>
  );
}`;
      }

      const fileData: FileData = {
        containerId,
        componentId: container.component.id,
        name: `${container.component.type}.jsx`,
        content: componentCode,
      };

      setSelectedFile(fileData);
      setFileContent(fileData.content);
    }
  };

  // Toggle folder expansion
  const toggleFolder = (containerId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [containerId]: !prev[containerId],
    }));
  };

  // Save current file
  const saveFile = () => {
    if (!selectedFile) {
      alert("No file selected");
      return;
    }

    // Dispatch action to update the component code in Redux
    dispatch(
      updateComponentCode({
        containerId: selectedFile.containerId,
        code: fileContent,
      })
    );

    alert("File saved successfully!");
  };

  // Export project
  const handleExport = async () => {
    try {
      // This would be implemented with JSZip
      alert("Export functionality would be implemented here");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export project. See console for details.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* File Explorer */}
      <div className="w-72 border-r border-gray-200 overflow-auto bg-white shadow-sm">
        <div className="p-4 font-bold border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center">
            <Code className="mr-2 text-blue-600" size={18} />
            <span>Project Files</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const fileName = prompt("Enter file name (with extension):", "NewComponent.jsx");
                if (fileName) {
                  const selectedContainer = containers[0]?.id;
                  if (selectedContainer) {
                    dispatch(addNewFile({ folderId: selectedContainer, fileName }));
                  } else {
                    alert("Please create a folder first");
                  }
                }
              }}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Add new file"
            >
              <FilePlus size={16} />
            </button>
            <button 
              onClick={() => {
                const folderName = prompt("Enter folder name:", "New Folder");
                if (folderName) {
                  dispatch(addNewFolder({ folderName }));
                }
              }}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Add new folder"
            >
              <FolderPlus size={16} />
            </button>
          </div>
        </div>

        <div className="p-2 file-explorer">
          {containers && containers.length > 0 ? (
            containers.map((container) => (
              <div key={container.id} className="mb-1">
                <div
                  className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded file-explorer-item ${
                    selectedFile && selectedFile.containerId === container.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleFolder(container.id)}
                >
                  {expandedFolders[container.id] ? (
                    <ChevronDown size={16} className="mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="mr-1 text-gray-500" />
                  )}
                  <Folder size={16} className="mr-2 text-blue-500" />
                  <span className="text-sm">{container.title || `Container ${container.id}`}</span>
                </div>

                {expandedFolders[container.id] && container.component && (
                  <div
                    className={`ml-6 p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center file-explorer-item ${
                      selectedFile &&
                      selectedFile.containerId === container.id &&
                      selectedFile.componentId === container.component.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleFileSelect(container.id, container.component.id)}
                  >
                    <FileText size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">{container.component.type}.jsx</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-sm">No files available</div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-col flex-grow">
        {/* Toolbar */}
        <div className="flex items-center p-3 border-b border-gray-200 bg-white shadow-sm">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded mr-2"
            onClick={() => navigate("/")}
            title="Back to Builder"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-grow mx-2">
            {selectedFile ? (
              <span className="font-medium text-sm">{selectedFile.name}</span>
            ) : (
              <span className="text-gray-500 text-sm">No file selected</span>
            )}
          </div>

          <button
            className={`p-2 rounded mr-2 flex items-center ${
              selectedFile ? "text-blue-600 hover:bg-blue-50" : "text-gray-400"
            }`}
            onClick={saveFile}
            disabled={!selectedFile}
            title="Save file"
          >
            <Save size={18} className="mr-1" />
            <span className="text-sm">Save</span>
          </button>

          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            onClick={handleExport}
            title="Export project"
          >
            <Download size={18} />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-grow overflow-hidden">
          {selectedFile ? (
            <div className="h-full">
              <CodeMirror
                value={fileContent}
                options={{
                  mode: getLanguageMode(selectedFile.name),
                  lineNumbers: true,
                  extraKeys: { "Ctrl-Space": "autocomplete" },
                  styleActiveLine: true,
                  lineWrapping: true,
                  theme: "default",
                  autoCloseBrackets: true,
                  autoCloseTags: true,
                  foldGutter: true,
                  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                }}
                onBeforeChange={(editor, data, value) => {
                  setFileContent(value);
                }}
                editorDidMount={(editor) => {
                  editor.refresh();
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
              <Code size={48} className="mb-4 text-gray-300" />
              <p className="text-lg mb-2">Select a file to edit</p>
              <p className="text-sm text-gray-400">Files are organized by containers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorRedux;
