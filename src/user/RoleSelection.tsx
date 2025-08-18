
import { Dispatch, useMemo, useReducer } from "react";
import {
  Autocomplete,
  Box,
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
import { UserRole, UserRoleName } from "../models/User";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { IdType } from "../models/IdType";
import { Payroll } from "../models/Payroll";

type RoleSelectionProps = {
  state: RoleSelectionState,
  dispatch: Dispatch<RoleSelectionReducerAction>
  payrolls: Array<Payroll>
  employees: Array<Employee>
}

export function useRoleSelection(initialRole: UserRole | null): [RoleSelectionState, Dispatch<RoleSelectionReducerAction>] {
  return useReducer(
    reducer,
    initialRole ?? {"$type": "Admin"},
    createInitialState
  );

}

export function RoleSelection(props: RoleSelectionProps) {
  return (
    <RadioGroup name="role">
      <Stack spacing={1}>
        <AdminRoleOption {...props} />
        <ManagerRoleOption {...props} />
        <SelfServiceRoleOption {...props} />
      </Stack>
    </RadioGroup>
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
  color: (theme) => theme.palette.primary.main,
  borderColor: (theme) => theme.palette.primary.main,
  backgroundColor: (theme) => theme.palette.primary.hover
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

function AdminRoleOption({ state, dispatch }: { state: RoleSelectionState, dispatch: Dispatch<RoleSelectionReducerAction> }) {
  const { t } = useTranslation();
  const active = state.selectedRole === "Admin";
  return (
    <RoleOption active={active} onSelect={() => !active && dispatch({ type: "set_selected_role", value: "Admin" })}>
      <Typography>{t("Administrator")}</Typography>
      <Typography variant="body2">{t("Grants access to the whole organization")}</Typography>
    </RoleOption>
  )
}

function ManagerRoleOption(props: RoleSelectionProps) {
  const { t } = useTranslation();
  const active = props.state.selectedRole === "PayrollManager";
  return (
    <RoleOption active={active} onSelect={() => !active && props.dispatch({ type: "set_selected_role", value: "PayrollManager" })}>
      <Typography>{t("Manager")}</Typography>
      <Typography variant="body2">{t("Grant access to specific payrolls")}</Typography>
      {active && <ManagerPayrollSection {...props} />}
    </RoleOption>
  )
}

function ManagerPayrollSection({ state, dispatch, payrolls }: RoleSelectionProps) {
  const selectedPayrollIds = state.role?.$type === "PayrollManager" ? state.role.payrollIds : [];
  return (
    <Stack>
      {
        payrolls.map((payroll: Payroll) => {
          const checked = selectedPayrollIds.includes(payroll.id) ?? false;
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

function SelfServiceRoleOption(props: RoleSelectionProps) {
  const { t } = useTranslation();
  const active = props.state.selectedRole === "SelfService";
  return (
    <RoleOption active={active} onSelect={() => !active && props.dispatch({ type: "set_selected_role", value: "SelfService" })}>
      <Typography>{t("Self Service")}</Typography>
      <Typography variant="body2">{t("Grants restricted access to the specific employee")}</Typography>
      {active && <SelfServiceSection {...props} />}
    </RoleOption>
  )
}

function SelfServiceSection({ state, dispatch, employees }: RoleSelectionProps) {
  const { t } = useTranslation();
  const selectedEmployeeId = state.role?.$type === "SelfService" ? state.role.employeeId : undefined;
  const value = useMemo(
    () => employees.find(employee => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId]);

  return (
    <Autocomplete
      disablePortal
      value={value}
      onChange={(event, newValue) => dispatch({ type: "set_employee", value: newValue?.id ?? null })}
      getOptionLabel={getEmployeeDisplayString}
      id="select_employee"
      options={employees}
      sx={{ py: 1 }}
      renderInput={(params) => <TextField {...params} label={t("Employee")} />}
    />
  );
}


function createInitialState(initialRole: UserRole): RoleSelectionState {
  return {
    selectedRole: initialRole["$type"],
    role: {...initialRole}
  };
}

type RoleSelectionState = {
  selectedRole: UserRoleName;
  role: UserRole | null
};

type RoleSelectionReducerAction = {
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

function reducer(state: RoleSelectionState, action: RoleSelectionReducerAction): RoleSelectionState {
      console.log(state, action)
  switch (action.type) {
    case "set_selected_role":
      if (state.selectedRole === action.value)
        return state;
      const newSelectedRole: UserRole | null = action.value === "Admin" ? {"$type": "Admin"} : null;
      return {
        role: newSelectedRole,
        selectedRole: action.value,
      };
    case "set_employee":
      if (state.selectedRole !== "SelfService")
        throw new Error("invalid set_self_service_employee call");
      const selfServiceRole: UserRole | null = action.value ?
        {"$type": "SelfService", employeeId: action.value} : null;
      return {
        ...state,
        role: selfServiceRole
      };
    case "remove_manager_payroll":
      if (state.role?.$type !== "PayrollManager")
        throw new Error("invalid set_manager_payrolls call");
      const payrollIdsRemoved = state.role.payrollIds.filter(p => p !== action.value);
      const managerRoleRemoved: UserRole | null = payrollIdsRemoved.length > 0 ?
        {"$type": "PayrollManager", payrollIds: payrollIdsRemoved} : null;
      return {
        ...state,
        role: managerRoleRemoved
      };
    case "add_manager_payroll":
      if (state.selectedRole !== "PayrollManager")
        throw new Error("invalid set_manager_payrolls call");
      const previousIds = state.role?.$type === "PayrollManager" ? state.role.payrollIds : [];
      const payrollIdsAdded = [...previousIds, action.value];
      const managerRoleAdded: UserRole = {"$type": "PayrollManager", payrollIds: payrollIdsAdded};
      return {
        ...state,
        role: managerRoleAdded
      };
    default:
      throw new Error("unknown action type");
  }
}
