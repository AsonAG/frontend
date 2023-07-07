import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="15px">
      <Typography variant="h2" fontWeight="bold">
        {title} 
      </Typography>
      {/* <Typography
        variant="h5"
        sx={{ m: "5px 0 0" }}
      >
        {subtitle}
      </Typography> */}
    </Box>
  );
};

export default Header;
