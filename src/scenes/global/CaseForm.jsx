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

	let content = null;
	if (fatalError) {
		content = <ErrorView error={fatalError} />;
	} else if (loading) {
		content = <Loading />;
	} else {
		content = (
			<CaseFormContext.Provider value={{ buildCase, attachments, setCaseFieldDetails }}>
				<Form method="post" ref={formRef} id="case_form" autoComplete="off">
					<Stack alignItems="stretch" spacing={4}>
						{caseData && <CaseComponent _case={caseData} />}
						<CaseErrorComponent errors={caseErrors} />
						<CaseFormButtons onSubmit={handleSubmit} backPath={redirectPath} />
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
