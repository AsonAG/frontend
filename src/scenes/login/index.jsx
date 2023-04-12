import React, { useContext } from "react";
import { useFormik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { UserContext } from "../../App";

export default function LoginForm() {
  const { user, setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      setUser((current) => ({
        ...current,
        userId: "1",
        employeeId: values.email,
        isAuthenticated: true,
        currentPayrollName: "SimplePayroll.Derived1",
        currentPayrollId: "1",
      }));
    },
  });
  return (
      <Box m="25px">
        
    <form onSubmit={formik.handleSubmit}>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        maxWidth="300px"
      >
        <TextField
          required
          variant="outlined"
          margin="normal"
          id="email"
          name="email"
        //   type="email"
          label="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
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
