import { Modal, Box, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CategoryDTO } from "../../types/types";
import { createCategory, updateCategory } from "../../api/categoryApi";
import { Toast } from "../ToastComponent";
import * as yup from 'yup';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface CategoryProps {
    open: boolean,
    category: CategoryDTO,
    handleClose: () => void,
    setCategories: React.Dispatch<React.SetStateAction<CategoryDTO[]>>,
    title: string,
    action: string,
    initialState: CategoryDTO
}

const CategoryModal = ({ open, category, handleClose, setCategories, title, action, initialState }: CategoryProps) => {
    const schema = yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên danh mục').min(2, 'Tên danh mục có số ký tự từ 2 - 50')
        .max(50, 'Tên danh mục có số ký tự từ 2 - 50'),
        description: yup.string().required('Vui lòng nhập mô tả').min(10, 'Mô tả có số ký tự từ 10 trở lên')
    })
    
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');

    const { register, reset, formState: { errors }, handleSubmit } = useForm<CategoryDTO>({
        defaultValues: {
            categoryId: 0,
            name: "",
            description: "",
        },
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (category) {
            reset(category);
        }
    }, [category]);

    const onSubmit: SubmitHandler<CategoryDTO> = async (formData) => {
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Tên danh mục"
                            {...register('name')}
                            variant="outlined"
                            margin="normal"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            {...register('description')}
                            variant="outlined"
                            margin="normal"
                            error={!!errors.description}
                            helperText={errors.description?.message}
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
