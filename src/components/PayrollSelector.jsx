import React, { useContext, useState } from "react";
import { Box, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { UserContext } from "../App";

export default function PayrollSelector() {
  const { user, setUser } = useContext(UserContext);
  const [payroll, setPayroll] = useState(user?.currentPayrollName);

  const handleChange = (e) => {
    setPayroll(e.value);

    setUser((current) => ({
      ...current,
      currentPayrollName: e.value,
      currentPayrollId: "1",
    }));
  };

  return (
    <Box m="25px">
      <FormControl variant="filled" size="small">
        <Select
          variant="outlined"
          id="payroll-main-select"
          label="Payroll"
          onChange={handleChange}
          value={payroll}
        >
          {user?.availablePayrolls?.map((option) => {
            return (
              <MenuItem
                key={"payroll-select-item-" + option.payrollId}
                // value={option.payrollName}
              >
                {option.payrollName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
