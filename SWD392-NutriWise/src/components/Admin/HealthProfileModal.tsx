import React from "react";
import { useState, useEffect } from "react";

import { Box, FormControl, FormControlLabel, FormLabel, InputAdornment, Modal, Radio, RadioGroup, TextField, Stack, Button, FormHelperText } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { HealthProfileDTO } from "../../types/types";
import { createHealthProfile, updateHealthProfile } from "../../api/healthProfileApi";
import { Toast } from "../ToastComponent";

interface Error {
    errorHeight?: boolean,
    errorWeight?: boolean,
    errorGender?: boolean,
    helperTextGender?: string,
    helperTextHeight?: string,
    helperTextWeight?: string
}

export default function HealthProfileModal({
    open,
    action,
    healthProfile,
    title,
    handleClose,
    setHealthProfiles }
    : {
        open: boolean,
        action: string,
        healthProfile: HealthProfileDTO,
        title: string,
        handleClose: () => void,
        setHealthProfiles: React.Dispatch<React.SetStateAction<HealthProfileDTO[]>>
    }) {
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');

    const [error, setError] = useState<Error | null>({
        errorHeight: false,
        errorWeight: false,
        errorGender: false,
        helperTextGender: '',
        helperTextHeight: '',
        helperTextWeight: ''
    })

    const [formData, setFormData] = useState<HealthProfileDTO>({
        healthProfileId: 0,
        fullName: '',
        gender: '',
        dateOfBirth: null,
        height: 0,
        weight: 0
    });

    useEffect(() => {
        if (healthProfile) {
            setFormData(healthProfile);
        }
    }, [healthProfile]);

    const onToast = (status: number, open: boolean, info: string) => {
        setStatusCode(status);
        setOpenToast(open);
        setInformation(info);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (date: Dayjs | null) => {
        setFormData((prev) => ({ ...prev, dateOfBirth: date ? date.format("YYYY-MM-DD") : null }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData) return;

        try {
            let response: HealthProfileDTO | null = null;

            if (formData.gender === '') {
                setError({
                    ...error,
                    errorGender: true,
                    helperTextGender: 'Vui lòng chọn giới tính'
                });
            }
            else if (formData.height <= 0) {
                setError({
                    ...error,
                    errorHeight: true,
                    helperTextHeight: 'Vui lòng nhập chiều cao hợp lệ'
                });
            }
            else if (formData.weight <= 0) {
                setError({
                    ...error,
                    errorWeight: true,
                    helperTextWeight: 'Vui lòng nhập cân nặng hợp lệ'
                });
            }
            else if (action === "update") {
                if (!formData.healthProfileId) {
                    throw new Error("Missing healthProfileId for update");
                }
                response = await updateHealthProfile(formData.healthProfileId, formData);
            } else if (action === "create") {
                response = await createHealthProfile(formData);
            }
            if (response) {
                setError(null)
                setHealthProfiles((prev: HealthProfileDTO[]) =>
                    action === "update"
                        ? prev.map((a) => (a.healthProfileId === formData.healthProfileId ? response : a))
                        : [...prev, response]
                );
                onToast(200, true, `Hồ sơ sức khỏe mới đã ${action === "update" ? "cập nhật" : "tạo"} thành công.`);
                handleClose();
            }
        } catch (error) {
            onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý.");
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

                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <Stack spacing={2}> {/* This ensures proper vertical gaps */}
                                <TextField
                                    label="Họ và tên"
                                    name="fullName"
                                    variant="outlined"
                                    value={formData.fullName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    required
                                />
                                <FormControl error={error?.errorGender}>
                                    <FormLabel>Giới tính</FormLabel>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}>
                                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                                        <FormControlLabel value="other" control={<Radio />} label="Khác" />
                                    </RadioGroup>
                                    <FormHelperText>{error?.helperTextGender}</FormHelperText>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Ngày sinh"
                                        defaultValue={dayjs(new Date())}
                                        value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                                        onChange={handleDateChange} />
                                </LocalizationProvider>

                                <TextField
                                    label="Cân nặng"
                                    name="weight"
                                    variant="outlined"
                                    type="number"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>
                                        }
                                    }}
                                    value={formData.weight}
                                    onChange={handleChange}
                                    error={error?.errorWeight}
                                    helperText={error?.helperTextWeight}
                                />

                                <TextField
                                    label="Chiều cao"
                                    name="height"
                                    variant="outlined"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">cm</InputAdornment>
                                        }
                                    }}
                                    value={formData.height}
                                    onChange={handleChange}
                                    error={error?.errorHeight}
                                    helperText={error?.helperTextHeight}
                                />
                            </Stack>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button variant="outlined" onClick={handleClose}>Hủy</Button>
                                <Button type="submit" variant="contained" color="primary">Lưu</Button>
                            </Box>
                        </FormControl>
                    </form>
                </Box>
            </Modal>
        </>
    )
}