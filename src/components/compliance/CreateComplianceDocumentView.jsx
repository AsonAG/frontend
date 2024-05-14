import {
	Box,
	Button,
	Divider,
	Stack,
	Typography,
	CircularProgress,
} from "@mui/material";
import { ContentLayout } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "@emotion/styled";
import { toBase64 } from "../../services/converters/BinaryConverter";
import { useNavigation, useSubmit } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getDateLocale } from "../../services/converters/DateLocaleExtractor";
import { useAtomValue } from "jotai";
import { userAtom } from "../../utils/dataAtoms";
import dayjs from "dayjs";

const Dropzone = styled(Box, {
	shouldForwardProp: (prop) => prop !== "isDragActive",
})(({ theme, isDragActive }) => {
	return {
		height: 300,
		cursor: "pointer",
		borderRadius: theme.spacing(1.5),
		padding: theme.spacing(2),
		borderStyle: "dashed",
		borderColor: theme.palette.divider,
		borderWidth: "thin",
		backgroundColor: isDragActive ? theme.palette.primary.hover : undefined,
	};
});

export function CreateComplianceDocumentView() {
	const { t } = useTranslation();
	return (
		<ContentLayout title={t("New document")} height="100%">
			<Stack spacing={3}>
				<Typography variant="h6">{t("Generate document")}</Typography>
				<GenerateDocument />
				<Divider>{t("OR")}</Divider>
				<Typography variant="h6">{t("Upload document")}</Typography>
				<UploadComplianceDocumentView />
			</Stack>
		</ContentLayout>
	);
}

function UploadComplianceDocumentView() {
	const { t } = useTranslation();
	const submit = useSubmit();
	const onDrop = useCallback((acceptedFiles) => {
		const upload = async () => {
			if (acceptedFiles.length !== 1) return;
			const file = acceptedFiles[0];
			const data = await toBase64(file);
			const document = {
				name: file.name,
				contentType: file.type,
				content: data,
			};

			submit(
				{ type: "upload", document },
				{ method: "post", encType: "application/json" },
			);
		};
		upload();
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
	});

	return (
		<Dropzone {...getRootProps({ isDragActive })}>
			<input {...getInputProps()} />
			<Stack justifyContent="center" height="100%">
				{isDragActive ? (
					<Typography alignSelf="center">
						{t("Drop the files here ...")}
					</Typography>
				) : (
					<Typography alignSelf="center">
						{t(
							"Drag and drop your compliance documents here, or click to select files",
						)}
					</Typography>
				)}
			</Stack>
		</Dropzone>
	);
}

function GenerateDocument() {
	const { t } = useTranslation();
	const user = useAtomValue(userAtom);
	const [date, setDate] = useState(
		dayjs().utc().subtract(1, "year").startOf("year"),
	);
	const submit = useSubmit();
	const navigation = useNavigation();

	const onGenerate = () => {
		const reportRequest = {
			language: "German",
			userId: user.id,
			parameters: {
				YearAndMonth: date.toISOString(),
				AHV: "true",
				FAK: "true",
				UVG: "true",
				UVGZ: "true",
				KTG: "true",
				WageStatement: "true",
			},
		};
		submit(
			{ type: "generate", reportRequest },
			{ method: "post", encType: "application/json" },
		);
	};

	const isGenerating = navigation.state === "submitting";

	const icon = isGenerating ? (
		<CircularProgress size="1em" sx={{ color: "common.white" }} />
	) : null;

	return (
		<Stack spacing={1} alignItems="start">
			<Typography>Jahresmeldung</Typography>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale={getDateLocale(user)}
			>
				<DatePicker views={["year"]} value={date} onChange={setDate} />
			</LocalizationProvider>
			<Button
				variant="contained"
				onClick={onGenerate}
				startIcon={icon}
				disabled={isGenerating}
			>
				{t("Generate")}
			</Button>
		</Stack>
	);
}
