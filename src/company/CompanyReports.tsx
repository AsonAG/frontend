import React, { useEffect, useMemo, useState } from "react";
import {
	Autocomplete,
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
import { DatePicker } from "../components/DatePicker";
import { getDatePickerVariant } from "../components/case/field/value/FieldValueDateComponent";
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

type LoaderData = {
	reports: ReportSet[];
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
	const { t, i18n } = useTranslation();
	const { reports } = useLoaderData() as LoaderData;
	const params = useParams();
	const [activeReport, setActiveReport] = useState<ReportSet | null>(null);
	const [busyReportId, setBusyReportId] = useState<string | null>(null);

	const language = languageByCode[i18n.language?.split("-")[0]] ?? "German";

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

	async function handleGenerate(report: ReportSet) {
		// Reports with options open the dialog; option-less reports generate at once.
		if (hasOptions(report)) {
			setActiveReport(report);
			return;
		}
		setBusyReportId(report.id);
		const values: Record<string, string> = {};
		for (const parameter of report.parameters ?? []) {
			values[parameter.name] = getInitialValue(parameter);
		}
		const format = (report.availableOutputs ?? [])[0];
		await generateReportFile(params, report, language, values, format, t);
		setBusyReportId(null);
	}

	return (
		<>
			<Stack spacing={1} sx={{ maxWidth: 720 }}>
				{visibleReports.map((report) => (
					<ReportListItem
						key={report.id}
						report={report}
						busy={busyReportId === report.id}
						onGenerate={() => handleGenerate(report)}
					/>
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

function ReportListItem({
	report,
	busy,
	onGenerate,
}: {
	report: ReportSet;
	busy: boolean;
	onGenerate: () => void;
}) {
	const { t } = useTranslation();
	return (
		<Stack
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
			<Button variant="outlined" onClick={onGenerate} loading={busy}>
				{t("Generate")}
			</Button>
		</Stack>
	);
}

function isHidden(parameter: ReportParameter): boolean {
	const hidden = parameter.attributes?.["input.hidden"];
	return hidden === true || hidden === "true";
}

// A report needs the parameter dialog only if there is something to choose:
// at least one visible parameter or more than one output format.
function hasOptions(report: ReportSet): boolean {
	const visibleParameters = (report.parameters ?? []).filter((p) => !isHidden(p));
	const outputs = report.availableOutputs ?? [];
	return visibleParameters.length > 0 || outputs.length > 1;
}

// Generate the report and trigger the file download. Returns true on success.
async function generateReportFile(
	params: Record<string, string | undefined>,
	report: ReportSet,
	language: Language,
	values: Record<string, string>,
	format: string,
	t: (key: string) => string,
): Promise<boolean> {
	try {
		const file = await generatePayrollReport(
			{ ...params, reportId: report.id },
			{ language, payrollId: params.payrollId, parameters: values },
			format,
		);
		if (!file?.content) {
			toast("error", t("The report could not be generated."));
			return false;
		}
		downloadBase64File({
			...file,
			name: buildDownloadName(report, values, file.name),
		});
		return true;
	} catch (e) {
		const detail = e instanceof Error ? e.message : "";
		toast(
			"error",
			detail
				? `${t("The report could not be generated.")} ${detail}`
				: t("The report could not be generated."),
		);
		return false;
	}
}

// Output file name: report name + the report date. The date comes from the
// report's date parameter; reports without one (e.g. wage types) use today.
function buildDownloadName(
	report: ReportSet,
	values: Record<string, string>,
	originalName: string,
): string {
	const dateParameter = (report.parameters ?? []).find((p) =>
		isDate(p.valueType),
	);
	const raw = dateParameter ? values[dateParameter.name] : "";
	const date = raw ? dayjs.utc(raw) : null;
	const label = (date?.isValid() ? date : dayjs.utc()).format("DD.MM.YYYY");
	const base = report.displayName ?? report.name;
	const dot = originalName.lastIndexOf(".");
	const extension = dot >= 0 ? originalName.slice(dot) : "";
	return `${base}_${label}${extension}`;
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

// A date parameter defaults to the current date. The report definition uses the
// literal "today" as default value, which is no date the picker can show.
function getInitialValue(parameter: ReportParameter): string {
	const value = parameter.value ?? "";
	if (!isDate(parameter.valueType)) {
		return value;
	}
	const date = value ? dayjs.utc(value) : null;
	return date?.isValid()
		? date.format("YYYY-MM-DD")
		: dayjs.utc().format("YYYY-MM-DD");
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
	onClose,
}: {
	report: ReportSet;
	onClose: () => void;
}) {
	const { t, i18n } = useTranslation();
	const params = useParams();
	const [generating, setGenerating] = useState(false);

	const language = languageByCode[i18n.language?.split("-")[0]] ?? "German";

	const outputs = report.availableOutputs ?? [];
	const [format, setFormat] = useState<string>(outputs[0]);

	const [values, setValues] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const parameter of report.parameters ?? []) {
			initial[parameter.name] = getInitialValue(parameter);
		}
		return initial;
	});

	// Parameters shown to the user. The build step enriches them with dynamic
	// attributes (e.g. an employee dropdown, hidden fields). We fall back to the
	// static definition until the build result arrives.
	const [parameters, setParameters] = useState<ReportParameter[]>(
		report.parameters ?? [],
	);

	// Re-run the build after every parameter change, since the build function
	// may derive attributes (dropdowns, hidden fields) from any of them.
	const structuralKey = (report.parameters ?? [])
		.map((p) => `${p.name}=${values[p.name] ?? ""}`)
		.join("&");

	useEffect(() => {
		let cancelled = false;
		async function build() {
			try {
				const result = await buildPayrollReport(
					{ ...params, reportId: report.id },
					{ language, payrollId: params.payrollId, parameters: values },
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
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
		[parameters],
	);

	const setValue = (name: string, value: string) =>
		setValues((prev) => ({ ...prev, [name]: value }));

	async function handleGenerate() {
		setGenerating(true);
		const ok = await generateReportFile(params, report, language, values, format, t);
		setGenerating(false);
		if (ok) {
			onClose();
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

	const listSelection = getListSelection(parameter);
	if (listSelection) {
		// The value is a comma-separated string; each pick becomes a removable chip.
		const options = listSelection.map(([optionLabel, optionValue]) => ({
			label: optionLabel,
			value: optionValue,
		}));
		const selectedValues = value
			? value
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean)
			: [];
		const selected = selectedValues.map(
			(v) => options.find((o) => o.value === v) ?? { label: v, value: v },
		);
		return (
			<Autocomplete
				multiple
				options={options}
				value={selected}
				getOptionLabel={(option) => option.label}
				isOptionEqualToValue={(a, b) => a.value === b.value}
				onChange={(_, newValue) =>
					onChange(newValue.map((o) => o.value).join(","))
				}
				renderInput={(params) => (
					<TextField
						{...params}
						label={label}
						required={parameter.mandatory && selected.length === 0}
						helperText={parameter.displayDescription ?? parameter.description}
					/>
				)}
			/>
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
			<DatePicker
				variant={getDatePickerVariant(
					parameter.attributes?.["input.datePicker"],
				)}
				label={label}
				value={value ? dayjs.utc(value) : null}
				required={parameter.mandatory}
				onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
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
