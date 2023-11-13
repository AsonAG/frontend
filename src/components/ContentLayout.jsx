import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

export function ContentLayout({ title, disableXsPadding, children, buttons, ...sxProps }) {
  const { t } = useTranslation();
  const stackSpacingProps = {xs: disableXsPadding ? 0 : 4, sm: 1, lg: 4};
  const headerSpacingProps = disableXsPadding ? {xs: 4, sm: 0} : {};

  return (
    <Stack px={stackSpacingProps} py={4} spacing={2} sx={{ minHeight: "100%", width: "100%", ...sxProps }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h2" fontWeight="bold" pb={2} px={headerSpacingProps} flex={1}>{t(title)}</Typography>
        { buttons }
      </Stack>
      {children}
    </Stack>
  );
}

export function ContextContentLayout(props) {
  const title = useOutletContext();
  return <ContentLayout title={title} {...props} />
}
