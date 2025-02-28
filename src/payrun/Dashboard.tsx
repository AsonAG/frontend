import React, { createContext, Dispatch, forwardRef, Ref, useCallback, useContext, useMemo, useReducer } from "react";
import { Link as RouterLink, Outlet, useRouteLoaderData, LinkProps } from "react-router-dom";
import { Stack, Typography, Button, Chip, Box, styled } from "@mui/material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "./DashboardHeader";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";
import { PayrunTabContent, PayrunTabs, Tab } from "./PayrunTabs";
import { EntryRow } from "./types";
import { getEmployeeDisplayString } from "../models/Employee";
import { PayrunTable } from "./PayrollTable";
import { CalculatingIndicator } from "./CalculatingIndicator";
import { SearchField } from "../components/SearchField";
import { MissingDataCase } from "../models/MissingData";



type PayrollTableContextProps = {
  state: DashboardState
  dispatch: Dispatch<DashboardAction>
}

export const PayrollTableContext = createContext<PayrollTableContextProps>(null!);

export function PayrunDashboard() {
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  return (
    <>
      <PayrunPeriodView key={payrunPeriod.id} />
      <Outlet />
    </>
  );
}

function PayrunPeriodView() {
  const { payrunPeriod, previousPayrunPeriod, controllingData, caseValueCounts, salaryTypes } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const isOpen = payrunPeriod.periodStatus === "Open";
  const rows: Array<EntryRow> = useMemo(() => {
    var controllingDataMap = new Map(controllingData.employeeControllingCases.map(x => [x.id, x.cases]));
    return payrunPeriod.entries.map((entry, index) => ({
      ...entry,
      amount: entry.openPayout ?? 0,
      previousEntry: previousPayrunPeriod?.entries?.find(previousEntry => previousEntry.employeeId == entry.employeeId),
      controllingTasks: isOpen ? controllingDataMap.get(entry.employeeId) : [],
      caseValueCount: isOpen ? caseValueCounts[index] : 0,
      salaryType: salaryTypes[index]
    }));
  }, [payrunPeriod.entries, previousPayrunPeriod?.entries, isOpen, controllingData, caseValueCounts]);
  const [state, dispatch] = useReducer(
    reducer,
    rows,
    createInitialState
  );

  const header = (
    <DashboardHeader index>
      <Stack direction="row" spacing={2}>
        {
          isOpen && <>
            <PayrunTabs />
            <CalculatingIndicator />
          </>
        }
        <Box flex={1} />
        <EmployeeTableSearchField />
      </Stack>
    </DashboardHeader>
  );


  return (
    <PayrollTableContext.Provider value={{ state, dispatch }}>
      <ContentLayout title={header}>
        {
          isOpen ? (
            <>
              <PayrunTabContent tab="Controlling" emptyText="Controlling completed.">
                <ControllingList />
              </PayrunTabContent>
              <PayrunTabContent tab="Payable" emptyText="All employees have been paid out.">
                <PayrunTable entries={state.entriesByState["Payable"]} completed={false} />
              </PayrunTabContent>
              <PayrunTabContent tab="PaidOut" emptyText="No payment has been made yet.">
                <PayrunTable entries={state.entriesByState["PaidOut"]} completed={true} />
              </PayrunTabContent>
            </>
          ) :
            <PayrunTable entries={state.filteredEntries} completed={true} />
        }
      </ContentLayout>
    </PayrollTableContext.Provider>
  );
}



type EntryState = "Controlling" | "Payable" | "PaidOut" | "Calculating" | "WithoutOccupation";

function EmployeeTableSearchField() {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(PayrollTableContext);
  const setFilter = useCallback((filter: string) => dispatch({ type: "set_employee_filter", filter }), [dispatch]);


  return (
    <SearchField
      label={t("Employee search")}
      value={state.employeeFilter}
      setValue={setFilter} />
  );
}
export type DashboardState = {
  entries: Array<EntryRow>
  filteredEntries: Array<EntryRow>
  entriesByState: Record<EntryState, EntryRow[]>
  entryCountByTab: Record<Tab, number>
  selectedTab: Tab,
  salaryType: string | null
  employeeFilter: string
}


export type DashboardAction = {
  type: "set_salary_type"
  salaryType: string | null
} | {
  type: "set_employee_filter"
  filter: string
} | {
  type: "set_tab"
  tab: Tab
}

function reducer(state: DashboardState, action: DashboardAction): DashboardState {
  let newState: DashboardState;
  switch (action.type) {
    case "set_tab": {
      if (action.tab === state.selectedTab) {
        return state;
      }
      return {
        ...state,
        selectedTab: action.tab,
      };
    }
    case "set_salary_type":
      if (state.salaryType === action.salaryType) {
        return state;
      }
      newState = {
        ...state,
        salaryType: action.salaryType
      };
      break;
    case "set_employee_filter":
      newState = {
        ...state,
        employeeFilter: action.filter
      };
      break;
  }
  newState.filteredEntries = newState.entries.filter(e => filterBySalaryType(e, newState.salaryType) && filterBySearch(e, newState.employeeFilter));
  newState.entriesByState = groupRows(newState.filteredEntries);
  newState.entryCountByTab = getEntryCountByTab(newState.entriesByState);
  if (action.type === "set_employee_filter") {
    newState.selectedTab = getSelectedTabAfterSearch(newState);
  }
  return newState;
}

