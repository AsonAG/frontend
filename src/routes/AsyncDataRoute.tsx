import { PropsWithChildren, ReactNode, Suspense } from "react";
import { Loading } from "../components/Loading";
import { ErrorView } from "../components/ErrorView";
import { Await, useLoaderData } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";

type AsyncDataRouteProps = {
	loadingElement?: ReactNode;
	skipDataCheck?: boolean;
	noDataAvailableText?: string;
	children?: ReactNode | undefined;
} & PropsWithChildren;

export function AsyncDataRoute({
	children,
	loadingElement,
	skipDataCheck,
	noDataAvailableText = "No data available",
}: AsyncDataRouteProps) {
	const routeData = useLoaderData() as any;
	const { t } = useTranslation();
	const loading = loadingElement || <Loading />;
	return (
		<Suspense fallback={loading}>
			<Await resolve={routeData.data} errorElement={<ErrorView />}>
				{(data) =>
					skipDataCheck || hasData(data) ? (
						children
					) : (
						<Typography>{t(noDataAvailableText)}</Typography>
					)
				}
			</Await>
		</Suspense>
	);
}

function hasData(value: { length: number; count: number }) {
	if (Array.isArray(value)) {
		return value.length > 0;
	}
	if (value instanceof Map) {
		return value.size > 0;
	}
	if (value === undefined || value === null) {
		return false;
	}
	return value.count > 0;
}
