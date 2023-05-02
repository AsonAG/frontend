import React, { useContext } from "react";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { UserContext } from "../App";

export default function PayrollSelector() {
  const { user, setUser } = useContext(UserContext);
  const handleChange = (e) => {
    let payroll = user.availablePayrolls.find((payroll) => payroll.payrollId === e.target.value);
    setUser((current) => ({
      ...current,
      currentPayrollName: payroll.payrollName,
      currentPayrollId: payroll.payrollId,
      divisionId: payroll.divisionId,
    }));
  };

  if (!user?.currentPayrollId) {
    return null;
  }

  return (
    <Box>
      <FormControl variant="filled" size="small">
        <Select
          variant="outlined"
          id="payroll-main-select"
          label="Payroll"
          onChange={handleChange}
          value={user.currentPayrollId}
        >
          {user.availablePayrolls?.map((option) => {
            return (
              <MenuItem
                key={"payroll-select-item-" + option.payrollId}
                value={option.payrollId}
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
