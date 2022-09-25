import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useMetaMask } from "../hooks/useMetaMask";
import CachedIcon from "@mui/icons-material/Cached";
import { connected } from "process";

interface Props {
  accountSelected?: string;
  connectedNetwork?: string;
  getAccounts: () => void;
}

const ConnectAppBar: React.FC<Props> = ({
  accountSelected,
  connectedNetwork,
  getAccounts,
}) => {
  return (
    <AppBar>
      <Toolbar>
        <Button color="inherit" onClick={() => getAccounts()}>
          {!accountSelected ? (
            "Connect to MetaMask"
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {accountSelected}
              <CachedIcon />
            </div>
          )}
        </Button>
        <Typography variant="h6" component="div" sx={{ marginLeft: "auto" }}>
          {connectedNetwork &&
            (connectedNetwork === "homestead"
              ? "Connected to Ethereum network"
              : `Connected to ${connectedNetwork}, please connect to Ethereum network`)}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default ConnectAppBar;
