import { useEffect, useMemo, useState} from "react";
import ApiClient from "../api/ApiClient";
import PayrollsApi from "../api/PayrollsApi";

const User = ({ tenantId, userId, employee }) => {
  // const caseName = window.sessionStorage.getItem("caseName");
  const payrollsApi = useMemo(() => new PayrollsApi(ApiClient, tenantId), [tenantId]);
  const [payrolls, setPayrolls] = useState(
    [
      // {
      //   payrollId: "1",
      //   payrollName: "CH",
      //   divisionId: "1"
      // },
      // {
      //   payrollId: "2",
      //   payrollName: "AT",
      //   divisionId: "2",
      // },
      // {
      //   payrollId: "3",
      //   payrollName: "BH",
      //   divisionId: "3",
      // },
      // {
      //   payrollId: "4",
      //   payrollName: "Demo Switzerland AG",
      //   divisionId: "4",
      // },
    ]
    );

  // useEffect(()=> {
  //   payrollsApi.getPayrolls(callback);
  // }, [])

  // const callback = function (error, data, response) {
  //   let tableData = [];
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     data.forEach((element, index) => {
  //       tableData = [
  //         ...tableData,
  //         {
  //           payrollId: element["id"],
  //           payrollName: element["name"],
  //           divisionId: element["divisionId"],
  //           description: element["description"],
  //           // divisionName: null,// TODO - get division name for user and each employee
  //         },
  //       ];
  //     });
  //     console.log(
  //       "API called successfully. Table data loaded: " +
  //         JSON.stringify(tableData, null, 2)
  //     );
  //     setPayrolls(tableData);
  //   }
  // };


  return {
    loaded: false,
    isAuthenticated: false,
    userEmail: "",

    tenantId,
    userId,
    employee,

    currentDivisionId: "1", // TODO: redefine
    currentPayrollId: "1",
    currentPayrollName: "CH",
    availablePayrolls: payrolls,
  };
};

export default User;
