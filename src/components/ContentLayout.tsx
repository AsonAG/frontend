import { Stack, Typography } from "@mui/material";
import React, { FC, PropsWithChildren, ReactNode, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useOutlet } from "react-router-dom";

type ContentLayoutProps = {
	title: ReactNode | string,
	disableInset?: boolean,
	buttons?: ReactNode
	stickyHeader?: boolean,
} & PropsWithChildren;

export function ContentLayout({
	title: defaultTitle,
	disableInset,
	children,
	buttons,
	stickyHeader = false,
	...sxProps
}: ContentLayoutProps) {
	return (
		<Stack
			pb={3}
			sx={{
				minHeight: "100%",
				width: "100%",
				boxSizing: "border-box",
				...sxProps,
			}}
		>
			<PageHeader title={defaultTitle} buttons={buttons} sticky={stickyHeader} />
			<PageContent disableInset={disableInset}>{children}</PageContent>
		</Stack>
	);
}

type LoaderData = {
	title: string
};

const stickyHeaderProps = {
	zIndex: 2,
	sx: {
		backgroundColor: theme => theme.palette.background.default,
		position: "sticky",
		top: "var(--header-height)"
	}
}

export function PageHeader({ title, buttons, sticky }) {
	const { t } = useTranslation();
	console.log(sticky);
	const loaderData = useLoaderData() as LoaderData;
	let headerTitle = title;
	if (typeof title === "string" || !title) {
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
			py={3}
			{...(sticky ? stickyHeaderProps : {})}
		>
			{headerTitle}
			{buttons}
		</Stack>
	);
}

type PageHeaderTitleProps = {
	title: string,
	flex?: number | string
};

export function PageHeaderTitle({ title, flex = undefined }: PageHeaderTitleProps) {
	return (
		<Typography variant="h2" fontWeight={500} flex={flex} noWrap>
			{title}
		</Typography>
	);
}

export function PageContent({ children, disableInset = false, ...sxProps }) {
	const px = disableInset ? undefined : "var(--content-inset)";
	const outlet = useOutlet();
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
			{children ?? outlet}
		</Stack>
	);
}

export function withPage<T>(header: ReactNode | string, Component: FC<T>, renderOutlet: boolean) {
	return function withPageHOC(props: T) {
		const outlet = useOutlet();
		{/* @ts-ignore */ }
		const content = renderOutlet && outlet ? outlet : <Component {...props} />;
		return (
			<ContentLayout title={header}>
				{content}
			</ContentLayout>
		);
	};
}

export function withSuspense<T>(Component: FC<T>) {
	return function withPageHOC(props: T) {
		return (
			<Suspense>
				{/* @ts-ignore */}
				<Component {...props} />
			</Suspense>
		);
	};
}
