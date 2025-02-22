import { TFunction } from "i18next";
import { Dispatch } from "react";
import { PayrunPeriodEntry } from "../models/PayrunPeriod";
import { AvailableCase } from "../models/AvailableCase";
import { PayrunTableAction } from "./PayrollTable";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    alignment?: "left" | "center" | "right",
    flex?: number,
    tooltip?: (context: CellContext<TData, TValue>, t: TFunction<"translation", undefined>) => string | null,
    headerTooltip?: (t: TFunction<"translation", undefined>) => string | null
  }
  interface CellContext<TData, TValue> {
    dispatch: Dispatch<PayrunTableAction>
    t: TFunction<"translation", undefined>
  }
  interface HeaderContext<TData, TValue> {
    t: TFunction<"translation", undefined>
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
