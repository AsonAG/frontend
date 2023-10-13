import { Markup } from "interweave";

const isHtml = RegExp.prototype.test.bind(/<\/?[a-z][\s\S]*>/i);

export function HtmlContent({content}) {
  return isHtml(content) ? <Markup content={content} /> : content;
}