
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// Define types for our containers, components, etc.
export interface Component {
  id: string;
  type: string;
  label?: string;
  component: string | any;
}

export interface Container {
  id: string;
  title: string;
  component: Component;
}

interface WebsiteBuilderState {
  containers: Container[];
}

const initialState: WebsiteBuilderState = {
  containers: [
    {
      id: '1',
      title: 'Components',
      component: {
        id: 'c1',
        type: 'Button',
        label: 'Primary Button',
        component: `import React from 'react';

export default function Button() {
  return (
    <button className="button-component bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      Click Me
    </button>
  );
}`
      }
    },
    {
      id: '2',
      title: 'Layouts',
      component: {
        id: 'c2',
        type: 'Header',
        label: 'Main Header',
        component: `import React from 'react';

export default function Header() {
  return (
    <header className="header-component bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold">Website Header</h1>
      <nav className="mt-2">
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}`
      }
    },
  ]
};

const websiteBuilderSlice = createSlice({
  name: 'websiteBuilder',
  initialState,
  reducers: {
    addContainer: (state, action: PayloadAction<Container>) => {
      state.containers.push(action.payload);
    },
    updateComponentCode: (state, action: PayloadAction<{ containerId: string; code: string }>) => {
      const { containerId, code } = action.payload;
      const containerIndex = state.containers.findIndex(c => c.id === containerId);
      
      if (containerIndex !== -1) {
        state.containers[containerIndex].component.component = code;
      }
    },
    addNewFile: (state, action: PayloadAction<{ folderId: string; fileName: string }>) => {
      const { folderId, fileName } = action.payload;
      const containerIndex = state.containers.findIndex(c => c.id === folderId);
      
      if (containerIndex !== -1) {
        const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        state.containers[containerIndex].component = {
          id: newId,
          type: fileName.split('.')[0],
          label: fileName.split('.')[0],
          component: `import React from 'react';

export default function ${fileName.split('.')[0]}() {
  return (
    <div className="${fileName.split('.')[0].toLowerCase()}-component">
      <h2>${fileName.split('.')[0]}</h2>
      {/* Add your component content here */}
    </div>
  );
}`
        };
      }
    },
    addNewFolder: (state, action: PayloadAction<{ folderName: string }>) => {
      const { folderName } = action.payload;
      const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const componentId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      
      state.containers.push({
        id: newId,
        title: folderName,
        component: {
          id: componentId,
          type: 'NewComponent',
          label: 'New Component',
          component: `import React from 'react';

export default function NewComponent() {
  return (
    <div className="new-component">
      <h2>New Component</h2>
      {/* Add your component content here */}
    </div>
  );
}`
        }
      });
    },
    deleteFolder: (state, action: PayloadAction<{ folderId: string }>) => {
      const { folderId } = action.payload;
      state.containers = state.containers.filter(c => c.id !== folderId);
    }
  }
});

export const { 
  addContainer, 
  updateComponentCode, 
  addNewFile, 
  addNewFolder,
  deleteFolder
} = websiteBuilderSlice.actions;

export const selectContainers = (state: RootState) => state.websiteBuilder.containers;

export default websiteBuilderSlice.reducer;
