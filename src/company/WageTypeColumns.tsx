
import { Checkbox, Typography } from "@mui/material";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { WageTypeDetailed } from "../models/WageType";
import { useTranslation } from "react-i18next";

const columnHelper = createColumnHelper<WageTypeDetailed>();
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
    columnHelper.accessor("controllingEnabled",
      {
        id: "controlling",
        cell: (props) => <ControllingCell value={props.getValue()} />,
        header: ({ t }) => t("payrun_period_wage_controlling"),
        size: 170,
        meta: {
          alignment: "center"
        }
      }),
  ];
}
export const columns = createColumns();


function ControllingCell({ value }: { value: "system" | boolean }) {
  const { t } = useTranslation();
  if (value === "system")
    return <Typography noWrap>{t("automatic")}</Typography>
  return <Checkbox checked={value} size="small" disabled />
}
