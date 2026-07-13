type RequestContext = {
	url: string;
	method: string;
	headers: Headers;
	searchParams: URLSearchParams;
	routeParams: Record<string, string>;
	body: string | null;
};

export const employeeCasesFilter = (data: unknown, ctx: RequestContext) => data;
export const companyCasesFilter = (data: unknown, ctx: RequestContext) => data;
