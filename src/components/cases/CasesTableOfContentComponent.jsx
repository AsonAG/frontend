import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const CasesTableOfContentComponent = ({
  casesTableOfContents,
  onClick,
  scrollPosition,
}) => {
  const cases = Object.values(casesTableOfContents);
  // const idItems = cases.map((_case) => "case_item_" + _case.id);
  let isTopCase = true;

  return (
    <Box>
      {cases.map((_case) => {
        const isActive =
          isTopCase && scrollPosition < _case.ref.current.offsetTop;
        if (isActive) isTopCase = false;

        return (
          <ListItem>
            {/* <ListItemButton
            onClick={(event) => onClick(event, _case)}
            key={"casesTableOfContent_caseButton_" + _case.id}
          > */}
            <ListItemButton
              data-to-scrollspy-id={"case_item_" + _case.id}
              key={"casesTableOfContent_caseButton_" + _case.id}
              className="nav__item"
              onClick={(event) => onClick(event, _case)}
            >
              <Typography
                key={"casesTableOfContent_caseButtonText_" + _case.id}
                sx={
                  // scrollPosition < _case.ref.current.getBoundingClientRect().top //+30
                  isActive
                    ? {
                        fontWeight: "bold",
                      }
                    : {}
                }
              >
                {_case.displayName}
              </Typography>
            </ListItemButton>
            {/* </ListItemButton> */}
          </ListItem>
        );
      })}

      {/* <TreeView
        expanded={true}
        // selected={selected}
        // onNodeToggle={handleToggle}
        // onNodeSelect={handleSelect}
      >
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar" />
          <TreeItem nodeId="3" label="Chrome" />
          <TreeItem nodeId="4" label="Webstorm" />
        </TreeItem>
      </TreeView> */}
    </Box>
  );
};

export default CasesTableOfContentComponent;
