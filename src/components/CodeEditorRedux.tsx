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
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import { 
  Download, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  Code, 
  Save, 
  ArrowLeft, 
  FilePlus, 
  FolderPlus,
  LayoutPanelLeft,
  Maximize,
  Minimize,
  Split,
  Sun,
  Moon
} from "lucide-react";
import "./CodeEditor.css";
import reactElementToJSXString from "react-element-to-jsx-string";
import CodePreview from "./CodePreview";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('code-editor-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    if (containers && containers.length > 0) {
      const expanded: Record<string, boolean> = {};
      containers.forEach((container) => {
        expanded[container.id] = true;
      });
      setExpandedFolders(expanded);
    }
  }, [containers]);

  useEffect(() => {
    localStorage.setItem('code-editor-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const getLanguageMode = (fileName: string) => {
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "jsx";
    if (fileName.endsWith(".html")) return "xml";
    if (fileName.endsWith(".css")) return "css";
    return "jsx";
  };

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

  const handleFileSelect = (containerId: string, componentId: string) => {
    const container = containers.find((c) => c.id === containerId);
    if (container && container.component) {
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

  const toggleFolder = (containerId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [containerId]: !prev[containerId],
    }));
  };

  const saveFile = () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    dispatch(
      updateComponentCode({
        containerId: selectedFile.containerId,
        code: fileContent,
      })
    );

    toast.success("File saved successfully!");
  };

  const handleExport = async () => {
    try {
      alert("Export functionality would be implemented here");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export project. See console for details.");
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('code-editor-theme', newTheme ? 'dark' : 'light');
    toast.success(`Switched to ${newTheme ? 'dark' : 'light'} mode`);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className={`w-72 border-r overflow-auto shadow-sm ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className={`p-4 font-bold border-b flex items-center justify-between ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center">
            <Code className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={18} />
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
                    toast.error("Please create a folder first");
                  }
                }
              }}
              className={`p-1 hover:bg-opacity-20 rounded ${
                isDarkMode ? 'text-blue-400 hover:bg-blue-800' : 'text-blue-600 hover:bg-blue-100'
              }`}
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
              className={`p-1 hover:bg-opacity-20 rounded ${
                isDarkMode ? 'text-blue-400 hover:bg-blue-800' : 'text-blue-600 hover:bg-blue-100'
              }`}
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
                  className={`flex items-center p-2 cursor-pointer rounded file-explorer-item ${
                    selectedFile && selectedFile.containerId === container.id 
                      ? isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'selected-file' 
                      : ''
                  } ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleFolder(container.id)}
                >
                  {expandedFolders[container.id] ? (
                    <ChevronDown size={16} className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <ChevronRight size={16} className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                  <Folder size={16} className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <span className="text-sm">{container.title || `Container ${container.id}`}</span>
                </div>

                {expandedFolders[container.id] && container.component && (
                  <div
                    className={`ml-6 p-2 cursor-pointer rounded flex items-center file-explorer-item ${
                      selectedFile &&
                      selectedFile.containerId === container.id &&
                      selectedFile.componentId === container.component.id
                        ? isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'selected-file'
                        : ''
                    } ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleFileSelect(container.id, container.component.id)}
                  >
                    <FileText size={16} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className="text-sm">{container.component.type}.jsx</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={`p-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No files available</div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className={`flex items-center p-3 border-b shadow-sm ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <button
            className={`p-2 rounded mr-2 ${
              isDarkMode ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => navigate("/")}
            title="Back to Builder"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-grow mx-2">
            {selectedFile ? (
              <span className="font-medium text-sm">{selectedFile.name}</span>
            ) : (
              <span className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>No file selected</span>
            )}
          </div>

          <div className="flex items-center mr-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded ${
                isDarkMode ? 'text-yellow-200 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button
            className={`p-2 rounded mr-2 ${
              isDarkMode ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={togglePreview}
            title={showPreview ? "Hide Preview" : "Show Preview"}
          >
            {showPreview ? <Minimize size={18} /> : <LayoutPanelLeft size={18} />}
          </button>

          <button
            className={`p-2 rounded mr-2 flex items-center ${
              selectedFile 
                ? isDarkMode 
                  ? 'text-blue-400 hover:bg-blue-900 hover:bg-opacity-30' 
                  : 'text-blue-600 hover:bg-blue-50'
                : isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`}
            onClick={saveFile}
            disabled={!selectedFile}
            title="Save file"
          >
            <Save size={18} className="mr-1" />
            <span className="text-sm">Save</span>
          </button>

          <button
            className={`p-2 rounded ${
              isDarkMode ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={handleExport}
            title="Export project"
          >
            <Download size={18} />
          </button>
        </div>

        <div className="flex-grow overflow-hidden">
          {selectedFile ? (
            showPreview ? (
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={25}>
                  <div className="h-full">
                    <CodeMirror
                      value={fileContent}
                      options={{
                        mode: getLanguageMode(selectedFile.name),
                        lineNumbers: true,
                        extraKeys: { "Ctrl-Space": "autocomplete" },
                        styleActiveLine: true,
                        lineWrapping: true,
                        theme: isDarkMode ? "material" : "eclipse",
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
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={50} minSize={25}>
                  <CodePreview 
                    code={fileContent} 
                    fileName={selectedFile.name} 
                    isDarkMode={isDarkMode} 
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="h-full">
                <CodeMirror
                  value={fileContent}
                  options={{
                    mode: getLanguageMode(selectedFile.name),
                    lineNumbers: true,
                    extraKeys: { "Ctrl-Space": "autocomplete" },
                    styleActiveLine: true,
                    lineWrapping: true,
                    theme: isDarkMode ? "material" : "eclipse",
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
            )
          ) : (
            <div className={`flex flex-col items-center justify-center h-full ${
              isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-500'
            }`}>
              <Code size={48} className={isDarkMode ? 'mb-4 text-gray-600' : 'mb-4 text-gray-300'} />
              <p className="text-lg mb-2">Select a file to edit</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Files are organized by containers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorRedux;
