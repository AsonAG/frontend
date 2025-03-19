import { Box, Button, Checkbox, Chip, Dialog, DialogContent, DialogTitle, Stack, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { getRowGridSx } from "../payrun/utils";
import { useTranslation } from "react-i18next";
import { WageTypeAccountPicker } from "./WageTypeAccountPicker";
import { LookupValue } from "../models/LookupSet";
import { useFetcher, useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";
import { Collector } from "../models/Collector";
import { WageType, WageTypeDetailed } from "../models/WageType";


type WageTypeDetailsProps = {
  wageType: WageTypeDetailed
  onClose: () => void
}

const dialogColumns = getRowGridSx([{ width: 150 }, { width: 150, flex: 1 }], 2);
export function WageTypeDetails({ wageType, onClose }: WageTypeDetailsProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { accountMasterMap, regulationId, fibuAccountLookup, wageTypePayrollControllingLookup, collectors } = useLoaderData() as WageTypeControllingLoaderData;
  const [state, dispatch] = useReducer(reducer, { wageType, accountMasterMap }, createInitialState);

  const onSubmit = () => {
    const accountLookupValue = {
      ...wageType.accountLookupValue,
      key: wageType.wageTypeNumber.toString(),
      value: JSON.stringify({
        creditAccountNumber: state.credit?.key ?? "",
        debitAccountNumber: state.debit?.key ?? ""
      })
    }


    const payrollControllingLookupValue = wageTypePayrollControllingLookup.values.find(x => x.key === wageType.wageTypeNumber.toString());
    let controllingLookupValue: any = null;
    if (state.controlling === true && !payrollControllingLookupValue) {
      controllingLookupValue = {
        key: wageType.wageTypeNumber.toString(),
        value: "true"
      }
    }

    if (state.controlling === false && !!payrollControllingLookupValue) {
      controllingLookupValue = payrollControllingLookupValue
    }

    fetcher.submit({
      wageType,
      regulationId,
      accountLookupValue: {
        lookupId: fibuAccountLookup.id,
        lookupValue: accountLookupValue
      },
      controllingLookupValue: {
        lookupId: wageTypePayrollControllingLookup.id,
        lookupValue: controllingLookupValue
      }
    },
      { method: "POST", encType: "application/json" });
  }

  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
    }
  }, [fetcher.data]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{wageType.displayName}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Box sx={dialogColumns}>
            <Typography>{t("Attributes")}</Typography>
            <WageTypeAttributes wageType={wageType} />
          </Box>
          <Box sx={dialogColumns}>
            <Typography>{t("Collectors")}</Typography>
            <WageTypeCollectors wageType={wageType} collectors={collectors} />
          </Box>
          <Box sx={dialogColumns}>
            <Typography>{t("payrun_period_wage_controlling")}</Typography>
            <Controlling value={state.controlling} onToggle={() => dispatch({ type: "toggle_controlling" })} />
          </Box>
        </Stack>
      </DialogContent>
      <DialogContent>
        <Stack spacing={1}>
          <Box sx={dialogColumns}>
            <Typography>{t("Credit")}</Typography>
            <WageTypeAccountPicker value={state.credit} onChange={(value) => dispatch({ type: "set_credit", lookupValue: value })} />
          </Box>
          <Box sx={dialogColumns}>
            <Typography>{t("Debit")}</Typography>
            <WageTypeAccountPicker value={state.debit} onChange={(value) => dispatch({ type: "set_debit", lookupValue: value })} />
          </Box>
          <Stack direction="row" justifyContent="end" spacing={2}>
            <Button onClick={onClose}>{t("Cancel")}</Button>
            <Button variant="contained" onClick={onSubmit} loading={fetcher.state === "submitting"}>{t("Save")}</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

type WageTypeFormState = {
  credit: LookupValue | null,
  debit: LookupValue | null,
  controlling: "system" | boolean
}

type WageTypeFormAction = {
  type: "set_credit"
  lookupValue: LookupValue | null
} | {
  type: "set_debit"
  lookupValue: LookupValue | null
} | {
  type: "toggle_controlling"
}

function reducer(state: WageTypeFormState, action: WageTypeFormAction): WageTypeFormState {
  switch (action.type) {
    case "set_credit":
      return {
        ...state,
        credit: action.lookupValue
      };
    case "set_debit":
      return {
        ...state,
        debit: action.lookupValue
      };
    case "toggle_controlling": {
      if (state.controlling === "system")
        return state;
      return {
        ...state,
        controlling: !state.controlling
      }
    }
  }

}

type InitialStateProps = {
  wageType: WageTypeDetailed
  accountMasterMap: Map<string, LookupValue>
}

function createInitialState({ wageType, accountMasterMap }: InitialStateProps): WageTypeFormState {
  return {
    credit: accountMasterMap.get(wageType.accountLookupValue?.value?.creditAccountNumber ?? "") ?? null,
    debit: accountMasterMap.get(wageType.accountLookupValue?.value?.debitAccountNumber ?? "") ?? null,
    controlling: wageType.controllingEnabled
  };
}

function WageTypeAttributes({ wageType }: { wageType: WageTypeDetailed }) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={0.5}>
      <WageTypeAttributeChip wageType={wageType} attribute="Accounting.Credit" category="Accounting" />
      <WageTypeAttributeChip wageType={wageType} attribute="Accounting.PlusMinus" category="Accounting" />
      <WageTypeAttributeChip wageType={wageType} attribute="Wage.Statement" category="Wage" />
      <WageTypeAttributeChip wageType={wageType} attribute="Stats.Month" category="Stats" />
      <WageTypeAttributeChip wageType={wageType} attribute="Stats.Year" category="Stats" />
      <WageTypeAttributeChip wageType={wageType} attribute="Cost.Center" category="Cost" />
      <WageTypeAttributeChip wageType={wageType} attribute="Bvg.Prospective" category="Bvg" />
      <WageTypeAttributeChip wageType={wageType} attribute="Bvg.Factor" category="Bvg" />
      <WageTypeAttributeChip wageType={wageType} attribute="Bvg.Retrospective" category="Bvg" />
      <WageTypeAttributeChip wageType={wageType} attribute="Payslip" category="Payslip" />
      <WageTypeAttributeChip wageType={wageType} attribute="FAK.billing" category="FAK" />
    </Stack>
  )
}

