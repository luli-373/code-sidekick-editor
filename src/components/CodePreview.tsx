
import { useEffect, useState } from "react";
import { Code } from "lucide-react";

interface CodePreviewProps {
  code: string;
  fileName: string;
  isDarkMode?: boolean;
}

const CodePreview = ({ code, fileName, isDarkMode = false }: CodePreviewProps) => {
  const [renderedOutput, setRenderedOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Basic rendering for preview - in a real app you'd use a more sophisticated approach
      if (code) {
        // Extract JSX from the component (very simplified approach)
        if (fileName.endsWith(".jsx") || fileName.endsWith(".js") || fileName.endsWith(".tsx")) {
          const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;/);
          if (returnMatch && returnMatch[1]) {
            setRenderedOutput(returnMatch[1]);
            setError(null);
          } else {
            setRenderedOutput("<div>No renderable content found</div>");
            setError(null);
          }
        } else if (fileName.endsWith(".html")) {
          setRenderedOutput(code);
          setError(null);
        } else if (fileName.endsWith(".css")) {
          setRenderedOutput(`<style>${code}</style><div class="preview-css-message">CSS Preview</div>`);
          setError(null);
        } else {
          // For other file types, just display the code
          setRenderedOutput(`<pre>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`);
          setError(null);
        }
      } else {
        setRenderedOutput("");
        setError(null);
      }
    } catch (err) {
      console.error("Preview rendering error:", err);
      setError("Error rendering preview");
      setRenderedOutput("");
    }
  }, [code, fileName]);

  // Create sandbox for preview content
  const sandboxHtml = `
    <!DOCTYPE html>
    <html class="${isDarkMode ? 'dark' : ''}">
      <head>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            padding: 1rem; 
            background-color: ${isDarkMode ? '#1e1e1e' : '#ffffff'}; 
            color: ${isDarkMode ? '#ffffff' : '#000000'};
          }
          pre {
            background-color: ${isDarkMode ? '#2d2d2d' : '#f1f5f9'};
            padding: 1rem;
            border-radius: 0.5rem;
            overflow: auto;
            font-family: monospace;
            white-space: pre-wrap;
            color: ${isDarkMode ? '#e0e0e0' : '#374151'};
          }
          .preview-error { 
            color: #ef4444; 
            border: 1px solid #ef4444; 
            padding: 1rem; 
            background-color: ${isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'};
          }
          .preview-css-message { 
            padding: 1rem; 
            background: ${isDarkMode ? '#2d2d2d' : '#f1f5f9'}; 
            border-radius: 0.5rem; 
            text-align: center; 
          }
          nav.bg-gray-800 {
            background-color: #1f2937;
          }
          .text-white {
            color: #ffffff;
          }
          .hover\\:text-gray-400:hover {
            color: #9ca3af;
          }
          .hover\\:bg-gray-600:hover {
            background-color: #4b5563;
          }
          .bg-gray-700 {
            background-color: #374151;
          }
        </style>
      </head>
      <body>
        ${error ? `<div class="preview-error">${error}</div>` : renderedOutput}
      </body>
    </html>
  `;

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} p-2 border-b text-sm font-medium flex items-center`}>
        <Code size={16} className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        Preview {fileName && `(${fileName})`}
      </div>
      <div className={`flex-grow ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-auto`}>
        {code ? (
          <iframe
            title="Code Preview"
            srcDoc={sandboxHtml}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <Code size={48} className={isDarkMode ? 'mb-4 text-gray-600' : 'mb-4 text-gray-300'} />
            <p className="text-lg mb-2">No preview available</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Select a file to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;
