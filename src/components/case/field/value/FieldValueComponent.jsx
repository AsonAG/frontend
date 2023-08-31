import { useContext, useEffect, useState } from "react";
import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Typography,
	Link,
	Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CaseContext } from "../../../../scenes/global/CasesForm";
import FieldValueFileComponent from "./FieldValueFileComponent";
import FieldValueLookupComponent from "./selector/FieldValueLookupComponent";
import FieldValueNumberComponent from "./FieldValueNumberComponent";
import FieldValueListComponent from "./selector/FieldValueListComponent";
import {
	validateMask,
	validateMinMax,
} from "../../../../services/validators/FieldValueValidator";
import FieldValueTextComponent from "./FieldValueTextComponent";
import FieldValueDateComponent from "./FieldValueDateComponent";
import FieldValueDateTimeComponent from "./FieldValueDateTimeComponent";

/**
 * Input field types {Decimal/Money/Percent/Hour/Day../Distance/NumericBoolean}
 */
const FieldValueComponent = ({
	fieldDisplayName,
	fieldKey,
	fieldValue,
	setFieldValue,
	fieldValueType,
	onChange,
	required = true,
	lookupSettings,
	attributes,
	setAttachmentFiles,
}) => {
	const caseIsReadOnly =
		useContext(CaseContext) || attributes?.["input.readOnly"];
	const [isValid, setIsValid] = useState(true);
	const helperText = "";
	let isInteger;

	/* Validation          =============================== START =============================== */
	const [slotInputProps, setSlotProps] = useState({});

	useEffect(() => {
		setSlotProps({
			fullWidth: true,
			helperText: helperText,
			error: !isValid,
			textField: {
				helperText: helperText,
				error: !isValid,
			},
			// textField: { size: "small" },
			// size: "small",
		});
	}, [isValid, helperText]);

	// useUpdateEffect(() => {
	//   isValid
	//     ? setSlotProps((current) => ({
	//         ...current,
	//         error: true,
	//         textField: {
	//           helperText: helperText,
	//           error: true,
	//         },
	//       }))
	//     : setSlotProps((current) => ({
	//         ...current,
	//         error: false,
	//         textField: {
	//           helperText: helperText,
	//           error: false,
	//         },
	//       }));
	// }, [isValid]);

	/* Validation ========================================== END ================================ */
	/* Handlers         =================================== START =============================== */
	const handleTextValueChange = (e) => {
		setFieldValue(e.target.value);
	};

	const handleNumberValueChange = (values, sourceInfo) => {
		setFieldValue(values.value);
	};

	const handleTextBlur = (e) => {
		setIsValid(validateMask(fieldValue, attributes));
		onChange(e.target.value);
	};

	const handleNumberBlur = () => {
		setIsValid(validateMinMax(fieldValue, attributes));
		onChange(fieldValue);
	};

	const handleBooleanValueChange = (e) => {
		console.log("input change: boolean clicked." + e.target.checked);
		setFieldValue(e.target.checked + "");
		onChange(e.target.checked + "");
	};

	const handleInputLookupValueChange = (value) => {
		setFieldValue(value);
		onChange(value);
	};

	const handleDateTimeValueChange = (dateValue) => {
		onChange(dateValue);
	};
	/* Handlers         ================================ END ================================ */

	/* Selectors    =============================== START =============================== */
	if (lookupSettings && "lookupName" in lookupSettings) {
		return (
			<div key={fieldKey + "_lookupoption"}>
				{FieldValueLookupComponent(
					fieldValue,
					fieldKey,
					onChange,
					lookupSettings,
					slotInputProps,
					fieldDisplayName,
					attributes,
					caseIsReadOnly
				)}
			</div>
		);
	} else if (attributes?.["input.list"]) {
		return (
			<div key={fieldKey + "_listoption"}>
				{FieldValueListComponent(
					fieldValue,
					fieldKey,
					onChange,
					lookupSettings,
					slotInputProps,
					fieldDisplayName,
					attributes,
					caseIsReadOnly
				)}
			</div>
		);
	} else
	/* Selectors          ================================ END ================================ */
	/* Return component =============================== START =============================== */
		switch (fieldValueType) {
			case "None":
				return (
					<Box marginLeft="14px" marginBottom="5px">
						<Typography>{fieldDisplayName}</Typography>
					</Box>
				);
			case "Document":
				return FieldValueFileComponent(
					fieldDisplayName,
					fieldValue,
					fieldKey,
					slotInputProps,
					attributes,
					setAttachmentFiles
				);
			case "Date":
				return FieldValueDateComponent(
					fieldDisplayName,
					required,
					fieldValue,
					handleDateTimeValueChange,
					fieldKey,
					slotInputProps,
					caseIsReadOnly
				);
			case "DateTime":
				return FieldValueDateTimeComponent(
					fieldDisplayName,
					required,
					fieldValue,
					handleDateTimeValueChange,
					fieldKey,
					slotInputProps,
					caseIsReadOnly
				);
			case "Boolean":
				return (
					<FormControl required={required}>
						<FormControlLabel
							name={fieldKey}
							label={fieldDisplayName}
							slotProps={{ ...slotInputProps }}
							labelPlacement="start"
							control={
								<Checkbox
									checked={
										fieldValue ? fieldValue.toLowerCase?.() === "true" : false
									}
									onChange={handleBooleanValueChange}
									key={fieldKey}
									disabled={caseIsReadOnly}
								/>
							}
						/>
						<FormHelperText>{helperText}</FormHelperText>
					</FormControl>
				);
			case "WebResource":
				return (
					<Stack>
						{FieldValueTextComponent(
							fieldDisplayName,
							required,
							fieldValue,
							handleTextValueChange,
							handleTextBlur,
							fieldKey,
							slotInputProps,
							attributes,
							caseIsReadOnly
						)}
						<Box m="6px">
							<Link href={fieldValue} target="_blank" rel="noopener">
								{fieldValue}
							</Link>
						</Box>
					</Stack>
				);
			case "Integer":
			case "NumericBoolean":
				isInteger = true;
				return FieldValueNumberComponent(
					fieldDisplayName,
					required,
					fieldValue,
					handleNumberValueChange,
					handleNumberBlur,
					fieldValueType,
					fieldKey,
					slotInputProps,
					attributes,
					caseIsReadOnly,
					isInteger
				);
			case "Week":
			case "Decimal":
			case "Year":
			case "Day":
			case "Hour":
			case "Distance":
			case "Month":
			case "Percent":
			case "Money":
				isInteger = false;
				return FieldValueNumberComponent(
					fieldDisplayName,
					required,
					fieldValue,
					handleNumberValueChange,
					handleNumberBlur,
					fieldValueType,
					fieldKey,
					slotInputProps,
					attributes,
					caseIsReadOnly,
					isInteger
				);
			default: //TextField or Autocomplete
				return FieldValueTextComponent(
					fieldDisplayName,
					required,
					fieldValue,
					handleTextValueChange,
					handleTextBlur,
					fieldKey,
					slotInputProps,
					attributes,
					caseIsReadOnly
				);
		}
	/* Return component =============================== END =============================== */
};

export default FieldValueComponent;
