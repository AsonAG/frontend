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
import { getCaseKey } from "../case/CaseComponent";
import useIntersection from "../../hooks/useIntersection";

const CasesFormWrapper = ({
  title,
  onSubmit,
  children,
  inputCase,
  outputCase,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [scrollPosition, setScrollPosition] = useState(0);
  const caseIsReadOnly = useContext(CaseContext);
  const mobileScreen = useMediaQuery("(max-width:600px)");

  // START set active case based on scroll position
  // outputCase.relat
  
//   outputCase.relatedCases.map((relCase) => {
//   const inViewport = useIntersection(relCase.ref, "0px");

//   if (inViewport) {
//       console.log("in viewport:", ref.current);
//   }

// });
  
  // const updateIsCaseActive = (caseBase) => { 
  //    const caseBaseKey = getCaseKey(caseBase);

  //   let isActive = false;
  //   if (topCase != caseBaseKey)
  //     try {
  //       // isTopCaseParam &&
  //       isActive =
  //         scrollPosition < caseBase?.ref?.current.offsetTop &&
  //         scrollPosition + window.innerHeight > caseBase?.ref?.current.offsetTop;
  //       if (isActive) {
  //         setTopCase(caseBaseKey);
  //       }
  //     } catch (error) {
  //       console.warn(JSON.stringify(error));
  //     }
  // }
  // END scroll positon setting 

  // useEffect(() => {
  //   if (inputCase) setTopCase(getCaseKey(inputCase));
  // }, [inputCase]);

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
                  inputCaseSchema={inputCase}
                  key={'CasesTableOfContentComponents_baseCase_'+inputCase.relatedCases.length}
                  // topCase={0}
                  setTopCase={()=>{}}
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
