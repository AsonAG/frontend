
import React, { useEffect, useReducer } from "react";
import { ContentLayout } from "../components/ContentLayout";
import { Box, Button, Chip, FormControl, FormLabel, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useLoaderData, useSubmit } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Payroll } from "../models/Payroll";
import { formatDate } from "../utils/DateUtils";
import { AvailableRegulation, AvailableRegulations, CountrySpecificRegulations } from "../models/AvailableRegulations";
import { PayrollRegulations, RegulationName } from "../models/PayrollRegulations";
import { toast } from "../utils/dataAtoms";
import { useUpdateEffect } from "usehooks-ts";

type LoaderData = {
  payroll: Payroll,
  payrollRegulations: PayrollRegulations
  availableRegulations: AvailableRegulations
}

export function PayrollSettings() {
  const { payroll } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  return (
    <ContentLayout title="Settings">
      <TextField value={payroll.name} label={t("Organization unit name")} />
      <FormControl fullWidth variant="standard">
        <FormLabel>{t("Payroll accounting start date")}</FormLabel>
        <Typography>{formatDate(payroll.accountingStartDate)}</Typography>
      </FormControl>
      <PayrollRegulationSettings />
    </ContentLayout>
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

  useEffect(() => {
    dispatch({ type: "reset_state", state: createInitialState({ payrollRegulations, availableRegulations }) });
  }, [payrollRegulations, availableRegulations]);

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
          accountingDocument: null
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
    accountingDocument: []
  };
  return {
    availableRegulations,
    countryRegulations,
    payrollRegulations,
    selectedRegulations: payrollRegulations,
    error: null
  };
}
