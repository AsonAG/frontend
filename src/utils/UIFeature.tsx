const disabledFeatures = new Set(import.meta.env.VITE_DISABLED_UI_FEATURES?.split(',').map(f => f.trim()) ?? []);

export const UIFeature = ({ feature, children }) => {
  if(disabledFeatures.has(feature)) {
    return null;
  }

  return children;
};