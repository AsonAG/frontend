import React, { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Stack,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { formatCaseValue } from "../../utils/Format";
import { ArrowDropUp, Clear, History } from "@mui/icons-material";
import { useSearchParam } from "../../hooks/useSearchParam";
import { IdType } from "../../models/IdType";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, Row, getSortedRowModel, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { CategoryLabel } from "../CategoryLabel";

const columnHelper = createColumnHelper<CaseValue>();

function createColumns(t: TFunction<"translation", undefined>) {
  return [
    columnHelper.accessor("displayCaseFieldName",
      {
        cell: name => name.getValue(),
        header: () => <span>{t("Field")}<ArrowDropUp fontSize="16px" /></span>
      }),
    columnHelper.accessor("value",
      {
        cell: value => formatCaseValue(value.row.original, t),
        header: () => t("Value")
      }),
    columnHelper.accessor("start",
      {
        cell: start => formatDate(start.getValue()),
        header: t("Start"),
        enableGlobalFilter: false
      }),
    columnHelper.accessor("end",
      {
        cell: end => formatDate(end.getValue()),
        header: t("End"),
        enableGlobalFilter: false
      }),
    columnHelper.accessor("created",
      {
        cell: created => <span title={formatDate(created.getValue(), true)}>{formatDate(created.getValue())}</span>,
        header: t("Created"),
        enableGlobalFilter: false
      }),
    columnHelper.accessor("tags",
      {
        id: "category",
        cell: attr => {
          const { tags } = useLoaderData() as LoaderData;
          const categories = attr.getValue();
          return (
            <Stack spacing={0.25} direction="row" flexWrap="wrap">
              {categories.filter(category => tags.find(x => category === x.tag)).map(category => <CategoryLabel key={category} label={t(category)} />)}
            </Stack>
          )
        },
        header: () => t("Category"),
        enableGlobalFilter: false,
        filterFn: "arrIncludesSome"
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
  created?: Date,
  tags: Array<string>
  attributes: any
}


type Tag = {
  tag: string,
  tagLocalizations: Map<string, string>
}

type LoaderData = {
  values: Array<CaseValue>
  history: Array<CaseValue>
  tags: Array<Tag>
}

export function DataTable() {
  const { t } = useTranslation();
  const { values, history } = useLoaderData() as LoaderData;
  const [historyName, setHistoryName] = useSearchParam("h", { replace: true });
  const columns = useMemo(() => createColumns(t), []);
  const providedTags = useMemo(() => [...new Set(values.flatMap(v => v.tags))], [values]);
  const [globalFilter, setGlobalFilter] = useState<string>("")
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
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFromLeafRows: true, // filter and search through sub-rows
    getSubRows: row => row.caseFieldName === historyName ? history : [],
    getRowId: originalRow => originalRow.id,
    getRowCanExpand: (_) => true,
    globalFilterFn: "includesString"
  });
  return <>
    <TableSearch filterValue={globalFilter} setFilterValue={(value: string) => table.setGlobalFilter(value)} />
    <CategoryFilter column={table.getColumn("category")} providedTags={providedTags} />
    <Table table={table}>
      {(row) => {
        const isExpanded = row.original.caseFieldName === historyName;
        return (
          <Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Box key={cell.id} sx={{ p: 0.5 }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
            <IconButton onClick={() => setHistoryName(isExpanded ? "" : row.original.caseFieldName)} size="small" sx={{ justifySelf: "center", alignSelf: "start" }} color={isExpanded ? "primary" : undefined}>
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
      }}
    </Table>
  </>;
}

function Table({ table, children }: { table: Table<CaseValue>, children: (row: Row<CaseValue>) => ReactNode }) {
  const { t } = useTranslation();
  const rows = table.getRowModel().rows;
  if (rows.length === 0) {
    return <Typography>{t("No data")}</Typography>;
  }
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
        {rows.map(children)}
      </Stack>
    </Stack>
  );
}

function Row({ children }: PropsWithChildren) {
  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr 75px 75px 75px 135px 40px" gridTemplateRows="auto" alignItems="start">
      {children}
    </Box>
  )
}


function CategoryFilter({ column, providedTags }: { column: Column<CaseValue, unknown> | undefined, providedTags: Array<string> }) {
  const { t } = useTranslation();
  const { tags } = useLoaderData() as LoaderData;
  if (!column || tags.length === 0)
    return;
  const columnFilter = (column.getFilterValue() ?? []) as Array<string>;
  const availableTags = useMemo(() => tags.filter(t => providedTags.indexOf(t.tag) !== -1), [tags, providedTags]);
  return (
    <Stack direction="row" spacing={1}>
      {availableTags.map(tag => {
        const isSelected = columnFilter.includes(tag.tag);
        return <Chip
          variant={isSelected ? "filled" : "outlined"}
          color="primary"
          key={tag.tag}
          label={t(tag.tag)}
          size="small"
          onClick={() => { column?.setFilterValue(isSelected ? columnFilter.filter(f => f !== tag.tag) : [...columnFilter, tag.tag]) }}
        />;
      })}
    </Stack>
  );
}
function TableSearch({ filterValue, setFilterValue }) {
  const { t } = useTranslation();

  const onChange = (event) => {
    const updatedValue = event.target.value;
    setFilterValue(updatedValue);
  };

  const onClear = () => {
    setFilterValue("");
  }

  let clearButton: ReactNode | null = null;
  if (filterValue) {
    clearButton = (
      <InputAdornment position="end">
        <IconButton onClick={onClear}>
          <Clear />
        </IconButton>
      </InputAdornment>
    )
  }

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={t("Search in Field or Value")}
      onChange={onChange}
      value={filterValue}
      slotProps={{
        input: {
          endAdornment: clearButton,
        }
      }}
    />
  );
}
