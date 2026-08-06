import { IdType } from "./IdType";

export type WageTypeLocalizationLanguage = "en" | "de" | "fr" | "it";

export type WageTypeNameLocalizations = Partial<
	Record<WageTypeLocalizationLanguage, string>
>;

export type WageTypeCollector = {
	id?: IdType;
	name: string;
	displayName: string;
	isActive: boolean;
	isChangeable: boolean;
};

export type WageTypeAccountAssignment = {
	debitAccountNumber: string | null;
	creditAccountNumber: string | null;
};

export type WageType = {
	id?: IdType;
	wageTypeNumber: number;
	name: string;
	nameLocalizations?: WageTypeNameLocalizations;
	attributes: Record<string, string>;
	displayName: string;
	description?: string | null;
	collectors: WageTypeCollector[];
	isActive: boolean;
	isCopyable: boolean;
	isLocalizable: boolean;
    category: string;
	accountAssignment: WageTypeAccountAssignment | null;
	activeControllingTriggers: string[];
	availableControllingTriggers: string[];
};
