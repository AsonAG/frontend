
import { Checkbox, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { WageTypeDetailed } from "../models/WageType";
import { useTranslation } from "react-i18next";
import { WageTypeAccountPicker } from "./WageTypeAccountPicker";
import { useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { WageTypeControllingLoaderData } from "./WageTypeControlling";

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
        cell: (props) => <WageTypeAccountPicker wageType={props.row.original} accountType="creditAccountNumber" />,
        header: ({ t }) => t("Credit"),
        size: 180
      }),
    columnHelper.accessor(row => row.accountLookupValue?.value?.debitAccountNumber,
      {
        id: "debit",
        cell: (props) => <WageTypeAccountPicker wageType={props.row.original} accountType="debitAccountNumber" />,
        header: ({ t }) => t("Debit"),
        size: 180
      }),
    columnHelper.accessor("controllingEnabled",
      {
        id: "controlling",
        cell: (props) => {
          const { t } = useTranslation();
          const wageType = props.row.original;
          if (wageType.controllingEnabled === "system")
            return <Typography noWrap>{t("automatic")}</Typography>

          return <ControllingCell checked={wageType.controllingEnabled} wageTypeNumber={wageType.wageTypeNumber.toString()} />;
        },
        header: ({ t }) => t("payrun_period_wage_controlling"),
        size: 170,
        meta: {
          alignment: "center"
        }
      }),
  ];
}
export const columns = createColumns();


function ControllingCell({ checked, wageTypeNumber }: { checked: boolean, wageTypeNumber: string }) {
  const { regulationId, wageTypePayrollControllingLookup } = useLoaderData() as WageTypeControllingLoaderData;
  const [value, setValue] = useState<boolean>(checked);
  const submit = useSubmit();
  const navigation = useNavigation();
  const onChange = (_, checked: boolean) => {
    if (navigation.state !== "idle")
      return;
    setValue(checked);
    const payrollControllingLookupValue = wageTypePayrollControllingLookup.values.find(x => x.key === wageTypeNumber);
    if (checked && !payrollControllingLookupValue) {
      submit({
        regulationId,
        lookupId: wageTypePayrollControllingLookup.id,
        lookupValue: {
          key: wageTypeNumber,
          value: "true"
        }
      },
        { method: "POST", encType: "application/json" });
    }

    if (!checked && !!payrollControllingLookupValue) {
      submit({
        regulationId,
        lookupId: wageTypePayrollControllingLookup.id,
        lookupValue: payrollControllingLookupValue
      },
        { method: "DELETE", encType: "application/json" });
    }
  }
  useEffect(() => {
    setValue(checked);
  }, [checked]);
  return <Checkbox checked={value} size="small" onChange={onChange} />
}
