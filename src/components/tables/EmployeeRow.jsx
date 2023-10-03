import { Stack, Typography } from "@mui/material";
import { EmployeeButtons } from "../buttons/EmployeeButtons";
import { Link as RouterLink } from "react-router-dom";
import styled from "@emotion/styled";
import { forwardRef } from "react";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    display: "block",
    textDecoration: "none",
    color: theme.palette.text.primary,
    flex: 1,
    "&:hover": {
      "color": theme.palette.primary.main,
    },
    "&.active": {
      "color": theme.palette.primary.main
    },
    "&.active:hover": {
      "color": theme.palette.primary.light,
    }
  }
});

const sx = {
  borderRadius: (theme) => theme.spacing(1),
  padding: (theme) => theme.spacing(1),
  "&:hover": {
    "backgroundColor": (theme) => theme.palette.primary.hover
  },
  "&.active": {
    "backgroundColor": (theme) => theme.palette.primary.active
  }
}

export function EmployeeRow({ employee, variant }) {
  return (
    <Stack direction="row" alignItems="center" gap={2} marginX={-1} sx={sx}>
      <Link to={employee.id + ""}>
        <Stack>
          <Typography gutterBottom>{employee.firstName}&nbsp;{employee.lastName}</Typography>
          <Typography variant="body2" sx={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{employee.identifier}</Typography>
        </Stack>
      </Link>
      <EmployeeButtons employeeId={employee.id} variant={variant} />
    </Stack>
  );
}