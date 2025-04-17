
import { Container, Component } from '../reduxState/websiteBuilderSlice';

// Generate a simple ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get a template based on file extension
export const getFileTemplate = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'jsx':
    case 'tsx':
      return `import React from 'react';

export default function NewComponent() {
  return (
    <div className="new-component">
      <h2>New Component</h2>
      {/* Add your code here */}
    </div>
  );
}`;

    case 'css':
      return `/* ${fileName} styles */

.component {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
}`;

    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;

    default:
      return `// ${fileName}
// Add your code here
`;
  }
};

// Create a new file in a specific folder
export const createNewFile = (
  containers: Container[], 
  folderId: string, 
  fileName: string
): Container[] => {
  return containers.map(container => {
    if (container.id === folderId) {
      // For simplicity, we're just overwriting the component
      // In a real app, you'd want to support multiple files per folder
      const newComponent: Component = {
        id: generateId(),
        type: fileName.split('.')[0],
        component: getFileTemplate(fileName),
      };
      
      return {
        ...container,
        component: newComponent
      };
    }
    return container;
  });
};

// Delete a file
export const deleteFile = (
  containers: Container[],
  folderId: string
): Container[] => {
  return containers.map(container => {
    if (container.id === folderId) {
      // Remove the component from the container
      // In a real app with multiple files, you'd use the componentId as well
      return {
        ...container,
        component: undefined as any // This is a simplification
      };
    }
    return container;
  });
};

// Create a new folder
export const createNewFolder = (
  containers: Container[],
  folderName: string
): Container[] => {
  const newFolder: Container = {
    id: generateId(),
    title: folderName,
    component: {
      id: generateId(),
      type: 'NewComponent',
      component: getFileTemplate('NewComponent.jsx')
    }
  };
  
  return [...containers, newFolder];
};
