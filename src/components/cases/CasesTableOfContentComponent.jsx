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

const CasesTableOfContentComponent = ({ caseBase, scrollPosition }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleTableOfContentsItemClick = (event, caseBase) => {
    console.log("Focus invoked: ", caseBase.ref.current);
    caseBase.ref.current.scrollIntoView();
    // casesTableOfContents["case_" + caseBase.id].ref.current.focus();
  };

  let isActive = false;
  try {
    // isTopCaseParam &&
    isActive =
      scrollPosition < caseBase?.ref?.current.offsetTop &&
      scrollPosition + window.innerHeight > caseBase?.ref?.current.offsetTop;
  } catch (error) {
    console.error(JSON.stringify(error));
  }

  return (
    <Box sx={{
      "& .MuiListItem-root": {
        paddingRight: '4px'
      }
    }}>
      <ListItem>
        {/* <ListItemButton
            onClick={(event) => onClick(event, _case)}
            key={"casesTableOfContent_caseButton_" + _case.id}
          > */}
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
            {Object.values(caseBase.relatedCases).map((relatedCase) => (
              <CasesTableOfContentComponent
                caseBase={relatedCase}
                scrollPosition={scrollPosition}
              />
            ))}
          </List>
        </ListItem>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CasesTableOfContentComponent;
