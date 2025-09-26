import { TFunction } from "i18next";
import { Dispatch } from "react";
import { PayrunPeriodEntry } from "../models/PayrunPeriod";
import { PayrunTableAction, PayrunTableState } from "./PayrollTable";
import { MissingData, MissingDataCase } from "../models/MissingData";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData, TValue> {
		alignment?: "left" | "center" | "right";
		flex?: number;
		tooltip?: (
			context: CellContext<TData, TValue>,
			t: TFunction<"translation", undefined>,
		) => string | null;
		headerTooltip?: (t: TFunction<"translation", undefined>) => string | null;
	}
	interface CellContext<TData, TValue> {
		dispatch: Dispatch<PayrunTableAction>;
		t: TFunction<"translation", undefined>;
	}
	interface HeaderContext<TData, TValue> {
		state: PayrunTableState;
		dispatch: Dispatch<PayrunTableAction>;
		completed: boolean;
		t: TFunction<"translation", undefined>;
	}
	interface TableState {
		payoutTotals: PayoutTotals;
		periodTotals: PeriodTotals;
	}
}

export type PeriodTotals = {
	employerCost: number;
	previousGross: number;
	diffGross: number;
	gross: number;
	net: number;
	offsetting: number;
	retro: number;
	openGarnishmentPayoutPreviousPeriod: number;
	openWagePayoutPreviousPeriod: number;
	paid: number;
	garnishment: number;
	open: number;
};
export type PayoutTotals = {
	open: number;
	payingOut: number;
};

export type EntryRow = PayrunPeriodEntry & {
	previousEntry: PayrunPeriodEntry | undefined;
	amount: number | undefined;
	controllingTasks: Array<MissingDataCase> | undefined;
	salaryType: string | null;
};

export type ControllingData = {
	employeeControllingCases: MissingData[];
	companyControllingCases: MissingDataCase[];
};
