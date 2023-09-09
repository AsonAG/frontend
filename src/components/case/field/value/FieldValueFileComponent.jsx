import { TextField } from "@mui/material";
// import { Box, Button, Stack, Typography, Chip, InputLabel, FormControl, OutlinedInput } from "@mui/material";
import { FieldContext } from "../FieldComponent";
import { useContext, useState, useEffect } from "react";
import { toBase64 } from "../../../../services/converters/BinaryConverter";


function FieldValueFileComponent() {
  const { field, isReadonly, displayName, attachments } = useContext(FieldContext);
  const extensions = field.attributes?.["input.attachmentExtensions"];
  // const required = attributes?.["input.attachment"] === "Mandatory";
  const required = true;
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  useEffect(() => {
    attachments[field.id] = attachmentFiles;
  }, [attachmentFiles]);

  const handleUpload = async (event) => {
    const files = event.target.files;
    const attachments = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await toBase64(file);
      attachments.push({
        name: file.name,
        contentType: file.type,
        content: data
      });
    }

    setAttachmentFiles(attachments);
  };

  return (
    <TextField
      label={displayName}
      onChange={handleUpload}
      required
      disabled={isReadonly}
      type="file"
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        multiple: true,
        accept: extensions
      }}
    />
  );
};
export default FieldValueFileComponent;
