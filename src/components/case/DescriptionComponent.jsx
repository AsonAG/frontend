import { Tooltip } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { HtmlContent } from "../HtmlContent";




export function DescriptionComponent({ description }) {
  
  if (!description) {
    return <div></div>;
  }

  return (
    <Tooltip arrow title={<HtmlContent content={description} />} placement="top">
      <HelpOutlineOutlinedIcon color="disabled" />
    </Tooltip>
  );
}