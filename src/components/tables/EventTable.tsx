import React, { Fragment, ReactNode, useMemo, useState } from "react";
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
	Theme
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { formatCaseValue } from "../../utils/Format";
import { ScrollToTop } from "../ScrollToTop";
import { Clear, ExpandLess, ExpandMore, MoreVert } from "@mui/icons-material";
import { PaginatedContent } from "../PaginatedContent";
import { useSearchParam } from "../../hooks/useSearchParam";
import { IdType } from "../../models/IdType";
import { createColumnHelper, useReactTable, getCoreRowModel, getExpandedRowModel, flexRender, ExpandedState } from "@tanstack/react-table";
import i18next from "i18next";


const columnHelper = createColumnHelper<EventRow>();


const defaultColumns = [
	columnHelper.accessor("eventName",
		{
			cell: name => name.getValue(),
			header: () => i18next.t("Event")
		}),
	columnHelper.accessor("eventFieldName",
		{
			cell: name => name.getValue(),
			header: () => i18next.t("Field")
		}),
	columnHelper.accessor("value",
		{
			cell: value => value.getValue(),
			header: () => i18next.t("Value")
		}),
	columnHelper.accessor("start",
		{
			cell: start => formatDate(start.getValue()),
			header: i18next.t("Start")
		}),
	columnHelper.accessor("end",
		{
			cell: end => formatDate(end.getValue()),
			header: i18next.t("End")
		}),
	columnHelper.accessor("created",
		{
			cell: created => formatDate(created.getValue(), true),
			header: i18next.t("Created")
		}),
	columnHelper.accessor("type",
		{
			cell: attr => attr.getValue(),
			header: i18next.t("Type")
		}),
	{
		id: "expandToggle",
		size: 30,
		cell: ({ row }) => {
			return row.getCanExpand() ?
				<IconButton onClick={row.getToggleExpandedHandler()} size="small">
					{row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
				: "";
		}
	},
];

export function AsyncEventTable() {
	const isDesktop = useMediaQuery<Theme>(theme => theme.breakpoints.up(1000));
	const Content = isDesktop ? EventTable : EventCards;
	return <>
		<TableSearch />
		<AsyncDataRoute>
			<PaginatedContent>
				<Content />
			</PaginatedContent>
		</AsyncDataRoute>
	</>;
}


type Event = {
	id: IdType
	caseName: string
	created: Date
	cancellationId: IdType
	cancallationDate: Date
	values: Array<EventValue>
}

type EventValue = {
	id: IdType
	caseFieldName: string
	valueType: string
	value: string
	numericValue: number | null
	start: Date
	end: Date
	attributes: any
}

type EventRow = {
	id: IdType
	eventName?: string
	eventFieldName?: string
	value?: string
	start?: Date
	end?: Date
	created?: Date
	type?: string
	subRows?: Array<EventRow>
}

function EventTable() {
	const { t } = useTranslation();
	const { items: events } = useAsyncValue() as { items: Array<Event> };
	const e: Array<EventRow> = useMemo(() => events.map(event => ({
		id: event.id,
		eventName: event.caseName,
		created: event.created,
		subRows: event.values.map(v => (
			{
				id: v.id,
				eventFieldName: v.caseFieldName,
				value: formatCaseValue(v, t),
				start: v.start,
				end: v.end
			}))
	})), [events]);
	const alternatingIds = useMemo(() => events.filter((_, index) => index % 2 === 1).map(event => event.id), [events]);
	const table = useReactTable({
		columns: defaultColumns,
		data: e,
		initialState: {
			expanded: true,
		},
		// autoResetExpanded: false,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getRowId: originalRow => originalRow.id,
		getSubRows: (row) => row.subRows
	});
	return (
		<>
			<Box display="grid" gridTemplateColumns="1fr 1fr 1fr 75px 75px 120px 105px auto" gridTemplateRows="auto">
				{table.getHeaderGroups().map(headerGroup => (
					<Fragment key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<Typography fontWeight="bold" key={header.id} sx={{ gridRow: 1, p: 0.5 }}>
								{flexRender(
									header.column.columnDef.header,
									header.getContext())
								}
							</Typography>
						))}
					</Fragment>
				))}
				{table.getRowModel().rows.map((row, rowIndex) => (
					<Fragment key={row.id}>
						{row.getVisibleCells().map((cell, index) => (
							<Box key={cell.id} sx={{ gridRow: 2 + rowIndex, gridColumn: 1 + index, p: 0.5 }}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Box>
						))}
						{!row.parentId &&
							<Box component="span" sx={{
								gridRowStart: rowIndex + 2,
								gridRowEnd: `span ${(row.getIsExpanded() ? row.subRows?.length ?? 0 : 0) + 1}`,
								gridColumnStart: 1,
								gridColumnEnd: "span 8",
								backgroundColor: theme => alternatingIds.includes(row.parentId ?? row.id) ? theme.palette.primary.hover : undefined
							}} />
						}
					</Fragment>
				))}
			</Box >
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

	let clearButton: ReactNode | null = null;
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
				slotProps={{
					input: {
						endAdornment: clearButton,
					}
				}}
			/>
		</form>
	);
}


function EventCards() {
	const { items: events } = useAsyncValue();
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
