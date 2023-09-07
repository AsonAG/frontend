import { useTheme } from "@emotion/react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { tokens } from "../../theme";

// TODO AJO fix this
const CasesTableOfContentComponent = ({
  caseBase,
  inputCaseSchema,
  activeCaseKey
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleTableOfContentsItemClick = (event, caseBase) => {
    console.log("Focus invoked: ", caseBase.ref.current);
    caseBase.ref.current.scrollIntoView();
  };

  // populated related cases components
  // let relatedCasesComponents = [];
  // inputCaseSchema?.relatedCases?.forEach((schemaRelatedCase, id) => {
  //   const key = getInputCaseKey(schemaRelatedCase);
  //   if (Object.hasOwnProperty.call(caseBase.relatedCases, key)) {
  //     const relatedCase = caseBase.relatedCases[key];
  //     relatedCasesComponents.push(
  //       <CasesTableOfContentComponent
  //         caseBase={relatedCase}
  //         inputCaseSchema={schemaRelatedCase}
  //         key={"CasesTableOfContentComponents_" + key}
  //         activeCaseKey={activeCaseKey}
  //         />
  //     );
  //   }
  // });

  return (
    inputCaseSchema &&
    caseBase.id &&
    shouldShowOutputCase(caseBase, inputCaseSchema) && (
      <Box
        sx={{
          "& .MuiListItem-root": {
            paddingRight: "4px",
          },
        }}
      >
        <ListItem>
          <ListItemButton
            data-to-scrollspy-id={"case_item_" + caseBase.id}
            key={"casesTableOfContent_caseButton_" + caseBase.id}
            className="nav__item"
            onClick={(event) => handleTableOfContentsItemClick(event, caseBase)}
          >
            <Typography
              key={"casesTableOfContent_caseButtonText_" + caseBase.id}
              fontSize="0.9rem"
              sx={
                // scrollPosition < _case.ref.current.getBoundingClientRect().top //+30
                isActive
                  ? {
                      fontWeight: "bold",
                      color: colors.blueAccent,
                      // textDecoration: "underline"
                    }
                  : {}
              }
            >
              {caseBase.displayName}
            </Typography>
          </ListItemButton>
        </ListItem>

        {caseBase.relatedCases ? (
          <ListItem>
            <List dense disablePadding>
              {relatedCasesComponents}
            </List>
          </ListItem>
        ) : (
          <></>
        )}
      </Box>
    )
  );
};

function shouldShowOutputCase(caseBase, inputCaseSchema) {
  return (
    caseBase.id === inputCaseSchema.id ||
    inputCaseSchema.relatedCases.some((element) =>
      shouldShowOutputCase(caseBase, element)
    )
  );
}

export default CasesTableOfContentComponent;
