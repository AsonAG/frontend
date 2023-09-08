import { Box, Stack, Typography } from "@mui/material";
import FieldValueComponent from "./value/FieldValueComponent";
import { DescriptionComponent } from "../DescriptionComponent";
import FieldPeriodSelector from "./FieldPeriodSelector";
import { useContext } from "react";
import { CaseFormContext } from "../../../scenes/global/CasesForm";

const FieldComponent = ({ field }) => {
	const { isReadonly } = useContext(CaseFormContext);
	return (
		<Box
			display="grid"
			gridTemplateColumns="repeat( auto-fill, 400px 21px)"
			rowGap="10px"
			columnGap="4px"
			padding="4px 0px 10px 10px"
		>
			<FieldValueComponent field={field} />
			<DescriptionComponent description={field.description} />

			{isReadonly ? (
				// Read-Only case display
				<Stack direction="column" justifyContent="center">
					<Typography variant="h5" alignCenter color="primary">
						{field.displayName}
					</Typography>
				</Stack>
			) : <FieldPeriodSelector field={field} />
		}
		</Box>
	);
};

export default FieldComponent;
