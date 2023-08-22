import { Box } from "@mui/material";
import DocumentsTable from "../../components/tables/DocumentsTable";
import Header from "../../components/Header";

const CompanyDocuments = () => {
  // const employee = JSON.parse(window.sessionStorage.getItem("employee"));

  return (
    <Box m="25px">
      <Header title="Company Documents" />

      <DocumentsTable 
          caseType={'Company'}
      />
    </Box>
  );
};

export default CompanyDocuments;
