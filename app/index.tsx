import React from 'react';
import { App } from './components/App';
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById('root') as HTMLElement;

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
