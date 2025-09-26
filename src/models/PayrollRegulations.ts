export type PayrollRegulations = {
	countryRegulation: RegulationName | null;
	industries: RegulationName[];
	erp: RegulationName[];
	accountingDocument: RegulationName | null;
	accountingData: RegulationName | null;
};
export type RegulationName = string;
