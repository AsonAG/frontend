import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Stack, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { WageTypeRow } from "./WageTypeColumns";
import { getRowGridSx } from "../payrun/utils";
import { useTranslation } from "react-i18next";
import { WageTypeAccountPicker } from "./WageTypeAccountPicker";
import { LookupValue } from "../models/LookupSet";
import { useFetcher, useLoaderData } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";
import { Collector } from "../models/Collector";


type WageTypeDetailsProps = {
  wageType: WageTypeRow
  onClose: () => void
}

const dialogColumns = getRowGridSx([{ width: 150 }, { width: 150, flex: 1 }], 2);
export function WageTypeDetails({ wageType, onClose }: WageTypeDetailsProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { accountMasterMap, regulationId, fibuAccountLookup, collectors } = useLoaderData() as WageTypeControllingLoaderData;
  const [state, dispatch] = useReducer(reducer, { wageType, accountMasterMap }, createInitialState);

  const onSubmit = () => {
    const lookupValue = {
      ...wageType.accountLookupValue,
      key: wageType.wageTypeNumber.toString(),
      value: JSON.stringify({
        creditAccountNumber: state.credit?.key ?? "",
        debitAccountNumber: state.debit?.key ?? ""
      })
    }

    fetcher.submit({
      wageType,
      regulationId,
      lookupId: fibuAccountLookup.id,
      lookupValue: lookupValue
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
}

type WageTypeFormAction = {
  type: "set_credit"
  lookupValue: LookupValue | null
} | {
  type: "set_debit"
  lookupValue: LookupValue | null
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
  }

}

type InitialStateProps = {
  wageType: WageTypeRow
  accountMasterMap: Map<string, LookupValue>
}

function createInitialState({ wageType, accountMasterMap }: InitialStateProps): WageTypeFormState {
  return {
    credit: accountMasterMap.get(wageType.accountLookupValue?.value?.creditAccountNumber ?? "") ?? null,
    debit: accountMasterMap.get(wageType.accountLookupValue?.value?.debitAccountNumber ?? "") ?? null
  };
}

function WageTypeAttributes({ wageType }: { wageType: WageTypeRow }) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={0.5}>
      <WageTypeAttributeChip attribute="Accounting.Credit" attributeValue={wageType.attributes?.["Accounting.Credit"]} category="Accounting" />
      <WageTypeAttributeChip attribute="Accounting.PlusMinus" attributeValue={wageType.attributes?.["Accounting.PlusMinus"]} category="Accounting" />
      <WageTypeAttributeChip attribute="Wage.Statement" attributeValue={wageType.attributes?.["Wage.Statement"]} category="Wage" />
      <WageTypeAttributeChip attribute="Stats.Month" attributeValue={wageType.attributes?.["Stats.Month"]} category="Stats" />
      <WageTypeAttributeChip attribute="Stats.Year" attributeValue={wageType.attributes?.["Stats.Year"]} category="Stats" />
      <WageTypeAttributeChip attribute="Cost.Center" attributeValue={wageType.attributes?.["Cost.Center"]} category="Cost" />
      <WageTypeAttributeChip attribute="Bvg.Prospective" attributeValue={wageType.attributes?.["Bvg.Prospective"]} category="Bvg" />
      <WageTypeAttributeChip attribute="Bvg.Factor" attributeValue={wageType.attributes?.["Bvg.Factor"]} category="Bvg" />
      <WageTypeAttributeChip attribute="Bvg.Retrospective" attributeValue={wageType.attributes?.["Bvg.Retrospective"]} category="Bvg" />
      <WageTypeAttributeChip attribute="Payslip" attributeValue={wageType.attributes?.["Payslip"]} category="Payslip" />
      <WageTypeAttributeChip attribute="FAK.billing" attributeValue={wageType.attributes?.["FAK.billing"]} category="FAK" />
    </Stack>
  )
}

function WageTypeCollectors({ wageType, collectors }: { wageType: WageTypeRow, collectors: Collector[] }) {
  const groupedCollectors = useMemo(() => Object.groupBy(collectors, ({ name }) => wageType.collectors?.includes(name) ? "active" : "inactive"), [collectors, wageType.collectors]) as Record<"active" | "inactive", Collector[]>;
  return (
    <Stack direction="row" flexWrap="wrap" spacing={0.5}>
      {groupedCollectors["active"].map(collector => <CollectorChip key={collector.id} collectorName={collector.displayName} active={wageType.collectors?.includes(collector.name)} />)}
      <InactiveCollectors collectors={groupedCollectors["inactive"]} />
    </Stack>
  )
}

type WageTypeAttributeChipProps = {
  attribute: string
  attributeValue: string
  tooltip?: string
  category: string
}

function WageTypeAttributeChip({ attribute, attributeValue, tooltip, category }: WageTypeAttributeChipProps) {
  if (!attributeValue)
    return;
  return (
    <Tooltip title={tooltip}>
      <Chip label={`${attribute}: ${attributeValue}`} size="small" />
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
