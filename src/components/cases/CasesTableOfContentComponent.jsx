import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { Box, ListItemButton, ListItemText } from "@mui/material";

const CasesTableOfContentComponent = ({ casesTableOfContents, onClick }) => {
  return (
    <Box>
      {Object.values(casesTableOfContents).map((caseAccordion) => (
        <ListItemButton
          onClick={(event) => onClick(event, caseAccordion)}
          key={"casesTableOfContent_caseButton_" + caseAccordion.id}
        >
          <ListItemText
            key={"casesTableOfContent_caseButtonText_" + caseAccordion.id}
          >
            {caseAccordion.displayName}
          </ListItemText>
        </ListItemButton>
      ))}

      <TreeView
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
      </TreeView>
    </Box>
  );
};

export default CasesTableOfContentComponent;
