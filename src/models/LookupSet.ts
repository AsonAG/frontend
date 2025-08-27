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
