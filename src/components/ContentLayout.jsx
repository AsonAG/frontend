import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

export function ContentLayout({ defaultTitle, disableXsPadding, children, ...sxProps }) {
  const { t } = useTranslation();
  const title = useOutletContext() || defaultTitle;
  const stackSpacingProps = {xs: disableXsPadding ? 0 : 4, sm: 1, lg: 4};
  const headerSpacingProps = disableXsPadding ? {xs: 4, sm: 0} : {};

  return (
    <Stack px={stackSpacingProps} py={4} spacing={2} sx={{ minHeight: "100%", width: "100%", ...sxProps }}>
      <Typography variant="h2" fontWeight="bold" pb={2} px={headerSpacingProps}>{t(title)}</Typography>
      {children}
    </Stack>
  );
}