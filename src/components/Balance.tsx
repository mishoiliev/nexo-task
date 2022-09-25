import React, { useEffect } from "react";
import { useMetaMask } from "../hooks/useMetaMask";

interface Props {
  ethBalance: string;
  nexoBalance: string;
  wEthBalance: string;
  ethPriceUSD: string;
}

const Balance: React.FC<Props> = ({
  ethBalance,
  nexoBalance,
  wEthBalance,
  ethPriceUSD,
}) => {
  return (
    <div>
      <p>ETH Balance: {ethBalance}</p>
      <p>NEXO Balance: {nexoBalance}</p>
      <p>
        wETH Balance: {wEthBalance}{" "}
        {ethPriceUSD && `(${ethPriceUSD} USDC / 1 wETH)`}
      </p>
    </div>
  );
};

export default Balance;
