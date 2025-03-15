
import { Typography } from "@mui/material";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { WageType } from "../models/WageType";
import { IdType } from "../models/IdType";

type AccountLookupValue = {
  id: IdType
  key: string
  created: string
  value: WageTypeAccounts
}
type WageTypeAccounts = {
  debitAccountNumber: string
  creditAccountNumber: string
}

export type WageTypeRow = {
  accountLookupValue: AccountLookupValue | null
} & WageType

const columnHelper = createColumnHelper<WageTypeRow>();
function createColumns() {
  return [
    columnHelper.accessor("wageTypeNumber",
      {
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Number"),
        size: 80
      }),
    columnHelper.accessor("name",
      {
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Name"),
        size: 250,
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
    columnHelper.accessor(wt => wt.attributes?.length,
      {
        id: "attributes",
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Attributes"),
        size: 150,
        meta: {
          flex: 1,
        }
      }),
  ];
}
export const columns = createColumns();
