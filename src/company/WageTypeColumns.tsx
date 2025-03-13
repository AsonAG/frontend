
import { Typography } from "@mui/material";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { WageType } from "../models/WageType";
import { IdType } from "../models/IdType";
import { WageTypeAccountPicker } from "./WageTypeAccountPicker";

export type WageTypeRow = {
  debit: IdType
  credit: IdType
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
    columnHelper.accessor("debit",
      {
        cell: (props) => <WageTypeAccountPicker lookupValueId={props.getValue()} />,
        header: ({ t }) => t("Debit"),
        size: 100,
      }),
    columnHelper.accessor("credit",
      {
        cell: (props) => <WageTypeAccountPicker lookupValueId={props.getValue()} />,
        header: ({ t }) => t("Credit"),
        size: 100,
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