function WageTypeCollectors({ wageType, collectors }: { wageType: WageTypeDetailed, collectors: Collector[] }) {
  const groupedCollectors = useMemo(() => Object.groupBy(collectors, ({ name }) => wageType.collectors?.includes(name) ? "active" : "inactive"), [collectors, wageType.collectors]) as Record<"active" | "inactive", Collector[]>;
  return (
    <Stack direction="row" flexWrap="wrap" spacing={0.5}>
      {groupedCollectors["active"]?.map(collector => <CollectorChip key={collector.id} collectorName={collector.displayName} active={wageType.collectors?.includes(collector.name)} />)}
      <InactiveCollectors collectors={groupedCollectors["inactive"]} />
    </Stack>
  )
}

type WageTypeAttributeChipProps = {
  wageType: WageType
  attribute: string
  tooltip?: string
  category: string
}

function WageTypeAttributeChip({ wageType, attribute, tooltip, category }: WageTypeAttributeChipProps) {
  const { t } = useTranslation();
  const { attributeTranslationMap } = useLoaderData() as WageTypeControllingLoaderData;
  let attributeValue = wageType.attributes?.[attribute];
  if (!attributeValue)
    return;
  if (attributeValue === "Y")
    attributeValue = t("Yes");
  else if (attributeValue === "N")
    attributeValue = t("No")
  const label = attributeTranslationMap.get(attribute)?.value ?? attribute;
  return (
    <Tooltip title={tooltip}>
      <Chip label={`${label}: ${attributeValue}`} size="small" />
    </Tooltip>
  )
}
type CollectorChipProps = {
  collectorName: string,
  tooltip?: string
  active: boolean
}
function CollectorChip({ collectorName, tooltip, active }: CollectorChipProps) {
  return (
    <Tooltip title={tooltip}>
      <Chip label={collectorName} size="small" color={active ? "primary" : "default"} variant={active ? "filled" : "outlined"} />
    </Tooltip>
  )
}
function InactiveCollectors({ collectors }: { collectors: Collector[] }) {
  const { t } = useTranslation();
  const [showInactive, setShowInactive] = useState(false);
  if (!showInactive) {
    return <Chip label={t("inactive_collector_chip", { count: collectors.length })} size="small" variant={"outlined"} onClick={() => setShowInactive(true)} />
  }

  return collectors.map(collector => <CollectorChip key={collector.id} collectorName={collector.displayName} active={false} />);
}

type ControllingProps = {
  value: "system" | boolean
  onToggle: () => void
}
function Controlling({ value, onToggle }: ControllingProps) {
  const { t } = useTranslation();
  if (value === "system")
    return <Typography>{t("automatic")}</Typography>
  return <Checkbox checked={value} size="small" onChange={onToggle} sx={{ justifySelf: "start" }} />
}
