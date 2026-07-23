import type { ActionFunctionArgs } from "react-router-dom";
import { copyWageType } from "../api/FetchClient";

type CopyWageTypeActionRequest = {
	intent: string;
	wageTypeNumber: number;
	copyFromWageTypeNumber: number;
	nameLocalizations: {
		en: string;
		de: string;
		fr: string;
		it: string;
	};
};

export async function wageTypeAction({
	request,
	params,
}: ActionFunctionArgs) {
	const data =
		(await request.json()) as CopyWageTypeActionRequest;

	if (data.intent !== "copyWageType") {
		return {
			error: "Unsupported wage type action.",
		};
	}

	try {
		const response = await copyWageType(
			params,
			data.wageTypeNumber,
			data.copyFromWageTypeNumber,
			data.nameLocalizations,
		);

		if (
			response &&
			typeof response === "object" &&
			"status" in response &&
			Number(response.status) !== 201
		) {
			return {
				error:
					"The maximum number of copies has been reached.",
			};
		}

		return {
			success: true,
		};
	} catch {
		return {
			error:
				"The maximum number of copies has been reached.",
		};
	}
}