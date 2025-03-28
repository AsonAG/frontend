import { Badge, Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { columns } from "./WageTypeColumns";
import { flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getRowGridSx, getStickySx } from "../payrun/utils";
import { LookupSet, LookupValue } from "../models/LookupSet";
import { IdType } from "../models/IdType";
import { Collector } from "../models/Collector";
import { WageTypeDetailed } from "../models/WageType";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { blend } from "@mui/system/colorManipulator";

export type WageTypeControllingLoaderData = {
  wageTypes: WageTypeDetailed[]
  collectors: Collector[]
  accountMaster: LookupSet
  accountMasterMap: Map<string, LookupValue>
  fibuAccountLookup: LookupSet
  wageTypePayrollControllingLookup: LookupSet
  regulationId: IdType
  attributeTranslationMap: Map<string, LookupValue>
}

const tableHeaderHeight = 36;
const headerStickySx = getStickySx(10, { top: 0 });
export function WageTypeControlling() {
  const { t } = useTranslation();
  const { wageTypes } = useLoaderData() as WageTypeControllingLoaderData;
  const table = useReactTable({
    columns: columns,
    data: wageTypes,
    getCoreRowModel: getCoreRowModel(),
    getRowId: originalRow => originalRow.id,
  });

  const rowGridSx = getRowGridSx(table.getVisibleLeafColumns().map(col => ({
    width: col.getSize(),
    flex: col.columnDef.meta?.flex
  })), 1);

  const [rowsByCategory, withoutCategory] = useMemo(() => {
    const grouped = Object.groupBy(table.getRowModel().rows, ({ original }) => original.attributes?.["Wage.Category"] ?? "noCategory") as Record<string, Array<Row<WageTypeDetailed>>>
    const { noCategory, ...result } = grouped;
    return [result, noCategory];
  }, [table.getRowModel().rows]);

  return <>
    <Stack sx={{ overflow: "auto", height: "calc(100vh - 212px)" }}>
      {table.getHeaderGroups().map(headerGroup => {
        const sx: SxProps<Theme> = {
          ...rowGridSx,
          ...headerStickySx,
          backgroundColor: theme => theme.palette.background.default,
          minHeight: tableHeaderHeight,
          maxHeight: tableHeaderHeight
        };
        return (
          <Box key={headerGroup.id} sx={sx}>
            {
              headerGroup.headers.map(header => {
                const alignment = header.column.columnDef.meta?.alignment;
                const context = { ...header.getContext(), t };
                return (
                  <Typography key={header.id} variant="h6" align={alignment} noWrap sx={{ px: 0.25, py: 0.5 }}>
                    {flexRender(header.column.columnDef.header, context)}
                  </Typography>
                );
              })
            }
          </Box>
        )
      }
      )}
      {
        Object.entries(rowsByCategory).map(([category, rows]) =>
          <WageTypeCategoryGroup key={category} category={category} rows={rows} rowGridSx={rowGridSx} />
        )

      }
      <WageTypeCategoryGroup category={t("Without category")} rows={withoutCategory} rowGridSx={rowGridSx} />
    </Stack>
  </>
}

const defaultRowSx: SxProps<Theme> = {
  minHeight: 42,
  maxHeight: 42,
  alignItems: "center",
}

type WageTypeCategoryProps = {
  category: string
  rows: Array<Row<WageTypeDetailed>>
  rowGridSx: SxProps<Theme>
}

function WageTypeCategoryGroup({ category, rows, rowGridSx }: WageTypeCategoryProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  if (!rows || rows.length === 0)
    return;
  const hasMissingData = rows.filter(r => r.original.accountAssignmentRequired).length > 0;
  const header =
    <WageTypeCategoryHeader
      header={category}
      expanded={expanded}
      onClick={() => setExpanded(p => !p)}
      hasMissingData={hasMissingData} />;
  if (!expanded) {
    return header;
  }
  return (
    <>
      {header}
      {rows.map(row => {
        const rowSx = { ...rowGridSx, ...defaultRowSx }
        return (
          <Box key={row.id} sx={rowSx}>
            {row.getVisibleCells().map(cell => {
              const { alignment } = (cell.column.columnDef.meta || {});
              return (
                <Box key={cell.id} sx={{ px: 0.25, py: 0.5 }} justifySelf={alignment}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Box>

              );
            })}
          </Box>
        )
      })}
    </>
  )
}

type WageTypeCategoryHeaderProps = {
  header: string
  expanded: boolean
  onClick: () => void
  hasMissingData: boolean
}

const headerSx: SxProps<Theme> = {
  ...getStickySx(10, { top: tableHeaderHeight }),
  minHeight: 36,
  maxHeight: 36,
  alignItems: "center",
  backgroundColor: theme => blend(theme.palette.background.default, theme.palette.action.hover, theme.palette.action.hoverOpacity * 1.5),
  borderColor: theme => theme.palette.divider,
  borderStyle: "solid",
  borderWidth: 0,
  borderTopWidth: 1,
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme => blend(theme.palette.background.default, theme.palette.action.hover, theme.palette.action.hoverOpacity)
  }
}

function WageTypeCategoryHeader({ header, expanded, onClick, hasMissingData }: WageTypeCategoryHeaderProps) {
  const { attributeTranslationMap } = useLoaderData() as WageTypeControllingLoaderData;
  const text = attributeTranslationMap.get(header)?.value ?? header;
  const icon = expanded ? <ExpandLess /> : <ExpandMore />;
  return (
    <Stack direction="row"
      onClick={onClick}
      spacing={1}
      sx={{
        ...headerSx,
        borderBottomWidth: expanded ? 1 : 0
      }}>
      {icon}
      <Badge variant={hasMissingData ? "dot" : "standard"} color="warning" sx={{
        "& .MuiBadge-badge": {
          top: 3
        }
      }}>
        <Typography pr={0.5}>{text}</Typography>
      </Badge>
    </Stack>
  )
}
