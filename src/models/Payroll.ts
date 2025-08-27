import { Language } from "./Language";
import { IdType } from "./IdType";

export type Payroll = {
	id: IdType;
	name: string;
	divisionId: IdType;
	accountingStartDate: string;
	transmissionStartDate: string;
	language: Language | null;
};
