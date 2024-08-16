
import React, { Dispatch, useEffect, useMemo, useReducer } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Select,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
  useRadioGroup,
} from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Link, useFetcher, useLoaderData, useNavigate, useParams, useRouteLoaderData, useSubmit } from "react-router-dom";
import { User, UserRole } from "../models/User";
import { Division } from "../models/Division";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "../components/ResponsiveDialog";
import { BorderAllSharp, Edit } from "@mui/icons-material";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { Loading } from "./Loading";
import { IdType } from "../models/IdType";

type LoaderData = {
  divisions: Array<Division>
  employees: Array<Employee>
}

type UserTableData = {
  users: Array<User>
}

export function UserEditDialog() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const { userId } = useParams();
  const { users } = useRouteLoaderData("userTable") as UserTableData;

  const user = useMemo(() => users.find(user => user.id === userId), [userId, users]) as User;

  const [state, dispatch] = useReducer(
    reducer,
    user,
    createInitialState,
  );
  const onSave = () => {
    const data: UserRole = {
      "$type": state.role,
    }
    if (state.role === "DivisionManager") {
      data.DivisionIds = state.divisions;
    }
    if (state.role === "SelfService") {
      data.EmployeeId = state.employee
    }
    submit(data, { method: "post", encType: "application/json" });
  };
  return (
    <ResponsiveDialog open>
      <ResponsiveDialogContent>
        <ResponsiveDialogTitle asChild>
          <Typography variant="h6">{t("Edit role")}: {user.firstName} {user.lastName}</Typography>
        </ResponsiveDialogTitle>
        <ResponsiveDialogDescription asChild>
          <Typography>Select the access from the options below:</Typography>
        </ResponsiveDialogDescription>
        <RadioGroup name="role" defaultValue="self-service">
          <Stack spacing={1}>
            <AdminRoleOption state={state} dispatch={dispatch} />
            <ManagerRoleOption state={state} dispatch={dispatch} />
            <SelfServiceRoleOption state={state} dispatch={dispatch} />
          </Stack>
        </RadioGroup>
        <Stack direction="row" justifyContent="end" spacing={1}>
          <Button component={Link} to="..">{t("Cancel")}</Button>
          <Button variant="contained" color="primary" onClick={onSave}>{t("Save")}</Button>
        </Stack>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}




const baseRoleOptionSx: SxProps<Theme> = {
  borderStyle: "solid",
  borderWidth: 2,
  borderRadius: 2,
  padding: 1.5
};

const activeRoleOptionSx: SxProps<Theme> = {
  ...baseRoleOptionSx,
  borderColor: (theme) => theme.palette.primary.main,
};
const inactiveRoleOptionSx: SxProps<Theme> = {
  ...baseRoleOptionSx,
  borderColor: (theme) => theme.palette.divider,
  "&:hover": {
    borderColor: (theme) => theme.palette.primary.light,
    cursor: "pointer"
  },
  "&:active": {
    borderColor: (theme) => theme.palette.primary.main,
    // @ts-ignore
    backgroundColor: (theme) => theme.palette.primary.hover
  }
};

function RoleOption({ active, onSelect, children }) {
  return (
    <Box sx={active ? activeRoleOptionSx : inactiveRoleOptionSx} onClick={onSelect}>
      {children}
    </Box>
  )
}

function AdminRoleOption({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { t } = useTranslation();
  const active = state.role === "Admin";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "Admin" })}>
      <Typography>{t("Administrator")}</Typography>
      <Typography variant="body2">{t("Grants access to the whole tenant")}</Typography>
    </RoleOption>
  )
}

function ManagerRoleOption({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { t } = useTranslation();
  const active = state.role === "DivisionManager";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "DivisionManager" })}>
      <Typography>{t("Manager")}</Typography>
      <Typography variant="body2">{t("Grant access to specific payrolls")}</Typography>
      {active && <ManagerDivisionSection state={state} dispatch={dispatch} />}
    </RoleOption>
  )
}

function ManagerDivisionSection({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { divisions } = useLoaderData() as LoaderData;
  return (
    <Stack>
      {
        divisions.map((division: Division) => {
          const checked = state.divisions?.includes(division.id) ?? false;
          const onChange = checked ?
            () => dispatch({ type: "remove_manager_payroll", value: division.id }) :
            () => dispatch({ type: "add_manager_payroll", value: division.id });

          return (
            <FormControl key={division.id}>
              <FormControlLabel
                name="division"
                label={division.name}
                labelPlacement="end"
                control={<Checkbox checked={checked} value={division.name} name="divisions" size="small"
                  onChange={onChange} />}
              />
            </FormControl>
          )
        })
      }
    </Stack>
  )
}

function SelfServiceRoleOption({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { t } = useTranslation();
  const active = state.role === "SelfService";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "SelfService" })}>
      <Typography>{t("Self Service")}</Typography>
      <Typography variant="body2">{t("Grants restricted access to the specific employee")}</Typography>
      {active && <SelfServiceSection state={state} dispatch={dispatch} />}
    </RoleOption>
  )
}

function SelfServiceSection({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { employees } = useLoaderData() as LoaderData;
  const value = useMemo(() => employees.find(employee => employee.id === state.employee) ?? null, [employees, state.employee]);

  return (
    <Autocomplete
      disablePortal
      value={value}
      onChange={(event, newValue) => dispatch({ type: "set_employee", value: newValue?.id ?? null })}
      getOptionLabel={getEmployeeDisplayString}
      id="select_employee"
      options={employees}
      sx={{ py: 1 }}
      renderInput={(params) => <TextField {...params} label="Employee" />}
    />
  );
}


function createInitialState(user: User): RoleState {
  return {
    role: user.role["$type"],
    employee: user.role["employeeId"] ?? null,
    divisions: user.role["divisionIds"] ?? null
  }
}

type Role = "Admin" | "DivisionManager" | "SelfService";
type RoleState = {
  role: Role;
  employee: IdType | null,
  divisions: Array<IdType> | null
};

type ReducerAction = {
  type: "set_selected_role"
  value: Role
} | {
  type: "set_employee"
  value: IdType | null
} | {
  type: "remove_manager_payroll"
  value: IdType
} | {
  type: "add_manager_payroll"
  value: IdType
};

function reducer(state: RoleState, action: ReducerAction) {
  switch (action.type) {
    case "set_selected_role":
      return {
        ...state,
        role: action.value
      };
    case "set_employee":
      if (state.role !== "SelfService")
        throw new Error("invalid set_self_service_employee call");
      return {
        ...state,
        employee: action.value
      };
    case "remove_manager_payroll":
      if (state.role !== "DivisionManager")
        throw new Error("invalid set_manager_payrolls call");
      const divisions = state.divisions?.filter(division => division !== action.value);
      return {
        ...state,
        divisions
      };
    case "add_manager_payroll":
      if (state.role !== "DivisionManager")
        throw new Error("invalid set_manager_payrolls call");
      const updatedDivisions = state.divisions ?? [];

      return {
        ...state,
        divisions: [...updatedDivisions, action.value]
      };
    default:
      throw new Error("unknown action type");
  }
}
