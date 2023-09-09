import { Box, Tooltip } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Markup } from "interweave";


const isHtml = RegExp.prototype.test.bind(/<\/?[a-z][\s\S]*>/i);

export function DescriptionComponent({ description }) {
  
  if (!description) {
    return <div></div>;
  }

  const content = isHtml(description) ? <Markup content={description} /> : <>{description}</>;

  return (
    <Box>
        <Tooltip arrow title={content} placement="top">
          <HelpOutlineOutlinedIcon color="secondary" />
        </Tooltip>
    </Box>
  );
}