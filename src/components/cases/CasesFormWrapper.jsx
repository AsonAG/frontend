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
  Stack,
  Typography,
} from "@mui/material";
import { React, createContext, useContext, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CasesTableOfContentComponent from "./CasesTableOfContentComponent";
import { getMainCaseObject } from "../../api/CasesApi";

const CasesFormWrapper = ({ title, items, onSubmit, children, outputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTopCaseSet, setIsTopCaseSet] = useState(false);

  const handleScroll = event => {
    setScrollPosition(event.currentTarget.scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      margin="0"
      display="flex"
      flexDirection="row"
      height="100%"
      //       height='calc(100vh - 90px)'
    >
      <Paper
        style={{
          height: "100%",
          width: "100%",
          overflow: "scroll",
          paddingTop: "5px",
          margin: "0 16px 0 8px",
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
        width="250px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        // alignItems="flex-start"
        margin="20px 20px 40px 5px"
        // sx={{ backgroundColor: colors.primary[400] }}
      >
      <Stack spacing={2}>
      <Typography variant="h4" fontWeight="bold">
        {title}
      </Typography>

        <List 
          dense
          disablePadding
        >
          {Object.keys(outputCase).length > 0 ? (
            <CasesTableOfContentComponent
              caseBase={getMainCaseObject(outputCase)}
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
        </Stack>  

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
