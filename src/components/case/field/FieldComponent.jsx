import { Box, Typography } from "@mui/material";
import FieldValueComponent from "./value/FieldValueComponent";
import { DescriptionComponent } from "../DescriptionComponent";
import FieldPeriodSelector from "./FieldPeriodSelector";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CasesForm";

export const FieldContext = createContext();


function FieldComponent({ field }) {
	const { buildCase, displayOnly, attachments } = useContext(CaseFormContext);
	const fieldIsReadonly = displayOnly || (field.attributes?.["input.readOnly"] ?? false);
	const displayName = !displayOnly ? field.displayName : '';

	return (
		<FieldContext.Provider value={{ field, displayName, buildCase, attachments, isReadonly: fieldIsReadonly }}  >
			<Box
				display="grid"
				gridTemplateColumns="3fr 22px minmax(135px, 1fr) minmax(135px, 1fr)"
				alignItems="center"
				columnGap="8px"
			>
				<FieldValueComponent />
				<DescriptionComponent description={field.description} />

				{displayOnly ? (
					<Typography color="primary" gridColumn="3 / 4">
						{field.displayName}
					</Typography>
				) : <FieldPeriodSelector field={field} />
			}
			</Box>
		</FieldContext.Provider>
	);
};

export default FieldComponent;
