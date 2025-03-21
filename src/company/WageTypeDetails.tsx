import { Box, Button, Checkbox, Chip, Dialog, DialogContent, DialogTitle, Stack, Tooltip, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { getRowGridSx } from "../payrun/utils";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
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
  const { collectors } = useLoaderData() as WageTypeControllingLoaderData;

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{wageType.displayName}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box sx={dialogColumns}>
            <Typography>{t("Collectors")}</Typography>
            <WageTypeCollectors wageType={wageType} collectors={collectors} />
          </Box>
          <Box sx={dialogColumns}>
            <Typography>{t("Attributes")}</Typography>
            <WageTypeAttributes wageType={wageType} />
          </Box>
          <Stack direction="row" justifyContent="end" spacing={2}>
            <Button onClick={onClose}>{t("Close")}</Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
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
      <Chip label={collectorName} size="small" variant={active ? "filled" : "outlined"} />
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
