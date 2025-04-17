
import { useEffect, useState } from "react";
import { Code } from "lucide-react";

interface CodePreviewProps {
  code: string;
  fileName: string;
}

const CodePreview = ({ code, fileName }: CodePreviewProps) => {
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

  // Create sandbox for preview content
  const sandboxHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: system-ui, sans-serif; padding: 1rem; }
          .preview-error { color: red; border: 1px solid red; padding: 1rem; }
          .preview-css-message { padding: 1rem; background: #f1f5f9; border-radius: 0.5rem; text-align: center; }
        </style>
      </head>
      <body>
        ${error ? `<div class="preview-error">${error}</div>` : renderedOutput}
      </body>
    </html>
  `;

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-2 border-b text-sm font-medium flex items-center">
        <Code size={16} className="mr-2 text-blue-600" />
        Preview {fileName && `(${fileName})`}
      </div>
      <div className="flex-grow bg-white border-gray-200 overflow-auto">
        {code ? (
          <iframe
            title="Code Preview"
            srcDoc={sandboxHtml}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500">
            <Code size={48} className="mb-4 text-gray-300" />
            <p className="text-lg mb-2">No preview available</p>
            <p className="text-sm text-gray-400">Select a file to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePreview;
