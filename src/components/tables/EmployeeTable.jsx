import { React, createContext, useContext, useState, forwardRef } from "react";
import { useAsyncValue, Link as RouterLink } from "react-router-dom";
import { Divider, Stack, Typography, TextField, useMediaQuery, InputAdornment, IconButton, Button, Switch, FormGroup, FormControlLabel} from "@mui/material";
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
import { useIsMobile } from "../../hooks/useIsMobile";
import { StatusChip } from "../../scenes/employees/StatusChip";
import { useMissingDataCount } from "../../utils/dataAtoms";

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

const SearchButton = styled(forwardRef(function SearchButton(itemProps, ref) {
  return <IconButton ref={ref} {...itemProps} role={undefined}><Search /></IconButton>;
}), {shouldForwardProp: (name) => name !== "isFiltering"})(({theme, ...props}) => {
  if (props.isFiltering) {
    return {
      color: theme.palette.common.white,
      backgroundColor: `${theme.palette.primary.main} !important`
    };
  }
  return {
    color: theme.palette.primary.main
  };
});

function EmployeeTableButtons() {
  const { t } = useTranslation();
  const variant = useContext(VariantContext);
  return (
    <Stack direction="row" spacing={2}>
      <EmployeeStatusSwitch />
      <EmployeeTableSearch />
      <TableButton title={t("New employee")} to="new" icon={<AddOutlinedIcon />} variant={variant} />
    </Stack>
  )
}

function EmployeeStatusSwitch() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useSearchParam("showAll", {replace: true});
  const isMobile = useIsMobile();
  if (isMobile)
    return;

  const label = t("Only active");
  const handleChange = (event) => setShowAll(event.target.checked ? null : "true");
  return (
    <FormGroup>
      <FormControlLabel control={<Switch checked={!showAll} onChange={handleChange} />} label={label} />
    </FormGroup>
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
        <SearchButton isFiltering={!!searchTerm} />
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
  const [showAll] = useSearchParam("showAll");
  return <>
    <Stack spacing={1} divider={<Divider />}>
      {employees.map((employee) => <EmployeeRow key={employee.id} employee={employee} showStatus={showAll} />)}
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

function EmployeeRow({ employee, showStatus }) {
  const variant = useContext(VariantContext);
  return (
    <Stack direction="row" alignItems="center" sx={sx} mx={-0.5} px={0.5}>
      <Link to={employee.id + ""}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography>{employee.firstName} {employee.lastName}</Typography>
          <Typography color="text.secondary" sx={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{employee.identifier}</Typography>
          {showStatus && <StatusChip status={employee.status} /> }
        </Stack>
      </Link>
      {
        variant === "standard" &&
          <EmployeeButtons employee={employee} />
      }
    </Stack>
  );
}

function EmployeeButtons ({ employee }) {
  const { t } = useTranslation();
  const variant = "dense";
  const isActive = employee.status === "Active"
  const missingDataCount = useMissingDataCount(employee.id);

  return (
    <Stack direction="row" spacing={2} py={0.5}>
      <TableButton title={t("New event")} to={employee.id + "/new"} variant={variant} icon={<AddOutlinedIcon />} disabled={!isActive}/>
      <TableButton title={t("Events")} to={employee.id + "/events"} variant={variant} icon={<WorkHistoryOutlinedIcon />} />
      <TableButton title={t("Documents")} to={employee.id + "/documents"} variant={variant} icon={<DescriptionOutlinedIcon />} />
      <TableButton title={t("Missing data")} to={employee.id + "/missingdata"} variant={variant} icon={<NotificationImportantIcon />} badgeCount={missingDataCount} disabled={!isActive || !missingDataCount} />
    </Stack>
  );
};
