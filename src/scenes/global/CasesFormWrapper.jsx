import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { React, useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import CasesForm from "./CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const CasesFormWrapper = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let onSubmit;

  return (
    <Box
      margin="0"
      display="flex"
      flexDirection="row"
      //     width="100%"
      height='calc(100vh - 90px)'
    >
      {/* <EmployeeHeader employee={employee} /> */}

      <Paper
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          margin: "25px",
        }}
      >
        <CasesForm {...props} />
      </Paper>

      <Box
        width="260px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        // alignItems="flex-start"
        margin="20px 20px 20px 0"
        // sx={{ backgroundColor: colors.primary[400] }}
      >
        {/* <Header title={employee.firstName + " " + employee.lastName} /> */}

        <List>
          <ListItem>
            <Typography variant="h4" fontWeight="bold">
              {props.title}
            </Typography>
          </ListItem>

          <ListItem>
            <Typography variant="h5" >Case 1</Typography>
          </ListItem>
        </List>

<Box 
display="flex"
justifyContent="center"
>
        <Button
          // disable={}
        //   fullWidth
          disableRipple
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          //   onClick={onSubmit}
          endIcon={<SendIcon />}
        >
          <Typography fontWeight="bold">Send</Typography>
        </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CasesFormWrapper;
