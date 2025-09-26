import { IdType } from "./IdType";

export type CaseChangeCaseValue = {
	id: IdType;
	start: Date;
	end: Date;
	created: Date;
	value: string;
	displayCaseFieldName: string;
};
