import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { React, useEffect, useContext, useState } from "react";
import Header from "../../components/Header";
import { IntegrationApi } from "../../api/IntegrationApi";
import { UserContext } from "../../App";
import { ApiClient } from "../../api/ApiClient";

const Tenants = () => {

  const { user, setUser } = useContext(UserContext);
  const [tenants, setTenants] = useState([]);
  const tenantsEffectKey = tenants.map(t => t.id).join(',');

  useEffect(() => {
    const apiClient = new ApiClient();
    apiClient.basePath = 'https://localhost:44354';
    const api = new IntegrationApi(apiClient);
    api.userTenants(callback);
  }, [tenantsEffectKey]);

  const callback = function(error, data, response) {
    if (error) {
      console.log(error);
      return;
    }
    setTenants(data);
  };

  const onSelectTenant = function(tenant) {
    console.log("selected tenant", tenant);
    setUser(current => ({
      ...current,
      tenantId: tenant.id,
      tenantIdentifier: tenant.identifier
    }));
  }

  return (
    <Box m="25px">
      <Header title="Tenants" subtitle="Select tenant" />
      <List>
        {tenants.map(tenant => (
          <ListItem key={tenant.id} disablePadding>
            <ListItemButton onClick={() => onSelectTenant(tenant)}>
              <ListItemText primary={tenant.identifier} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Tenants;
