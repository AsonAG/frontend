import { TextField, Box } from "@mui/material";
import { FieldContext } from "../EditFieldComponent";
import { useContext, useState, useEffect } from "react";
import { toBase64 } from "../../../../services/converters/BinaryConverter";
import { CloudUpload } from "@mui/icons-material";

export function FieldValueFileComponent() {
  const { field, isReadonly, required, displayName, attachments } = useContext(FieldContext);
  const extensions = field.attributes?.["input.attachmentExtensions"];
  // const required = attributes?.["input.attachment"] === "Mandatory";
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

  const fileUploadId = `fileupload_${field.id}`;
  return (
    <TextField
      label={displayName}
      onChange={handleUpload}
      required={required}
      disabled={isReadonly}
      type="file"
      InputLabelProps={{
        shrink: true
      }}
      inputProps={{
        multiple: true,
        accept: extensions,
        id: fileUploadId,
      }}
      InputProps={{
        startAdornment: 
            <Box component="label" htmlFor={fileUploadId} sx={{paddingLeft: 2, paddingRight: 1.5, display: 'flex', alignContent: 'center', flexWrap: 'wrap', height: "100%", cursor: 'pointer'}}>
              <CloudUpload />
            </Box>,
        classes: {
          adornedStart: "file-upload-adorned-start"
        }
      }}
      
    />
  );
};
