import {
  Box,
  Button,
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
import { CaseContext } from "./CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const CasesTableOfContentComponent = ({casesTableOfContents, onClick}) => {
  return Object.values(casesTableOfContents).map((caseAccordion) => (
    <ListItemButton
      onClick={(event) => onClick(event, caseAccordion)}
      key={"casesTableOfContent_caseButton_" + caseAccordion.id}
    >
      <ListItemText
        key={"casesTableOfContent_caseButtonText_" + caseAccordion.id}
      >
        {caseAccordion.displayName}
      </ListItemText>
    </ListItemButton>
  ));
};

const CasesFormWrapper = ({ title, items, onSubmit, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { casesTableOfContents, setCasesTableOfContents } =
    useContext(CaseContext);

  const handleTableOfContentsItemClick = (event, caseBase) => {
    setCasesTableOfContents((current) => ({
      ...current,
      ["case_" + caseBase.id]: {
        displayName: caseBase.displayName,
        id: caseBase.id,
        expanded: !caseBase.expanded,
      },
    }));
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
          <CasesTableOfContentComponent
            casesTableOfContents={casesTableOfContents}
            onClick={handleTableOfContentsItemClick}
          />
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
