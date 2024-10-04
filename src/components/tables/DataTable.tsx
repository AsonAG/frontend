import React, { PropsWithChildren, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Stack,
  Typography,
  Box,
  // useMediaQuery,
  // Theme
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { formatCaseValue } from "../../utils/Format";
import { History } from "@mui/icons-material";
import { useSearchParam } from "../../hooks/useSearchParam";
import { IdType } from "../../models/IdType";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, Row, getSortedRowModel } from "@tanstack/react-table";
import { TFunction } from "i18next";

const columnHelper = createColumnHelper<CaseValue>();

function createColumns(t: TFunction<"translation", undefined>) {
  return [
    columnHelper.accessor("displayCaseFieldName",
      {
        cell: name => name.getValue(),
        header: () => t("Field")
      }),
    columnHelper.accessor("value",
      {
        cell: value => formatCaseValue(value.row.original, t),
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
      }),
    columnHelper.accessor("created",
      {
        cell: created => <span title={formatDate(created.getValue(), true)}>{formatDate(created.getValue())}</span>,
        header: t("Created")
      }),
    columnHelper.accessor("type",
      {
        cell: attr => attr.getValue(),
        header: t("Category")
      }),
  ];
}

type CaseValue = {
  id: IdType
  caseName: string
  displayCaseName: string
  caseFieldName: string
  displayCaseFieldName: string
  valueType: string
  value: string
  numericValue: number | null
  start: Date
  end: Date
  created?: Date
  attributes: any
  history?: Array<CaseValue> | undefined
}

export function DataTable() {
  const { t } = useTranslation();
  const values = useLoaderData() as Array<CaseValue>;
  const [historyName, setHistoryName] = useSearchParam("h", { replace: true });
  const columns = useMemo(() => createColumns(t), []);
  const table = useReactTable({
    columns,
    data: values,
    initialState: {
      sorting: [
        {
          id: "displayCaseFieldName",
          desc: false
        }
      ]
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: row => row.history,
    getRowId: originalRow => originalRow.id,
    getRowCanExpand: (_) => true
  });
  return (
    <Stack>
      {table.getHeaderGroups().map(headerGroup => (
        <Row key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <Typography fontWeight="bold" key={header.id} sx={{ p: 0.5 }}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext())
              }
            </Typography>
          ))}
          <Box></Box>
        </Row>
      ))}
      <Stack sx={{
        "& > div:nth-of-type(even)": {
          backgroundColor: theme => theme.palette.primary.hover
        }
      }}>
        {table.getRowModel().rows.map((row) => renderRow(row, historyName, setHistoryName))}
      </Stack>
    </Stack>
  );
}

function renderRow(row: Row<CaseValue>, selectedCaseField: string, setSelectedCaseField: (field: string) => void) {
  const { t } = useTranslation();
  const isExpanded = row.original.caseFieldName === selectedCaseField;
  return (
    <Row key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <Box key={cell.id} sx={{ p: 0.5 }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Box>
      ))}
      <IconButton onClick={() => setSelectedCaseField(isExpanded ? "" : row.original.caseFieldName)} size="small" sx={{ justifySelf: "center", alignSelf: "start" }} color={isExpanded ? "primary" : undefined}>
        <History />
      </IconButton>
      {row.subRows.length > 0 && <Typography fontWeight="bold" sx={{ gridColumn: "1 / -1", p: 0.5, pt: 1 }}>{t("History")}</Typography>}
      {row.subRows.flatMap((subRow, index) => [...subRow.getVisibleCells().map((cell) => (
        <Box key={cell.id} sx={{ p: 0.5 }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Box>
      )), <span key={"ph-" + index}></span>])}
    </Row>
  );
}

function Row({ children }: PropsWithChildren) {
  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr 75px 75px 75px 105px 40px" gridTemplateRows="auto" alignItems="start">
      {children}
    </Box>
  )
}

