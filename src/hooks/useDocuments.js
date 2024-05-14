import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDocumentsOfCaseField } from "../api/FetchClient";

const documentLoadSteps = 15;
export function useDocuments(caseFieldName) {
	const params = useParams();
	const [documents, setDocuments] = useState({ count: 0, items: [] });
	const [top, setTop] = useState(documentLoadSteps);
	const [loading, setLoading] = useState(true);

	function loadMore() {
		setTop((top) => top + documentLoadSteps);
	}

	useEffect(() => {
		setLoading(true);
		const load = async () => {
			try {
				const response = await getDocumentsOfCaseField(
					params,
					caseFieldName,
					top,
				);
				setDocuments(response);
			} catch {
				setDocuments({ count: 0, items: [] });
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [
		caseFieldName,
		params.tenantId,
		params.payrollId,
		params.employeeId,
		top,
	]);

	const hasMore = documents.count > documents.items.length;

	return { documents, loading, hasMore, loadMore };
}
