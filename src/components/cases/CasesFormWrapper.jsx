import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { React, useContext, useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CasesTableOfContentComponent from "./CasesTableOfContentComponent";

const CasesFormWrapper = ({ title, items, onSubmit, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { casesTableOfContents, setCasesTableOfContents } =
    useContext(CaseContext);

  const handleTableOfContentsItemClick = (event, caseBase) => {
    console.log("Focus invoked: ", casesTableOfContents["case_" + caseBase.id].ref.current);
    casesTableOfContents["case_" + caseBase.id].ref.current.scrollIntoView(); 
    casesTableOfContents["case_" + caseBase.id].ref.current.focus(); 
  };

  return (
    <Box
      margin="0"
      display="flex"
      flexDirection="row"
      height="100%"
      //       height='calc(100vh - 90px)'
    >
      {/* <EmployeeHeader employee={employee} /> */}
      <Paper
        style={{
          height: "100%",
          width: "100%",
          overflow: "auto",
          paddingTop: "5px",
          margin: "0 8px 0 0px",
        }}
        sx={{
          // TODO: fix background color
          "& .MuiPaper-root": {
            backgroundColor: colors.primary[300],
          },
        }}
      >
        {children}
      </Paper>

      <Box
        width="260px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        // alignItems="flex-start"
        margin="20px 20px 40px 0px"
        // sx={{ backgroundColor: colors.primary[400] }}
      >
        <List>
          <ListItem>
            <Typography variant="h4" fontWeight="bold">
              {title}
            </Typography>
          </ListItem>

          <Divider />
          {Object.keys(casesTableOfContents).length > 0 ? (
            <CasesTableOfContentComponent
              casesTableOfContents={casesTableOfContents}
              onClick={handleTableOfContentsItemClick}
            />
          ) : (
            // TODO: fix circular progress display
            <Box sx={{ display: "flex" }}>
              <CircularProgress
                disableShrink={true}
                color="neutral"
                size="lg"
              />
            </Box>
          )}
        </List>

        <Box display="flex" justifyContent="center">
          <Button
            // disable={}
            //   fullWidth
            disableRipple
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            onClick={onSubmit}
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
