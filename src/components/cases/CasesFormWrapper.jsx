import {
  Box,
  CircularProgress,
  List,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { React, useContext, useEffect, useState } from "react";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import CasesTableOfContentComponent from "./CasesTableOfContentComponent";
import { buildCasesBody, filterBody, getMainCaseObject } from "../../api/CasesApi";
import CasesSaveButton from "../buttons/CasesSaveButton";

const CasesFormWrapper = ({ title, onSubmit, children, inputCase, outputCase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isTopCaseSet, setIsTopCaseSet] = useState(false);
  const caseIsReadOnly = useContext(CaseContext);
  const mobileScreen = useMediaQuery("(max-width:600px)");


  // const [caseFiltered, setCaseFiltered] = useState();

  // useEffect(() => {
  //   if (outputCase){
  //   try{
  //     const postBody = buildCasesBody(outputCase, true);
  //   filterBody(inputCase, postBody.case);
  //   setCaseFiltered(postBody.case);
  //   }
  //   catch (error){
  //     console.warn("Error on filtering output case: "+error);
  //   }
  // }
  // }, [outputCase])

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
      flexDirection={mobileScreen ? "column" : "row"}
      height="100%"
    >
      <Paper
        style={{
          height: "100%",
          width: "100%",
          // minWidth: "520px",
          overflow: "scroll",
          paddingTop: "6px",
          // margin: "0 16px 0 8px",
        }}
        sx={{
          // TODO: move styles to a different file
          "& .MuiFormHelperText-root": {
            marginTop: "0px",
            marginBottom: "6px",
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

      {!mobileScreen ? (
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
              // color={colors.blueAccent}
              marginLeft="12px"
            >
              {title}
            </Typography>

            <List dense disablePadding>
              {Object.keys(outputCase).length > 0 ? (
                <CasesTableOfContentComponent
                  caseBase={getMainCaseObject(outputCase)}
                  scrollPosition={scrollPosition}
                  inputCaseSchema={inputCase}
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

          <CasesSaveButton
            onSubmit={onSubmit}
            caseIsReadOnly={caseIsReadOnly}
          />
        </Box>
      ) : (
        <CasesSaveButton onSubmit={onSubmit} caseIsReadOnly={caseIsReadOnly} />
      )}
    </Box>
  );
};

export default CasesFormWrapper;
