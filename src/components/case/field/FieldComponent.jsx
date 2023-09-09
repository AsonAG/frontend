import { Box, Stack, Typography } from "@mui/material";
import FieldValueComponent from "./value/FieldValueComponent";
import { DescriptionComponent } from "../DescriptionComponent";
import FieldPeriodSelector from "./FieldPeriodSelector";
import { createContext, useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CasesForm";

export const FieldContext = createContext();


function FieldComponent({ field }) {
	const { buildCase, displayOnly } = useContext(CaseFormContext);
	const fieldIsReadonly = displayOnly || (field.attributes?.["input.readOnly"] ?? false);
	const displayName = !displayOnly ? field.displayName : '';
	return (
		<FieldContext.Provider value={{ field, displayName, buildCase, isReadonly: fieldIsReadonly }}  >
			<Box
				display="grid"
				gridTemplateColumns="repeat( auto-fill, 400px 21px)"
				rowGap="10px"
				columnGap="4px"
				padding="4px 0px 10px 10px"
			>
				<FieldValueComponent />
				<DescriptionComponent description={field.description} />

				{displayOnly ? (
					<Stack direction="column" justifyContent="center">
						<Typography variant="h5" color="primary">
							{field.displayName}
						</Typography>
					</Stack>
				) : <FieldPeriodSelector field={field} />
			}
			</Box>
		</FieldContext.Provider>
	);
};

export default FieldComponent;
