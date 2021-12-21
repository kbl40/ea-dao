import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// Import ThridWeb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// Include chains to support
// 4 = Rinkeby
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet"
const connectors = {
  injected: {},
};


// Wrap App with ThirdwebWeb3Provider
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <div className="landing">
        <App />
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);