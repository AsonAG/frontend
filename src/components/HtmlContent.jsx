import { Box } from "@mui/material";
import { Markup } from "interweave";

const isHtml = RegExp.prototype.test.bind(/<\/?[a-z][\s\S]*>/i);

export function HtmlContent({ content }) {
	return (
		<Box sx={{ wordBreak: "break-word" }}>
			{isHtml(content) ? <Markup content={content} /> : content}
		</Box>
	);
}
