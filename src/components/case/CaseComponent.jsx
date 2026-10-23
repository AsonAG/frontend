import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Field } from "./field/Field";

export function CaseComponent({ _case, pt = 0 }) {
	const visibleFields = (_case.fields ?? []).filter(
		(field) => !field.attributes?.["input.hidden"],
	);
	const fieldGroups = groupFields(visibleFields);
	return (
		<Stack component="section" spacing={2} width="100%" pt={pt}>
			<Stack id={_case.name} data-header-jump-anchor>
				<Typography variant="h3" fontWeight="bold" gutterBottom>
					{_case.displayName}
				</Typography>
				<Typography variant="subtitle">{_case.description}</Typography>
			</Stack>
			<Stack spacing={1.5}>
				{fieldGroups.map((group) =>
					group.length === 1 ? (
						<Field key={group[0].id} field={group[0]} />
					) : (
						<FieldGroup key={group[0].id} fields={group} />
					),
				)}
			</Stack>
		</Stack>
	);
}

function FieldGroup({ fields }) {
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down(725));
	return (
		<Stack
			direction={mobile ? "column" : "row"}
			gap={1.5}
			alignItems={mobile ? undefined : "flex-end"}
		>
			{fields.map((field) => (
				<Box key={field.id} flex="1 1 0" minWidth={0}>
					<Field field={field} labelAbove />
				</Box>
			))}
		</Stack>
	);
}

// consecutive fields with the same groupId are rendered in one row.
function groupFields(fields) {
	const groups = [];
	for (const field of fields) {
		const lastGroup = groups.at(-1);
		if (field.groupId && lastGroup?.[0].groupId === field.groupId) {
			lastGroup.push(field);
		} else {
			groups.push([field]);
		}
	}
	return groups;
}
