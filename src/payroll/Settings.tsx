
import React, { useEffect, useReducer } from "react";
import { ContentLayout } from "../components/ContentLayout";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Form, Link, Navigate, Outlet, useLoaderData, useRouteLoaderData, useSubmit } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Payroll } from "../models/Payroll";
import { formatDate } from "../utils/DateUtils";
import { AvailableRegulation, AvailableRegulations, CountrySpecificRegulations } from "../models/AvailableRegulations";
import { PayrollRegulations, RegulationName } from "../models/PayrollRegulations";
import { toast } from "../utils/dataAtoms";
import { PayrunPeriod } from "../models/PayrunPeriod";

type LoaderData = {
  payroll: Payroll,
  payrollRegulations: PayrollRegulations
  availableRegulations: AvailableRegulations
  loadKey: string
}

export function PayrollSettings() {
  return (
    <ContentLayout title="Settings">
      <PayrollDataSettings />
      <PayrollRegulationSettings />
      <PayrollTransmissionState />
      <Outlet />
    </ContentLayout>
  );
}

function PayrollDataSettings() {
  const { payroll } = useLoaderData() as LoaderData;
  const { t } = useTranslation();

  return (
    <Form method="POST">
      <Stack spacing={2}>
        <TextField name="payrollName" defaultValue={payroll.name} label={t("Organization unit name")} />
        <TextField name="accoutingStartDate" value={formatDate(payroll.accountingStartDate)} label={t("Payroll accounting start date")} disabled />
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>{t("Language")}</InputLabel>
          <Select name="language" defaultValue={payroll.language} label={t("Language")}>
            <MenuItem value="German">{t("German")}</MenuItem>
            <MenuItem value="English">{t("English")}</MenuItem>
            <MenuItem value="French">{t("French")}</MenuItem>
            <MenuItem value="Italian">{t("Italian")}</MenuItem>
          </Select>
        </FormControl>
        <Stack alignItems="end">
          <Button variant="contained" type="submit">{t("Save")}</Button>
        </Stack>
      </Stack>
    </Form>
  );
}

function PayrollRegulationSettings() {
  const { t } = useTranslation();
  const { payrollRegulations, availableRegulations } = useLoaderData() as LoaderData;
  const [state, dispatch] = useReducer(reducer, { payrollRegulations, availableRegulations }, createInitialState);
  const submit = useSubmit();

  useEffect(() => {
    if (state.error) {
      toast("error", state.error.message)
    }
  }, [state.error]);

  const onSubmit = () => {
    submit(state.selectedRegulations, { method: "POST", encType: "application/json" });
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t("Regulations")}</Typography>
      <RegulationSelect
        label={t("Country")}
        items={availableRegulations}
        value={state.selectedRegulations.countryRegulationName}
        onChange={(value) => dispatch({ type: "set_country", countryRegulation: value })}
        disabled={!!payrollRegulations.countryRegulationName} />
      <RegulationSelect
        label={t("Industry")}
        items={state.countryRegulations.industries}
        multiple
        onChange={(values) => dispatch({ type: "set_industries", industries: values })}
        value={state.selectedRegulations.industries} />
      <RegulationSelect
        label={t("ERP")}
        items={state.countryRegulations.erp}
        multiple
        onChange={(values) => dispatch({ type: "set_erp", erp: values })}
        value={state.selectedRegulations.erp} />
      <RegulationSelect
        label={t("accounting_data_regulation")}
        items={state.countryRegulations.accountingData}
        value={state.selectedRegulations.accountingData}
        onChange={(value) => dispatch({ type: "set_accounting_data", accountingData: value })} />
      <RegulationSelect
        label={t("Accounting document")}
        items={state.countryRegulations.accountingDocument}
        value={state.selectedRegulations.accountingDocument}
        onChange={(value) => dispatch({ type: "set_accounting_document", accountingDocument: value })} />
      <Stack alignItems="end">
        <Button variant="contained" onClick={onSubmit}>{t("Save regulations")}</Button>
      </Stack>
    </Stack>
  )
}

type RegulationSelectProps = {
  label: string
  items: AvailableRegulation[]
  disabled?: boolean
} & ({
  multiple: true
  value: RegulationName[]
  onChange: (v: RegulationName[]) => void
} | {
  multiple?: undefined
  value: RegulationName | null
  onChange: (value: RegulationName) => void
})

function RegulationSelect({ label, items, multiple, value, onChange, disabled }: RegulationSelectProps) {
  const menuItems = items.map(x => (
    <MenuItem key={x.name} value={x.name}>{x.displayName}</MenuItem>
  ));
  const select = multiple ?
    <Select
      value={value || ""}
      label={label}
      multiple
      disabled={disabled}
      onChange={(event) => {
        const { target: { value } } = event;
        onChange(
          typeof value === 'string' ? value.split(',') : value,
        )
      }}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip key={value} label={items.find(r => r.name === value)?.displayName ?? value} size="small" sx={{ height: 20 }} />
          ))}
        </Box>
      )}
    >
      {menuItems}
    </Select>
    :
    <Select
      value={value || ""}
      label={label}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {menuItems}
    </Select>
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel>{label}</InputLabel>
      {select}
    </FormControl>
  )
}

