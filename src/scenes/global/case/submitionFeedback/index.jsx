import { Box, useTheme } from "@mui/material";
import Header from "../../../../components/Header";
import { tokens } from "../../../../theme";


const SubmitionFeedback = ( requestResult ) => {
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);

        console.log(requestResult);
      
        return (
          <Box m="25px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Header title="DOSSIER" subtitle="Your personal details and documents" />
            </Box>
          </Box>
        )
}


export default SubmitionFeedback;