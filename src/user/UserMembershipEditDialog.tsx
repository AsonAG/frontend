
import React, { Dispatch, useMemo, useReducer } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useLoaderData, useParams, useRouteLoaderData, useSubmit } from "react-router-dom";
import { UserMembership, UserRole, UserRoleName } from "../models/User";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle } from "../components/ResponsiveDialog";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { IdType } from "../models/IdType";
import { Payroll } from "../models/Payroll";

type LoaderData = {
  payrolls: Array<Payroll>
  employees: Array<Employee>
}

type UserTableData = {
  userMemberships: Array<UserMembership>
}

export function UserMembershipEditDialog() {
  const { t } = useTranslation();
  const submit = useSubmit();
  const { userMembershipId } = useParams();
  const { userMemberships } = useRouteLoaderData("userTable") as UserTableData;

  const user = useMemo(() => userMemberships.find(user => user.id === userMembershipId)!, [userMembershipId, userMemberships]);

  const [state, dispatch] = useReducer(
    reducer,
    user,
    createInitialState
  );
  const onSave = () => {
    function getUserRole(): UserRole {
      switch (state.role) {
        case "Admin":
          return {"$type": "Admin"};
        case "Owner":
          return {"$type": "Owner"};
        case "PayrollManager":
          return {
            "$type": "PayrollManager",
            payrollIds: state.payrollIds
          };
        case "SelfService":
          return {
            "$type": "SelfService",
            employeeId: state.employee!
          };
      }
    }
    submit(getUserRole(), { method: "post", encType: "application/json" });
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
  const active = state.role === "PayrollManager";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "PayrollManager" })}>
      <Typography>{t("Manager")}</Typography>
      <Typography variant="body2">{t("Grant access to specific payrolls")}</Typography>
      {active && <ManagerPayrollSection state={state} dispatch={dispatch} />}
    </RoleOption>
  )
}

function ManagerPayrollSection({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { payrolls } = useLoaderData() as LoaderData;
  return (
    <Stack>
      {
        payrolls.map((payroll: Payroll) => {
          const checked = state.payrollIds?.includes(payroll.id) ?? false;
          const onChange = checked ?
            () => dispatch({ type: "remove_manager_payroll", value: payroll.id }) :
            () => dispatch({ type: "add_manager_payroll", value: payroll.id });

          return (
            <FormControl key={payroll.id}>
              <FormControlLabel
                name="payroll"
                label={payroll.name}
                labelPlacement="end"
                control={<Checkbox checked={checked} value={payroll.name} name="payrollIds" size="small"
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


function createInitialState(userMembership: UserMembership): RoleState {
  return {
    role: userMembership.role["$type"],
    employee: userMembership.role["employeeId"] ?? null,
    payrollIds: userMembership.role["payrollIds"] ?? null
  }
}

type RoleState = {
  role: UserRoleName;
  employee: IdType | null,
  payrollIds: Array<IdType>
};

type ReducerAction = {
  type: "set_selected_role"
  value: UserRoleName
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

function reducer(state: RoleState, action: ReducerAction): RoleState {
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
      if (state.role !== "PayrollManager")
        throw new Error("invalid set_manager_payrolls call");
      const payrollIds = state.payrollIds?.filter(payroll => payroll !== action.value);
      return {
        ...state,
        payrollIds
      };
    case "add_manager_payroll":
      if (state.role !== "PayrollManager")
        throw new Error("invalid set_manager_payrolls call");
      const updatedPayrollIds = state.payrollIds ?? [];

      return {
        ...state,
        payrollIds: [...updatedPayrollIds, action.value]
      };
    default:
      throw new Error("unknown action type");
  }
}
