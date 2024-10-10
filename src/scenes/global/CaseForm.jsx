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
import { Stack } from "@mui/material";
import { useCaseData } from "../../hooks/useCaseData.js";
import { Loading } from "../../components/Loading";
import { CaseErrorComponent } from "../../components/case/CaseErrorComponent";
import { ErrorView } from "../../components/ErrorView";
import { PageContent } from "../../components/ContentLayout";
import { toast } from "../../utils/dataAtoms";
import { CaseFieldDetails } from "../../components/CaseFieldDetails";
import { DatePicker } from "../../components/DatePicker";
import { useTranslation } from "react-i18next";

export const CaseFormContext = createContext();


export function Component() {
	const params = useParams();
	const key = `${params.tenantId}-${params.payrollId}-${params.employeeId}-${params.caseName}`;
	return <CaseForm key={key} />
}

function CaseForm() {
	const navigate = useNavigate();
	const { user, payroll } = useRouteLoaderData("root");
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
		buildCase,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		addCase,
	} = useCaseData(params, user, payroll);
	const formRef = useRef();

	const handleSubmit = () => {
		if (formRef?.current?.reportValidity()) {
			addCase(() => {
				toast("success", "Saved!");
				navigate(redirectPath, { relative: "path" });
			});
		}
	};

	const renderFieldPeriods = caseData?.periodInputMode === "Individual";
	let content = null;
	if (fatalError) {
		content = <ErrorView error={fatalError} />;
	} else if (loading) {
		content = <Loading />;
	} else {
		content = (
			<CaseFormContext.Provider value={{ buildCase, attachments, setCaseFieldDetails, renderFieldPeriods }}>
				<Form method="post" ref={formRef} id="case_form" autoComplete="off">
					<Stack alignItems="stretch" spacing={4}>
						{caseData && <CaseComponent _case={caseData} />}
						<CaseErrorComponent errors={caseErrors} />
						{/* row-reverse, wrap reverse to make the items stick to the right side when wrapped*/}
						<Stack direction="row-reverse" spacing={2} alignSelf="end" alignItems="end" flexWrap="wrap-reverse">
							<CaseFormButtons onSubmit={handleSubmit} backPath={redirectPath} />
							<PeriodPicker inputMode={caseData.periodInputMode} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
						</Stack >
						{caseFieldDetails && <CaseFieldDetails caseField={caseFieldDetails} onClose={() => setCaseFieldDetails(null)} />}
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

function PeriodPicker({ inputMode, startDate, setStartDate, endDate, setEndDate }) {
	const { t } = useTranslation();
	if (inputMode === "Individual") {
		return;
	}
	const startPicker = (
		<DatePicker
			label={t("Valid from")}
			value={startDate}
			required
			onChange={setStartDate}
			name="case_change_valid_from"
		/>
	);
	let endPicker = undefined;
	if (inputMode === "StartAndEnd") {
		endPicker = (
			<DatePicker
				label={t("until")}
				value={endDate}
				required
				onChange={setEndDate}
				name="case_change_valid_until"
			/>
		)
	}
	return (
		<Stack direction="row" spacing={2}>
			{startPicker}
			{endPicker}
		</Stack>
	)

}
