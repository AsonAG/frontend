import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { columns } from "./WageTypeColumns";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getRowGridSx } from "../payrun/utils";
import { LookupSet, LookupValue } from "../models/LookupSet";
import { IdType } from "../models/IdType";
import { Collector } from "../models/Collector";
import { WageTypeDetailed } from "../models/WageType";

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

  return <>
    <Stack sx={{ overflow: "auto", height: "calc(100vh - 212px)" }}>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <Box key={headerGroup.id} sx={rowGridSx}>
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
        table.getRowModel().rows.map(row => {
          const rowSx = { ...rowGridSx, ...getRowSx(row.original) }
          return (
            <Box key={row.id} sx={rowSx}>
              {row.getVisibleCells().map(cell => {
                const { alignment } = (cell.column.columnDef.meta || {});
                const cellContext = cell.getContext();
                return (
                  <Box key={cell.id} sx={{ px: 0.25, py: 0.5 }} justifySelf={alignment}>
                    {flexRender(cell.column.columnDef.cell, { ...cellContext, t })}
                  </Box>

                );
              })}
            </Box>
          )
        })
      }
    </Stack>
  </>
}

function getRowSx(row: WageTypeDetailed): SxProps<Theme> {
  return {
    height: 36,
    alignItems: "center",
    userSelect: "none",
    backgroundColor: (theme: Theme) => row.accountAssignmentRequired ? theme.palette.selectionAttention.dark : theme.palette.background.default,
    "&:hover": {
      backgroundColor: (theme: Theme) => row.accountAssignmentRequired ? theme.palette.selectionAttention.light : theme.palette.selection.main,
      cursor: "pointer"
    }
  }
}

