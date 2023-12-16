import { React, useMemo, useReducer } from "react";
import { useAsyncValue, useLoaderData, useRouteLoaderData, useSubmit } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { ContentLayout } from "./ContentLayout";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getDateLocale } from "../services/converters/DateLocaleExtractor";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

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
  const [state, dispatch] = usePayrunFormReducer(payrun, parameters, employees);

  const updateTextValue = type => event => dispatch({type, value: event.target.value});
  const onSubmit = () => {
    var jobInvocation = {
      payrunId: payrun.id,
      payrollId: payroll.id,
      userId: user.id,
      name: state.jobName,
      forecast: state.forecast,
      periodStart: state.period,
      employeeIdentifiers: employees.map(e => e.identifier),
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
      <TextField label="Employees" disabled value="All Employees" />
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
      <Button variant="contained" onClick={onSubmit}>Start</Button>
    </Stack>
  )
}

function createInitialState(payrun, parameters, employees) {
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

function usePayrunFormReducer(payrun, parameters, employees) {
  const initialState = useMemo(() => createInitialState(payrun, parameters, employees));
  return useReducer(reducer, initialState);
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
