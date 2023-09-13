import {
  Container,
} from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import Paper from "@mui/material/Paper";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLoaderData } from "react-router-dom";

function Tenants() {
  const tenants = useLoaderData();
  return (
    <Container maxWidth="lg" sx={{mt: 4}}>
      <Header title="Select a company"/>
      <Paper>
        <List>
          {tenants.map(tenant => (
            <ListItem disablePadding key={tenant.id}>
              <ListItemButton component={Link} to={`${tenant.id}/payrolls`} state={{tenant}}>
                <ListItemText primary={tenant.identifier} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Tenants;
