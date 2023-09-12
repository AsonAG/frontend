import {
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";

function CaseIndexComponent({ _case, indent,  activeCase, onSelect}) {
  const isActive = _case.name === activeCase;

  const styling = isActive ? {
    borderLeftColor: "#461eb7",
    color: "#461eb7"
  } : {
    borderLeftColor: "transparent",
  };

  return <List disablePadding>
    <ListItem disablePadding>
      <ListItemButton onClick={() => onSelect(_case.name)} sx={{ pl: 2 + indent, borderLeftWidth: "3px", borderLeftStyle: "solid", ...styling }}>
        <ListItemText>{_case.name}</ListItemText>
      </ListItemButton>
    </ListItem>
    { _case?.relatedCases?.map(c => <CaseIndexComponent key={c.id} _case={c} indent={indent + 1} activeCase={activeCase} onSelect={onSelect} />) }
  </List>
};

export default CaseIndexComponent;
