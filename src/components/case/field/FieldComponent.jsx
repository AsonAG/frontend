import { useState, useContext, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import FieldValueComponent from "./value/FieldValueComponent";
import { CaseContext } from "../../../scenes/global/CasesForm";
import { useUpdateEffect } from "usehooks-ts";
import { DescriptionComponent } from "../DescriptionComponent";
import dayjs from "dayjs";

export const getFieldKey = (name, id) => "field_" + name + "_" + id;

const FieldComponent = ({ field, onChange }) => {
	const fieldName = field.name;
	const fieldKey = getFieldKey(field.name, field.id);
	const [fieldValue, setFieldValue] = useState(field.value);
	const [fieldStartDate, setFieldStartDate] = useState(dayjs.utc(field.start));
	const [fieldEndDate, setFieldEndDate] = useState(dayjs.utc(field.end));
	const [attachmentFiles, setAttachmentFiles] = useState([]);
	const caseIsReadOnly = useContext(CaseContext);
	const isStartEndVisible =
		field.timeType != "Timeless" &&
		!caseIsReadOnly &&
		!field.attributes?.["input.hideStartEnd"];

	const fieldDisplayName = caseIsReadOnly ? "" : field.displayName;

	// initial build
	useEffect(() => {
		onChange(
			fieldKey,
			fieldName,
			fieldValue,
			fieldStartDate,
			fieldEndDate,
			attachmentFiles
		);
	}, []);

	// update input values when request with newly built field comes
	useUpdateEffect(() => {
		setFieldValue(field.value);
	}, [field.value]);

	useUpdateEffect(() => {
		setFieldStartDate(dayjs.utc(field.start));
	}, [field.start]);

	useUpdateEffect(() => {
		setFieldEndDate(dayjs.utc(field.end));
	}, [field.end]);

	// handle new document upload
	useUpdateEffect(() => {
		// TODO: await for Send button click
		onChange(
			fieldKey,
			fieldName,
			fieldValue,
			fieldStartDate,
			fieldEndDate,
			attachmentFiles
		);
	}, [attachmentFiles]);

	// handle user manuall value change
	const handleValueChange = (value) => {
		onChange(
			fieldKey,
			fieldName,
			value,
			fieldStartDate,
			fieldEndDate,
			attachmentFiles
		);
	};

	const handleInputStartDateChange = (dateValue) => {
		onChange(
			fieldKey,
			fieldName,
			fieldValue,
			dateValue,
			fieldEndDate,
			attachmentFiles
		);
	};

	const handleInputEndDateChange = (dateValue) => {
		onChange(
			fieldKey,
			fieldName,
			fieldValue,
			fieldStartDate,
			dateValue,
			attachmentFiles
		);
	};

	return (
		<Box
			display="grid"
			gridTemplateColumns="repeat( auto-fill, 400px 21px)"
			key={"field_grid_" + field.id}
			rowGap="10px"
			columnGap="4px"
			padding="4px 0px 10px 10px"
			// borderBottom="1px solid #0f0f0f"
		>
			<FieldValueComponent
				fieldDisplayName={fieldDisplayName}
				fieldKey={fieldKey}
				fieldValue={fieldValue}
				setFieldValue={setFieldValue}
				fieldValueType={field.valueType}
				onChange={handleValueChange}
				lookupSettings={field.lookupSettings}
				attributes={field.attributes}
				setAttachmentFiles={setAttachmentFiles}
				key={"field_valuecomponent_" + field.id + "_" + field.valueType}
			/>
			<DescriptionComponent description={field.description} fieldKey />

			{caseIsReadOnly ? (
				// Read-Only case display
				<Stack direction="column" justifyContent="center">
					<Typography variant="h5" alignCenter color="primary">
						{field.displayName}
					</Typography>
				</Stack>
			) : isStartEndVisible ? (
				// Start-end input
				<Box
					key={"field_textfield_dates" + field.id}
					display="grid"
					gridTemplateColumns="1fr 1fr"
					columnGap="14px"
				>
					<FieldValueComponent
						fieldDisplayName={"Start"}
						fieldKey={fieldKey + "_start"}
						fieldValue={fieldStartDate}
						setFieldValue={setFieldStartDate}
						fieldValueType="Date"
						onChange={handleInputStartDateChange}
						key={"field_startdate" + field.id}
					/>

					<Box key={"field_box_enddate" + field.id}>
						{field.timeType != "Moment" && (
							<FieldValueComponent
								fieldDisplayName={"End"}
								fieldKey={fieldKey + "_end"}
								fieldValue={fieldEndDate}
								setFieldValue={setFieldEndDate}
								fieldValueType="Date"
								onChange={handleInputEndDateChange}
								required={field.endMandatory}
								key={"field_enddate" + field.id}
							/>
						)}
					</Box>
				</Box>
			) : (
				<div></div>
			)}
		</Box>
	);
};

export default FieldComponent;
