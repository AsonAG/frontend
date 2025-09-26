import { IdType } from "./IdType";

export type CaseDocument = {
	id: IdType;
	name: string;
	content: string;
};

export type CaseValue = {
	id: IdType;
	start: Date;
	end: Date;
	created: Date;
	documents: Array<CaseDocument>;
};
