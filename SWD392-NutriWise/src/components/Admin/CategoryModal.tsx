import { Modal, Box, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CategoryDTO } from "../../types/types";
import { createCategory, updateCategory } from "../../api/categoryApi";
import Toast from "../ToastComponent";

const CategoryModal = ({ open, category, handleClose, setCategories, title, action, initialState }: {
    open: boolean, category: CategoryDTO,
    handleClose: () => void, setCategories: React.Dispatch<React.SetStateAction<CategoryDTO[]>>,
    title: string, action: string, initialState: CategoryDTO
}) => {
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');
    const [formData, setFormData] = useState<CategoryDTO>({
        categoryId: 0,
        name: "",
        description: "",
    });

    useEffect(() => {
        if (category) {
            setFormData(category);
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData) return;

        try {
            let response: CategoryDTO = initialState;

            if (action === "update") {
                if (!formData.categoryId) {
                    throw new Error("Missing categoryId for update");
                }
                response = await updateCategory(formData.categoryId, formData);
            } else if (action === "create") {
                response = await createCategory(formData);
            }

            if (response) {
                setCategories((prev) =>
                    action === "update"
                        ? prev.map((a) => (a.categoryId === formData.categoryId ? response : a))
                        : [...prev, response]
                );

                // Hiển thị thông báo thành công
                onToast(200, true, `Danh mục đã ${action === "update" ? "cập nhật" : "tạo"} thành công.`);
                handleClose();
            }
        } catch (error) {
            // Hiển thị thông báo lỗi
            onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý danh mục.");
        }
    };

    const handleCloseToast = () => {
        setOpenToast(false);
    };

    const onToast = (status: number, open: boolean, info: string) => {
        setStatusCode(status);
        setOpenToast(open);
        setInformation(info);
    };

    return (
        <>
            {/* Toast thông báo */}
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
                    <h2>{title}</h2>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Tên danh mục"
                            name="name"
                            value={formData?.name}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            value={formData?.description}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                        />
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button variant="outlined" onClick={handleClose}>Hủy</Button>
                            <Button type="submit" variant="contained" color="primary">Lưu</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default CategoryModal;
