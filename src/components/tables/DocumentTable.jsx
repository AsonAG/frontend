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
import { React, useEffect, useState } from "react";
import { useAsyncValue, Outlet, useSubmit, Form, useFetcher } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import dayjs from "dayjs";
import { DocumentLink } from "../DocumentLink";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "../ResponsiveDialog";
import { useRole } from "../../hooks/useRole";
import { useIsMobile } from "../../hooks/useIsMobile";

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

const itemSx = {
	pl: 0.5,
	borderRadius: 2,
	"& > button": {
		visibility: "hidden"
	},
	":hover": {
		backgroundColor: (theme) => theme.palette.primary.hover,
		"& > button": {
			visibility: "visible"
		}
	}
};

function CaseValueRow({ caseValue }) {
	const { t } = useTranslation();
	const submit = useSubmit();
	const onDelete = (documentId) => {
		submit(null, {
			method: "delete",
			action: `${caseValue.id}/i/${documentId}`
		});
	};
	const isProviderRole = useRole("provider");
	const isMobile = useIsMobile();
	return (
		<Stack>
			{caseValue.documents.map((document) => (
				<Stack direction="row" alignItems="center" sx={itemSx} key={document.id}>
					<DocumentLink
						name={document.name}
						to={`${caseValue.id}/i/${document.id}`}
						sx={{ flex: 1 }}
					/>
					{isProviderRole && !isMobile &&
						<ResponsiveDialog>
							<ResponsiveDialogTrigger>
								<IconButton size="small">
									<Delete fontSize="small" />
								</IconButton>
							</ResponsiveDialogTrigger>
							<ResponsiveDialogContent>
								<Typography variant="h6">{t("Delete document")}</Typography>
								<Typography>{t("delete_document_text", { documentName: document.name })}</Typography>
								<Stack direction="row" justifyContent="end" spacing={1}>
									<ResponsiveDialogClose>
										<Button>{t("Cancel")}</Button>
									</ResponsiveDialogClose>
									<ResponsiveDialogClose>
										<Button variant="contained" color="destructive" onClick={() => onDelete(document.id)}>{t("Delete")}</Button>
									</ResponsiveDialogClose>
								</Stack>
							</ResponsiveDialogContent>
						</ResponsiveDialog>
					}
				</Stack>
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

const documentLoadSteps = 15;
function DocumentCard({ caseFieldName, displayName }) {
	const fetcher = useFetcher();
	const [open, setOpen] = useState(true);
	const { t } = useTranslation();
	const [top, setTop] = useState(documentLoadSteps);

	const documents = fetcher.data;

	useEffect(() => {
		if (fetcher.state === "idle" && (!fetcher.data || (documents.items.length < top) && (documents.items.length < documents.count))) {
			fetcher.load(`${encodeURIComponent(caseFieldName)}?top=${top}`);
		}
	}, [fetcher, top]);

	if (!documents) {
		return;
	}

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
	const hasMore = documents.items.length !== documents.count;
	function loadMore() {
		setTop((top) => top + documentLoadSteps);
	}

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
						loading={fetcher.state === "loading"}
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
		<Stack alignSelf="stretch">
			<Typography variant="subtitle">{month}</Typography>
			{items.map((caseValue) => (
				<CaseValueRow key={caseValue.id} caseValue={caseValue} />
			))}
		</Stack>
	);
}
