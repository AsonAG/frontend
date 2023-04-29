import ApiClient from "../api/ApiClient";

const User = ({ tenantId, userId, employee }) => {
  // const caseName = window.sessionStorage.getItem("caseName");

  return {
    loaded: false,
    isAuthenticated: false,
    userEmail: "",

    tenantId,
    userId,
    employee,

    divisionId: "1", // TODO: redefine
    currentPayrollId: "1",
    currentPayrollName: "CH",
    availablePayrolls: [
      {
        payrollId: "1",
        payrollName: "CH",
      },
      {
        payrollId: "2",
        payrollName: "AT",
      },
      {
        payrollId: "3",
        payrollName: "BH",
      },
      {
        payrollId: "4",
        payrollName: "Demo Switzerland AG",
      },
    ],
  };
};

export default User;
