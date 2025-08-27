import React from "react";
import { ContentLayout } from "../components/ContentLayout";
import { DashboardHeader } from "./DashboardHeader";
import { PeriodDocuments } from "./PeriodDocuments";

export function ClosedPeriodDocuments() {
	return (
		<ContentLayout title={<DashboardHeader />}>
			<PeriodDocuments />
		</ContentLayout>
	);
}
