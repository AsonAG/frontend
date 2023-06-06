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
import { React, useContext, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CasesTableOfContentComponent from "./CasesTableOfContentComponent";

const CasesFormWrapper = ({ title, items, onSubmit, children, outputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleTableOfContentsItemClick = (event, caseBase) => {
    console.log(
      "Focus invoked: ",
      outputCase["case_" + caseBase.id].ref.current
    );
    outputCase["case_" + caseBase.id].ref.current.scrollIntoView();
    // casesTableOfContents["case_" + caseBase.id].ref.current.focus();
  };

  const handleScroll = event => {
    setScrollPosition(event.currentTarget.scrollTop);
  };

  useEffect(() => {
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
// useEffect(() => {
//   getscroll();
//   window.addEventListener("scroll", getscroll);
//   return () => {
//     window.removeEventListener("scroll", getscroll);
//   };
//   }, []);

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
          overflow: "scroll",
          paddingTop: "5px",
          margin: "0 8px 0 0px",
        }}
        sx={{
          // TODO: fix background color
          "& .MuiPaper-root": {
            backgroundColor: colors.primary[300],
          },
        }}
        onScroll={handleScroll}
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
        <List disablePadding>
          <ListItem>
            <Typography variant="h4" fontWeight="bold">
              {title}
            </Typography>
          </ListItem>

          {Object.keys(outputCase).length > 0 ? (
            <CasesTableOfContentComponent
              casesTableOfContents={outputCase}
              onClick={handleTableOfContentsItemClick}
              scrollPosition={scrollPosition}
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
