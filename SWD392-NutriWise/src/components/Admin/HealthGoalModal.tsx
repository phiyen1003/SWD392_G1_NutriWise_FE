import { createHealthGoal, updateHealthGoal } from "../../api/healthGoalApi";
import { HealthGoalDTO } from "@/types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup'
import { Modal, Box, TextField, Button } from "@mui/material";
import { Toast } from "../ToastComponent";

interface HealthGoalProps {
    open: boolean,
    goal: HealthGoalDTO,
    handleClose: () => void,
    setGoals: React.Dispatch<React.SetStateAction<HealthGoalDTO[]>>,
    title: string,
    action: string,
}

const initialState: HealthGoalDTO = {
    healthGoalId: 0,
    description: '',
    name: ''
}

export default function HealthGoalModal({ open, goal, handleClose, setGoals, title, action }: HealthGoalProps) {
    const schema = yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên mục tiêu').min(5, 'Ký tự từ 5 - 50').max(50, 'Ký tự từ 5 - 50'),
        description: yup.string().required('Vui lòng không để trống phần mô tả').min(10, 'Ký tự từ 10 trở lên')
    });

    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<HealthGoalDTO>({
        defaultValues: initialState,
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (goal) {
            reset(goal);
        }
    }, [goal, reset])

    const handleCloseToast = () => {
        setOpenToast(false);
    };

    const onToast = (status: number, open: boolean, info: string) => {
        setStatusCode(status);
        setOpenToast(open);
        setInformation(info);
    };

    const onSubmit: SubmitHandler<HealthGoalDTO> = async (formData) => {

        if (!formData) return;

        try {
            let response: HealthGoalDTO | null = null;

            if (action === "update") {
                if (!formData.healthGoalId) {
                    throw new Error("Missing goalId for update");
                }
                response = await updateHealthGoal(formData.healthGoalId, formData);
            } else if (action === "create") {
                response = await createHealthGoal(formData);
            }

            if (response) {
                setGoals((prev) =>
                    action === "update"
                        ? prev.map((a) => (a.healthGoalId === formData.healthGoalId ? response : a))
                        : [...prev, response]
                );
                onToast(200, true, `Thành phần dị ứng mới đã ${action === "update" ? "cập nhật" : "tạo"} thành công.`);
                handleClose();
            }

        } catch (error) {
            onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý thành phần dị ứng.");
        }
    }

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
                aria-describedby="modal-modal-description">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // Centers the modal
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 3, // Padding inside the modal
                        minWidth: 400, // Ensures the modal is wide enough for the form
                        maxWidth: 600, // Prevents it from being too large
                        borderRadius: 2, // Adds rounded corners
                    }}
                >
                    <h2>{title}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            label="Tên thành phần"
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
    )
}