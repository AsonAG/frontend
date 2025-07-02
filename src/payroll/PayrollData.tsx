import { Stack, TextField, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, Typography, Button, Box, Chip } from "@mui/material";
import React, { useRef, useState, useReducer, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { PayrollSettingsLoaderData } from "./Settings";
import { toast } from "../utils/dataAtoms";
import { DatePicker } from "../components/DatePicker";
import dayjs from "dayjs";
import { AvailableRegulation, AvailableRegulations, CountrySpecificRegulations } from "../models/AvailableRegulations";
import { PayrollRegulations, RegulationName } from "../models/PayrollRegulations";

export function PayrollData() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const { payroll, payrollRegulations, availableRegulations } = useLoaderData() as PayrollSettingsLoaderData;
  const [payrollName, setPayrollName] = useState(payroll?.name ?? "");
  const [accountingStartDate, setAccountingStartDate] = useState((!!payroll && payroll.accountingStartDate) ? dayjs.utc(payroll.accountingStartDate) : dayjs().utc().startOf('year'));
  const [language, setLanguage] = useState(payroll?.language ?? "German");
  const { state: navigationState } = useNavigation();

  const createInitialStateArgs = {
    payrollRegulations: payrollRegulations ?? {
      countryRegulation: availableRegulations?.[0]?.name,
      industries: [],
      erp: [],
      accountingData: null,
      accountingDocument: null
    },
    availableRegulations: availableRegulations
  };
  const [state, dispatch] = useReducer(reducer, createInitialStateArgs, createInitialState);

  useEffect(() => {
    if (state.error) {
      toast("error", state.error.message)
    }
  }, [state.error]);

  const submit = useSubmit();
  const onSubmit = () => {
    if (!formRef.current || !formRef.current.reportValidity()) {
      return;
    }
    if (!payroll) {
      const createPayrollRequest = {
        payroll: {
          name: payrollName,
          accountingStartDate: accountingStartDate.toISOString(),
          language,
          culture: "de-ch"
        },
        regulations: state.selectedRegulations
      };
      submit(createPayrollRequest, { method: "POST", encType: "application/json" });
    } else {
      const updatePayrollRequest = {
        payroll: {
          ...payroll,
          name: payrollName,
          language
        },
        regulations: state.selectedRegulations
      }
      submit(updatePayrollRequest, { method: "PUT", encType: "application/json" });

    }
  }

  return (
    <Form ref={formRef}>
      <Stack spacing={2}>
        <TextField label={t("Organization unit name")} value={payrollName} onChange={(e) => setPayrollName(e.target.value)} required />
        <DatePicker
          label={t("Payroll accounting start date")}
          value={accountingStartDate}
          variant="month"
          minDate={dayjs("2024-01-01T0:00:00.000Z")}
          onChange={(e) => setAccountingStartDate(e)}
          required
          disabled={!!payroll} />
        <FormControl fullWidth variant="outlined" size="small" required>
          <InputLabel>{t("Language")}</InputLabel>
          <Select value={language} onChange={(e: SelectChangeEvent) => setLanguage(e.target.value)} label={t("Language")}>
            <MenuItem value="German">{t("German")}</MenuItem>
            <MenuItem value="English">{t("English")}</MenuItem>
            <MenuItem value="French">{t("French")}</MenuItem>
            <MenuItem value="Italian">{t("Italian")}</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h6">{t("Regulations")}</Typography>
        <RegulationSelect
          label={t("Country")}
          items={availableRegulations}
          value={state.selectedRegulations.countryRegulation}
          onChange={(value) => dispatch({ type: "set_country", countryRegulation: value })}
          disabled={!!(payrollRegulations?.countryRegulation)}
          required />
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
          <Button variant="contained" onClick={onSubmit} loading={navigationState === "submitting"} loadingPosition="start">{t(!payroll ? "Create" : "Save")}</Button>
        </Stack>
      </Stack>
    </Form>
  );
} type RegulationSelectProps = {
  label: string
  items: AvailableRegulation[]
  disabled?: boolean
  required?: boolean
} & ({
  multiple: true
  value: RegulationName[]
  onChange: (v: RegulationName[]) => void
} | {
  multiple?: undefined
  value: RegulationName | null
  onChange: (value: RegulationName) => void
})

function RegulationSelect({ label, items, multiple, value, onChange, disabled, required }: RegulationSelectProps) {
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
    <FormControl fullWidth variant="outlined" size="small" required={required}>
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
          countryRegulation: action.countryRegulation,
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
  const countryRegulations = availableRegulations.find(r => r.name === payrollRegulations.countryRegulation) ?? {
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
