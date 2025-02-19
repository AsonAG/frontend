import { EntryRow } from "./Dashboard";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { formatValue } from "./utils";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { TFunction } from "i18next";
import { useOpenAmountDetails } from "./useOpenAmountDetails";
import { TableSettingsButton } from "./TableSettings";
import { AmountInput } from "./AmountInput";

const stopPropagation: MouseEventHandler = (event) => event?.stopPropagation();
function getWageTypeTooltipForPreviousValue(t: TFunction<"translation", undefined>, wageType: string, context: CellContext<EntryRow, number | null>, previousValueColumnName: string | undefined = undefined) {
  if (!context.table.options.meta?.isOpen)
    return null;
  if (previousValueColumnName && context.table.getState().columnVisibility[previousValueColumnName])
    return null;
  const previousValue = formatValue(context.row.original.previousEntry?.[wageType]);
  return `${t("Value from previous period")} ${previousValue ?? "-"}`;
}


const columnHelper = createColumnHelper<EntryRow>();
function createColumns() {
  return [
    columnHelper.group({
      id: "employeeTotal",
      columns: [
        columnHelper.accessor("identifier",
          {
            id: "identifier",
            cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
            header: ({ t }) => t("Id"),
            footer: ({ t }) => t("Total"),
            size: 150,
            meta: {
              flex: 1,
              tooltip: (context) => !context.table.getState().columnVisibility.employee ? context.row.original.name : null,
              headerTooltip: (t) => t("Id of the employee")
            }
          }),
        columnHelper.accessor(row => `${row.lastName} ${row.firstName}`,
          {
            id: "employee",
            cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
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
    columnHelper.group({
      id: "grossWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.gross),
      columns: [
        columnHelper.accessor("grossWage",
          {
            cell: (props) => {
              const { grossWage, previousEntry } = props.row.original;
              const previousGrossWage = previousEntry?.grossWage;
              const isOpen = props.table.options.meta?.isOpen;
              if (!isOpen || !grossWage || grossWage === previousGrossWage) {
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
    columnHelper.group({
      id: "openTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.open),
      columns: [
        columnHelper.accessor("openPayout",
          {
            id: "openPayout",
            cell: context => {
              const { hasDetails, popover, openPopover, closePopover } = useOpenAmountDetails(context);
              let value = formatValue(context.getValue());
              if (value !== null) {
                value = value + (hasDetails ? "*" : "")
              }
              return (
                <>
                  <Typography onMouseOver={openPopover} onMouseLeave={closePopover}>{value}</Typography>
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
            }
          }),
      ]
    }),
    columnHelper.accessor("amount",
      {
        id: "amount",
        cell: function({ row, dispatch }) {
          if (row.getCanExpand()) {
            return;
          }
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
      cell: (props) => {
        const payrunEntry = props.row.original;
        return (
          <Stack direction="row" sx={{ width: 35, justifyContent: "end" }}>
            {
              payrunEntry?.documents?.filter(doc => doc.attributes?.type === "payslip").map(doc => (
                <Tooltip key={doc.id} title={doc.name} placement="left">
                  <IconButton size="small" component={Link} to={`${payrunEntry.id}/doc/${doc.id}`} onClick={stopPropagation}><FilePresentRoundedIcon /></IconButton>
                </Tooltip>
              ))
            }
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
        const { employeeId, caseValueCount } = row.original;
        if (caseValueCount === 0)
          return <div></div>;
        return (
          <Stack direction="row" sx={{ width: 35, justifyContent: "end" }}>
            <Tooltip title={t("Events")} placement="left">
              <IconButton size="small" component={Link} to={`employees/${employeeId}/events`} onClick={stopPropagation}><WorkHistoryOutlinedIcon /></IconButton>
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
