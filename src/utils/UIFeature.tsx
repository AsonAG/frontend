import React, { PropsWithChildren } from "react";
import { useUIFeatureRuntimeEnabled } from "./UIFeatureEvaluator";

export enum UIFeature {
	HrEmployeesEdit,
	HrEmployeesEditFirstName,
	HrEmployeesEditLastName,
	HrEmployeesNew,
	OrganizationsCreate,
	OrganizationsImport,
	OrganizationExport,
	OrganizationDelete,
	OrganizationUnitCreate,
	UsersEditRole,
	UsersInvite,
	UsersRemove,
	Tasks,
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
	const runtimeEnabled = useUIFeatureRuntimeEnabled(feature);

	if (disabledFeatures.has(featureName)) {
		return null;
	}

	if (runtimeEnabled === null || !runtimeEnabled) {
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
	const runtimeEnabled = useUIFeatureRuntimeEnabled(feature);

	if (disabledFeatures.has(featureName)) {
		return render(false);
	}

	if (runtimeEnabled === null) {
		return null;
	}

	return render(runtimeEnabled);
};
