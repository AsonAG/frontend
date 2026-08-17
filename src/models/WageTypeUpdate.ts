import {
	WageTypeNameLocalizations,
	WageTypeAccountAssignment,
} from "./WageType";

export type WageTypeUpdate = {
	wageTypeNumber: number;
	nameLocalizations?: WageTypeNameLocalizations | null;
	collectors?: Array<string> | null;
	accountAssignment?: WageTypeAccountAssignment | null;
	activeControllingTriggers?: Array<string> | null;
};
