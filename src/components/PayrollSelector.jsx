import React, { useContext } from "react";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { UserContext } from "../App";

export default function PayrollSelector() {
  const { user, setUser } = useContext(UserContext);
  const [payroll, setPayroll] = useState({
    currentPayrollName: "",
    currentPayrollId: "",
    currentDivisionId: "",
  });

  const handleChange = (e) => {
    console.log("User has changed.");
    setUser((current) => ({
      ...current,
      currentPayrollName: user.availablePayrolls.find(
        (payroll) => payroll.payrollId === e.target.value
      ).payrollName,
      currentDivisionId: user.availablePayrolls.find(
        (payroll) => payroll.payrollId === e.target.value
      ).divisionId,
      currentPayrollId: e.target.value,
    }));
  };

  useEffect(() => {
    setPayroll({
      currentPayrollName: user?.currentPayrollName,
      currentPayrollId: user?.currentPayrollId,
      currentDivisionId: user?.currentDivisionId,
    });
  }, [user]);

  return (
    <Box>
      <FormControl variant="filled" fullWidth>
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
