import { forwardRef, Suspense } from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { Link as RouterLink, Await } from "react-router-dom";
import styled from "@emotion/styled";
import { Summarize, TextSnippet } from "@mui/icons-material";

const cardHeight = 100;
const cardWidth = 200;

function ItemSkeletion({ children }) {
	return (
		<>
			{children}
			<Skeleton width={cardWidth} height={cardHeight} variant="rounded" />
			<Skeleton width={cardWidth} height={cardHeight} variant="rounded" />
			<Skeleton width={cardWidth} height={cardHeight} variant="rounded" />
		</>
	);
}

function ItemStack({ data, path, children, Icon }) {
	return (
		<>
			{children}
			{data.map((item) => (
				<ComplianceItemCard
					key={item.id}
					to={`${path}/${item.id}`}
					title={item.name}
					Icon={Icon}
				/>
			))}
		</>
	);
}

export function ComplianceItemView({ dataPromise, path, Icon, children }) {
	return (
		<Stack direction="row" spacing={2} flexWrap="wrap">
			<Suspense fallback={<ItemSkeletion>{children}</ItemSkeletion>}>
				<Await resolve={dataPromise}>
					{(data) => (
						<ItemStack
							data={data}
							path={path}
							children={children}
							Icon={Icon}
						/>
					)}
				</Await>
			</Suspense>
		</Stack>
	);
}

const Link = styled(
	forwardRef(function Link(itemProps, ref) {
		return <RouterLink ref={ref} {...itemProps} role={undefined} />;
	}),
)(({ theme, variant }) => ({
	display: "flex",
	width: variant === "small" ? 100 : 200,
	height: 100,
	textDecoration: "none",
	padding: theme.spacing(1),
	borderWidth: "thin",
	borderColor: theme.palette.primary.main,
	borderStyle: "solid",
	borderRadius: theme.spacing(1.5),
	color: theme.palette.primary.main,
	"&:hover": {
		backgroundColor: theme.palette.primary.hover,
	},
}));

export function ComplianceItemCard({ to, title, Icon }) {
	Icon ??= TextSnippet;
	return (
		<Link to={to}>
			<Stack width="100%">
				<Box flex={1} alignContent="center">
					<Icon fontSize="large" />
				</Box>
				<Typography noWrap>{title}</Typography>
			</Stack>
		</Link>
	);
}
