import React, { useContext, useEffect, useState } from "react";
import { Box, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { UserContext } from "../App";

export default function PayrollSelector() {
  const { user, setUser } = useContext(UserContext);
  const [payroll, setPayroll] = useState({
        currentPayrollName: "",
        currentPayrollId: ""
  });

  const handleChange = (e) => {
    setUser((current) => ({
      ...current,
      currentPayrollName: user.availablePayrolls.find((payroll) => 
        payroll.payrollId === e.target.value).payrollName,
      currentPayrollId: e.target.value,
    }));
  };

  useEffect(()=>{
        setPayroll({
                currentPayrollName: user?.currentPayrollName,
                currentPayrollId: user?.currentPayrollId
          })
  },[user]);

  return (
    <Box>
      <FormControl variant="filled" size="small">
        <Select
          variant="outlined"
          id="payroll-main-select"
          label="Payroll"
          onChange={handleChange}
          value={payroll.currentPayrollId}
        >
          {user?.availablePayrolls?.map((option) => {
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
