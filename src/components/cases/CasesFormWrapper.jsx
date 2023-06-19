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
import {
  React,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SendIcon from "@mui/icons-material/Send";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CasesTableOfContentComponent from "./CasesTableOfContentComponent";
import { getMainCaseObject } from "../../api/CasesApi";

const CasesFormWrapper = ({ title, onSubmit, children, outputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTopCaseSet, setIsTopCaseSet] = useState(false);
  const caseIsReadOnly = useContext(CaseContext);

  const handleScroll = (event) => {
    setScrollPosition(event.currentTarget.scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
          paddingTop: "6px",
          // margin: "0 16px 0 8px",
        }}
        sx={{
          // TODO: move styles to a different file
          "& .MuiFormHelperText-root": {
            marginTop: '0px',
            marginBottom: '6px',
          },
          // TODO: fix background color
          "& .MuiPaper-root": {
            // backgroundColor: colors.grey[100] + ' !important',
          },  
        }}
        onScroll={handleScroll}
      >
        {children}
      </Paper>

      <Box
        width="270px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        // alignItems="flex-start"
        margin="20px 20px 40px 12px"
        // sx={{ backgroundColor: colors.primary[400] }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color={colors.blueAccent}
            marginLeft="12px"
          >
            {title}
          </Typography>

          <List dense disablePadding>
            {Object.keys(outputCase).length > 0 ? (
              <CasesTableOfContentComponent
                caseBase={getMainCaseObject(outputCase)}
                scrollPosition={scrollPosition}
              />
            ) : (
              // TODO: fix circular progress display
              <Box sx={{ display: "flex" }}>
                <CircularProgress
                  variant="indeterminate"
                  disableShrink={true}
                  color="neutral"
                  size="lg"
                />
              </Box>
            )}
          </List>
        </Stack>

        <Box display="flex" justifyContent="center">
          {!caseIsReadOnly && (
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CasesFormWrapper;
