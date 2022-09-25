import { Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import "./App.css";
import { useMetaMask } from "./hooks/useMetaMask";

function App() {
  const {
    accounts,
    getAccounts,
    getBalance,
    ethBalance,
    nexoBalance,
    error,
    loading,
  } = useMetaMask();
  const accountSelected = accounts[0];

  useEffect(() => {
    getBalance(accountSelected);
  }, [accountSelected]);

  return (
    <div className="App">
      <div>
        <Button onClick={() => getAccounts()}>Connect to MetaMask</Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : !error ? (
        `
      ETH Balance: ${ethBalance}
      NEXO Balance: ${nexoBalance}`
      ) : (
        error
      )}
    </div>
  );
}

export default App;
