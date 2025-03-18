import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { columns } from "./WageTypeColumns";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getRowGridSx } from "../payrun/utils";
import { LookupSet, LookupValue } from "../models/LookupSet";
import { IdType } from "../models/IdType";
import { WageTypeDetails } from "./WageTypeDetails";
import { Collector } from "../models/Collector";
import { WageTypeWithAccount } from "../models/WageType";

export type WageTypeControllingLoaderData = {
  wageTypes: WageTypeWithAccount[]
  collectors: Collector[]
  accountMaster: LookupSet
  accountMasterMap: Map<string, LookupValue>
  fibuAccountLookup: LookupSet
  regulationId: IdType
  attributeTranslationMap: Map<string, LookupValue>
}

export function WageTypeControlling() {
  const { t } = useTranslation();
  const { wageTypes } = useLoaderData() as WageTypeControllingLoaderData;
  const [selected, setSelected] = useState<WageTypeWithAccount | null>(null);
  const onClose = () => setSelected(null);
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
    <Stack>
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
            <Box key={row.id} sx={rowSx} onClick={() => setSelected(row.original)}>
              {row.getVisibleCells().map(cell => {
                const { alignment } = (cell.column.columnDef.meta || {});
                const cellContext = cell.getContext();
                return (
                  <Typography key={cell.id} variant="h6" align={alignment} noWrap sx={{ px: 0.25, py: 0.5 }}>
                    {flexRender(cell.column.columnDef.cell, { ...cellContext, t })}
                  </Typography>

                );
              })}
            </Box>
          )
        })
      }
    </Stack>
    {selected && <WageTypeDetails wageType={selected} onClose={onClose} />}
  </>
}

function getRowSx(row: WageTypeWithAccount): SxProps<Theme> {
  return {
    userSelect: "none",
    backgroundColor: (theme: Theme) => row.accountAssignmentRequired ? theme.palette.selectionAttention.dark : theme.palette.background.default,
    "&:hover": {
      backgroundColor: (theme: Theme) => row.accountAssignmentRequired ? theme.palette.selectionAttention.light : theme.palette.selection.main,
      cursor: "pointer"
    }
  }
}

