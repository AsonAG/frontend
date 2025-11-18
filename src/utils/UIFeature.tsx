import { PropsWithChildren } from "react";

export enum UIFeature {
  HrEmployeesEdit,
  HrEmployeesNew,
  OrganizationsCreate,
  OrganizationsImport,
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

  if (disabledFeatures.has(featureName)) {
    return null;
  }

  return children;
};
