import {
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";

import { Link } from "react-router-dom";


const toAnchorLink = caseName => `#${caseName}`;

// TODO AJO highlight current case
function CaseIndexComponent({ _case, indent,  activeCase}) {
  const isActive = _case.name === activeCase;
  return <List disablePadding>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={toAnchorLink(_case.name)} sx={{ pl: 2 + indent, backgroundColor: isActive ? 'red' : undefined }}>
        <ListItemText>{_case.name}</ListItemText>
      </ListItemButton>
    </ListItem>
    { _case?.relatedCases.map(c => <CaseIndexComponent key={c.id} _case={c} indent={indent + 1} activeCase={activeCase} />) }
  </List>
};

export default CaseIndexComponent;
