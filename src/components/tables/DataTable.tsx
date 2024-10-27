import React, { Fragment, PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Stack,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  useMediaQuery,
  Theme,
  useTheme,
  Divider,
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { formatCaseValue } from "../../utils/Format";
import { ArrowDropUp, Clear, Close, History } from "@mui/icons-material";
import { IdType } from "../../models/IdType";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, Row as TableRow, getSortedRowModel, getFilteredRowModel, Table, filterFns, sortingFns } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { AvailableCase } from "../../models/AvailableCase";

const columnHelper = createColumnHelper<CaseValue>();

function createColumns(t: TFunction<"translation", undefined>) {
  return [
    columnHelper.accessor("displayCaseFieldName",
      {
        cell: name => name.getValue(),
        header: () => t("Field"),
        meta: {
          renderSortIndicator: true
        },
        //@ts-ignore
        sortingFn: "caseDataFn"
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
  attributes: any
}

type LoaderData = {
  values: Array<CaseValue>
  valueCounts: Record<string, number>
  dataCases: Array<AvailableCase>
}

const getRowId = (row: CaseValue) => row.id

export function DataTable() {
  const { t } = useTranslation();
  const { values, valueCounts } = useLoaderData() as LoaderData;
  const columns = useMemo(() => createColumns(t), []);
  const [search, setSearch] = useState<string>("");
  const [selectedDataCase, setSelectedDataCase] = useState<AvailableCase>();
  const filteredCaseFieldNames = useMemo(() => !!selectedDataCase ? new Set(selectedDataCase.caseFields.map(fields => fields.name)) : null, [selectedDataCase]);
  const dataCaseValues = useMemo(() => !!filteredCaseFieldNames ? values.filter(value => filteredCaseFieldNames.has(value.caseFieldName)) : values, [values, filteredCaseFieldNames]);
  const orderCaseFields = useMemo(() => !!selectedDataCase ? new Map(selectedDataCase.caseFields.map((fields, index) => [fields.name, index])) : null, [selectedDataCase]);
  const table = useReactTable({
    columns,
    data: dataCaseValues,
    initialState: {
      sorting: [
        {
          id: "displayCaseFieldName",
          desc: false
        }
      ]
    },
    state: {
      globalFilter: search
    },
    sortingFns: {
      caseDataFn: (rowA, rowB, columnId) => {
        if (orderCaseFields) {
          const difference = (orderCaseFields.get(rowA.original.caseFieldName) ?? 0) - (orderCaseFields.get(rowB.original.caseFieldName) ?? 0);
          return difference > 0 ? 1 : difference < 0 ? -1 : 0;
          ;
        }
        return sortingFns["alphanumeric"](rowA, rowB, columnId);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId,
    globalFilterFn: "includesString"
  });
  return <>
    <TableSearch filterValue={search} setFilterValue={setSearch} />
    <CategoryFilter selectedDataCase={selectedDataCase} setSelectedDataCase={setSelectedDataCase} />
    <Table table={table} defaultSort={!selectedDataCase}>
      {(row => (
        <Row key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Box key={cell.id} sx={{ p: 0.5 }}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Box>
          ))}
          {
            (valueCounts[row.original.caseFieldName] ?? 0) > 1 ?
              <IconButton component={Link} to={encodeURIComponent(row.original.caseFieldName)} size="small" sx={{ justifySelf: "center", alignSelf: "start" }}>
                <History />
              </IconButton>
              :
              <span></span>
          }
        </Row>
      ))}
    </Table>
    <Outlet />
  </>;
}

function Table({ table, defaultSort, children }: { table: Table<CaseValue>, defaultSort: boolean, children: (row: TableRow<CaseValue>) => ReactNode }) {
  const { t } = useTranslation();
  const rows = table.getRowModel().rows;
  if (rows.length === 0) {
    return <Typography>{t("No data")}</Typography>;
  }
  console.log(defaultSort);
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
              {header.column.columnDef.meta?.renderSortIndicator && defaultSort && <ArrowDropUp fontSize="16px" />}
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
    <Box display="grid" gridTemplateColumns="1fr 1fr 75px 75px 40px" gridTemplateRows="auto" alignItems="start">
      {children}
    </Box>
  )
}


function CategoryFilter({ selectedDataCase, setSelectedDataCase }) {
  const { t } = useTranslation();
  const { values, dataCases } = useLoaderData() as LoaderData;
  if (dataCases.length === 0)
    return;
  const availableCaseFieldNames = useMemo(() => new Set(values.map(v => v.caseFieldName)), [values]);
  const availableDataCases = useMemo(() => dataCases.filter(dataCase => dataCase.caseFields.some(caseField => availableCaseFieldNames.has(caseField.name))), [dataCases, availableCaseFieldNames]);
  return (
    <Stack direction="row" spacing={1}>
      {availableDataCases.map(dataCase => {
        const isSelected = dataCase === selectedDataCase;
        return <Chip
          variant={isSelected ? "filled" : "outlined"}
          color="primary"
          key={dataCase.id}
          label={t(dataCase.displayName)}
          size="small"
          onClick={() => { setSelectedDataCase(isSelected ? undefined : dataCase) }}
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


export function DataValueHistory() {
  const { t } = useTranslation();
  const values = useLoaderData() as Array<CaseValue>;
  const useFullScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const title = `${t("History")} ${values[0].displayCaseFieldName}`;
  const navigate = useNavigate();
  return (
    <Dialog fullScreen={useFullScreen} open fullWidth maxWidth="xl" onClose={() => navigate("..")}>
      <DialogHeader title={title} />
      <Divider />
      <Box display="grid" gridTemplateColumns="1fr 75px 75px 75px" columnGap="8px" p={2}>
        <Typography fontWeight="bold">{t("Value")}</Typography>
        <Typography fontWeight="bold">{t("Start")}</Typography>
        <Typography fontWeight="bold">{t("End")}</Typography>
        <Typography fontWeight="bold">{t("Created")}</Typography>
        {
          values.map(cv => {
            const caseValueFormatted = formatCaseValue(cv, t);
            return (
              <Fragment key={cv.id}>
                <Typography noWrap title={caseValueFormatted}>{caseValueFormatted}</Typography>
                <Typography>{formatDate(cv.start)}</Typography>
                <Typography>{formatDate(cv.end)}</Typography>
                <Typography title={formatDate(cv.created, true)}>{formatDate(cv.created)}</Typography>
              </Fragment>
            )
          })
        }
      </Box>
    </Dialog>
  )
}

function DialogHeader({ title }) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      px={2}
      sx={theme.mixins.toolbar}
    >
      <Typography variant="h6" sx={{ flex: 1 }}>
        {title}
      </Typography>
      <IconButton component={Link} to=".." size="small">
        <Close />
      </IconButton>
    </Stack>
  );
}
