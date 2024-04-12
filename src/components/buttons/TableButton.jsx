import { Tooltip, IconButton, Button, Typography, Badge } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function TableButton({ title, icon, variant, badgeCount = 0, ...buttonProps }) {
  if (buttonProps.to) {
    buttonProps.component = RouterLink;
  }
  if (variant === "dense") {
    return (
      <Tooltip title={title} placement="top" arrow size="sm">
        <div>
          <IconButton color="primary" {...buttonProps}>
            <Badge badgeContent={badgeCount} color="primary">
              {icon}
            </Badge>
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <Button variant="outlined" startIcon={icon} {...buttonProps}>
      <Typography>{title}</Typography>
    </Button>
  );
};
