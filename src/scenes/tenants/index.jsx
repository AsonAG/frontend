import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { React, useEffect, useContext, useState, useMemo } from "react";
import Header from "../../components/Header";
import TenantsApi from "../../api/TenantsApi";
import { UserContext } from "../../App";
import ApiClient from "../../api/ApiClient";
import { useNavigate } from "react-router-dom";
import Topbar from "../global/Topbar";

const Tenants = () => {
  const { user, setUser } = useContext(UserContext);
  const [tenants, setTenants] = useState([]);
  const tenantsEffectKey = tenants.map((t) => t.id).join(",");
  const api = useMemo(() => new TenantsApi(ApiClient), []);
  const navigate = useNavigate();

  useEffect(() => {
    api.userTenants(callback);
  }, [tenantsEffectKey]);

  const callback = function (error, data, response) {
    if (error) {
      console.log(error);
      return;
    }
    setTenants(data);
  };

  const onSelectTenant = function (tenant) {
    console.log("selected tenant", tenant);
    setUser((current) => ({
      // ...current,
      tenantId: tenant.id,
      tenantIdentifier: tenant.identifier,
    }));
    navigate("/");
  };

  return (
<Box 
      m="25px"
      >
    <Topbar
        noSidebar={true}
      />

    <Box
      mt="25vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minWidth="90vw"
    >
        <Header title="Tenants" subtitle="Select tenant" />
        {tenants.map((tenant) => (
          <Card sx={{ 
            maxWidth: '445px',
            minWidth: '345px'
             }} key={tenant.id}>
            <CardActionArea>
              <CardContent onClick={() => onSelectTenant(tenant)}>
                <Typography gutterBottom variant="h5" component="div">
                  {tenant.identifier}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Tenants;
