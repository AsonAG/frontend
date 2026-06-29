import React, { useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { useLoaderData, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { generatePayrollReport } from "../api/FetchClient";
import { toast } from "../utils/dataAtoms";
import { Language } from "../models/Language";

type ReportParameter = {
	name: string;
	displayName?: string;
	description?: string;
	displayDescription?: string;
	value?: string;
	valueType?: string;
	mandatory?: boolean;
	order?: number;
	attributes?: Record<string, unknown>;
};

type ReportSet = {
	id: string;
	name: string;
	displayName?: string;
	description?: string;
	displayDescription?: string;
	parameters?: ReportParameter[];
	availableOutputs?: string[];
};

type LoaderData = {
	reports: ReportSet[];
};

const languageByCode: Record<string, Language> = {
	de: "German",
	en: "English",
	fr: "French",
	it: "Italian",
};

export function CompanyReports() {
	const { t } = useTranslation();
	const { reports } = useLoaderData() as LoaderData;
	const [activeReport, setActiveReport] = useState<ReportSet | null>(null);

	if (!reports || reports.length === 0) {
		return (
			<Typography color="text.secondary">
				{t("No reports available.")}
			</Typography>
		);
	}

	return (
		<>
			<Stack spacing={1} sx={{ maxWidth: 720 }}>
				{reports.map((report) => (
					<Stack
						key={report.id}
						direction="row"
						alignItems="center"
						spacing={2}
						sx={{
							p: 1.5,
							borderRadius: 1,
							border: (theme) => `1px solid ${theme.palette.divider}`,
						}}
					>
						<DescriptionRoundedIcon color="action" />
						<Stack sx={{ flex: 1, minWidth: 0 }}>
							<Typography fontWeight="bold">
								{report.displayName ?? report.name}
							</Typography>
							{(report.displayDescription ?? report.description) && (
								<Typography variant="body2" color="text.secondary" noWrap>
									{report.displayDescription ?? report.description}
								</Typography>
							)}
						</Stack>
						<Button variant="outlined" onClick={() => setActiveReport(report)}>
							{t("Generate")}
						</Button>
					</Stack>
				))}
			</Stack>
			{activeReport && (
				<GenerateReportDialog
					key={activeReport.id}
					report={activeReport}
					onClose={() => setActiveReport(null)}
				/>
			)}
		</>
	);
}

function isHidden(parameter: ReportParameter): boolean {
	const hidden = parameter.attributes?.["input.hidden"];
	return hidden === true || hidden === "true";
}

function isBoolean(valueType?: string): boolean {
	return valueType === "Boolean" || valueType === "NumericBoolean";
}

function isDate(valueType?: string): boolean {
	return valueType === "Date" || valueType === "DateTime";
}

function isNumber(valueType?: string): boolean {
	return (
		valueType === "Integer" ||
		valueType === "Decimal" ||
		valueType === "Money" ||
		valueType === "Percent" ||
		valueType === "Hour" ||
		valueType === "Day" ||
		valueType === "Week" ||
		valueType === "Month" ||
		valueType === "Year" ||
		valueType === "Distance"
	);
}

function GenerateReportDialog({
	report,
	onClose,
}: {
	report: ReportSet;
	onClose: () => void;
}) {
	const { t, i18n } = useTranslation();
	const params = useParams();
	const [generating, setGenerating] = useState(false);

	const visibleParameters = useMemo(
		() =>
			(report.parameters ?? [])
				.filter((p) => !isHidden(p))
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		[report.parameters],
	);

	const outputs = report.availableOutputs?.length
		? report.availableOutputs
		: ["Pdf"];

	const [values, setValues] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const parameter of report.parameters ?? []) {
			initial[parameter.name] = parameter.value ?? "";
		}
		return initial;
	});
	const [format, setFormat] = useState<string>(outputs[0]);

	const setValue = (name: string, value: string) =>
		setValues((prev) => ({ ...prev, [name]: value }));

	async function handleGenerate() {
		setGenerating(true);
		try {
			const language = languageByCode[i18n.language?.split("-")[0]] ?? "German";
			const request = {
				language,
				payrollId: params.payrollId,
				parameters: values,
			};
			const file = await generatePayrollReport(
				{ ...params, reportId: report.id },
				request,
				format,
			);
			if (!file?.content) {
				toast("error", t("The report could not be generated."));
				return;
			}
			downloadBase64File(file);
			onClose();
		} catch (e) {
			toast("error", t("The report could not be generated."));
		} finally {
			setGenerating(false);
		}
	}

	return (
		<Dialog open onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{report.displayName ?? report.name}</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={2} sx={{ pt: 1 }}>
					{visibleParameters.map((parameter) => (
						<ParameterInput
							key={parameter.name}
							parameter={parameter}
							value={values[parameter.name] ?? ""}
							onChange={(value) => setValue(parameter.name, value)}
						/>
					))}
					{outputs.length > 1 && (
						<TextField
							select
							label={t("Format")}
							value={format}
							onChange={(e) => setFormat(e.target.value)}
						>
							{outputs.map((output) => (
								<MenuItem key={output} value={output}>
									{output}
								</MenuItem>
							))}
						</TextField>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={generating}>
					{t("Cancel")}
				</Button>
				<Button
					variant="contained"
					onClick={handleGenerate}
					loading={generating}
				>
					{t("Generate")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function ParameterInput({
	parameter,
	value,
	onChange,
}: {
	parameter: ReportParameter;
	value: string;
	onChange: (value: string) => void;
}) {
	const label = parameter.displayName ?? parameter.name;

	if (isBoolean(parameter.valueType)) {
		return (
			<FormControlLabel
				control={
					<Checkbox
						checked={value === "true"}
						onChange={(e) => onChange(e.target.checked ? "true" : "false")}
					/>
				}
				label={label}
			/>
		);
	}

	if (isDate(parameter.valueType)) {
		return (
			<TextField
				type="date"
				label={label}
				value={value ? value.substring(0, 10) : ""}
				onChange={(e) => onChange(e.target.value)}
				required={parameter.mandatory}
				slotProps={{ inputLabel: { shrink: true } }}
			/>
		);
	}

	return (
		<TextField
			type={isNumber(parameter.valueType) ? "number" : "text"}
			label={label}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			required={parameter.mandatory}
			helperText={parameter.displayDescription ?? parameter.description}
		/>
	);
}

function downloadBase64File(file: {
	name: string;
	content: string;
	contentType: string;
}) {
	const byteChars = atob(file.content);
	const bytes = new Uint8Array(byteChars.length);
	for (let i = 0; i < byteChars.length; i++) {
		bytes[i] = byteChars.charCodeAt(i);
	}
	const blob = new Blob([bytes], {
		type: file.contentType || "application/octet-stream",
	});
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = file.name;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}
