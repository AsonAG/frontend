import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import CasesTable from "../../components/CasesTable";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

const Reporting = ( {updateCaseName} ) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return (
      <Box m="25px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="REPORTING" subtitle="Find what you want to report to the HR department" />
        </Box>
        <CasesTable updateCaseName={updateCaseName} caseType={'Employee'}/>

      </Box>
  )};  



  export default Reporting;