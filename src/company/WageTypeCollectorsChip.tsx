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
import { useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { WageType } from "../models/WageType";
import { WageTypeContext } from "./WageTypeControlling";

export function WageTypeCollectorsChip({ wageType }: { wageType: WageType }) {
	const { t } = useTranslation();
	const { state, dispatch } = useContext(WageTypeContext);
	const currentWageType =
		state.wageTypesByNumber[wageType.wageTypeNumber.toString()] ?? wageType;
	const collectors = currentWageType.collectors;

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
													wageTypeNumber: currentWageType.wageTypeNumber,
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
}
