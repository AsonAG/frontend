import { React, createContext, useContext, useState, forwardRef } from "react";
import { useAsyncValue, Link as RouterLink } from "react-router-dom";
import { Divider, Stack, Typography, TextField, useMediaQuery, InputAdornment, IconButton, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { TableButton } from "../buttons/TableButton";
import { useTranslation } from "react-i18next";
import { useDebounceCallback } from "usehooks-ts";
import styled from "@emotion/styled";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import { Search } from "@mui/icons-material";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../ResponsiveDialog";
import { useSearchParam } from "../../hooks/useSearchParam";

const VariantContext = createContext("standard");


export function AsyncEmployeeTable() {
  const theme = useTheme();
  const variant = useMediaQuery(theme.breakpoints.down("sm")) ? "dense" : "standard";
  
  return (
    <VariantContext.Provider value={variant}>
      <ContentLayout title="Employees" buttons={<EmployeeTableButtons/>}>
        <AsyncDataRoute>
          <EmployeeTable/>
        </AsyncDataRoute>
      </ContentLayout>
    </VariantContext.Provider>
  );
}

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    display: "flex",
    textDecoration: "none",
    borderRadius: theme.spacing(0.5),
    color: theme.palette.text.primary,
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
    "&:hover": {
      "color": theme.palette.primary.main,
    },
    "&.active": {
      "color": theme.palette.primary.main,
    },
    "&.active:hover": {
      "color": theme.palette.primary.light,
    }
  }
});


function EmployeeTableButtons() {
  const { t } = useTranslation();
  const variant = useContext(VariantContext);
  return (
    <Stack direction="row" spacing={2}>
      <EmployeeTableSearch />
      <TableButton title={t("New employee")} to="new" icon={<AddOutlinedIcon />} variant={variant} />
    </Stack>
  )
}

function EmployeeTableSearchField() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useSearchParam("search", {replace: true});
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debounced = useDebounceCallback(setSearchTerm, 500);
  
  const onChange = (event) => {
    const updatedValue = event.target.value;
    setLocalSearchTerm(updatedValue);
    debounced.cancel();
    debounced(updatedValue);
  };
  
  return (
    <TextField
      variant="outlined"
      label={t("Search")}
      onChange={onChange}
      value={localSearchTerm}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        )
      }}
    />
  );
}

function EmployeeTableSearch() {
  const variant = useContext(VariantContext);
  if (variant === "dense") {
    return <EmployeeTableSearchDialog />;
  }
  return <EmployeeTableSearchField />
}

function EmployeeTableSearchDialog() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useSearchParam("search");
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const onSearch = () => {
    setSearchTerm(localSearchTerm);
  }
  const onClear = () => {
    setSearchTerm(null);
    setLocalSearchTerm(null);
  }
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger>
        <IconButton color="primary">
          <Search />
        </IconButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <TextField
          variant="outlined"
          label="Name"
          value={localSearchTerm}
          onChange={event => setLocalSearchTerm(event.target.value)}
        />
        <ResponsiveDialogClose>
          <Button color="primary" variant="contained" onClick={onSearch}>{t("Search")}</Button>
        </ResponsiveDialogClose>
        <ResponsiveDialogClose>
          <Button variant="outlined" onClick={onClear}>{t("Clear search")}</Button>
        </ResponsiveDialogClose>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function EmployeeTable() {
  const employees = useAsyncValue();
  return <>
    <Stack spacing={1} divider={<Divider />}>
      {employees.map((employee) => <EmployeeRow key={employee.id} employee={employee} />)}
    </Stack>
  </>;
};

const sx = {
  borderRadius: (theme) => theme.spacing(1),
  "&:hover": {
    "backgroundColor": (theme) => theme.palette.primary.hover
  },
  "&.active": {
    "backgroundColor": (theme) => theme.palette.primary.active
  }
}

function EmployeeRow({ employee }) {
  const variant = useContext(VariantContext);
  return (
    <Stack direction="row" alignItems="center" sx={sx} mx={-0.5} px={0.5}>
      <Link to={`${employee.id + ""}/new`}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography>{employee.firstName} {employee.lastName}</Typography>
          <Typography color="text.secondary" sx={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{employee.identifier}</Typography>
        </Stack>
      </Link>
      {
        variant === "standard" &&
          <EmployeeButtons employeeId={employee.id} />
      }
    </Stack>
  );
}

function EmployeeButtons ({ employeeId }) {
  const { t } = useTranslation();
  const variant = "dense";

  return (
    <Stack direction="row" spacing={2} py={0.5}>
      <TableButton title={t("New event")} to={employeeId + "/new"} variant={variant} icon={<AddOutlinedIcon />} />
      <TableButton title={t("Events")} to={employeeId + "/events"} variant={variant} icon={<WorkHistoryOutlinedIcon />} />
      <TableButton title={t("Documents")} to={employeeId + "/documents"} variant={variant} icon={<DescriptionOutlinedIcon />} />
      <TableButton title={t("Missing data")} to={employeeId + "/missingdata"} variant={variant} icon={<NotificationImportantIcon />} />
    </Stack>
  );
};
