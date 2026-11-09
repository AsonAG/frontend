import { IdType } from "./IdType";

export type LookupSet = {
	id: IdType;
	values: LookupValue[];
};

export type LookupValue = {
	id?: IdType;
	key: string;
	created?: string;
	value: string;
};

export type PayrollLookupValueSource =
	| "Regulation"
	| "PayrollOverride"
	| "Payroll";

export type PayrollLookupValue = {
	key: string;
	value: string;
	valueLocalizations?: Record<string, string> | null;
	source: PayrollLookupValueSource;
};
