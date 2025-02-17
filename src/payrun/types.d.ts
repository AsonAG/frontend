import { TFunction } from "i18next";
import { Dispatch } from "react";
import { PayrollTableAction } from "./Dashboard";
import { PayrunPeriodEntry } from "../models/PayrunPeriod";
import { AvailableCase } from "../models/AvailableCase";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    alignment?: "left" | "center" | "right",
    flex?: number,
    tooltip?: (context: CellContext<TData, TValue>, t: TFunction<"translation", undefined>) => string | null,
    headerTooltip?: (t: TFunction<"translation", undefined>) => string | null
  }
  interface CellContext<TData, TValue> {
    dispatch: Dispatch<PayrollTableAction>
    t: TFunction<"translation", undefined>
  }
  interface HeaderContext<TData, TValue> {
    t: TFunction<"translation", undefined>
  }

  interface TableMeta<TData> {
    isOpen: boolean
  }

  interface TableState {
    periodTotals: PeriodTotals
    payoutTotals: PayoutTotals
  }
}

export type PeriodTotals = {
  employees: number
  gross: number
  previousGross: number
  net: number
  employerCost: number
  open: number
}
export type PayoutTotals = {
  open: number
  payingOut: number
}

export type EntryRow = PayrunPeriodEntry & {
  previousEntry: PayrunPeriodEntry | undefined
  amount: number | undefined
  controllingTasks: Array<AvailableCase> | undefined
  caseValueCount: number,
  salaryType: string | null
}
