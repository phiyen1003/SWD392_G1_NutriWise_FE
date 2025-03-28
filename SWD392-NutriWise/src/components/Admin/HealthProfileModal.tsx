import React from "react";
import { useState, useEffect } from "react";

import { Box, FormControl, FormControlLabel, FormLabel, InputAdornment, Modal, Radio, RadioGroup, TextField, Stack, Button, FormHelperText } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NumberInput } from "@chakra-ui/react";

import { HealthProfileDTO, ProfileDTO } from "../../types/types";
import { createHealthProfile, updateHealthProfile } from "../../api/healthProfileApi";
import { Toast } from "../ToastComponent";

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"

import { SubmitHandler, useForm, Controller } from "react-hook-form";

export default function HealthProfileModal({
    open,
    action,
    profile,
    title,
    handleClose,
    setHealthProfiles }
    : {
        open: boolean,
        action: string,
        profile: ProfileDTO,
        title: string,
        handleClose: () => void,
        setHealthProfiles: React.Dispatch<React.SetStateAction<HealthProfileDTO[]>>
    }) {
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const schema = yup.object().shape({
        email: yup.string().required('Vui lòng nhập email').email('Vui lòng nhập email hợp lệ'),
        username: yup.string().required('Vui lòng nhập username').min(2, 'Username ít nhất 2 chữ cái trở lên'),
        healthProfile: yup.object().shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên').min(5, 'Họ và tên có ít nhất 5 chữ cái trở lên'),
            gender: yup.string().required('Vui lòng chọn giới tính'),
            dateOfBirth: yup.string().required('Vui lòng nhập ngày sinh'),
            height: yup.number().typeError('Vui lòng nhập chiều cao hợp lệ').required('Vui lòng nhập chiều cao').min(80, 'Vui lòng nhập chiều cao hợp lệ').max(250, 'Vui lòng nhập chiều cao hợp lệ'),
            weight: yup.number().typeError('Vui lòng nhập cân nặng hợp lệ').required('Vui lòng nhập cân nặng').min(25, 'Vui lòng nhập cân nặng hợp lệ').max(250, 'Vui lòng nhập cân nặng hợp lệ'),
        })
    })

    type FormData = yup.InferType<typeof schema>

    const { formState: { errors }, register, handleSubmit, control, setValue, reset } = useForm<FormData>({
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (profile) {
            reset({
                ...profile,
                ...profile?.healthProfile,
            } as FormData)
        }
    }, [profile]);

    const onToast = (status: number, open: boolean, info: string) => {
        setStatusCode(status);
        setOpenToast(open);
        setInformation(info);
    };

    const onSubmitModal: SubmitHandler<FormData> = async (formData) => {
        if (!formData) return;

        const profile = formData as ProfileDTO
        setLoading(true);

        try {
            let response: HealthProfileDTO | null = null;

            const profId = profile.healthProfile.healthProfileId;

            if (action === "update") {
                console.log(profile.healthProfile.healthProfileId);
                console.log('log update in health profile modal');
                if (!profId) {
                    throw new Error("Missing healthProfileId for update");
                }
                response = await updateHealthProfile(profId, formData.healthProfile);
            } else if (action === "create") {
                console.log('log create in health profile modal');
                console.log('profile create:', profile);
                response = await createHealthProfile(profile.healthProfile);
            }
            if (response) {
                setHealthProfiles((prev: HealthProfileDTO[]) =>
                    action === "update"
                        ? prev.map((a) => (a?.healthProfileId === profId ? response : a))
                        : [...prev, response]
                );
                onToast(200, true, `Hồ sơ sức khỏe mới đã ${action === "update" ? "cập nhật" : "tạo"} thành công.`);
                handleClose();
            }
        } catch (error) {
            onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý.");
        } finally {
            setLoading(false);
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

            <Modal open={open}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 4, // Increased padding for better spacing
                    minWidth: 400,
                    maxWidth: 600,
                    borderRadius: 2,
                }}>
                    <h2 style={{ marginBottom: "16px" }}>{title}</h2>

                    <form onSubmit={handleSubmit(onSubmitModal)}>
                        <FormControl fullWidth>
                            <Stack spacing={2}> {/* This ensures proper vertical gaps */}
                                <TextField
                                    label="Họ và tên"
                                    {...register('healthProfile.fullName')}
                                    variant="outlined"
                                    error={!!errors.healthProfile?.fullName}
                                    helperText={errors.healthProfile?.fullName?.message}
                                />
                                <Controller
                                    name="healthProfile.gender"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl error={!!errors.healthProfile?.gender}>
                                            <FormLabel>Giới tính</FormLabel>
                                            <RadioGroup
                                                row
                                                value={field.value}
                                                onChange={(event) => setValue('healthProfile.gender', event.target.value)}
                                            >
                                                <FormControlLabel value="male" control={<Radio />} label="Nam" />
                                                <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                                                <FormControlLabel value="other" control={<Radio />} label="Khác" />
                                            </RadioGroup>
                                            <FormHelperText>{errors.healthProfile?.gender?.message}</FormHelperText>
                                        </FormControl>
                                    )}
                                >
                                </Controller>

                                <Controller
                                    name="healthProfile.dateOfBirth"
                                    control={control}
                                    render={({ field }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Ngày đo"
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(date) => setValue("healthProfile.dateOfBirth", date ? date.format('YYYY-MM-DD') : '')}
                                                slotProps={{
                                                    textField: {
                                                        error: !!errors.healthProfile?.dateOfBirth,
                                                        helperText: errors.healthProfile?.dateOfBirth?.message
                                                    }
                                                }}
                                                disableFuture />
                                        </LocalizationProvider>
                                    )}>
                                </Controller>

                                <TextField
                                    label="Cân nặng"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>
                                        }
                                    }}
                                    {...register('healthProfile.weight', { valueAsNumber: true })}
                                    error={!!errors.healthProfile?.weight}
                                    helperText={errors.healthProfile?.weight?.message}
                                />

                                <TextField
                                    label="Chiều cao"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">cm</InputAdornment>
                                        }
                                    }}
                                    {...register('healthProfile.height', { valueAsNumber: true })}
                                    error={!!errors.healthProfile?.height}
                                    helperText={errors.healthProfile?.message}
                                />
                            </Stack>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button variant="outlined" onClick={handleClose}>Hủy</Button>
                                <Button type="submit" variant="contained" color="primary" loading={loading}>Lưu</Button>
                            </Box>
                        </FormControl>
                    </form>
                </Box>
            </Modal>
        </>
    )
}