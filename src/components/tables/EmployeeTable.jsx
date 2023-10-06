import { React } from "react";
import { useAsyncValue } from "react-router-dom";
import { Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "../Link";
import { TableButton } from "../buttons/TableButton";
import { useTranslation } from "react-i18next";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export function EmployeeTable() {
  const employees = useAsyncValue();
  const theme = useTheme();
  const variant = useMediaQuery(theme.breakpoints.down("md")) ? "dense" : "default";

  return (
    <Stack gap={1.5} divider={<Divider />}>
      {employees.map((employee, index) => <EmployeeRow key={index} employee={employee} variant={variant} />)}
    </Stack>
  );
};

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

function EmployeeRow({ employee, variant }) {
  return (
    <Stack direction="row" alignItems="center" gap={2} marginX={-1} sx={sx}>
      <Link to={employee.id + "/data"} flex={1} disableBgHover>
        <Stack>
          <Typography gutterBottom>{employee.firstName} {employee.lastName}</Typography>
          <Typography variant="body2" sx={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{employee.identifier}</Typography>
        </Stack>
      </Link>
      <EmployeeButtons employeeId={employee.id} variant={variant} />
    </Stack>
  );
}

function EmployeeButtons ({ employeeId, variant }) {
  const { t } = useTranslation();
  const stackSpacing = variant === "dense" ? 1 : 2;
  return (
    <Stack direction="row" spacing={stackSpacing}>
      <TableButton title={t("New event")} to={employeeId + "/new"} variant={variant} icon={<AddOutlinedIcon />} />
      <TableButton title={t("Events")} to={employeeId + "/events"} variant={variant} icon={<WorkHistoryOutlinedIcon />} />
      <TableButton title={t("Documents")} to={employeeId + "/documents"} variant={variant} icon={<DescriptionOutlinedIcon />} />
    </Stack>
  );
};