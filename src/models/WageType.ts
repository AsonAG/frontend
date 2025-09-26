import { IdType } from "./IdType";

export type WageType = {
	id: IdType;
	wageTypeNumber: number;
	name: string;
	displayName: string;
	collectors: string[];
	attributes: Record<string, string>;
};

export type WageTypeDetailed = WageType & {
	accountAssignmentRequired: boolean;
};

type WageTypeAccounts = {
	debitAccountNumber: string | null;
	creditAccountNumber: string | null;
};

export type WageTypeSettings = {
	accountAssignments: Record<string, WageTypeAccounts>;
	payrollControlling: Record<string, string[]>;
};
