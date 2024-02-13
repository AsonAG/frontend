import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLoaderData, useOutletContext } from "react-router-dom";

export function ContentLayout({ title: defaultTitle, disableXsPadding, children, buttons, ...sxProps }) {
  const { t } = useTranslation();
  const contextTitle = useOutletContext();
  const loaderData = useLoaderData();
  const contentTitle = t(loaderData?.title || defaultTitle);
  const title = contextTitle || contentTitle;
  const subtitle = contextTitle ? contentTitle : null;
  const stackSpacingProps = {xs: disableXsPadding ? 1 : 4, sm: 1, lg: 4};
  const headerSpacingProps = disableXsPadding ? {xs: 1, sm: 0} : {};
  return (
    <Stack px={stackSpacingProps} py={4} spacing={2} sx={{ minHeight: "100%", width: "100%", boxSizing: "border-box", ...sxProps }}>
      <Stack direction="row" spacing={2} alignItems="start">
        <Stack pb={2} px={headerSpacingProps} flex={1} spacing={1}>
          <Typography variant="h2" fontWeight={500}  noWrap>{title}</Typography>
          { subtitle && <Typography variant="h2" noWrap>{subtitle}</Typography>}
        </Stack>
        { buttons }
      </Stack>
      {children}
    </Stack>
  );
}

// TODO AJO rework this
export function ContentStack({children, disableXsPadding}) {
  const stackSpacingProps = {xs: disableXsPadding ? 0 : 4, sm: 1, lg: 4};
  return (
    <Stack px={stackSpacingProps} spacing={2} sx={{ minHeight: "100%", width: "100%", boxSizing: "border-box" }}>
      {children}
    </Stack>
  );
}