function filterBySalaryType(entry: EntryRow, salaryType: string | null) {
  if (salaryType === null)
    return true;
  return entry.salaryType === salaryType;
}

function filterBySearch(entry: EntryRow, search: string) {
  if (search === "")
    return true;
  return getEmployeeDisplayString(entry).toLowerCase().includes(search.toLowerCase());
}

function getSelectedTabAfterSearch(state: DashboardState): Tab {
  function hasEntries(tab: Tab) { return (state.entriesByState[tab] ?? []).length > 0; }
  if (hasEntries(state.selectedTab)) {
    return state.selectedTab;
  }
  if (hasEntries("Controlling")) {
    return "Controlling"
  }
  if (hasEntries("Payable")) {
    return "Payable";
  }
  if (hasEntries("PaidOut")) {
    return "PaidOut";
  }
  return state.selectedTab;
}


function createInitialState(employeeRows: Array<EntryRow>): DashboardState {
  const grouped = groupRows(employeeRows);
  return {
    entries: employeeRows,
    filteredEntries: employeeRows,
    entriesByState: grouped,
    entryCountByTab: getEntryCountByTab(grouped),
    selectedTab: "Controlling",
    salaryType: null,
    employeeFilter: ""
  };
}

function groupRows(rows: Array<EntryRow>): Record<EntryState, Array<EntryRow>> {
  return Object.groupBy(rows, groupingFn);
  function groupingFn(row: EntryRow): EntryState {
    if (!row.payrunJobId) {
      return "Calculating";
    }
    if ((row.controllingTasks?.length ?? 0) > 0) {
      return "Controlling";
    }
    if (!!row.openPayout) {
      return "Payable";
    }
    if (row.openPayout === 0 && ((row.netWage ?? 0) > 0) && ((row.grossWage ?? 0) > 0)) {
      return "PaidOut";
    }
    return "WithoutOccupation";
  }
}

function getEntryCountByTab(grouped: Record<EntryState, EntryRow[]>): Record<Tab, number> {
  return {
    "Controlling": (grouped["Controlling"]?.length ?? 0) + (grouped["WithoutOccupation"]?.length ?? 0),
    "Payable": (grouped["Payable"]?.length ?? 0),
    "PaidOut": (grouped["PaidOut"]?.length ?? 0)
  };
}


function ControllingList() {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  const { controllingData } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const wageControlling = state.entriesByState["Controlling"];
  const withoutOccupation = state.entriesByState["WithoutOccupation"];
  if (!wageControlling && !withoutOccupation && controllingData.companyControllingCases.length === 0) {
    return <Typography>{t("All entries are ok.")}</Typography>
  }

  return (
    <Stack spacing={2}>
      <WageControllingList wageControlling={wageControlling} companyControllingCases={controllingData.companyControllingCases} />
      <WithoutOccupationList withoutOccupation={withoutOccupation} />
    </Stack>
  )
}

function WageControllingList({ wageControlling, companyControllingCases }: { wageControlling: Array<EntryRow>, companyControllingCases: MissingDataCase[] }) {
  const { t } = useTranslation();
  if (!wageControlling && companyControllingCases.length === 0)
    return;

  return (
    <Stack spacing={1}>
      <Typography variant="h6">{t("payrun_period_wage_controlling")}</Typography>
      <CompanyControllingRow companyControllingCases={companyControllingCases} />
      {wageControlling.map(entry => <ControllingRow key={entry.id} entry={entry} />)}
    </Stack>
  )
}

function CompanyControllingRow({ companyControllingCases }: { companyControllingCases: MissingDataCase[] }) {
  const { t } = useTranslation();
  if (companyControllingCases.length === 0)
    return;
  return (
    <Stack spacing={0.5} alignItems="start">
      <Typography>{t("Company")}</Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {
          companyControllingCases.map(task => <Button key={task.id} component={RouterLink} to={`company/new/${encodeURIComponent(task.name)}`} variant="outlined" color="warning" size="small">{task.displayName}</Button>)
        }
      </Stack>
    </Stack>
  )
}
function ControllingRow({ entry }: { entry: EntryRow }) {
  return (
    <Stack spacing={0.5} alignItems="start">
      <Link to={`../../hr/employees/${entry.employeeId}`} >{getEmployeeDisplayString(entry)}</Link>
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {
          entry?.controllingTasks?.map(task => <Button key={task.id} component={RouterLink} to={`employees/${entry.employeeId}/new/${encodeURIComponent(task.name)}`} variant="outlined" color="warning" size="small">{task.displayName}</Button>)
        }
      </Stack>
    </Stack>
  )
}

const Link = styled(
  forwardRef(function Link(itemProps: LinkProps, ref: Ref<HTMLAnchorElement>) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  }),
)(({ theme }) => {
  return {
    display: "block",
    textDecoration: "none",
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.hover
    }
  };
});

function WithoutOccupationList({ withoutOccupation }: { withoutOccupation: Array<EntryRow> }) {
  const { t } = useTranslation();
  if (!withoutOccupation)
    return;

  return (
    <Stack spacing={1}>
      <Typography variant="h6">{t("payrun_period_without_occupation")}</Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {withoutOccupation.map(entry => <Chip component={RouterLink} to={`../../hr/employees/${entry.employeeId}`} key={entry.id} label={getEmployeeDisplayString(entry)} variant="outlined" onClick={noop} color="primary" />)}
      </Stack>
    </Stack>
  )
}

const noop = () => { };
