import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import { useAuth } from "oidc-react";

const Login = () => {
  const auth = useAuth();

    return (
      <Box m="25px">
        <Logo />
        <Box
          mt="25vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minWidth="90vw"
        >
          <Header title="Welcome back" subtitle="" />
          <Card
            sx={{
              maxWidth: "445px",
              minWidth: "345px",
            }}
          >
            <CardActionArea>
              <CardContent 
              onClick={() => auth.signIn()}
              >
                <Typography gutterBottom variant="h5" component="div">
                  Select tenant
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    );
};

export default Login;
