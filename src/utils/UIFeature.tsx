import React, { PropsWithChildren } from "react";
import { useUIFeatureCheck } from "./UIFeatureCheck";

export enum UIFeature {
	HrEmployeesEdit,
	HrEmployeesEditFirstName,
	HrEmployeesEditLastName,
	HrEmployeesNew,
	HrTasks,
	OrganizationsCreate,
	OrganizationsImport,
	OrganizationExport,
	OrganizationDelete,
	OrganizationUnitCreate,
	UsersEditRole,
	UsersInvite,
	UsersRemove,
}

const disabledFeatures: Set<string> = new Set(
	import.meta.env.VITE_DISABLED_UI_FEATURES?.split(",").map((f) => f.trim()) ??
		[],
);

const featureNames = Object.values(UIFeature);

for (const disabledFeature of disabledFeatures) {
	if (!featureNames.includes(disabledFeature)) {
		throw new Error(`Unknown feature name "${disabledFeature}"`);
	}
}

export const UIFeatureGate = ({
	feature,
	children,
}: { feature: UIFeature } & PropsWithChildren) => {
	const featureName = UIFeature[feature];
	const disabledViaEnv = disabledFeatures.has(featureName);
	const disabledViaCheck = !useUIFeatureCheck(feature);

	if (disabledViaEnv || disabledViaCheck) {
		return null;
	}

	return children;
};

export const UIFeatureQuery = ({
	feature,
	render,
}: {
	feature: UIFeature;
	render: (enabled: boolean) => React.ReactNode;
}) => {
	const featureName = UIFeature[feature];
	const enabledViaEnv = !disabledFeatures.has(featureName);
	const enabledViaCheck = useUIFeatureCheck(feature);

	return render(enabledViaEnv && enabledViaCheck);
};
