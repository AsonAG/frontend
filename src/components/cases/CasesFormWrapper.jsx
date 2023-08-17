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
import {
  buildCasesBody,
  filterBody,
  getMainCaseObject,
} from "../../api/CasesApi";
import CasesSaveButton from "../buttons/CasesSaveButton";
import useActiveCase from "../../hooks/useActiveCase";

const CasesFormWrapper = ({
  title,
  onSubmit,
  children,
  inputCase,
  outputCase,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const caseIsReadOnly = useContext(CaseContext);
  const mobileScreen = useMediaQuery("(max-width:600px)");
  // const [activeCaseKey, setActiveCaseKey] = useState();
  const [activeCaseKey, setActiveCaseKey] = useState();
  const handleScroll = useActiveCase( outputCase, setActiveCaseKey);

  // START set active case based on scroll position
  

  // useEffect(() => {
  //   if (inputCase) setTopCase(getCaseKey(inputCase));
  // }, [inputCase]);
  // END scroll positon setting


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
                  inputCaseSchema={inputCase}
                  key={
                    "CasesTableOfContentComponents_baseCase_" +
                    inputCase.relatedCases.length
                  }
                  activeCaseKey={activeCaseKey}
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
