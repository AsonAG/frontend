import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { formatValue } from "./utils";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { TFunction } from "i18next";
import { useOpenAmountDetails } from "./useOpenAmountDetails";
import { TableSettingsButton } from "./TableSettings";
import { AmountInput } from "./AmountInput";
import { RowSelectionButton } from "./RowSelectionButton";
import { EntryRow } from "./types";
import { PayslipButton } from "./PayslipButton";
import { StatusDot } from "../employee/StatusDot";

const stopPropagation: MouseEventHandler = (event) => event?.stopPropagation();
function getWageTypeTooltipForPreviousValue(t: TFunction<"translation", undefined>, wageType: string, context: CellContext<EntryRow, number | null>, previousValueColumnName: string | undefined = undefined) {
  if (previousValueColumnName && context.table.getState().columnVisibility[previousValueColumnName])
    return null;
  const previousValue = formatValue(context.row.original.previousEntry?.[wageType]);
  return `${t("Value from previous period")} ${previousValue ?? "-"}`;
}

function TableStatusDot({ row }: { row: EntryRow }) {
  if (row.isEmployed)
    return;
  return <StatusDot isEmployed={false} />
}

const columnHelper = createColumnHelper<EntryRow>();
function createColumns() {
  return [
    columnHelper.group({
      id: "employeeTotal",
      header: ({ state, dispatch, completed }) => !completed && <RowSelectionButton state={state} dispatch={dispatch} />,
      columns: [
        columnHelper.accessor("identifier",
          {
            id: "identifier",
            cell: (props) => {
              return <Typography noWrap>{props.getValue()}<>&nbsp;</><TableStatusDot row={props.row.original} /></Typography>;
            },
            header: ({ t }) => t("Id"),
            footer: ({ t }) => t("Total"),
            size: 150,
            meta: {
              flex: 1,
              tooltip: (context) => !context.table.getState().columnVisibility.employee ? `${context.row.original.lastName} ${context.row.original.firstName}` : null,
              headerTooltip: (t) => t("Id of the employee")
            }
          }),
        columnHelper.accessor(row => `${row.lastName} ${row.firstName}`,
          {
            id: "employee",
            cell: (props) => {
              const idColumnVisible = props.table.getState().columnVisibility.identifier;
              const statusDot = !idColumnVisible ? <>&nbsp;<TableStatusDot row={props.row.original} /></> : null;
              return <Typography noWrap>{props.getValue()}{statusDot}</Typography>;
            },
            header: ({ t }) => t("Name"),
            footer: ({ table, t }) => !table.getState().columnVisibility.identifier ? t("Total") : null,
            size: 150,
            meta: {
              flex: 1,
              tooltip: (context) => !context.table.getState().columnVisibility.identifier ? context.row.original.identifier : null,
              headerTooltip: (t) => t("Last name and first name of the employee")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "employerCostTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.employerCost),
      columns: [
        columnHelper.accessor("employerCost",
          {
            id: "employerCost",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Total cost"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "employerCost", context),
              headerTooltip: t => t("Total costs from the employer's perspective")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "previousGrossWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.previousGross),
      columns: [
        columnHelper.accessor(row => row.previousEntry?.grossWage ?? null,
          {
            id: "grossPreviousPeriod",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Gross PP"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: t => t("Gross wage previous period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "diffGrossWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.diffGross),
      columns: [
        columnHelper.accessor(row => formatValue((row.grossWage ?? 0) - (row.previousEntry?.grossWage ?? 0)),
          {
            id: "grossDiff",
            cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
            header: ({ t }) => t("Diff. gross"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: t => t("Gross wage previous period minus gross wage open period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "grossWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.gross),
      columns: [
        columnHelper.accessor("grossWage",
          {
            cell: (props) => {
              const { grossWage, previousEntry } = props.row.original;
              const previousGrossWage = previousEntry?.grossWage;
              if (!grossWage || grossWage === previousGrossWage) {
                // no highlight
                return <Typography noWrap>{formatValue(props.getValue())}</Typography>
              }
              const trendingUp = !previousGrossWage || (grossWage > previousGrossWage);

              const Icon = trendingUp ? TrendingUp : TrendingDown;
              const color = trendingUp ? "green" : "red";
              return (
                <>
                  <Icon fontSize="small" htmlColor={color} />
                  <Typography noWrap color={color}>{formatValue(props.getValue())}</Typography>
                </>
              )
            },
            header: ({ t }) => t("Gross"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "grossWage", context, "grossPreviousPeriod"),
              headerTooltip: (t) => t("Gross wage open period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "netWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.net),
      columns: [
        columnHelper.accessor("netWage",
          {
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Net"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "netWage", context),
              headerTooltip: (t) => t("Net wage open period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "offsettingTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.offsetting),
      columns: [
        columnHelper.accessor("offsetting",
          {
            id: "offsetting",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("OT"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "offsetting", context),
              headerTooltip: t => t("Offsettings, i.e. supplements and deductions after the net wage")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "retroTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.retro),
      columns: [
        columnHelper.accessor("retro",
          {
            id: "retro",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Retro"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "retro", context),
              headerTooltip: (t) => t("Net amount from all retroactive changes prior to the open period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "openGarnishmentPayoutPreviousPeriodTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.openGarnishmentPayoutPreviousPeriod),
      columns: [
        columnHelper.accessor("openGarnishmentPayoutPreviousPeriod",
          {
            id: "openGarnishmentPayoutPreviousPeriod",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("GPP"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: t => t("Garnishments to be paid from the previous period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "openWagePayoutPreviousPeriodTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.openWagePayoutPreviousPeriod),
      columns: [
        columnHelper.accessor("openWagePayoutPreviousPeriod",
          {
            id: "openWagePayoutPreviousPeriod",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("OPP"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: t => t("Outstanding amount to be paid from the previous period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "paidTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.paid),
      columns: [
        columnHelper.accessor(row => (row.paidOut ?? 0) + (row.paidOutGarnishment ?? 0),
          {
            id: "paidOut",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Paid"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: (t) => t("Already paid out in the open period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "garnishmentTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.garnishment),
      columns: [
        columnHelper.accessor("garnishment",
          {
            id: "garnishment",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Garnishment"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: (t) => t("Garnishment open period")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "openTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.open),
      columns: [
        columnHelper.accessor("openPayout",
          {
            id: "openPayout",
            cell: context => {
              const { hasDetails, popover, openPopover, closePopover } = useOpenAmountDetails(context);
              const openAmount = context.getValue();
              let value = formatValue(openAmount);
              if (value !== null) {
                value = value + (hasDetails ? "*" : "")
              }
              const color = !!openAmount && openAmount < 0 ? "red" : undefined;
              return (
                <>
                  <Typography onMouseOver={openPopover} onMouseLeave={closePopover} color={color}>{value}</Typography>
                  {popover}
                </>
              )
            },
            header: ({ t }) => t("Open"),
            footer: (props) => formatValue(props.table.getState().payoutTotals.open),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: t => t("Outstanding amount to be paid in the open period")
            },
            sortingFn: (rowA, rowB) => {
              const aNegative = rowA.original.openPayout < 0;
              const bNegative = rowB.original.openPayout < 0;
              if (aNegative && !bNegative) return -1;
              if (!aNegative && bNegative) return 1;
              return 0;
            }
          }
        )
      ]
    }),
    columnHelper.accessor("amount",
      {
        id: "amount",
        cell: function({ row, dispatch }) {
          const onClick: MouseEventHandler = (event) => {
            if (row.getIsSelected()) {
              event.stopPropagation();
            }
          }
          return <AmountInput entry={row.original} dispatch={dispatch} onClick={onClick} />;
        },
        header: ({ t }) => t("dashboard_payout_header"),
        footer: (props) => formatValue(props.table.getState().payoutTotals.payingOut),
        size: 110,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.display({
      id: "documents",
      cell: ({ row }) => {
        return (
          <Stack direction="row" sx={{ width: 35, justifyContent: "end" }}>
            <PayslipButton payrunPeriodEntry={row.original} />
          </Stack>
        )
      },
      size: 55,
      meta: {
        alignment: "center"
      }
    }),
    columnHelper.display({
      id: "events",
      cell: ({ row, t }) => {
        const { id, relevantEventCount } = row.original;
        if (relevantEventCount === 0)
          return <div></div>;
        return (
          <Stack direction="row" sx={{ justifyContent: "end" }}>
            <Tooltip title={t("Events")} placement="left">
              <IconButton size="small" component={Link} to={`entries/${id}/events`} onClick={stopPropagation}><WorkHistoryOutlinedIcon /></IconButton>
            </Tooltip>
          </Stack>
        )
      },
      header: ({ t }) => <Tooltip title={t("Settings")}><TableSettingsButton /></Tooltip>,
      size: 55,
      meta: {
        alignment: "center"
      }
    })
  ];
}
export const columns = createColumns();
