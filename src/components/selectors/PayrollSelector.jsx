import React, { useContext, useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { UserContext } from "../../App";

export default function PayrollSelector() {
  const { user, setUser } = useContext(UserContext);
  const [payroll, setPayroll] = useState({
    currentPayrollName: "",
    currentPayrollId: "",
    currentDivisionId: "",
  });

  const handleChange = (e) => {
    console.log("User has changed.");
    let payroll = user.availablePayrolls.find(
      (payroll) => payroll.payrollId === e.target.value
    );
    setUser((current) => ({
      ...current,
      currentPayrollName: payroll.payrollName,
      currentPayrollId: payroll.payrollId,
      currentDivisionId: payroll.divisionId,
    }));
  };

  useEffect(() => {
    setPayroll({
      currentPayrollName: user?.currentPayrollName,
      currentPayrollId: user?.currentPayrollId,
      currentDivisionId: user?.currentDivisionId,
    });
  }, [user]);

  if (!user?.currentPayrollId) {
    return null;
  }
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel color="primary" id="payroll-selection-label">
          Payroll Unit
        </InputLabel>
        <Select
          variant="standard"
          id="payroll-main-select"
          label="Payroll"
          labelId="payroll-selection-label"
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
