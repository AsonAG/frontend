import React, { useEffect, useMemo, useState } from "react";
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
import dayjs from "dayjs";
import { buildPayrollReport, generatePayrollReport } from "../api/FetchClient";
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

type PayrunPeriod = {
	id: string;
	periodStart: string;
	periodStatus?: string;
};

type LoaderData = {
	reports: ReportSet[];
	periods: PayrunPeriod[];
};

const languageByCode: Record<string, Language> = {
	de: "German",
	en: "English",
	fr: "French",
	it: "Italian",
};

// Only these reports are offered in the company reports tab.
const ALLOWED_REPORTS = new Set([
	"WageTypesReport",
	"EmployeesMasterDataReport",
	"CompanyMasterDataReport",
	"CaseFieldExportReport",
]);

export function CompanyReports() {
	const { t } = useTranslation();
	const { reports, periods } = useLoaderData() as LoaderData;
	const [activeReport, setActiveReport] = useState<ReportSet | null>(null);

	const visibleReports = (reports ?? []).filter((r) =>
		ALLOWED_REPORTS.has(r.name),
	);

	if (visibleReports.length === 0) {
		return (
			<Typography color="text.secondary">
				{t("No reports available.")}
			</Typography>
		);
	}

	return (
		<>
			<Stack spacing={1} sx={{ maxWidth: 720 }}>
				{visibleReports.map((report) => (
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
					periods={periods ?? []}
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

// The build function serializes list options as {"dictionary": {label: value}}.
function getListSelection(
	parameter: ReportParameter,
): Array<[string, string]> | null {
	const raw = parameter.attributes?.["input.listSelection"];
	if (!raw) return null;
	try {
		const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
		const dictionary = parsed?.dictionary;
		if (!dictionary) return null;
		return Object.entries(dictionary as Record<string, string>);
	} catch {
		return null;
	}
}

function GenerateReportDialog({
	report,
	periods,
	onClose,
}: {
	report: ReportSet;
	periods: PayrunPeriod[];
	onClose: () => void;
}) {
	const { t, i18n } = useTranslation();
	const params = useParams();
	const [generating, setGenerating] = useState(false);

	const language = languageByCode[i18n.language?.split("-")[0]] ?? "German";

	// Reports with an "Excel" flag can render both tabular (Excel/CSV) and
	// template (Word/PDF) output; the flag is derived from the chosen format.
	const hasExcelFlag = (report.parameters ?? []).some((p) => p.name === "Excel");
	const outputs = report.availableOutputs?.length
		? report.availableOutputs
		: hasExcelFlag
			? ["Word", "Pdf", "Excel", "Csv"]
			: ["Pdf"];
	const [format, setFormat] = useState<string>(outputs[0]);

	const [values, setValues] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const parameter of report.parameters ?? []) {
			initial[parameter.name] = parameter.value ?? "";
		}
		return initial;
	});

	// Parameters shown to the user. The build step enriches them with dynamic
	// attributes (e.g. an employee dropdown, hidden fields). We fall back to the
	// static definition until the build result arrives.
	const [parameters, setParameters] = useState<ReportParameter[]>(
		report.parameters ?? [],
	);

	// Re-run the build whenever a boolean parameter changes, since those drive
	// the build logic (e.g. "All employees?" toggles the employee dropdown).
	const structuralKey = (report.parameters ?? [])
		.filter((p) => isBoolean(p.valueType))
		.map((p) => `${p.name}=${values[p.name]}`)
		.join("&");

	useEffect(() => {
		let cancelled = false;
		async function build() {
			try {
				const result = await buildPayrollReport(
					{ ...params, reportId: report.id },
					{ language, payrollId: params.payrollId, parameters: values },
					language,
				);
				if (!cancelled && result?.parameters) {
					setParameters(result.parameters);
				}
			} catch {
				// keep the static parameters on failure
			}
		}
		build();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [structuralKey]);

	const visibleParameters = useMemo(
		() =>
			parameters
				.filter((p) => !isHidden(p))
				// The "Excel" flag is driven by the format selector, so hide it.
				.filter((p) => !(hasExcelFlag && p.name === "Excel"))
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		[parameters, hasExcelFlag],
	);

	const setValue = (name: string, value: string) =>
		setValues((prev) => ({ ...prev, [name]: value }));

	async function handleGenerate() {
		setGenerating(true);
		try {
			// Tabular formats (Excel/CSV) need the report's "Excel" flag on
			// (flat data); template formats (Word/PDF) need it off. Keep in sync.
			const requestValues = { ...values };
			if (hasExcelFlag) {
				requestValues["Excel"] =
					format === "Excel" || format === "Csv" ? "true" : "false";
			}
			const file = await generatePayrollReport(
				{ ...params, reportId: report.id },
				{ language, payrollId: params.payrollId, parameters: requestValues },
				format,
			);
			if (!file?.content) {
				toast("error", t("The report could not be generated."));
				return;
			}
			downloadBase64File(file);
			onClose();
		} catch (e) {
			const detail = e instanceof Error ? e.message : "";
			toast(
				"error",
				detail
					? `${t("The report could not be generated.")} ${detail}`
					: t("The report could not be generated."),
			);
		} finally {
			setGenerating(false);
		}
	}

	return (
		<Dialog open onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{report.displayName ?? report.name}</DialogTitle>
			<DialogContent dividers>
				<Stack spacing={2} sx={{ pt: 1 }}>
					{visibleParameters.length === 0 && outputs.length <= 1 && (
						<Typography color="text.secondary">
							{t("This report has no options — click Generate to create it.")}
						</Typography>
					)}
					{visibleParameters.map((parameter) => (
						<ParameterInput
							key={parameter.name}
							parameter={parameter}
							periods={periods}
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
	periods,
	value,
	onChange,
}: {
	parameter: ReportParameter;
	periods: PayrunPeriod[];
	value: string;
	onChange: (value: string) => void;
}) {
	const { t } = useTranslation();
	const label = parameter.displayName ?? parameter.name;

	// Let the user pick a payrun period by date instead of typing a raw id.
	if (parameter.name === "PayrunPeriodId") {
		return (
			<TextField
				select
				label={t("Period")}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required={parameter.mandatory}
			>
				<MenuItem value="">
					<em>—</em>
				</MenuItem>
				{periods.map((period) => (
					<MenuItem key={period.id} value={period.id}>
						{dayjs.utc(period.periodStart).format("MMMM YYYY")}
					</MenuItem>
				))}
			</TextField>
		);
	}

	const listSelection = getListSelection(parameter);
	if (listSelection) {
		// The value is a comma-separated string; the multi-select works on an array.
		const selected = value
			? value
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean)
			: [];
		return (
			<TextField
				select
				label={label}
				value={selected}
				onChange={(e) => {
					const v = e.target.value as unknown as string[];
					onChange(Array.isArray(v) ? v.join(",") : v);
				}}
				required={parameter.mandatory}
				helperText={parameter.displayDescription ?? parameter.description}
				SelectProps={{ multiple: true }}
			>
				{listSelection.map(([optionLabel, optionValue]) => (
					<MenuItem key={optionValue} value={optionValue}>
						{optionLabel}
					</MenuItem>
				))}
			</TextField>
		);
	}

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
