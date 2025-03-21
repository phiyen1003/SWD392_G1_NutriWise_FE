// src/components/Admin/ModalForm.tsx
import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import Toast from "../ToastComponent";

// Loại bỏ export { FieldConfig } nếu đã có export interface
export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: any;
}

interface ModalFormProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  action: "create" | "update";
  initialData?: any;
  fields: FieldConfig[];
  onSubmit: (data: any) => Promise<any>;
  onSuccess: (data: any) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
  open,
  handleClose,
  title,
  action,
  initialData,
  fields,
  onSubmit,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const initialFormData: any = {};
      fields.forEach((field) => {
        initialFormData[field.name] = field.value || "";
      });
      setFormData(initialFormData);
    }
  }, [initialData, fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  const onToast = (status: number, open: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(open);
    setInformation(info);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = fields
      .filter((field) => field.required && !formData[field.name])
      .map((field) => field.label);
    if (missingFields.length > 0) {
      onToast(400, true, `Vui lòng điền các trường bắt buộc: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const response = await onSubmit(formData);
      if (response) {
        onSuccess(response);
        onToast(200, true, `Thành phần đã ${action === "update" ? "cập nhật" : "tạo"} thành công.`);
        handleClose();
      }
    } catch (error) {
      onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý.");
    }
  };

  return (
    <>
      <Toast
        onClose={handleCloseToast}
        information={information}
        open={openToast}
        statusCode={statusCode}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 3,
            minWidth: 400,
            maxWidth: 600,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <TextField
                key={field.name}
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={formData[field.name] || ""}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required={field.required}
              />
            ))}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Lưu
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ModalForm;
// Không cần export { FieldConfig } nữa vì đã export trực tiếp qua interface