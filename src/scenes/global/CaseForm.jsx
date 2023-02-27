import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

const CaseForm = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
      <Box m="25px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={props.caseName} subtitle="Welcome to your case" />
        </Box>
      </Box>
  )};  



  export default CaseForm;