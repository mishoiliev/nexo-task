import { Alert, Button, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface Props {
  buttonContent: string;
  onSubmitAction: ([value]: any) => void;
  availableBalance?: string;
}

const TradeForm: React.FC<Props> = ({
  buttonContent,
  onSubmitAction,
  availableBalance = "0",
}) => {
  const [value, setValue] = useState<string | number>("");
  const [formError, setFormError] = useState<string>("");

  const handleChange = (e: any) => {
    if (parseFloat(e.target.value) > parseFloat(availableBalance)) {
      setFormError("Not enough available balance");
    } else {
      setFormError("");
    }
    setValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = value?.toString();
    const regEx = new RegExp(/^(0|[1-9]\d*)(\.\d+)?$/);

    if (amount && regEx.test(amount)) {
      onSubmitAction(amount);
    } else {
      setFormError("Please provide a number");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        maxWidth: "30em",
        margin: "auto",
        paddingTop: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "15px ",
          width: "100%",
        }}
      >
        <TextField
          placeholder="Amount of WETH to swap"
          fullWidth
          variant="outlined"
          value={value}
          onChange={handleChange}
        />
        <Button disabled={formError.length > 0} type="submit">
          {buttonContent}
        </Button>
      </div>
      {formError && <Alert severity="error">{formError}</Alert>}
    </form>
  );
};

export default TradeForm;
