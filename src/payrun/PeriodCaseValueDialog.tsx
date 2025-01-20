import React, { PropsWithChildren, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Stack,
  Typography,
  Box,
  Button,
  SxProps,
  Theme
} from "@mui/material";
import { formatDate } from "../utils/DateUtils";
import { formatCaseValue } from "../utils/Format";
import { ArrowDropDown } from "@mui/icons-material";
import { IdType } from "../models/IdType";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent } from "../components/ResponsiveDialog";

type EventValue = {
  id: IdType
  caseFieldName: string
  valueType: string
  value: string
  numericValue: number | null
  start: Date
  end: Date
  created: Date
  attributes: any
}

type EventRow = {
  id: IdType
  eventName?: string
  eventFieldName?: string
  value?: string
  start?: Date
  end?: Date
  created?: Date
}

const columnHelper = createColumnHelper<EventRow>();

function createColumns(t: TFunction<"translation", undefined>) {
  return [
    columnHelper.accessor("created",
      {
        cell: created => <span title={formatDate(created.getValue(), true)}>{formatDate(created.getValue())}</span>,
        header: () => <span title={t("Newest events first")}>{t("Created")}<ArrowDropDown fontSize="16px" /></span>
      }),
    columnHelper.accessor("eventFieldName",
      {
        cell: name => name.getValue(),
        header: () => t("Field")
      }),
    columnHelper.accessor("value",
      {
        cell: value => value.getValue(),
        header: () => t("Value")
      }),
    columnHelper.accessor("start",
      {
        cell: start => formatDate(start.getValue()),
        header: t("Start")
      }),
    columnHelper.accessor("end",
      {
        cell: end => formatDate(end.getValue()),
        header: t("End")
      })
  ];
}
export function PeriodCaseValueDialog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onClose = () => navigate("..");
  return (
    <ResponsiveDialog open onOpenChange={onClose}>
      <ResponsiveDialogContent containerWidth>
        <Typography variant="h6">{t("New relevant values in open period")}</Typography>
        <Table />
        <Stack direction="row" justifyContent="end">
          <ResponsiveDialogClose>
            <Button variant="outlined">{t("Close")}</Button>
          </ResponsiveDialogClose>
        </Stack>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function Table() {
  const { t } = useTranslation();
  const items = useLoaderData() as Array<EventValue>;
  const e: Array<EventRow> = useMemo(() => items.map(v => ({
    id: v.id,
    eventFieldName: v.caseFieldName,
    value: formatCaseValue(v, t),
    start: v.start,
    end: v.end,
    created: v.created
  })), [items]);
  const columns = useMemo(() => createColumns(t), [t]);
  const table = useReactTable({
    columns: columns,
    data: e,
    getCoreRowModel: getCoreRowModel(),
    getRowId: originalRow => originalRow.id,
  });
  return (
    <Stack flex={1} sx={{ overflowY: "auto" }}>
      {table.getHeaderGroups().map(headerGroup => (
        <Row key={headerGroup.id} sx={{ position: "sticky", top: 0, backgroundColor: theme => theme.palette.background.default }}>
          {headerGroup.headers.map(header => (
            <Typography fontWeight="bold" key={header.id} sx={{ p: 0.5 }}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext())
              }
            </Typography>
          ))}
        </Row>
      ))}
      <Stack sx={{
        "& > div:nth-of-type(even)": {
          backgroundColor: theme => theme.palette.primary.hover
        }
      }}>
        {table.getRowModel().rows.map((row) => (
          <Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Box key={cell.id} sx={{ p: 0.5 }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Row>
        ))}
      </Stack>
    </Stack>
  )
}

function Row({ sx, children }: { sx?: SxProps<Theme> } & PropsWithChildren) {
  return (
    <Box display="grid" gridTemplateColumns="75px 1fr 1fr 75px 75px" gridTemplateRows="auto" alignItems="start" sx={sx}>
      {children}
    </Box>
  )
}
