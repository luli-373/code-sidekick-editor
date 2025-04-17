
import { useEffect, useState } from "react";
import { Code } from "lucide-react";

interface CodePreviewProps {
  code: string;
  fileName: string;
  isDarkMode: boolean;
}

const CodePreview = ({ code, fileName, isDarkMode }: CodePreviewProps) => {
  const [renderedOutput, setRenderedOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Basic rendering for preview - in a real app you'd use a more sophisticated approach
      // This is a simplified version that just shows HTML/JSX-like code
      if (code && (fileName.endsWith(".jsx") || fileName.endsWith(".js"))) {
        // Extract JSX from the component (very simplified approach)
        const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;/);
        if (returnMatch && returnMatch[1]) {
          setRenderedOutput(returnMatch[1]);
          setError(null);
        } else {
          setRenderedOutput("<div>No renderable content found</div>");
          setError(null);
        }
      } else if (code && fileName.endsWith(".html")) {
        setRenderedOutput(code);
        setError(null);
      } else if (code && fileName.endsWith(".css")) {
        setRenderedOutput(`<style>${code}</style><div class="preview-css-message">CSS Preview</div>`);
        setError(null);
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

  // Create sandbox for preview content with dark/light mode styles
  const sandboxHtml = `
    <!DOCTYPE html>
    <html class="${isDarkMode ? 'dark' : ''}">
      <head>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            padding: 1rem; 
            background-color: ${isDarkMode ? '#1e1e1e' : '#ffffff'}; 
            color: ${isDarkMode ? '#eeffff' : '#333333'}; 
          }
          .preview-error { 
            color: ${isDarkMode ? '#ff6b6b' : 'red'}; 
            border: 1px solid ${isDarkMode ? '#ff6b6b' : 'red'}; 
            padding: 1rem; 
            background-color: ${isDarkMode ? 'rgba(255, 107, 107, 0.1)' : 'transparent'}; 
          }
          .preview-css-message { 
            padding: 1rem; 
            background: ${isDarkMode ? '#2d3748' : '#f1f5f9'}; 
            border-radius: 0.5rem; 
            text-align: center; 
            color: ${isDarkMode ? '#eeffff' : '#333333'}; 
          }
        </style>
      </head>
      <body>
        ${error ? `<div class="preview-error">${error}</div>` : renderedOutput}
      </body>
    </html>
  `;

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`p-2 border-b text-sm font-medium flex items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
        <Code size={16} className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        Preview {fileName && `(${fileName})`}
      </div>
      <div className={`flex-grow overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {code ? (
          <iframe
            title="Code Preview"
            srcDoc={sandboxHtml}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
            <Code size={48} className={`mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className="text-lg mb-2">No preview available</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Select a file to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;
