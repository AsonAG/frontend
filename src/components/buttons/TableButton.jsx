import { Tooltip, IconButton, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function TableButton({ title, icon, variant, ...buttonProps }) {
  if (buttonProps.to) {
    buttonProps.component = RouterLink;
  }
  if (variant === "dense") {
    return (
      <Tooltip title={title} placement="top" arrow size="sm">
        <IconButton color="primary" {...buttonProps}>
          {icon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button variant="outlined" startIcon={icon} {...buttonProps}>
      <Typography>{title}</Typography>
    </Button>
  );
};
