import { Box, Button, Drawer, List, ListItem, Paper, Typography } from "@mui/material";
import { React, useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import CasesForm from "./CasesForm";

const CasesFormWrapper = ( props) => {
  return (
        
    <Box margin="0" display="flex" flexDirection="row" width="100%">
    {/* <EmployeeHeader employee={employee} /> */}

    <Paper
      style={{
        // maxHeight: "80vh",
        height: "100%",
        width: "100%",
        overflow: "auto",
        margin: "25px",
      }}
    >
      <CasesForm {...props} />
        
        </Paper>

      <Box 
        margin="0px 0"
        width="260px" 
        height="90vh"
        display="flex" flexDirection="column" 
        justifyContent="space-between"
        alignItems="flex-start">
        {/* <Header title={employee.firstName + " " + employee.lastName} /> */}

        <List>
          <ListItem>
            <Typography variant="h3" fontWeight="bold">
              {props.title}
            </Typography>
          </ListItem>

          <ListItem>
            <Typography>Case 1</Typography>
          </ListItem>

          <ListItem>
            <Typography>Case 2</Typography>
          </ListItem>
          <ListItem>
            <Typography>Case 3</Typography>
          </ListItem>
          <ListItem>
            <Typography>Case 4</Typography>
          </ListItem>
        </List>

        
            <Button
              // disable={}
              disableRipple
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
        //       onClick={onSubmit}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
      </Box>

    </Box>
  );
}

export default CasesFormWrapper;