import { React, useReducer } from "react";
import { useAsyncValue, useLoaderData, useRouteLoaderData, useSubmit, useNavigation } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { ContentLayout } from "./ContentLayout";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getDateLocale } from "../services/converters/DateLocaleExtractor";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { EmployeeSelector } from "./EmployeeSelector";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@mui/material";

export function AsyncNewPayrunView() {
  const { payrun } = useLoaderData();
  
  return (
    <ContentLayout title={payrun.name}>
      <AsyncDataRoute skipDataCheck>
        <NewPayrunView payrun={payrun}/>
      </AsyncDataRoute>
    </ContentLayout>
  );
}

function NewPayrunView({payrun}) {
  const { user, payroll } = useRouteLoaderData('root');
  const submit = useSubmit();
  const [parameters, employees] = useAsyncValue();
  const [state, dispatch] = useReducer(reducer, {payrun, parameters, employees}, createInitialState);
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
      name: state.jobName,
      forecast: state.forecast,
      periodStart: state.period,
      employeeIdentifiers: state.employees.map(e => e.identifier),
      reason: state.jobReason,
      retroPayMode: state.retroPayMode ? "ValueChange" : "None",
      // TODO AJO
      // attributes: parameters
    }
    submit(jobInvocation, { method: "post", encType: "application/json" });
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getDateLocale(user)}>
          <DatePicker
            label="Period"
            value={state.period}
            onChange={newDate => dispatch({type: "set_period", value: newDate})}
            timezone="UTC"
            openTo="month"
            views={['year', 'month']}
            slotProps={{
              textField: { required: true, sx: {flex: 1} }
            }}
          />
        </LocalizationProvider>
        <IconButton onClick={() => dispatch({type: "dec_period"})}>
          <NavigateBefore />
        </IconButton>
        <IconButton onClick={() => dispatch({type: "inc_period"})}>
          <NavigateNext />
        </IconButton>
      </Stack>
      <TextField label="JobName" value={state.jobName} onChange={updateTextValue("set_job_name")} onBlur={() => dispatch({type: "blur_job_name"})}/>
      <TextField label="JobReason" value={state.jobReason} onChange={updateTextValue("set_job_reason")} />
      <EmployeeSelector allEmployees={employees} selectedEmployees={state.employees} updateEmployees={e => dispatch({type: "set_employees", value: e})} />
      <TextField label="Forecast" value={state.forecast} onChange={updateTextValue("set_forecast")}/>
      <FormControl>
        <FormControlLabel
          label="Retro Pay Mode"
          labelPlacement="end"
          control={
            <Checkbox
              checked={state.retroPayMode}
              onChange={event => dispatch({type: "set_retro", value: event.target.checked})}
            />
          }
        />
      </FormControl>
      <Typography>Parameters</Typography>
      <Button
        disabled={isProcessing}
        variant="contained"
        onClick={onSubmit}
        endIcon={icon}
        sx={{alignSelf: "end"}}
      >
        {t("Start")}
      </Button>
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
    case "inc_period":
      return updatePeriod(state.period.add(1, "month"));
    case "dec_period":
      return updatePeriod(state.period.subtract(1, "month"));
    case "set_job_name":
      return {
        ...state,
        jobName: action.value,
        jobNameDirty: true
      };
    case "blur_job_name":
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
