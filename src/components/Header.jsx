import { Typography, Box } from "@mui/material";

const Header = ({ title }) => {
  return (
    <Box mb="15px">
      <Typography variant="h2" fontWeight="bold">
        {title} 
      </Typography>
    </Box>
  );
};

export default Header;
