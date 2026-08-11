import type { ActionFunctionArgs } from "react-router-dom";
import {
	activateWageType,
	copyWageType,
	updatePayrollWageTypes,
} from "../api/FetchClient";
import { WageType, WageTypeNameLocalizations } from "../models/WageType";
import { WageTypeUpdate } from "../models/WageTypeUpdate";

type WageTypeActionRequest =
	| {
			intent: "copyWageType";
			wageTypeNumber: number;
			copyFromWageTypeNumber: number;
			nameLocalizations: WageTypeNameLocalizations;
	  }
	| {
			intent: "updateWageType";
			wageType: WageType;
	  }
	| {
			intent: "updateWageTypes";
			wageTypes: WageTypeUpdate[];
	  }
	| {
			intent: "activateWageType";
			wageTypeNumber: number;
	  };

export async function wageTypeAction({
	request,
	params,
}: ActionFunctionArgs) {
	const data = (await request.json()) as WageTypeActionRequest;

	try {
		switch (data.intent) {
			case "copyWageType": {
				const response = await copyWageType(
					params,
					data.wageTypeNumber,
					data.copyFromWageTypeNumber,
					data.nameLocalizations,
				);
				return createActionResult("copyWageType", response, 201);
			}
			case "updateWageType": {
				const response = await updatePayrollWageTypes(params, [data.wageType]);
				return createActionResult("updateWageType", response);
			}
			case "updateWageTypes": {
				const response = await updatePayrollWageTypes(params, data.wageTypes);
				return createActionResult("updateWageTypes", response);
			}
			case "activateWageType": {
				const response = await activateWageType(params, data.wageTypeNumber);
				return createActionResult("activateWageType", response);
			}
		}
	} catch (error) {
		console.error("Wage type action failed", error);
		return {
			intent: data.intent,
			error: "Action failed",
		};
	}
}

function createActionResult(
	intent: WageTypeActionRequest["intent"],
	response: unknown,
	expectedStatus?: number,
) {
	const status =
		response && typeof response === "object" && "status" in response
			? Number(response.status)
			: undefined;
	const ok =
		response && typeof response === "object" && "ok" in response
			? Boolean(response.ok)
			: expectedStatus === undefined || status === expectedStatus;

	return ok
		? { intent, success: true }
		: { intent, error: "Action failed" };
}
