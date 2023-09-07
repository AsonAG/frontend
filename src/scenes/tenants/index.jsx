import {
  Box,
} from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import Paper from "@mui/material/Paper";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLoaderData } from "react-router-dom";

const Tenants = () => {
  const tenants = useLoaderData();
  return (
    <Box m={4} mt="25vh">
      <Header title="Select a company" subtitle="Select a company" />
      <Paper>
        <List>
          {tenants.map(tenant => (
            <ListItem disablePadding key={tenant.id}>
              <ListItemButton component={Link} to={`${tenant.id}/payrolls`}>
                <ListItemText primary={tenant.identifier} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Tenants;
