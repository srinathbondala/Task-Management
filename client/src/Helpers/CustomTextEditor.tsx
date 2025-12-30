import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";
import '../App.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
  fullWidth?: boolean;
  readOnly?: boolean;
  toolbarOptions?: any; // optional custom toolbar config
}

const CustomTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Write something...",
  minHeight = "100px",
  fullWidth = true,
  readOnly = false,
  toolbarOptions,
}) => {
  const defaultModules = {
    toolbar: toolbarOptions || [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["undo", "redo", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
  ];

  return (
    <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
      )}
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={defaultModules}
        formats={formats}
        readOnly={readOnly}
        style={{
          minHeight,
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 0 3px rgba(0,0,0,0.1)",
        }}
      />
    </Box>
  );
};

export default CustomTextEditor;
