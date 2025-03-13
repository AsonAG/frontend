import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { columns, WageTypeRow } from "./WageTypeColumns";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getRowGridSx } from "../payrun/utils";
import { LookupSet } from "../models/LookupSet";

export type WageTypeControllingLoaderData = {
  wageTypes: WageTypeRow[],
  accountMaster: LookupSet
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

  const rowContainerSx = getRowGridSx(table.getVisibleLeafColumns().map(col => ({
    width: col.getSize(),
    flex: col.columnDef.meta?.flex
  })), 1);

  return (
    <Stack spacing={0.5}>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <Box sx={rowContainerSx}>
            {
              headerGroup.headers.map(header => {
                const alignment = header.column.columnDef.meta?.alignment;
                const context = { ...header.getContext(), t };
                return (
                  <Typography variant="h6" align={alignment} noWrap>
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
          return (
            <Box sx={rowContainerSx}>
              {row.getVisibleCells().map(cell => {
                const { alignment } = (cell.column.columnDef.meta || {});
                const cellContext = cell.getContext();
                return (
                  <Typography variant="h6" align={alignment} noWrap>
                    {flexRender(cell.column.columnDef.cell, { ...cellContext, t })}
                  </Typography>

                );
              })}
            </Box>
          )
        })
      }
    </Stack>
  )
}
