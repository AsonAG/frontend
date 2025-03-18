
import { Typography } from "@mui/material";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { WageTypeWithAccount } from "../models/WageType";

const columnHelper = createColumnHelper<WageTypeWithAccount>();
function createColumns() {
  return [
    columnHelper.accessor("wageTypeNumber",
      {
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Number"),
        size: 80
      }),
    columnHelper.accessor("displayName",
      {
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Name"),
        size: 250,
        meta: {
          flex: 1
        }
      }),
    columnHelper.accessor(row => row.accountLookupValue?.value?.creditAccountNumber,
      {
        id: "credit",
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Credit"),
        size: 120,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor(row => row.accountLookupValue?.value?.debitAccountNumber,
      {
        id: "debit",
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Debit"),
        size: 120,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor(wt => wt.attributes?.["Configuration.WageType"],
      {
        id: "controlling",
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("payrun_period_wage_controlling"),
        size: 150,
        meta: {
          flex: 1,
        }
      }),
  ];
}
export const columns = createColumns();
