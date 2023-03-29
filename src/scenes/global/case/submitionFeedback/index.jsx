import { Alert, Box, useTheme } from "@mui/material";
import Header from "../../../../components/Header";
import { tokens } from "../../../../theme";


const SubmitionFeedback = ( requestResult ) => {
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);

        console.log(requestResult);
      
        return (
          <Box m="25px">
            <Alert severity="success">Details here</Alert>
          </Box>
        )
}


export default SubmitionFeedback;