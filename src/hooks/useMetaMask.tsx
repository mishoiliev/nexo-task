import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const NEXO_CONTRACT = "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Props {
  accounts: string[];
  ethBalance?: string;
  nexoBalance?: string;
  error?: string;
  loading: boolean;
  getAccounts: () => void;
  getBalance: (account: string) => void;
}

export const useMetaMask = (): Props => {
  const [accounts, setAccounts] = useState<Array<string>>([]);
  const [ethBalance, setEthBalance] = useState<string>();
  const [nexoBalance, setNexoBalance] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    console.log(accounts);
    if (accounts.length === 0) {
      setError("Please connect to MetaMask");
    } else {
      setError("");
    }
  }, [accounts]);

  const getAccounts = async () => {
    const accts = await provider
      .send("eth_requestAccounts", [])
      .catch((err) => {
        console.error(err);
      });

    setAccounts(accts);
    setLoading(false);
  };

  const convertBalance = (balance: string) => {
    return (parseInt(balance) / Math.pow(10, 18)).toFixed(4);
  };

  const getBalance = async (account: string) => {
    setLoading(true);
    const chainId = (await provider.getNetwork()).name;
    console.log(account);
    setLoading(false);

    if (chainId === "homestead" && account) {
      setLoading(true);
      const ethBalance = await provider.send("eth_getBalance", [
        account,
        "latest",
      ]);
      const token = new ethers.Contract(
        NEXO_CONTRACT,
        ["function balanceOf(address) external view returns (uint256)"],
        provider
      );
      const nexoBalance = await token.balanceOf(account);

      const ethBalanceConverted = convertBalance(ethBalance);
      const nexoBalanceConverted = convertBalance(nexoBalance);

      setEthBalance(ethBalanceConverted);
      setNexoBalance(nexoBalanceConverted);
      setLoading(false);
    } else {
      setError("Please change network to Ethereum");
    }
  };

  return {
    accounts,
    ethBalance,
    nexoBalance,
    error,
    loading,
    getAccounts,
    getBalance,
  };
};
