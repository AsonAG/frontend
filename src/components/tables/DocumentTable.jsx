import {
	Divider,
	Stack,
	Typography,
	IconButton,
	Button,
	Paper,
	Collapse,
	CircularProgress,
} from "@mui/material";
import { React, useState } from "react";
import { useAsyncValue, Outlet } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useTranslation } from "react-i18next";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import dayjs from "dayjs";
import { DocumentLink } from "../DocumentLink";

export function AsyncDocumentTable() {
	return (
		<AsyncDataRoute>
			<DocumentTable />
		</AsyncDataRoute>
	);
}

function DocumentTable() {
	const caseFields = useAsyncValue();

	return (
		<>
			<Stack spacing={3} pb={3}>
				{caseFields.map((caseField) => (
					<DocumentCard
						key={caseField.id}
						caseFieldName={caseField.name}
						displayName={caseField.displayName}
					/>
				))}
			</Stack>
			<Outlet />
		</>
	);
}

function CaseValueRow({ caseValue }) {
	return (
		<Stack pl={0.5}>
			{caseValue.documents.map((document) => (
				<DocumentLink
					key={document.id}
					name={document.name}
					to={`${caseValue.id}/i/${document.id}`}
				/>
			))}
		</Stack>
	);
}

function LoadDocumentsButton({ loading, hasMore, onClick, allLoadedText, sx }) {
	const { t } = useTranslation();
	const text = loading ? "Loading..." : hasMore ? "Load more" : allLoadedText;

	return (
		<Button
			disabled={loading || !hasMore}
			startIcon={
				loading && (
					<CircularProgress
						size="1rem"
						sx={{ color: (theme) => theme.palette.text.disabled }}
					/>
				)
			}
			onClick={onClick}
			sx={sx}
		>
			{t(text)}
		</Button>
	);
}

function DocumentCard({ caseFieldName, displayName }) {
	const [open, setOpen] = useState(true);
	const { documents, loading, hasMore, loadMore } = useDocuments(caseFieldName);
	const { t } = useTranslation();
	const onClick = () => setOpen((o) => !o);
	const groupedDocuments = Object.groupBy(documents.items, ({ start }) => {
		const date = dayjs.utc(start);
		return date.isValid() ? date.format("MMMM YYYY") : t("Without date");
	});
	const entries = Object.entries(groupedDocuments);
	const allLoadedText =
		documents.items.length === 0
			? "No documents available"
			: "Showing all documents";

	return (
		<Paper>
			<Stack>
				<Stack
					direction="row"
					alignItems="center"
					sx={{ pl: 2, pr: 1, py: 1 }}
					spacing={2}
				>
					<Typography variant="h6" flex={1}>
						{displayName}
					</Typography>
					<IconButton onClick={onClick}>
						{open ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				</Stack>
				<Collapse in={open} mountOnEnter>
					<Divider />
					{entries.length > 0 && (
						<Stack sx={{ px: 2, pt: 2 }} spacing={1} alignItems="start">
							{entries.map(([key, values]) => (
								<DocumentMonthGroup key={key} month={key} items={values} />
							))}
						</Stack>
					)}
					<LoadDocumentsButton
						loading={loading}
						hasMore={hasMore}
						onClick={loadMore}
						allLoadedText={allLoadedText}
						sx={{ m: 1 }}
					/>
				</Collapse>
			</Stack>
		</Paper>
	);
}

function DocumentMonthGroup({ month, items }) {
	return (
		<Stack>
			<Typography variant="subtitle">{month}</Typography>
			{items.map((caseValue) => (
				<CaseValueRow key={caseValue.id} caseValue={caseValue} />
			))}
		</Stack>
	);
}
