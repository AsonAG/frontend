import React, { Dispatch, Fragment, PropsWithChildren, useMemo, useReducer, useRef } from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Stack,
  Typography,
  Box,
  Chip,
  Dialog,
  useMediaQuery,
  Theme,
  useTheme,
  Divider,
  styled,
  SxProps,
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { formatCaseValue } from "../../utils/Format";
import { Close, History, Search } from "@mui/icons-material";
import { IdType } from "../../models/IdType";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { AvailableCase } from "../../models/AvailableCase";

const columnHelper = createColumnHelper<CaseValue>();

const renderPeriod = (caseValue: CaseValue, part: "start" | "end") => {
  if (caseValue.valueType === "Date" || caseValue.valueType === "DateTime")
    return "";
  return formatDate(caseValue[part]);
}

function createColumns(t: TFunction<"translation", undefined>) {
  return [
    columnHelper.accessor("displayCaseFieldName",
      {
        cell: name => name.getValue(),
        header: () => t("Field"),
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
        cell: value => renderPeriod(value.row.original, "start"),
        header: t("Start")
      }),
    columnHelper.accessor("end",
      {
        cell: value => renderPeriod(value.row.original, "end"),
        header: t("End")
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

type State = {
  searchMap: Map<string, Array<string>>
  groups: Array<AvailableCase>
  filteredGroups: Array<AvailableCase>
  selectedGroup: AvailableCase | null
  search: string
}

type Action = {
  type: "select_group",
  group: AvailableCase
} | {
  type: "set_search"
  search: string
}

export function DataTable() {
  const { t } = useTranslation();
  const { values, dataCases: dataGroups } = useLoaderData() as LoaderData;
  const [state, dispatch] = useReducer(
    reducer,
    { groups: dataGroups, values, t },
    createInitialState
  );
  const { selectedGroup } = state;
  return <>
    <GroupFilter state={state} dispatch={dispatch} />
    {
      selectedGroup ?
        <Table state={state} /> :
        <Typography>{t("No data available")}</Typography>
    }
    <Outlet />
  </>;
}

function reducer(state: State, action: Action): State {
  if (action.type === "select_group") {
    return {
      ...state,
      selectedGroup: action.group
    };
  }
  if (action.type === "set_search") {
    const lowerSearch = action.search.toLowerCase();
    let selectedGroup = state.selectedGroup;
    const filtered = state.groups.filter(group => state.searchMap.get(group.name)!.some(searchValue => searchValue.includes(lowerSearch)));
    if (filtered.length > 0 && (state.selectedGroup === null || !filtered.includes(state.selectedGroup))) {
      selectedGroup = filtered[0];
    }
    if (filtered.length === 0) {
      selectedGroup = null;
    }
    return {
      ...state,
      selectedGroup,
      filteredGroups: filtered,
      search: action.search
    }
  }
  throw new Error("unknown action type");
}

function createInitialState({ groups, values, t }: { groups: Array<AvailableCase>, values: Array<CaseValue>, t: TFunction }): State {
  const fieldMap = Map.groupBy(values, (value: CaseValue) => value.caseFieldName) as Map<string, Array<CaseValue>>;
  const availableGroups = groups.filter(group => group.caseFields.some(caseField => fieldMap.has(caseField.name)));
  const ordered = availableGroups.sort(((a, b) => a.attributes?.["tag.order"] - b.attributes?.["tag.order"]));
  const searchMap = new Map();
  for (const group of availableGroups) {
    searchMap.set(
      group.name,
      group.caseFields.flatMap(
        field => {
          const values = fieldMap.get(field.name);
          if (!values) return [];
          let searchValues = values.flatMap(value => (
            value.valueType == "WebResource" ?
              value.value :
              formatCaseValue(value, t) ?? "").toLowerCase());
          searchValues.push(field.displayName.toLowerCase())
          return searchValues;
        }
      )
    );
  }
  return {
    searchMap,
    groups: ordered,
    filteredGroups: ordered,
    selectedGroup: ordered[0],
    search: ""
  };
}

function Table({ state }: { state: State }) {
  const { t } = useTranslation();
  const { values, valueCounts } = useLoaderData() as LoaderData;
  const columns = useMemo(() => createColumns(t), []);
  const { selectedGroup } = state;
  const selectedGroupFieldNames = useMemo(() => new Set(selectedGroup!.caseFields.map(fields => fields.name)), [selectedGroup]);
  const dataCaseValues = useMemo(() => values.filter(value => selectedGroupFieldNames.has(value.caseFieldName)), [values, selectedGroupFieldNames]);
  const orderCaseFields = useMemo(() => new Map(selectedGroup!.caseFields.map((fields, index) => [fields.name, index])), [selectedGroup]);
  const table = useReactTable({
    columns,
    data: dataCaseValues,
    sortingFns: {
      caseDataFn: (rowA, rowB) => {
        if (orderCaseFields) {
          const difference = (orderCaseFields.get(rowA.original.caseFieldName) ?? 0) - (orderCaseFields.get(rowB.original.caseFieldName) ?? 0);
          return difference > 0 ? 1 : difference < 0 ? -1 : 0;
          ;
        }
        return 0;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId
  });
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
        {rows.map(row => (
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

const ChipInput = styled("input")(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: "inherit",
  border: "none",
  outline: "none",
  ...theme.typography.body2,
  fontSize: "0.7rem",
  lineHeight: 1,
  marginTop: "1px"
}));

const chipSx: SxProps<Theme> = {
  "& .MuiChip-icon": {
    mx: 0.325
  },
  "&.MuiChip-root.Mui-focusVisible": {
    backgroundColor: "inherit"
  },
  "& .MuiChip-label": {
    display: "inline-block",
    width: 0,
    visibility: "hidden",
    transition: "visibility 0s, width 0.25s",
    px: 0
  },
  "& .MuiChip-deleteIcon": {
    display: "none"
  },
  "&:hover, &:focus-within, &:has(input:valid)": {
    "& .MuiChip-label": {
      width: 140,
      visibility: "visible"
    },
    "& .MuiChip-deleteIcon": {
      display: "unset",
      visibility: "hidden"
    },
  },
  "&:has(input:valid)": {
    "& .MuiChip-deleteIcon": {
      visibility: "visible"
    }
  }
}

function GroupFilter({ state, dispatch }: { state: State, dispatch: Dispatch<Action> }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { search, selectedGroup, filteredGroups } = state;
  const onChange = (event) => dispatch({ type: "set_search", search: event.target.value });
  const onClear = () => {
    dispatch({ type: "set_search", search: "" });
    inputRef.current?.focus();
  };
  const searchField =
    <ChipInput
      ref={inputRef}
      required
      value={search}
      placeholder={t("Find in groups...")}
      onChange={onChange}
      spellCheck={false}
    />;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      <Chip variant="outlined" color="primary" size="small" icon={<Search />} onDelete={onClear} label={searchField} sx={chipSx} />
      {filteredGroups.map(group => {
        const isSelected = group === selectedGroup;
        return <Chip
          variant={isSelected ? "filled" : "outlined"}
          color="primary"
          key={group.id}
          label={t(group.displayName)}
          size="small"
          onClick={() => { dispatch({ type: "select_group", group }) }}
        />;
      })}
    </Stack>
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
