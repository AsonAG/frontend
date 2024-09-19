import {
	AppBar,
	Toolbar,
	Stack,
} from "@mui/material";
import { UserAccountComponent } from "./UserAccountComponent";
import { Suspense } from "react";
import { NewEventCommand } from "../../components/NewEventCommand";
import { useTranslation } from "react-i18next";
import { payrollAtom } from "../../utils/dataAtoms";
import { useAtomValue } from "jotai";
import { DatePicker } from "../../components/DatePicker";
import dayjs from "dayjs";

function Topbar({ children }) {
	return (
		<AppBar
			elevation={0}
			sx={{
				backgroundColor: "background.default",
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<Toolbar
				disableGutters
				sx={{ mx: { sm: 2 }, gap: { xs: 1, sm: 2 } }}
				spacing={1}
			>
				{children}
				<Stack sx={{ flexGrow: 1 }} alignItems="center" justifyContent="center" direction="row">
					<Suspense>
						<OpenPeriod />
					</Suspense>
				</Stack>

				<Stack direction="row" spacing={2.5} alignItems="center">
					<NewEventCommand />
					<Suspense>
						<UserAccountComponent />
					</Suspense>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}

function OpenPeriod() {
	const { t } = useTranslation();
	const payroll = useAtomValue(payrollAtom);
	if (!payroll?.attributes?.["showOpenPeriod"]) {
		return;
	}
	return (
		<>
			<DatePicker
				variant="month-short"
				label={t("Open period")}
				value={dayjs(new Date(2024, 7, 1))}
			/>
		</>
	)

}

export default Topbar;
