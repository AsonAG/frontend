import { React, useReducer } from "react";
import { useAsyncValue, useRouteLoaderData, useSubmit, useNavigation, useLoaderData, Link, useActionData } from "react-router-dom";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import dayjs from "dayjs";
import { EmployeeSelector } from "./EmployeeSelector";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@mui/material";
import { DatePicker } from "../DatePicker";

export function AsyncNewPayrunView() {
  return (
    <AsyncDataRoute skipDataCheck>
      <NewPayrunView />
    </AsyncDataRoute>
  );
}

function NewPayrunView() {
  const errorMessage = useActionData();
  const { user, payroll } = useRouteLoaderData('root');
  const submit = useSubmit();
  const employees = useAsyncValue();
  const { payrun } = useLoaderData();
  const [state, dispatch] = useReducer(reducer, {payrun, employees, parameters: null}, createInitialState);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" && !!navigation.json;
  const isRedirecting = navigation.state === "loading" && navigation.json && navigation.formAction !== navigation.location.pathname;
  const isProcessing = isSubmitting || isRedirecting;
  const icon = isProcessing ? <CircularProgress {...iconProps} /> : null;
  const { t } = useTranslation();

  const updateTextValue = type => event => dispatch({type, value: event.target.value});
  const onSubmit = () => {
    var jobInvocation = {
      payrunId: payrun.id,
      payrollId: payroll.id,
      userId: user.id,
      name: state.jobName === "" ? null : state.jobName,
      forecast: state.forecast === "" ? null : state.forecast,
      periodStart: state.period,
      employeeIdentifiers: state.employees.map(e => e.identifier),
      reason: state.jobReason === "" ? null : state.jobReason,
      retroPayMode: state.retroPayMode ? "ValueChange" : "None",
    }
    submit(jobInvocation, { method: "post", encType: "application/json" });
  };

  return (
    <Stack spacing={2}>
      <DatePicker
        variant="month"
        label={t("Period")}
        value={state.period}
        onChange={newDate => dispatch({type: "set_period", value: newDate})}
      />
      <TextField label={t("Name")} value={state.jobName} onChange={updateTextValue("set_job_name")} onBlur={() => dispatch({type: "ensure_job_name"})}/>
      <TextField label={t("Reason")} value={state.jobReason} onChange={updateTextValue("set_job_reason")} />
      <EmployeeSelector allEmployees={employees} selectedEmployees={state.employees} updateEmployees={e => dispatch({type: "set_employees", value: e})} />
      <TextField label={t("Forecast")} value={state.forecast} onChange={updateTextValue("set_forecast")}/>
      { errorMessage && <Alert severity="error" variant="filled"><Typography>{errorMessage}</Typography></Alert> }
      <Stack direction="row" alignSelf="end" spacing={2}>
        <Button
          component={Link}
          to=".."
          disabled={isProcessing}
        >
          {t("Back")}
        </Button>
        <Button
          disabled={isProcessing}
          variant="contained"
          onClick={onSubmit}
          endIcon={icon}
        >
          {t("Start")}
        </Button>
      </Stack>
    </Stack>
  )
}

function createInitialState({payrun, parameters, employees}) {
  const period = dayjs().utc().startOf("month").add(1, "month");
  return {
    period,
    jobName: getJobName(period),
    jobReason: payrun.defaultReason,
    retroPayMode: true,
    forecast: "",
    employees
  }
}

function reducer(state, action) {
  const updatePeriod = period => {
    const jobName = state.jobNameDirty ? state.jobName : getJobName(period);
    return {
      ...state,
      jobName,
      period
    };
  }
  switch(action.type) {
    case "set_period":
      return updatePeriod(action.value);
    case "set_job_name":
      return {
        ...state,
        jobName: action.value,
        jobNameDirty: true
      };
    case "ensure_job_name":
      if (!state.jobName) {
        return {
          ...state,
          jobName: getJobName(state.period),
          jobNameDirty: false
        }
      }
      return state;
    case "set_job_reason":
      return {
        ...state,
        jobReason: action.value
      };
    case "set_employees":
      return {
        ...state,
        employees: action.value
      };
    case "set_forecast":
      return {
        ...state,
        forecast: action.value
      };
    case "set_retro":
      return {
        ...state,
        retroPayMode: action.value
      };
    default:
      throw new Error("unknown action type");
  }
}

const getJobName = period => `Payrun ${period.format('MMMM')} ${period.year()}`;
const iconProps = {
  size: "1em",
  sx: {
    color: "common.white"
  }
};
