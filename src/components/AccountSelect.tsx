import { MenuItem, Select } from "@mui/material";
import React from "react";

interface Props {
  accounts: string[];
  handleChange: (acc: string) => void;
}

const AccountSelect: React.FC<Props> = ({ accounts, handleChange }) => {
  return (
    <Select
      defaultValue={accounts[0]}
      onChange={(e) => handleChange(e.target.value)}
    >
      {accounts.map((account, index) => (
        <MenuItem key={index} value={account}>
          {account}
        </MenuItem>
      ))}
    </Select>
  );
};

export default AccountSelect;
