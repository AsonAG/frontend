import { Tooltip } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Markup } from "interweave";


const isHtml = RegExp.prototype.test.bind(/<\/?[a-z][\s\S]*>/i);

export function DescriptionComponent({ description }) {
  
  if (!description) {
    return <div></div>;
  }

  const content = isHtml(description) ? <Markup content={description} /> : description;

  return (
    <Tooltip arrow title={content} placement="top">
      <HelpOutlineOutlinedIcon color="disabled" />
    </Tooltip>
  );
}