type RegulationSelectionState = {
  availableRegulations: AvailableRegulations
  countryRegulations: CountrySpecificRegulations
  selectedRegulations: PayrollRegulations
  payrollRegulations: PayrollRegulations
  error: {
    message: string
  } | null
}

type RegulationSelectionAction = {
  type: "set_country"
  countryRegulation: RegulationName
} | {
  type: "set_industries"
  industries: RegulationName[]
} | {
  type: "set_erp"
  erp: RegulationName[]
} | {
  type: "set_accounting_document"
  accountingDocument: RegulationName
} | {
  type: "set_accounting_data"
  accountingData: RegulationName
} | {
  type: "reset_state",
  state: RegulationSelectionState
}

function reducer(state: RegulationSelectionState, action: RegulationSelectionAction): RegulationSelectionState {
  switch (action.type) {
    case "set_country":
      return {
        ...state,
        countryRegulations: state.availableRegulations.find(r => r.name === action.countryRegulation)!,
        selectedRegulations: {
          countryRegulationName: action.countryRegulation,
          industries: [],
          erp: [],
          accountingDocument: null,
          accountingData: null
        }
      };
    case "set_industries":
      if (state.payrollRegulations.industries.some(x => !action.industries.includes(x))) {
        return {
          ...state,
          error: {
            message: "Loaded industry regulations cannot be removed!"
          }
        };
      }
      return {
        ...state,
        selectedRegulations: {
          ...state.selectedRegulations,
          industries: action.industries
        }
      };
    case "set_erp":
      if (state.payrollRegulations.erp.some(x => !action.erp.includes(x))) {
        return {
          ...state,
          error: {
            message: "Loaded ERP regulations cannot be removed!"
          }
        };
      }
      return {
        ...state,
        selectedRegulations: {
          ...state.selectedRegulations,
          erp: action.erp
        }
      };
    case "set_accounting_document":
      return {
        ...state,
        selectedRegulations: {
          ...state.selectedRegulations,
          accountingDocument: action.accountingDocument
        }
      };
    case "set_accounting_data":
      return {
        ...state,
        selectedRegulations: {
          ...state.selectedRegulations,
          accountingData: action.accountingData
        }
      };
    case "reset_state":
      return action.state;
  }
}


function createInitialState({ availableRegulations, payrollRegulations }: { availableRegulations: AvailableRegulations, payrollRegulations: PayrollRegulations }): RegulationSelectionState {
  const countryRegulations = availableRegulations.find(r => r.name === payrollRegulations.countryRegulationName) ?? {
    name: "",
    displayName: "",
    industries: [],
    erp: [],
    accountingDocument: [],
    accountingData: []
  };
  return {
    availableRegulations,
    countryRegulations,
    payrollRegulations,
    selectedRegulations: payrollRegulations,
    error: null
  };
}


function PayrollTransmissionState() {
  const { payroll } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  const text = !!payroll.transmissionStartDate ?
    t("{{name}} is live. Closing a period will transmit the documents to swissdec.", { name: payroll.name }) :
    t("{{name}} is not live. Documents will not be sent to swissdec.", { name: payroll.name });
  return (
    <Form method="POST">
      <Stack spacing={2}>
        <Typography variant="h6">{t("Transmission")}</Typography>
        <Typography>{text}</Typography>
        {
          !payroll.transmissionStartDate &&
          <Stack alignItems="end">
            <Button component={Link} to="golive" variant="contained" color="primary" >{t("Go live")}</Button>
          </Stack>
        }
      </Stack>
    </Form>
  );
}


export function ConfirmTransmissionDialog() {
  const { payroll } = useRouteLoaderData("payrollSettings") as LoaderData;
  const openPayrunPeriod = useLoaderData() as PayrunPeriod;
  const { t } = useTranslation();
  if (payroll.transmissionStartDate) {
    return <Navigate to=".." />
  }
  return (
    <Dialog open>
      <DialogTitle>{t("Start transmission")}</DialogTitle>
      <DialogContent>
        <Typography>{t("Starting with the currently open period {{periodDate}} the relevant documents will be sent to swissdec.", { periodDate: formatDate(openPayrunPeriod.periodStart) })}</Typography>
      </DialogContent>
      <DialogActions>
        <Button component={Link} to="..">{t("Back")}</Button>
        <Form method="POST">
          <input type="hidden" name="transmissionStartDate" value={openPayrunPeriod.periodStart as unknown as string} />
          <Button type="submit" variant="contained">{t("Go live")}</Button>
        </Form>
      </DialogActions>
    </Dialog>
  )
}
