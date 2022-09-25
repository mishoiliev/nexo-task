import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  ERC20_ABI,
  NEXO_CONTRACT,
  NEXO_CONTRACT_RINKEBY,
  USDC_CONTRACT,
  WETH_CONTRACT,
  WETH_CONTRACT_RINKEBY,
} from "../constants";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Props {
  accounts: string[];
  ethBalance?: string;
  nexoBalance?: string;
  wETHBalance?: string;
  error?: string;
  loading: boolean;
  connectedNetwork?: string;
  etherPriceUSD?: string;
  swapWETHtoNEXO: (amount: number | string) => void;
  getAccounts: () => void;
  getBalance: (account: string) => void;
  transferEth: (addressTo: string, value: string) => void;
}

export const useMetaMask = (): Props => {
  const [accounts, setAccounts] = useState<Array<string>>([]);
  const [ethBalance, setEthBalance] = useState<string>();
  const [nexoBalance, setNexoBalance] = useState<string>();
  const [wETHBalance, setWETHBalance] = useState<string>();
  const [etherPriceUSD, setEtherPriceUSD] = useState<string>();
  const [connectedNetwork, setConnectedNetwork] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    setLoading(true);
    if (accounts.length === 0) {
      setError("Please connect to MetaMask");
    } else {
      getUSDCPrice();
      setError("");
    }
    setLoading(false);
  }, [accounts]);

  const swapWETHtoNEXO = async (amount: number | string) => {
    if (connectedNetwork === "homestead") {
      const swap = await fetch(
        `https://api.1inch.io/v4.0/1/swap?fromTokenAddress=${WETH_CONTRACT}&toTokenAddress=${NEXO_CONTRACT}&amount=${amount}&fromAddress=${accounts[0]}&slippage=1`
      )
        .then((res) => res.json())
        .then((json) => json)
        .catch((err) => {
          console.error(err.message);
          setError(err.message);
        });
    } else {
      setError("Cannot swap if not connected to Ethereum network");
    }
  };

  const getUSDCPrice = async () => {
    const price = await fetch(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${USDC_CONTRACT}`
    )
      .then((res) => res.json())
      .then((json) => json.market_data.current_price.eth)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });

    setEtherPriceUSD((1 / price).toFixed(2));
  };

  const getAccounts = async () => {
    setLoading(true);
    if (accounts) {
      getBalance(accounts[0]);
    }

    const accts = await provider
      .send("eth_requestAccounts", [])
      .catch((err) => {
        console.error(err);
      });

    const network = (await provider.getNetwork()).name;

    setConnectedNetwork(network);
    setAccounts(accts);
    setLoading(false);
  };

  const convertBalance = (balance: string) => {
    return (parseInt(balance) / Math.pow(10, 18)).toFixed(4);
  };

  const getBalance = async (account: string) => {
    setLoading(true);
    try {
      const ethBalance = await provider.send("eth_getBalance", [
        account,
        "latest",
      ]);
      let nexoToken;
      let wETHToken;

      if (connectedNetwork === "homestead" && account) {
        nexoToken = new ethers.Contract(NEXO_CONTRACT, ERC20_ABI, provider);
        wETHToken = new ethers.Contract(WETH_CONTRACT, ERC20_ABI, provider);
      } else if (connectedNetwork === "rinkeby") {
        nexoToken = new ethers.Contract(
          NEXO_CONTRACT_RINKEBY,
          ERC20_ABI,
          provider
        );

        wETHToken = new ethers.Contract(
          WETH_CONTRACT_RINKEBY,
          ERC20_ABI,
          provider
        );
      } else {
        setError("Please change network to Ethereum");
      }

      if (nexoToken) {
        const nexoBalance = await nexoToken.balanceOf(account);
        const nexoBalanceConverted = convertBalance(nexoBalance);
        setNexoBalance(nexoBalanceConverted);
      }

      if (wETHToken) {
        const wEthBalance = await wETHToken.balanceOf(account);
        const wETHBalanceConverted = convertBalance(wEthBalance);
        setWETHBalance(wETHBalanceConverted);
      }

      const ethBalanceConverted = convertBalance(ethBalance);
      setEthBalance(ethBalanceConverted);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const transferEth = async (addressTo: string, value: string) => {
    const signer = provider.getSigner();
    setLoading(true);

    try {
      const tx = await signer.sendTransaction({
        to: addressTo,
        value: ethers.utils.parseEther(value),
      });

      tx.wait();
      console.log(tx);
    } catch (e) {
      console.error(e);
      if ((e as Error).message.includes("insufficient funds")) {
        setError("Insufficient funds");
      }
      setLoading(false);
    }

    setLoading(false);
  };

  return {
    accounts,
    ethBalance,
    nexoBalance,
    wETHBalance,
    error,
    loading,
    connectedNetwork,
    etherPriceUSD,
    swapWETHtoNEXO,
    getAccounts,
    getBalance,
    transferEth,
  };
};
