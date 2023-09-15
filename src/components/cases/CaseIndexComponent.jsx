import {
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";

function CaseIndexComponent({ _case, indent,  activeCase, onSelect}) {
  const isActive = _case.name === activeCase;

  const styling = isActive ? {
    borderLeftColor: "primary.main",
    color: "primary.main"
  } : {
    borderLeftColor: "transparent",
  };

  return <List disablePadding>
    <ListItem disablePadding>
      <ListItemButton onClick={() => onSelect(_case.name)} sx={{ pl: 2 + indent, borderLeftWidth: "3px", borderLeftStyle: "solid", ...styling }}>
        <ListItemText primaryTypographyProps={{textOverflow:"ellipsis", overflow: "hidden"}}>{_case.name}</ListItemText>
      </ListItemButton>
    </ListItem>
    { _case?.relatedCases?.map(c => <CaseIndexComponent key={c.id} _case={c} indent={indent + 1} activeCase={activeCase} onSelect={onSelect} />) }
  </List>
};

export default CaseIndexComponent;
