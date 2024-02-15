import { React } from "react";
import { useAsyncValue } from "react-router-dom";
import { Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { TableButton } from "../buttons/TableButton";
import { useTranslation } from "react-i18next";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import { Edit } from "@mui/icons-material";


export function AsyncEmployeeTable() {
  const theme = useTheme();
  const variant = useMediaQuery(theme.breakpoints.down("md")) ? "dense" : "default";
  const { t } = useTranslation();
  const newEmployeeButton = <TableButton title={t("New employee")} to="new" icon={<AddOutlinedIcon />} variant={variant} />
  
  return (
    <ContentLayout title="Employees" buttons={newEmployeeButton}>
      <AsyncDataRoute>
        <EmployeeTable variant={variant}/>
      </AsyncDataRoute>
    </ContentLayout>
  );
}

function EmployeeTable({variant}) {
  const employees = useAsyncValue();
  return (
    <Stack spacing={1.5} divider={<Divider />}>
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
    <Stack direction="row" alignItems="center" spacing={2} ml={-2} mr={-1} sx={sx}>
      <Stack flex={1} p={1}>
        <Typography gutterBottom>{employee.firstName} {employee.lastName}</Typography>
        <Typography variant="body2" sx={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{employee.identifier}</Typography>
      </Stack>
      <EmployeeButtons employeeId={employee.id} variant={variant} />
    </Stack>
  );
}

function EmployeeButtons ({ employeeId, variant }) {
  const { t } = useTranslation();
  const stackSpacing = variant === "dense" ? 1 : 2;
  return (
    <Stack direction="row" spacing={stackSpacing}>
      <TableButton title={t("Edit")} to={employeeId + "/edit"} variant={variant} icon={<Edit />} />
      <TableButton title={t("New event")} to={employeeId + "/new"} variant={variant} icon={<AddOutlinedIcon />} />
      <TableButton title={t("Events")} to={employeeId + "/events"} variant={variant} icon={<WorkHistoryOutlinedIcon />} />
      <TableButton title={t("Documents")} to={employeeId + "/documents"} variant={variant} icon={<DescriptionOutlinedIcon />} />
    </Stack>
  );
};