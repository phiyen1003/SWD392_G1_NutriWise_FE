import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Box, Button, TableContainer, Table, TableCell, TableHead, TableRow, TableBody, Paper, TableSortLabel } from "@mui/material";
import { Card, Text, NumberInput, Stack, VStack, HStack, Input, Field } from "@chakra-ui/react";
import { Delete } from "@mui/icons-material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { HealthMetricDTO } from "../../types/types";


import { Toast } from "../../components/ToastComponent";
import { CustomPagination } from "../PagingComponent";
import HealthMetricModal from "./HealthMetricModal";

import apiClient from "../../api/apiClient";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
    minBmi: yup.number(),
    maxBmi: yup.number(),
    cholesterol: yup.string(),
    bloodPressure: yup.string(),
    minMeasurementDate: yup.string(),
    maxMeasurementDate: yup.string()
})

type FormData = yup.InferType<typeof schema>


export default function HealthMetricCard() {
    const { register, handleSubmit, watch, formState: { errors }, control, getValues, setValue, getFieldState } = useForm<FormData>({})
    const [metrics, setMetrics] = useState<HealthMetricDTO[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedMetric, setSelectedMetric] = useState<HealthMetricDTO | null>(null);
    const [modalAction, setModalAction] = useState<"create" | "update">("create");
    const [orderBy, setOrderBy] = useState<keyof HealthMetricDTO>("measurementDate");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [statusCode, setStatusCode] = useState<number>(0);
    const [information, setInformation] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [dataFetched, setDataFetched] = useState<boolean>(false);

    const { profileId } = useParams();

    const initialState: HealthMetricDTO = {
        healthMetricId: 0,
        healthProfileId: parseInt(profileId!),
        measurementDate: '',
        bloodPressure: '',
        bmi: 0,
        cholesterol: ''
    }

    const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
        setTotalCount(totalCount);
        setCurrentPage(currentPage);
        setPageSize(pageSize);
    }

    const onToast = (status: number, openToast: boolean, info: string) => {
        setStatusCode(status);
        setOpenToast(openToast);
        setInformation(info);
    }

    const handleOpen = (metric: HealthMetricDTO, action: "create" | "update") => {
        setSelectedMetric(metric);
        setModalAction(action);
        setOpen(true);
    };

    const handleSort = (property: keyof HealthMetricDTO) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    }

    const fetchMetrics = useCallback(async (values?: any) => {
        if (!profileId) return;
        try {

            const response = await apiClient.get(`/HealthMetric/health-metric-by-health-profile-id/${parseInt(profileId)}?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}&Bmi.Min=${values?.minBmi?.toString() || ''}&Bmi.Max=${values?.maxBmi?.toString() || ''}&BloodPressure=${values?.bloodPressure ?? ''}&Cholesterol=${values?.cholesterol ?? ''}&MeasurementDate.Min=${values?.minMeasurementDate ?? ''}&MeasurementDate.Max=${values?.maxMeasurementDate ?? ''}`);
            const paginationHeader = JSON.parse(response.headers["x-pagination"]);
            setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
            setMetrics(response.data);
            setLoading(() => false);
        } catch (error) {
            onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
        } finally {
            setDataFetched(true);
            setLoading(false);
        }
    }, [order, orderBy, currentPage]);

    // const handleSearch = async (value: string) => {
    //     try {
    //         if (value !== '') {
    //             const response = await apiClient.get(`/Allergen/allergen-search?name=${value}`);
    //             setMetrics(response.data);
    //         } else {
    //             fetchMetrics()
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };

    const onDeleteMetric = async (metricId: number) => {
        setLoadingId(metricId);
        setTimeout(async () => {
            try {
                const response = await apiClient.delete(`/HealthMetric/health-metric-deletion/${metricId}`);
                if (response.status === 200) {
                    onToast(200, true, 'Đã xóa thành công');

                    if (metrics.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    } else {
                        fetchMetrics();
                    }
                }
            } catch (e) {
                onToast(statusCode, true, 'Có lỗi đã xảy ra');
            } finally {
                setLoadingId(null)
            }
        }, 300)
    }

    useEffect(() => {
        const values = getValues();
        values ? fetchMetrics(values) : fetchMetrics();
    }, [order, orderBy, currentPage]);

    const onFilterSubmit = handleSubmit((form) => {
        if (!form) return;
        fetchMetrics(form);
    })

    return (
        <>
            <Card.Body gap={5}>
                <Toast
                    onClose={() => setOpenToast(false)}
                    information={information}
                    open={openToast}
                    statusCode={statusCode}
                ></Toast>
                <Card.Title>
                    Chỉ số sức khỏe
                </Card.Title>
                <Card.Description>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpen(initialState, 'create')}
                    >
                        Tạo chỉ số sức khỏe
                    </Button>
                    <Stack mb={2} mt={5}>
                        <form onSubmit={onFilterSubmit}>
                            <Stack direction={"column"} gap={4} mb={2} align={"start"} width="100%">
                                <HStack gap={4} width="100%">
                                    <Controller
                                        name="minBmi"
                                        control={control}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                flex={1}
                                                name={field.name}
                                                value={field.value?.toString()}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value)
                                                }}>
                                                <NumberInput.Label fontWeight={"bold"}>Min BMI</NumberInput.Label>
                                                <NumberInput.Input placeholder="Enter BMI" />
                                            </NumberInput.Root>
                                        )}
                                    >
                                    </Controller>
                                    <Controller
                                        name="maxBmi"
                                        control={control}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                flex={1}
                                                name={field.name}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value)
                                                }}>
                                                <NumberInput.Label fontWeight={"bold"}>Max BMI</NumberInput.Label>
                                                <NumberInput.Input placeholder="Enter BMI" />
                                            </NumberInput.Root>
                                        )}>
                                    </Controller>
                                    <Field.Root flex={1}>
                                        <Field.Label>Blood Pressure</Field.Label>
                                        <Input {...register('bloodPressure')} placeholder="Enter blood pressure" />
                                    </Field.Root>
                                    <Controller
                                        name="cholesterol"
                                        control={control}
                                        render={({ field }) => (
                                            <NumberInput.Root
                                                flex={1}
                                                name={field.value}
                                                onValueChange={({ value }) => {
                                                    field.onChange(value)
                                                }}
                                            >
                                                <NumberInput.Label fontWeight={"bold"}>Cholesterol</NumberInput.Label>
                                                <NumberInput.Input placeholder="Enter Cholesterol" />
                                            </NumberInput.Root>
                                        )}
                                    >
                                    </Controller>
                                </HStack>

                                <HStack gap={4} width="100%">
                                    <Controller
                                        name="minMeasurementDate"
                                        control={control}
                                        render={({ field }) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="Measurement Date ( From )"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => setValue("minMeasurementDate", date ? date.format('YYYY-MM-DD') : '')}
                                                    slotProps={{
                                                        textField: {
                                                            error: !!errors.minMeasurementDate,
                                                            helperText: errors.minMeasurementDate?.message
                                                        }
                                                    }}
                                                    disableFuture />
                                            </LocalizationProvider>
                                        )}>
                                    </Controller>
                                    <Controller
                                        name="maxMeasurementDate"
                                        control={control}
                                        render={({ field }) => (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="Measurement Date ( To )"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => setValue("maxMeasurementDate", date ? date.format('YYYY-MM-DD') : '')}
                                                    slotProps={{
                                                        textField: {
                                                            error: !!errors.maxMeasurementDate,
                                                            helperText: errors.maxMeasurementDate?.message
                                                        }
                                                    }}
                                                    disableFuture />
                                            </LocalizationProvider>
                                        )}>
                                    </Controller>
                                </HStack>
                            </Stack>
                            <Button variant="contained" color="primary" type="submit">
                                Apply Filters
                            </Button>
                        </form>
                    </Stack>

                    {metrics.length > 0 ? (
                        <>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === "bloodPressure"}
                                                    direction={order}
                                                    onClick={() => handleSort("bloodPressure")}
                                                >
                                                    <b>Huyết áp</b>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === "bmi"}
                                                    direction={order}
                                                    onClick={() => handleSort("bmi")}
                                                >
                                                    <b>BMI</b>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === "cholesterol"}
                                                    direction={order}
                                                    onClick={() => handleSort("cholesterol")}
                                                >
                                                    <b>Cholesterol</b>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel active={orderBy === "measurementDate"}
                                                    direction={order}
                                                    onClick={() => handleSort("measurementDate")}
                                                >
                                                    <b>Ngày đo</b>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {metrics.map((metric) => (
                                            <TableRow key={metric.healthMetricId}>
                                                <TableCell>{metric.bloodPressure}</TableCell>
                                                <TableCell>{metric.bmi}</TableCell>
                                                <TableCell>{metric.cholesterol}</TableCell>
                                                <TableCell>{metric.measurementDate}</TableCell>
                                                <TableCell>
                                                    <Box display={"flex"} gap={3}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => handleOpen(metric, 'update')}>
                                                            Chỉnh sửa
                                                        </Button>
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<Delete />}
                                                            loading={loadingId === metric.healthMetricId}
                                                            onClick={() => onDeleteMetric(metric.healthMetricId)}>
                                                            Xóa
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Box mt={2}>

                                    <CustomPagination
                                        count={totalCount}
                                        pageSize={pageSize}
                                        defaultPage={currentPage}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </Box>
                            </TableContainer>
                        </>
                    ) : (<Text>Hiện tại chưa có gì</Text>)}
                </Card.Description>
            </Card.Body >
            <HealthMetricModal
                profId={parseInt(profileId!)}
                open={open}
                action={modalAction}
                handleClose={() => setOpen(false)}
                metric={selectedMetric!}
                setMetrics={setMetrics}
                title={modalAction === 'create' ? "Thêm chỉ số sức khỏe" : "Cập nhật chỉ số sức khỏe"}
            />
        </>
    )
}