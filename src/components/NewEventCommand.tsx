import { Command } from "cmdk";
import React, { Dispatch, Suspense, useEffect, useMemo, useReducer, useState } from "react";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "./ResponsiveDialog";
import { Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { Add, Business, ChevronRight, Event, PeopleOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { payrollAtom } from "../utils/dataAtoms";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { getCompanyCases, getEmployeeCases, getEmployees } from "../api/FetchClient";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { AvailableCase } from "../models/AvailableCase";
import { useIsESS } from "../hooks/useRole";

export function NewEventCommand() {
  const params = useParams();
  const isMobile = useIsMobile();
  const isESS = useIsESS();
  if (!params.orgId || !params.payrollId || isMobile || isESS) {
    return;
  }
  return <InternalNewEventCommand />;
}

function InternalNewEventCommand() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
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
          {t("New event")}
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
        {open && <NewEventDialogContent close={() => setOpen(false)} />}
      </Suspense>
    </ResponsiveDialog>
  );
};

const chipSx = { pl: 0.75, pr: 0.25, borderRadius: 1, fontSize: "0.75rem" };

function NewEventDialogContent({ close }: { close: () => void }) {
  const { t } = useTranslation();
  const payroll = useAtomValue(payrollAtom);
  const params = useParams();
  const [state, dispatch] = useReducer(
    reducer,
    null,
    createInitialState,
  );

  useEffect(() => {
    // initialze state
    if (state.initialized)
      return;
    const controller = new AbortController();
    async function fetchInitialState() {
      try {

        const employeePromise = getEmployees(params).withActive().withSignal(controller.signal).fetchJson();
        if (params.employeeId) {
          const casesPromise = getEmployeeCases(params, "NewEvent", controller.signal);
          const [employees, cases]: [Array<Employee>, Array<any>] = await Promise.all([employeePromise, casesPromise]);
          const employee = employees.find(x => x.id === params.employeeId);
          // if employee does not exists, the employee could not be found or is inactive
          if (employee) {
            dispatch({
              type: "initialize", state: {
                initialized: true,
                loading: false,
                placeholder: "Select event",
                page: "employee",
                search: "",
                employees,
                employee,
                cases
              }
            });
            return;
          }
        }
        const employees: Array<Employee> = await employeePromise;
        dispatch({
          type: "initialize", state: {
            initialized: true,
            loading: false,
            page: "context",
            search: "",
            placeholder: "Select event context",
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

  useEffect(() => {
    // initialze state
    if (!state.initialized)
      return;

    async function fetchCases(getCases: () => Promise<Array<any>>) {
      try {
        // TODO Dispatch loading
        dispatch({ type: "start-loading-cases" });

        const cases = await getCases();

        dispatch({
          type: "cases-loaded", cases
        });
      } catch (e) {
        // TODO AJO 
      }
    };
    if (state.page === "employee" && state.cases === null) {
      const controller = new AbortController();
      const getCases = () => getEmployeeCases({ ...params, employeeId: state.employee.id }, "NewEvent", controller.signal);
      fetchCases(getCases);
      return () => controller.abort();
    }

    if (state.page === "company" && state.cases === null) {
      const controller = new AbortController();
      const getCases = () => getCompanyCases(params, "NewEvent", controller.signal);
      fetchCases(getCases);
      return () => controller.abort();

    }

  }, [state.initialized && state.page])

  return (
    <ResponsiveDialogContent containerWidth disablePadding spacing={0}>
      <VisuallyHidden>
        <ResponsiveDialogTitle>{t("New event")}</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>{t("Mask for selecting a new event to report")}</ResponsiveDialogDescription>
      </VisuallyHidden>
      <Stack direction="row" spacing={1} sx={{ p: 2, pb: 1 }} alignItems="center">
        <Chip
          label={payroll.name}
          icon={<Business />}
          variant="outlined"
          onClick={() => dispatch({ type: "context" })}
          color="primary"
          sx={chipSx} />
        <ContextChip state={state} />
      </Stack>
      <Command
        label="New Event Command Menu"
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !state.search) {
            e.preventDefault();
            dispatch({ type: "context" });
          }
        }}
        filter={(value, search, keywords) => {
          if (value.toLowerCase().includes(search.toLowerCase())) return 1;
          const allKeywords = keywords.join(' ');
          if (allKeywords.toLowerCase().includes(search.toLowerCase())) return 0.9;
          return 0;
        }}
      >
        <Command.Input value={state.search} onValueChange={s => dispatch({ type: "set-search", search: s })} autoFocus placeholder={t(state.placeholder)} />
        <LoadingCommandList state={state}>
          <ContextCommandGroup state={state} dispatch={dispatch} />
          <EmployeeCasesCommandGroup state={state} dispatch={dispatch} close={close} />
          <CompanyCasesCommandGroup state={state} dispatch={dispatch} close={close} />
        </LoadingCommandList>
      </Command>
    </ResponsiveDialogContent>
  )
}

function ContextChip({ state }: { state: State }) {
  const { t } = useTranslation();
  if (!state.initialized)
    return;

  if (state.page === "context")
    return;

  const label = state.page === "employee" ? getEmployeeDisplayString(state.employee) : t("Company event");
  const icon = state.page === "employee" ? <PeopleOutlined /> : <Event />;
  return (
    <>
      <ChevronRight sx={{ color: theme => theme.palette.text.disabled }} />
      <Chip label={label} icon={icon} variant="outlined" sx={chipSx} />
    </>
  );
}

function LoadingCommandList({ state, children }: { state: State, children: React.ReactNode }) {
  const { t } = useTranslation();
  const elements = !state.initialized || state.loading ?
    <Command.Loading><CircularProgress /></Command.Loading> :
    <>
      <Command.Empty>{state.page === "context" ? t("No employee found") : t("No event found")}</Command.Empty>
      {children}
    </>
  return (
    <Command.List>
      {elements}
    </Command.List>
  )
}

function ContextCommandGroup({ state, dispatch }: { state: State, dispatch: Dispatch<Action> }) {
  const { t } = useTranslation();
  const employeeState = state.initialized ? state.employees : null;
  const employees = useMemo(() => employeeState?.map((employee: Employee) => (
    <Command.Item key={employee.id} onSelect={() => dispatch({ type: "select-employee", employee: employee })}>
      <CommandItem text={getEmployeeDisplayString(employee)} subtext={employee.identifier} />
    </Command.Item>
  )), [employeeState]);

  const isContextPage = state.initialized && state.page === "context";
  if (!isContextPage)
    return;

  return <>
    <Command.Group heading={t("Company")}>
      <Command.Item onSelect={() => dispatch({ type: "select-company" })}>{t("Company event")}</Command.Item>
    </Command.Group>
    {
      employees &&
      <Command.Group heading={t("Employees")}>
        {employees}
      </Command.Group>
    }
  </>
}

function getCaseKeywords(_case: AvailableCase) {
  let keywords = [_case.name];
  if (_case.description) {
    keywords.push(_case.description);
  }
  if (_case.nameSynonyms) {
    for (const synonym of _case.nameSynonyms) {
      keywords.push(synonym);
    }
  }
  if (_case.caseFields) {
    for (const field of _case.caseFields) {
      keywords.push(field.displayName);
      if (field.description) {
        keywords.push(field.description);
      }
    }
  }
  return keywords;
}


type CommandItemProps = {
  text: string
  subtext?: string
}

function CommandItem({ text, subtext }: CommandItemProps) {
  return (
    <Stack>
      <Typography>{text}</Typography>
      {
        subtext && <Typography variant="body2" noWrap>{subtext}</Typography>
      }
    </Stack>
  );
};

function EmployeeCasesCommandGroup({ state, close, dispatch }: { state: State, close: () => void, dispatch: Dispatch<Action> }) {
  const navigate = useNavigate();
  const params = useParams();
  const casesState = state.initialized && state.page === "employee" ? state.cases : null;
  function onCaseSelected(_case: AvailableCase) {
    const employee = state.initialized && state.page === "employee" && state.employee;
    if (!employee)
      throw new Error("no employee found"); // this should never happen
    const path = generatePath(`/orgs/:orgId/payrolls/:payrollId/hr/employees/:employeeId/new/:caseName`, { orgId: params.orgId!, payrollId: params.payrollId!, employeeId: employee.id, caseName: encodeURIComponent(_case.name) });
    navigate(path);
    close();
  }
  const cases = useMemo(() => casesState?.map((_case) => (
    <Command.Item key={_case.id} onSelect={() => onCaseSelected(_case)} keywords={getCaseKeywords(_case)}>
      <CommandItem text={_case.displayName} subtext={_case.description} />
    </Command.Item>
  )), [casesState]);

  const isEmployeeCasesPage = state.initialized && state.page === "employee";
  if (!isEmployeeCasesPage || (casesState?.length ?? 0) === 0)
    return;

  return (
    <Command.Group>
      {cases}
    </Command.Group>
  );
}


function CompanyCasesCommandGroup({ state, close, dispatch }: { state: State, close: () => void, dispatch: Dispatch<Action> }) {
  const navigate = useNavigate();
  const params = useParams();
  const casesState = state.initialized && state.page === "company" ? state.cases : null;
  function onCaseSelected(_case: AvailableCase) {
    const path = generatePath(`/orgs/:orgId/payrolls/:payrollId/company/new/:caseName`, { orgId: params.orgId!, payrollId: params.payrollId!, caseName: encodeURIComponent(_case.name) });
    navigate(path);
    close();
  }
  const cases = useMemo(() => casesState?.map((_case) => (
    <Command.Item key={_case.id} onSelect={() => onCaseSelected(_case)} keywords={getCaseKeywords(_case)}>
      <CommandItem text={_case.displayName} subtext={_case.description} />
    </Command.Item>
  )), [casesState]);

  const isCompanyCasesPage = state.initialized && state.page === "company";
  if (!isCompanyCasesPage || (casesState?.length ?? 0) === 0)
    return;

  return (
    <Command.Group>
      {cases}
    </Command.Group>
  );
}

type State = {
  initialized: false
  search: string
  placeholder: string
} | {
  initialized: true
  employees: Array<Employee>
  loading: boolean
  search: string
  placeholder: string
} & ({
  page: "employee"
  employee: Employee,
  cases: Array<AvailableCase> | null
} | {
  page: "company"
  cases: Array<AvailableCase> | null
} | {
  page: "context"
})

type Action = {
  type: "select-employee"
  employee: Employee
} | {
  type: "select-company"
} | {
  type: "start-loading-cases"
} | {
  type: "cases-loaded"
  cases: Array<AvailableCase>
} | {
  type: "context"
} | {
  type: "initialize"
  state: State
} | {
  type: "set-search",
  search: string
}

function createInitialState(): State {
  return {
    initialized: false,
    search: "",
    placeholder: ""
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select-employee":
      if (!state.initialized)
        throw new Error("not initialized");
      if (!action.employee || state.page === "company")
        throw new Error("invalid action");
      return {
        ...state,
        page: "employee",
        search: "",
        placeholder: "Select event",
        employee: action.employee,
        cases: null
      };
    case "select-company":
      if (!state.initialized)
        throw new Error("not initialized");
      if (state.page === "employee")
        throw new Error("invalid action");
      return {
        ...state,
        page: "company",
        search: "",
        placeholder: "Select event",
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
        search: "",
        placeholder: "Select event context"
      }
    case "start-loading-cases":
      if (!state.initialized)
        throw new Error("not initialized");
      return {
        ...state,
        loading: true
      };
    case "cases-loaded":
      if (!state.initialized)
        throw new Error("not initialized");
      if (!(state.page === "employee" || state.page === "company"))
        throw new Error("invalid context");

      return {
        ...state,
        loading: false,
        cases: action.cases
      };
    case "initialize":
      if (state.initialized)
        throw new Error("Already initialized");
      if (!action.state.initialized)
        throw new Error("New State should be initialized");
      return action.state;
    case "set-search":
      return {
        ...state,
        search: action.search
      };
    default:
      throw new Error("unknown action type");
  }
}


