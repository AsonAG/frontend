import { ListItemButton, ListItemText } from "@mui/material";

const CasesTableOfContentComponent = ({ casesTableOfContents, onClick }) => {
  return Object.values(casesTableOfContents).map((caseAccordion) => (
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
  ));
};

export default CasesTableOfContentComponent;
