import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'


const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
}
