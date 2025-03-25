import { useEffect, useState } from "react";

import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { Modal, Box, TextField, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { HealthMetricDTO } from "../../types/types";
import { Toast } from "../../components/ToastComponent";

import { createHealthMetric, updateHealthMetric } from "../../api/healthMetricApi";

interface MetricProps {
    profId: number,
    open: boolean,
    metric: HealthMetricDTO,
    handleClose: () => void,
    setMetrics: React.Dispatch<React.SetStateAction<HealthMetricDTO[]>>,
    title: string,
    action: string,
}

const initialState = {
    measurementDate: '',
    bloodPressure: '',
    bmi: 0,
    cholesterol: ''
}

export default function HealthMetricModal({
    profId,
    open,
    metric,
    handleClose,
    setMetrics,
    title,
    action }: MetricProps) {

    const schema = yup.object().shape({
        bmi: yup.number().typeError('BMI phải là số').positive('BMI phải lớn hơn 0').required('Chỉ số BMI không được để trống')
            .min(15, 'Chỉ số BMI hợp lệ từ 15 - 50').max(50, 'Chỉ số BMI hợp lệ từ 15 - 50'),
        bloodPressure: yup.string().required("Huyết áp không được để trống").matches(RegExp(`^\\b(29[0-9]|2[0-9][0-9]|[01]?[0-9][0-9]?)\\/(29[0-9]|2[0-9][0-9]|[01]?[0-9][0-9]?)$`), 'Vui lòng nhập chỉ số huyết áp hợp lệ'),
        cholesterol: yup.number().typeError('Cholesterol phải là số').required("Cholesterol không được để trống").min(50, "Giá trị cholesterol quá thấp")
            .max(500, "Giá trị cholesterol quá cao"),
        measurementDate: yup.string().required("Ngày đo không được để trống"),
    })

    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');
    const { register, handleSubmit, reset, formState: { errors }, control, setValue } = useForm<HealthMetricDTO>({
        resolver: yupResolver(schema),
        defaultValues: initialState
    });

    useEffect(() => {
        if (metric) {
            reset(metric);
        }
    }, [metric, reset]);

    const onToast = (status: number, open: boolean, info: string) => {
        setStatusCode(status);
        setOpenToast(open);
        setInformation(info);
    };

    const onSubmit: SubmitHandler<HealthMetricDTO> = async (formData) => {

        if (!formData) return;

        try {
            let response: HealthMetricDTO | null = null;

            if (action === "update") {
                if (!formData.healthMetricId) {
                    throw new Error("Missing allergenId for update");
                }
                response = await updateHealthMetric(formData.healthMetricId, formData);
            } else if (action === "create") {
                response = await createHealthMetric(formData);
            }

            if (response) {
                setMetrics((prev) =>
                    action === "update"
                        ? prev.map((a) => (a.healthMetricId === formData.healthMetricId ? response : a))
                        : [...prev, response]
                );
                onToast(200, true, `Đã ${action === "update" ? "cập nhật" : "tạo"} thành công.`);
                handleClose();
            }

        } catch (error) {
            onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý");
        }
    }

    return (
        <>

            <Toast
                onClose={() => setOpenToast(false)}
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
                            label="Chỉ số BMI"
                            {...register('bmi')}
                            variant="outlined"
                            margin="normal"
                            error={!!errors.bmi}
                            helperText={errors.bmi?.message}
                        />
                        <TextField
                            fullWidth
                            label="Huyết áp"
                            {...register('bloodPressure')}
                            variant="outlined"
                            margin="normal"
                            error={!!errors.bloodPressure}
                            helperText={errors.bloodPressure?.message}
                        />
                        <TextField
                            fullWidth
                            label="Cholesterol"
                            {...register('cholesterol')}
                            variant="outlined"
                            margin="normal"
                            error={!!errors.cholesterol}
                            helperText={errors.cholesterol?.message}
                        />
                        <Controller
                            name="measurementDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Ngày đo"
                                        // defaultValue={}
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(date) => setValue("measurementDate", date ? date.format('YYYY-MM-DD') : '')}
                                        slotProps={{
                                            textField: {
                                                error: !!errors.measurementDate,
                                                helperText: errors.measurementDate?.message
                                            }
                                        }}
                                        disableFuture />
                                </LocalizationProvider>
                            )}>
                        </Controller>
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