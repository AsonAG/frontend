import { IdType } from "./IdType";

export type PayrunPeriodEntry = {
	id: IdType;
	employeeId: IdType;
	payrunJobId: IdType;
	identifier: string;
	lastName: string;
	firstName: string;
	leavingDate: Date | null;
	isEmployed: boolean;
	netWage: number;
	grossWage: number;
	offsetting: number;
	employerCost: number;
	paidOut: number;
	paidOutGarnishment: number;
	garnishment: number;
	retro: number;
	openPayout: number;
	openWagePayout: number;
	openGarnishmentPayout: number;
	openWagePayoutPreviousPeriod: number;
	openGarnishmentPayoutPreviousPeriod: number;
	hasWage: boolean;
	documents: Array<PayrunDocument> | null;
	state: "OutOfDate" | "Generating" | "Current" | "Error";
	relevantEventCount: number;
};

export type PayrunPeriod = {
	id: IdType;
	entries: Array<PayrunPeriodEntry>;
	periodStart: Date;
	periodStatus: "Open" | "Closed";
	processingStatus: "Complete" | "ReadyToGenerate" | "Processing";
};

export type PayrunDocument = {
	id: IdType;
	name: string;
	contentType: string;
	attributes: PayrunDocumentAttributes;
};
type PayrunDocumentAttributes = {
	type: string;
	reports?: DocumentReportDefinition[];
	errorCode?: number;
};
type DocumentReportDefinition = {
	Name: string;
	Variants: Array<string>;
};
