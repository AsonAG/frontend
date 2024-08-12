import React, { Dispatch, useEffect, useReducer } from "react";
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
import { useFetcher, useLoaderData } from "react-router-dom";
import { User } from "../models/User";
import { Division } from "../models/Division";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "../components/ResponsiveDialog";
import { BorderAllSharp, Edit } from "@mui/icons-material";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { Loading } from "./Loading";

type LoaderData = {
  users: Array<User>,
  divisions: Array<Division>
}

export function UserTable() {
  const { users } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Users")}>
      {users.map(user => <UserRow key={user.id} user={user} />)}
    </ContentLayout>
  );
}

function UserRow({ user }: { user: User }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack flex={1}>
        <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </Stack>
      <UserRoles user={user} />

      <EditUserRolesButton user={user} />
    </Stack>
  );
}

function UserRoles({ user }: { user: User }) {
  const role = "Admin";
  const scope = "";
  return (
    <Stack>
      <Typography fontWeight={500}>{role}</Typography>
      {scope &&
        <Typography variant="body2">{scope}</Typography>
      }
    </Stack>
  );
}

function EditUserRolesButton({ user }: { user: User }) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(
    reducer,
    {},
    createInitialState,
  );
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger>
        <IconButton>
          <Edit />
        </IconButton>
      </ResponsiveDialogTrigger>
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
          <ResponsiveDialogClose>
            <Button>{t("Cancel")}</Button>
          </ResponsiveDialogClose>
          <ResponsiveDialogClose>
            <Button variant="contained" color="primary" >{t("Save")}</Button>
          </ResponsiveDialogClose>
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
  const active = state.role === "admin";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "admin" })}>
      <Typography>{t("Administrator")}</Typography>
      <Typography variant="body2">{t("Grants access to the whole tenant")}</Typography>
    </RoleOption>
  )
}

function ManagerRoleOption({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const { t } = useTranslation();
  const active = state.role === "manager";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "manager" })}>
      <Typography>{t("Manager")}</Typography>
      <Typography variant="body2">{t("Grant access to specific payrolls")}</Typography>
      {active && <ManagerDivisionSection state={state} dispatch={dispatch} />}
    </RoleOption>
  )
}

function ManagerDivisionSection({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") {
      fetcher.load("divisions");
    }
  }, [fetcher]);

  if (!fetcher.data)
    return;
  if (fetcher.state === "loading")
    return <Loading />;

  return (
    <Stack>
      {
        fetcher.data.map((division: Division) => {
          return (
            <FormControl key={division.id}>
              <FormControlLabel
                name="division"
                label={division.name}
                labelPlacement="end"
                control={<Checkbox defaultChecked={true} value={division.name} name="divisions" size="small" />}
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
  const active = state.role === "self_service";
  return (
    <RoleOption active={active} onSelect={() => dispatch({ type: "set_selected_role", value: "self_service" })}>
      <Typography>{t("Self Service")}</Typography>
      <Typography variant="body2">{t("Grants restricted access to the specific employee")}</Typography>
      {active && <SelfServiceSection state={state} dispatch={dispatch} />}
    </RoleOption>
  )
}

function SelfServiceSection({ state, dispatch }: { state: RoleState, dispatch: Dispatch<ReducerAction> }) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") {
      fetcher.load("employees");
    }
  }, [fetcher]);

  if (!fetcher.data)
    return;
  if (fetcher.state === "loading")
    return <Loading />;

  return (
    <Autocomplete
      disablePortal
      value={state.employee?.id}
      onChange={(event, newValue) => dispatch({ type: "set_employee", value: newValue?.id })}
      getOptionLabel={getEmployeeDisplayString}
      id="select_employee"
      options={fetcher.data}
      sx={{ py: 1 }}
      renderInput={(params) => <TextField {...params} label="Employee" />}
    />
  );
}


function createInitialState(): RoleState {
  return {
    role: "admin",
    employee: null,
    divisions: null
  }
}

type Roles = "admin" | "manager" | "self_service";
type RoleState = {
  role: Roles;
  employee: Employee | null,
  divisions: Array<Division> | null
};

type ReducerAction = {
  type: "set_selected_role"
  value: Roles
} | {
  type: "set_employee"
  value: Employee | null
} | {
  type: "set_manager_payrolls"
  value: Array<Division> | null
};

function reducer(state: RoleState, action: ReducerAction) {
  switch (action.type) {
    case "set_selected_role":
      return {
        ...state,
        role: action.value
      };
    case "set_employee":
      if (state.role !== "self_service")
        throw new Error("invalid set_self_service_employee call");
      console.log("setting employee", action.value);
      return {
        ...state,
        employee: action.value
      };
    case "set_manager_payrolls":
      if (state.role !== "manager")
        throw new Error("invalid set_manager_payrolls call");
      return {
        ...state,
        divisions: action.value
      };
    default:
      throw new Error("unknown action type");
  }
}
