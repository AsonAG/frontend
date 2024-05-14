import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";

export function ContentLayout({
	title: defaultTitle,
	disableInset,
	children,
	buttons,
	...sxProps
}) {
	return (
		<Stack
			py={3}
			spacing={3}
			sx={{
				minHeight: "100%",
				width: "100%",
				boxSizing: "border-box",
				...sxProps,
			}}
		>
			<PageHeader title={defaultTitle} buttons={buttons} />
			<PageContent disableInset={disableInset}>{children}</PageContent>
		</Stack>
	);
}

export function PageHeader({ title, buttons }) {
	const { t } = useTranslation();
	const loaderData = useLoaderData();
	let headerTitle = title;
	if (typeof title === "string") {
		headerTitle = (
			<PageHeaderTitle title={t(loaderData?.title || title)} flex={1} />
		);
	}
	return (
		<Stack
			direction="row"
			spacing={2}
			alignItems="start"
			px="var(--content-inset)"
		>
			{headerTitle}
			{buttons}
		</Stack>
	);
}

export function PageHeaderTitle({ title, flex = undefined }) {
	return (
		<Typography variant="h2" fontWeight={500} flex={flex} noWrap>
			{title}
		</Typography>
	);
}

export function PageContent({ children, disableInset, ...sxProps }) {
	const px = disableInset ? undefined : "var(--content-inset)";
	return (
		<Stack
			px={px}
			spacing={2}
			sx={{
				minHeight: "100%",
				width: "100%",
				boxSizing: "border-box",
				...sxProps,
			}}
		>
			{children}
		</Stack>
	);
}

export function withPage(header, Component) {
	return function withPageHOC(props) {
		return (
			<ContentLayout title={header}>
				<Component {...props} />
			</ContentLayout>
		);
	};
}
