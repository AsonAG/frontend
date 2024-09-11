import { React, useState } from "react";
import { useAsyncValue } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Stack,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
	TextField,
	InputAdornment
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { formatCaseValue } from "../../utils/Format";
import { ScrollToTop } from "../ScrollToTop";
import { Clear, MoreVert } from "@mui/icons-material";
import { PaginatedContent } from "../PaginatedContent";
import { useSearchParam } from "../../hooks/useSearchParam";

export function AsyncEventTable() {
	return <>
		<TableSearch />
		<AsyncDataRoute>
			<PaginatedContent>
				<EventTable />
			</PaginatedContent>
		</AsyncDataRoute>
	</>;
}

function EventTable() {
	const { items: events } = useAsyncValue();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const variant = isMobile ? "mobile" : "standard";
	return (
		<>
			<Stack spacing={3}>
				{events.map((caseChange) => (
					<CaseChange
						key={caseChange.id}
						caseChange={caseChange}
						variant={variant}
					/>
				))}
			</Stack>
			<ScrollToTop />
		</>
	);
}

function TableSearch() {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useSearchParam("q", {
		replace: true,
		exclusive: true
	});
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	const onChange = (event) => {
		const updatedValue = event.target.value;
		setLocalSearchTerm(updatedValue);
	};

	const onClear = () => {
		setLocalSearchTerm("");
		setSearchTerm("");
	}

	const onSubmit = (event) => {
		setSearchTerm(localSearchTerm);
		event.preventDefault();
	};

	let clearButton = null;
	if (searchTerm) {
		clearButton = (
			<InputAdornment position="end">
				<IconButton onClick={onClear}>
					<Clear />
				</IconButton>
			</InputAdornment>
		)
	}

	return (
		<form onSubmit={onSubmit}>
			<TextField
				fullWidth
				variant="outlined"
				placeholder={t("Search")}
				onChange={onChange}
				value={localSearchTerm}
				InputProps={{
					endAdornment: clearButton,
				}}
			/>
		</form>
	);
}

const tooltipProps = {
	placement: "bottom-start",
	slotProps: {
		popper: {
			modifiers: [
				{
					name: "offset",
					options: {
						offset: [0, -14],
					},
				},
			],
		},
	},
};

function CaseChange({ caseChange, variant }) {
	const { t } = useTranslation();
	const valueAndDateStackDirection = variant === "mobile" ? "column" : "row";
	return (
		<Stack>
			<Card>
				<CardHeader
					action={
						<IconButton>
							<MoreVert />
						</IconButton>
					}
					title={caseChange.caseName}
					titleTypographyProps={{ variant: "h6" }}
					subheader={
						<Tooltip title={t("Created")} {...tooltipProps}>
							<Typography>{formatDate(caseChange.created, true)}</Typography>
						</Tooltip>
					}
				/>
				<CardContent>
					<Stack spacing={1}>
						{caseChange.values.map((event) => {
							return (
								<Stack key={event.id} spacing={0.5}>
									<Typography fontWeight={500}>
										{event.caseFieldName}
									</Typography>
									<Stack direction={valueAndDateStackDirection} spacing={0.5}>
										<Typography flex={1}>
											{formatCaseValue(event, t)}
										</Typography>
										<Stack direction="row" spacing={0.5}>
											<Tooltip title={t("Start")} {...tooltipProps}>
												<Typography>{formatDate(event.start)}</Typography>
											</Tooltip>
											{event.end && (
												<>
													-
													<Tooltip title={t("End")} {...tooltipProps}>
														<Typography>{formatDate(event.end)}</Typography>
													</Tooltip>
												</>
											)}
										</Stack>
									</Stack>
								</Stack>
							);
						})}
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}
