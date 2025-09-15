import {
	Form,
	useParams,
	useLoaderData,
	useRouteLoaderData,
	useNavigate,
} from "react-router-dom";
import { CaseComponent } from "../../components/case/CaseComponent";
import { createContext, useRef, useState } from "react";
import { CaseFormButtons } from "../../components/buttons/CaseFormButtons";
import { Stack, Typography } from "@mui/material";
import { useCaseData } from "../../hooks/useCaseData.js";
import { Loading } from "../../components/Loading";
import { CaseErrorComponent } from "../../components/case/CaseErrorComponent";
import { PageContent } from "../../components/ContentLayout";
import { toast } from "../../utils/dataAtoms";
import { CaseFieldDetails } from "../../components/CaseFieldDetails";
import { DatePicker } from "../../components/DatePicker";
import { useTranslation } from "react-i18next";
import { useAccountingPeriodDateLimit } from "../../components/case/useAccountingPeriodDateLimit";

export const CaseFormContext = createContext();

export function Component() {
	const params = useParams();
	const key = `${params.tenantId}-${params.payrollId}-${params.employeeId}-${params.caseName}`;
	return <CaseForm key={key} />;
}

function CaseForm() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { payroll } = useRouteLoaderData("root");
	const loaderData = useLoaderData();
	const [caseFieldDetails, setCaseFieldDetails] = useState(null);
	const redirectPath = loaderData?.redirect || "../..";
	const params = useParams();
	const {
		caseData,
		caseErrors,
		fatalError,
		attachments,
		loading,
		submitting,
		isReadonlyCase,
		buildCase,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		addCase,
	} = useCaseData(params, payroll);
	const formRef = useRef();

	const handleSubmit = async () => {
		if (formRef?.current?.reportValidity()) {
			addCase(() => {
				toast("success", "Saved!");
				navigate(redirectPath, { relative: "path", state: "case_added" });
			});
		}
	};
	const renderFieldPeriods = caseData?.periodInputMode === "Individual";
	let content = null;
	if (fatalError) {
		content = <Typography>{t(fatalError.message)}</Typography>;
	} else if (loading) {
		content = <Loading />;
	} else {
		content = (
			<CaseFormContext.Provider
				value={{
					buildCase,
					attachments,
					setCaseFieldDetails,
					renderFieldPeriods,
				}}
			>
				<Form method="post" ref={formRef} id="case_form" autoComplete="off">
					<Stack alignItems="stretch" spacing={4}>
						{caseData && <CaseComponent _case={caseData} />}
						<CaseErrorComponent errors={caseErrors} />
						<Stack
							spacing={2}
							justifyContent="end"
							alignItems="end"
							direction="row"
							flexWrap="wrap"
						>
							<PeriodPicker
								variant={
									caseData.attributes?.["input.datePicker"] === "month"
										? "month-short"
										: "standard"
								}
								inputMode={caseData.periodInputMode}
								startDate={startDate}
								setStartDate={setStartDate}
								endDate={endDate}
								setEndDate={setEndDate}
							/>
							<CaseFormButtons
								onSubmit={handleSubmit}
								backPath={redirectPath}
								submitting={submitting}
								isReadonlyCase={isReadonlyCase}
							/>
						</Stack>
						{caseFieldDetails && (
							<CaseFieldDetails
								caseField={caseFieldDetails.field ?? caseFieldDetails}
								focus={caseFieldDetails.focus}
								onClose={() => setCaseFieldDetails(null)}
							/>
						)}
					</Stack>
				</Form>
			</CaseFormContext.Provider>
		);
	}

	return (
		<PageContent disableInset sx={{ flex: 1 }}>
			{content}
		</PageContent>
	);
}

function PeriodPicker({
	inputMode,
	variant,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) {
	const { t } = useTranslation();
	const startPickerProps = useAccountingPeriodDateLimit();
	const endPickerProps = useAccountingPeriodDateLimit();
	if (inputMode === "Individual") {
		return;
	}
	const startPicker = (
		<DatePicker
			label={t("Valid from")}
			value={startDate}
			variant={variant}
			required
			onChange={(s) =>
				setStartDate(
					variant === "month-short" ? s.startOf("month") : s
				)
			}
			name="case_change_valid_from"
			{...startPickerProps}
		/>
	);
	let endPicker = undefined;
	if (inputMode === "StartAndEnd") {
		endPicker = (
			<DatePicker
				label={t("until")}
				value={endDate}
				variant={variant}
				required
				onChange={(e) =>
					setEndDate(
						variant === "month-short" ? e.endOf("month") : e
					)
				}
				name="case_change_valid_until"
				{...endPickerProps}
			/>
		);
	}
	return (
		<Stack direction="row" spacing={2}>
			{startPicker}
			{endPicker}
		</Stack>
	);
}