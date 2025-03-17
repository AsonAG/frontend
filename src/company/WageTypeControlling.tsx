import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { columns, WageTypeRow } from "./WageTypeColumns";
import { flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getRowGridSx } from "../payrun/utils";
import { LookupSet, LookupValue } from "../models/LookupSet";
import { IdType } from "../models/IdType";
import { WageTypeDetails } from "./WageTypeDetails";
import { Collector } from "../models/Collector";

export type WageTypeControllingLoaderData = {
  wageTypes: WageTypeRow[]
  collectors: Collector[]
  accountMaster: LookupSet
  accountMasterMap: Map<string, LookupValue>
  fibuAccountLookup: LookupSet
  regulationId: IdType
}

export function WageTypeControlling() {
  const { t } = useTranslation();
  const { wageTypes } = useLoaderData() as WageTypeControllingLoaderData;
  const [selected, setSelected] = useState<WageTypeRow | null>(null);
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
  const rowContainerSx = { ...rowGridSx, ...rowSx };

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
          return (
            <Box key={row.id} sx={rowContainerSx} onClick={() => setSelected(row.original)}>
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

const rowSx: SxProps<Theme> = {
  userSelect: "none",
  backgroundColor: (theme: Theme) => theme.palette.background.default,
  "&:hover": {
    backgroundColor: (theme: Theme) => theme.palette.selection.main,
    cursor: "pointer"
  }
};
