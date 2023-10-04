import { Typography } from "@mui/material";

function Header({ title, ...otherProps }) {
  return <Typography variant="h2" fontWeight="bold" pb={2} {...otherProps}>{title}</Typography>;
};

export default Header;
