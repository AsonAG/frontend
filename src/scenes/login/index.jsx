import React, { useContext } from "react";
import { useFormik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { UserContext } from "../../App";
import { useNavigate } from "react-router";

// DEPRECATED
export default function LoginForm() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      setUser((current) => ({
        ...current,
        loaded: true,
        userId: values.userId,
        userEmail: values.email,
        employeeId: values.employeeId,
        isAuthenticated: true,
        currentPayrollName: "SimplePayroll.Derived1",
        currentPayrollId: "1",
        tenantId: values.tenantId,
        divisionId: values.divisionId,
      }));
    navigate("/");
    },
  });
  return (
    <Box m="25px">
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" maxWidth="300px">
          {/* <TextField
            required
            variant="outlined"
            margin="normal"
            id="email"
            name="email"
            //   type="email"
            label="Employee ID"
            onChange={formik.handleChange}
            value={formik.values.email}
          /> */}
          <TextField
            required
            variant="outlined"
            margin="normal"
            id="userId"
            name="userId"
            //   type="email"
            label="User ID"
            onChange={formik.handleChange}
            value={formik.values.userId}
          />
          <TextField
            required
            variant="outlined"
            margin="normal"
            id="employeeId"
            name="employeeId"
            //   type="email"
            label="Employee ID"
            onChange={formik.handleChange}
            value={formik.values.employeeId}
          />

          <TextField
            required
            variant="outlined"
            margin="normal"
            id="tenantId"
            name="tenantId"
            type="number"
            label="Tenant ID"
            onChange={formik.handleChange}
            value={formik.values.tenantId}
          />

          <TextField
            required
            variant="outlined"
            margin="normal"
            id="divisionId"
            name="divisionId"
            type="number"
            label="Division ID"
            onChange={formik.handleChange}
            value={formik.values.divisionId}
          />

          <Button
            type="submit"
            color="secondary"
            variant="contained"
            size="large"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
