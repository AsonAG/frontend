import { Command } from "cmdk";
import React, { Suspense, useEffect, useId, useMemo, useReducer, useRef, useState } from "react";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "./ResponsiveDialog";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { selfServiceEmployeeAtom, payrollAtom } from "../utils/dataAtoms";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { getCompanyCases, getEmployeeCases, getEmployees } from "../api/FetchClient";
import { generatePath, useFetcher, useParams } from "react-router-dom";

export function NewEventCommand() {
  const params = useParams();
  if (!params.tenantId || !params.payrollId) {
    return;
  }
  return <InternalNewEventCommand />;
}

function InternalNewEventCommand() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ px: 1, tabIndex: -1 }} disableRipple>
          <Add sx={{ mr: 0.5, pb: 0.125 }} />
          Neues Ereignis...
          <Box component="div" sx={{
            borderWidth: "thin",
            borderStyle: "solid",
            borderRadius: 1,
            px: 0.5,
            ml: 2,
            fontSize: "0.6rem",
            borderColor: theme => theme.palette.common.white
          }}>CTRL+K</Box>
        </Button>
      </ResponsiveDialogTrigger>
      <Suspense>
        {open && <NewEventDialogContent />}
      </Suspense>
    </ResponsiveDialog>
  );
};

function NewEventDialogContent() {
  const { t } = useTranslation();
  // const payroll = useAtomValue(payrollAtom);
  const preselectedEmployee: Employee = useAtomValue(selfServiceEmployeeAtom);
  const params = useParams();
  const [search, setSearch] = useState("");
  const [state, dispatch] = useReducer(
    reducer,
    preselectedEmployee,
    createInitialState,
  );

  useEffect(() => {
    // initialze state
    if (state.initialized)
      return;
    const controller = new AbortController();
    async function fetchInitialState() {
      try {

        const employeePromise = getEmployees(params).withSignal(controller.signal).fetchJson();
        if (params.employeeId) {
          const casesPromise = getEmployeeCases(params, "NewEvent", controller.signal);
          const [employees, cases]: [Array<Employee>, Array<any>] = await Promise.all([employeePromise, casesPromise]);
          const employee = employees.find(x => x.id === params.employeeId);
          if (!employee)
            throw new Error("Employee not found")
          dispatch({
            type: "initialize", state: {
              initialized: true,
              loading: false,
              page: "employee",
              employees,
              employee,
              cases
            }
          });
          return;
        }
        const employees: Array<Employee> = await employeePromise;
        dispatch({
          type: "initialize", state: {
            initialized: true,
            loading: false,
            page: "context",
            employees
          }
        });
      }
      catch (e) {
        // TODO AJO 
      }
    }

    fetchInitialState();
    return () => controller.abort();
  }, []);

  return (
    <ResponsiveDialogContent containerWidth disablePadding>
      <VisuallyHidden>
        <ResponsiveDialogTitle>{t("New event")}</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>{t("Mask for selecting a new event to report")}</ResponsiveDialogDescription>
      </VisuallyHidden>
      <Command
        label="Global Command Menu"
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !search) {
            e.preventDefault();
          }
        }}
      >
        <Command.Input value={search} onValueChange={setSearch} placeholder={t("Select the context")} />
        <LoadingCommandList state={state}>
          <ContextCommandGroup state={state} />
        </LoadingCommandList>
      </Command>
    </ResponsiveDialogContent>
  )
}

function LoadingCommandList({ state, children }: { state: State, children: React.ReactNode }) {
  const { t } = useTranslation();
  const elements = !state.initialized || state.loading ?
    <Command.Loading>{t("Fetching")}</Command.Loading> :
    <>
      <Command.Empty>{t("No event found.")}</Command.Empty>
      {children}
    </>
  return (
    <Command.List>
      {elements}
    </Command.List>
  )
}

function ContextCommandGroup({ state }: { state: State }) {
  const { t } = useTranslation();
  const employeeState = state.initialized ? state.employees : null;
  const employees = useMemo(() => employeeState?.map((employee: Employee) => (
    <Command.Item key={employee.id}>{getEmployeeDisplayString(employee)}</Command.Item>
  )), [employeeState]);

  const isContextPage = state.initialized && state.page === "context";
  if (!isContextPage)
    return;

  return <>
    <Command.Group heading={t("Firma")}>
    </Command.Group>
    {
      employees &&
      <Command.Group heading={t("Employees")}>
        {employees}
      </Command.Group>
    }
  </>
}

type State = {
  initialized: false
} | {
  initialized: true
  employees: Array<Employee>
  loading: boolean
} & ({
  page: "employee"
  employee: Employee,
  cases: Array<{}> | null
} | {
  page: "company"
  cases: Array<{}> | null
} | {
  page: "context"
})

type Action = {
  type: "select_employee"
  employee: Employee
} | {
  type: "select_company"
} | {
  type: "context"
} | {
  type: "initialize"
  state: State
}

function createInitialState(): State {
  return {
    initialized: false
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select_employee":
      if (!state.initialized)
        throw new Error("not initialized");
      if (!action.employee || state.page === "company")
        throw new Error("invalid action");
      return {
        ...state,
        page: "employee",
        employee: action.employee,
        cases: null
      };
    case "select_company":
      if (!state.initialized)
        throw new Error("not initialized");
      if (state.page === "employee")
        throw new Error("invalid action");
      return {
        ...state,
        page: "company",
        cases: null
      };
    case "context":
      if (!state.initialized)
        throw new Error("not initialized");
      if (state.page === "context")
        return state;
      return {
        ...state,
        page: "context",
      }
    case "initialize":
      if (state.initialized)
        throw new Error("Already initialized");
      if (!action.state.initialized)
        throw new Error("New State should be initialized");
      return action.state;
    default:
      throw new Error("unknown action type");
  }
}
