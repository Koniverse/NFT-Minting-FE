import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {ThemeProvider} from "./contexts/ThemeContext";
import {RouterProvider} from "react-router";
import {router} from "./router";
import {AppContextProvider} from "./contexts/AppContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AppContextProvider>
        <RouterProvider router={router}/>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

