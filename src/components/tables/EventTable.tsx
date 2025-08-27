import React, { PropsWithChildren, ReactNode, useMemo, useState } from "react";
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
	TextField,
	InputAdornment,
	Box,
	TooltipProps,
	useMediaQuery,
	Theme,
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { formatCaseValue } from "../../utils/Format";
import { ScrollToTop } from "../ScrollToTop";
import {
	ArrowDropDown,
	Clear,
	ExpandLess,
	ExpandMore,
	MoreVert,
} from "@mui/icons-material";
import { PaginatedContent } from "../PaginatedContent";
import { useSearchParam } from "../../hooks/useSearchParam";
import { IdType } from "../../models/IdType";
import {
	createColumnHelper,
	useReactTable,
	getCoreRowModel,
	flexRender,
	Row,
} from "@tanstack/react-table";
import { TFunction } from "i18next";

const columnHelper = createColumnHelper<EventRow>();

function createColumns(t: TFunction<"translation", undefined>) {
	return [
		columnHelper.accessor("eventName", {
			cell: (name) => name.getValue(),
			header: () => t("Event"),
		}),
		columnHelper.accessor("eventFieldName", {
			cell: (name) => name.getValue(),
			header: () => t("Field"),
		}),
		columnHelper.accessor("value", {
			cell: (value) => value.getValue(),
			header: () => t("Value"),
		}),
		columnHelper.accessor("start", {
			cell: (start) => formatDate(start.getValue()),
			header: t("Start"),
		}),
		columnHelper.accessor("end", {
			cell: (end) => formatDate(end.getValue()),
			header: t("End"),
		}),
		columnHelper.accessor("created", {
			cell: (created) => (
				<span title={formatDate(created.getValue(), true)}>
					{formatDate(created.getValue())}
				</span>
			),
			header: () => (
				<span title={t("Newest events first")}>
					{t("Created")}
					<ArrowDropDown fontSize="16px" />
				</span>
			),
		}),
		{
			id: "expandToggle",
			size: 30,
			cell: ({ row }) => {
				return row.getCanExpand() ? (
					<IconButton onClick={row.getToggleExpandedHandler()} size="small">
						{row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				) : (
					""
				);
			},
		},
	];
}

export function AsyncEventTable() {
	return (
		<>
			<TableSearch />
			<AsyncDataRoute>
				<PaginatedContent>
					<AwaitedEventTable />
				</PaginatedContent>
			</AsyncDataRoute>
		</>
	);
}

function AwaitedEventTable() {
	const { items } = useAsyncValue() as { items: Array<Event> };
	const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up(1000));
	const Content = isDesktop ? EventTable : EventCards;
	return <Content items={items} />;
}

type Event = {
	id: IdType;
	caseName: string;
	created: Date;
	cancellationId: IdType;
	cancallationDate: Date;
	values: Array<EventValue>;
};

type EventValue = {
	id: IdType;
	caseFieldName: string;
	valueType: string;
	value: string;
	numericValue: number | null;
	start: Date;
	end: Date;
	attributes: any;
};

type EventRow = {
	id: IdType;
	eventName?: string;
	eventFieldName?: string;
	value?: string;
	start?: Date;
	end?: Date;
	created?: Date;
	type?: string;
	subRows?: Array<EventRow>;
};

let reentry = false;
// invert the logic so that all rows are expanded by default
// setting expanded actually hides the row
// we do this because having an initialState {expanded: true} only works as long as the state does not change.
// If we change the state and load another page, all rows will be collapsed.
// Manually managing the state will lead to more unnecessary rerenders.
function getIsRowExpanded(row: Row<EventRow>) {
	if (reentry)
		// returning undefined "tricks" the table into not calling getIsRowExpanded anymore but use its builtin logic
		return undefined;

	reentry = true;
	try {
		return !row.getIsExpanded();
	} finally {
		reentry = false;
	}
}

type EventDisplayProps = {
	items: Array<Event>;
};

export function EventTable({ items: events }: EventDisplayProps) {
	const { t } = useTranslation();
	const e: Array<EventRow> = useMemo(
		() =>
			events.map((event) => ({
				id: event.id,
				eventName: event.caseName,
				created: event.created,
				subRows: event.values.map((v) => ({
					id: v.id,
					eventFieldName: v.caseFieldName,
					value: formatCaseValue(v, t),
					start: v.start,
					end: v.end,
				})),
			})),
		[events],
	);
	const columns = useMemo(() => createColumns(t), [t]);
	const table = useReactTable({
		columns: columns,
		data: e,
		//@ts-ignore -- hack around table
		getIsRowExpanded,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (originalRow) => originalRow.id,
		getSubRows: (row) => row.subRows,
	});
	return (
		<>
			<Stack>
				{table.getHeaderGroups().map((headerGroup) => (
					<Row key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<Typography fontWeight="bold" key={header.id} sx={{ p: 0.5 }}>
								{flexRender(
									header.column.columnDef.header,
									header.getContext(),
								)}
							</Typography>
						))}
					</Row>
				))}
				<Stack
					sx={{
						"& > div:nth-of-type(even)": {
							backgroundColor: (theme) => theme.palette.primary.hover,
						},
					}}
				>
					{table.getRowModel().rows.map((row) => (
						<Row key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<Box key={cell.id} sx={{ p: 0.5 }}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Box>
							))}
							{row.getIsExpanded() &&
								row.subRows.flatMap((subRow) =>
									subRow.getVisibleCells().map((cell) => (
										<Box key={cell.id} sx={{ p: 0.5 }}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</Box>
									)),
								)}
						</Row>
					))}
				</Stack>
			</Stack>
			<ScrollToTop />
		</>
	);
}

function Row({ children }: PropsWithChildren) {
	return (
		<Box
			display="grid"
			gridTemplateColumns="1fr 1fr 1fr 75px 75px 75px 40px"
			gridTemplateRows="auto"
			alignItems="start"
		>
			{children}
		</Box>
	);
}

function TableSearch() {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useSearchParam("q", {
		replace: true,
		exclusive: true,
	});
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	const onChange = (event) => {
		const updatedValue = event.target.value;
		setLocalSearchTerm(updatedValue);
	};

	const onClear = () => {
		setLocalSearchTerm("");
		setSearchTerm("");
	};

	const onSubmit = (event) => {
		setSearchTerm(localSearchTerm);
		event.preventDefault();
	};

	let clearButton: ReactNode | null = null;
	if (searchTerm) {
		clearButton = (
			<InputAdornment position="end">
				<IconButton onClick={onClear}>
					<Clear />
				</IconButton>
			</InputAdornment>
		);
	}

	return (
		<form onSubmit={onSubmit}>
			<TextField
				fullWidth
				variant="outlined"
				placeholder={t("Search in Event, Field or Value")}
				onChange={onChange}
				value={localSearchTerm}
				slotProps={{
					input: {
						endAdornment: clearButton,
					},
				}}
			/>
		</form>
	);
}

function EventCards({ items: events }: EventDisplayProps) {
	return (
		<>
			<Stack spacing={3}>
				{events.map((caseChange) => (
					<CaseChange
						key={caseChange.id}
						caseChange={caseChange}
						variant="mobile"
					/>
				))}
			</Stack>
			<ScrollToTop />
		</>
	);
}

const tooltipProps: Omit<TooltipProps, "children" | "title"> = {
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
