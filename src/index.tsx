import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router";
import {router} from "./router";
import {ThemeProvider} from "./providers/ThemeProvider";
import {WalletProvider} from "./providers/WalletProvider";
import NotificationProvider from './providers/NotificationProvider';
import {ScreenContextProvider} from "./providers/ScreenProvider";
import {AppStateProvider} from './providers/AppStateProvider';
import {ModalProvider} from "./providers/ModalProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <WalletProvider>
          <AppStateProvider>
            <ScreenContextProvider>
              <ModalProvider>
                <RouterProvider router={router}/>
              </ModalProvider>
            </ScreenContextProvider>
          </AppStateProvider>
        </WalletProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);

