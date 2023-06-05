import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { Box, ListItem, ListItemButton, ListItemText } from "@mui/material";

const CasesTableOfContentComponent = ({ casesTableOfContents, onClick, scrollPosition }) => {
  const cases = Object.values(casesTableOfContents);
  const idItems = cases.map((_case) => "case_item_" + _case.id);

  return (
    <Box>
      {cases.map((_case) => (
        <ListItem >
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
            <ListItemText
              key={"casesTableOfContent_caseButtonText_" + _case.id}
              sx={scrollPosition > _case.ref.current.offsetTop ? 
                {
                  fontSize: 20
                }
                 : {} }
            >
              {_case.displayName}
            </ListItemText>
            </ListItemButton>
            {/* </ListItemButton> */}
        </ListItem>
      ))}

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
