import { useRef, useState, useEffect, useMemo } from "react";
import { buildCase, addCase } from "../api/FetchClient";

function mapCase(_case, attachments) {
	return {
		caseName: _case.name,
		values: _case.fields.map((f) => ({
			caseName: _case.name,
			caseFieldName: f.name,
			value: f.value,
			start: f.start,
			end: f.end,
			documents: attachments[f.id],
			tags: f.valueTags,
			attributes: f.valueAttributes,
		}))
	};
}

export function useCaseData(params, user, payroll) {
	const attachments = useRef({});
	const [caseData, setCaseData] = useState(null);
	const [caseErrors, setCaseErrors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [fatalError, setFatalError] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	let [startDate, setStartDate] = useState(null);
	let [endDate, setEndDate] = useState(null);

	const isReadonlyCase = useMemo(
		() => caseData?.fields.every(field => field.valueType === "None" || field.valueType === "WebResource") ?? true, [caseData]);


	useEffect(() => {
		const loadData = async () => {
			await _buildCase();
			setLoading(false);
		};
		loadData();
	}, []);

	function getCaseChangeSetup() {
		if (!caseData) {
			return null;
		}
		const caseChangeSetup = {
			userId: user.id,
			divisionId: payroll.divisionId,
			case: mapCase(caseData, attachments),
			start: startDate?.toISOString(),
			end: endDate?.toISOString()
		};
		if (params.employeeId) {
			caseChangeSetup.employeeId = params.employeeId;
		}
		return caseChangeSetup;
	}

	async function handleError(caseResponse) {
		const response = await caseResponse.json();
		if (caseResponse.status >= 400 && caseResponse.status < 500) {
			if (typeof response === "string") {
				setCaseErrors([response]);
			} else {
				const errors = Object.entries(response.errors).flatMap((entry) =>
					entry[1].flatMap((e) => `${entry[0]}: ${e}`),
				);
				setCaseErrors(errors);
			}
		} else {
			setFatalError(new Error(response));
		}
	}

	async function _buildCase() {
		const caseResponse = await buildCase(params, getCaseChangeSetup());
		if (caseResponse.ok) {
			setCaseData(await caseResponse.json());
			setCaseErrors([]);
		} else {
			handleError(caseResponse);
		}
	}

	async function _addCase(onCaseAdded) {
		setSubmitting(true);
		try {
			const caseResponse = await addCase(params, getCaseChangeSetup());
			if (caseResponse.ok) {
				onCaseAdded();
			} else {
				handleError(caseResponse);
			}
		} finally {
			setSubmitting(false);
		}
	}

	return {
		caseData,
		caseErrors,
		fatalError,
		attachments,
		loading,
		submitting,
		isReadonlyCase,
		startDate,
		endDate,
		setStartDate: (updatedStartDate) => {
			// setStartDate does not immediately update startDate..
			// so we need to update the value and trigger the rerender
			startDate = updatedStartDate;
			setStartDate(updatedStartDate);
			_buildCase();
		},
		setEndDate: (updatedEndDate) => {
			endDate = updatedEndDate;
			setEndDate(updatedEndDate);
			_buildCase();
		},
		buildCase: _buildCase,
		addCase: _addCase,
	};
}
