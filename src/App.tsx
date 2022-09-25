import { Alert, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import "./App.css";
import Balance from "./components/Balance";
import ConnectAppBar from "./components/ConnectAppBar";
import TradeForm from "./components/TradeForm";
import { WETH_CONTRACT } from "./constants";
import { useMetaMask } from "./hooks/useMetaMask";

function App() {
  const {
    accounts,
    error,
    loading,
    ethBalance,
    nexoBalance,
    wETHBalance,
    connectedNetwork,
    etherPriceUSD,
    getBalance,
    getAccounts,
    transferEth,
    swapWETHtoNEXO,
  } = useMetaMask();

  const accountSelected = accounts[0];

  useEffect(() => {
    if (accountSelected) {
      getBalance(accountSelected);
    }
  }, [accountSelected]);

  return (
    <div className="App">
      <ConnectAppBar
        connectedNetwork={connectedNetwork}
        getAccounts={getAccounts}
        accountSelected={accountSelected}
      />
      <div style={{ height: "64px" }} />
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        !error && (
          <div>
            <Balance
              ethPriceUSD={etherPriceUSD || "0"}
              ethBalance={ethBalance || "0"}
              nexoBalance={nexoBalance || "0"}
              wEthBalance={wETHBalance || "0"}
            />
            <TradeForm
              availableBalance={ethBalance}
              buttonContent="Wrap ETH to WETH"
              onSubmitAction={(amount) => transferEth(WETH_CONTRACT, amount)}
            />
            <TradeForm
              availableBalance={wETHBalance}
              buttonContent="Swap WETH to NEXO"
              onSubmitAction={(amount) => swapWETHtoNEXO(amount)}
            />
          </div>
        )
      )}
    </div>
  );
}

export default App;
