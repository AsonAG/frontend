import { Edit } from "@mui/icons-material";
import {
	Chip,
	ClickAwayListener,
	Fade,
	Paper,
	Popper,
	Stack,
	Typography,
} from "@mui/material";
import { memo, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { WageType } from "../models/WageType";
import { useWageTypeDispatch } from "./WageTypeList";

export const WageTypeCollectorsChip = memo(function WageTypeCollectorsChip({
	wageType,
}: {
	wageType: WageType;
}) {
	const { t } = useTranslation();
	const dispatch = useWageTypeDispatch();
	// wageType comes from row.original, which already has the pending changes applied.
	const collectors = wageType.collectors;

	const anchorRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	const activeCount = useMemo(
		() => collectors.filter((collector) => collector.isActive).length,
		[collectors],
	);
	const hasChangeableCollectors = useMemo(
		() => collectors.some((collector) => collector.isChangeable),
		[collectors],
	);

	if (collectors.length === 0) {
		return null;
	}

	return (
		<>
			<Chip
				ref={anchorRef}
				size="small"
				onClick={() => setOpen((current) => !current)}
				label={
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<Typography variant="body2" component="span" noWrap>
							{t("{{count}} active", { count: activeCount })}
						</Typography>
						{hasChangeableCollectors && <Edit sx={{ fontSize: 14 }} />}
					</Stack>
				}
			/>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				placement="bottom"
				transition
				sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
			>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={150}>
						<Paper elevation={4} sx={{ p: 1, maxWidth: 350 }}>
							<ClickAwayListener onClickAway={() => setOpen(false)}>
								<Stack direction="row" flexWrap="wrap" gap={1}>
									{collectors.map((collector) => (
										<Chip
											key={collector.name}
											label={collector.displayName}
											color={collector.isActive ? "primary" : "default"}
											variant={collector.isActive ? "filled" : "outlined"}
											disabled={!collector.isChangeable}
											size="small"
											onClick={() =>
												dispatch({
													type: "set_collector_active",
													wageTypeNumber: wageType.wageTypeNumber,
													collectorName: collector.name,
													isActive: !collector.isActive,
												})
											}
										/>
									))}
								</Stack>
							</ClickAwayListener>
						</Paper>
					</Fade>
				)}
			</Popper>
		</>
	);
});
