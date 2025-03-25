import React, { useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { HealthMetricDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";
import { Toast } from "../../components/ToastComponent";
import { CustomPagination } from "../../components/PagingComponent";
import { Search } from "../../components/SearchComponent";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";
import apiClient from "../../api/apiClient";
import { Spinner, VStack, Text, NumberInput } from "@chakra-ui/react";

const HealthMetricsPage: React.FC = () => {
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

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/HealthMetric/all-health-metrics?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`)
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
  }, [orderBy, order, currentPage]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const onToast = (status: number, openToast: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(openToast);
    setInformation(info);
  }

  const handleCloseToast = () => {
    setOpenToast(false);
  }

  const onDeleteAllergen = async (allergenId: number) => {
    setLoadingId(allergenId);
    setTimeout(async () => {
      try {
        const response = await apiClient.delete(`/Allergen/allergen-deletion/${allergenId}`);
        if (response.status === 200) {
          onToast(200, true, 'Đã xóa thành phần dị ứng');

          if (metrics.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchMetrics();
          }
        }
      } catch (e) {
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa metric');
      } finally {
        setLoadingId(null)
      }
    }, 300)
  }

  const initialState: HealthMetricDTO = {
    healthMetricId: 0,
    healthProfileId: 0,
    measurementDate: '',
    bloodPressure: '',
    bmi: 0,
    cholesterol: ''
  }

  const handleOpen = (allergen: HealthMetricDTO, action: "create" | "update") => {
    setSelectedMetric(allergen);
    setModalAction(action);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedMetric(null);
  };

  const handleSort = (property: keyof HealthMetricDTO) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  const handleSearch = async (value: string) => {
    try {
      if (value !== '') {
        const response = await apiClient.get(`/Allergen/allergen-search?name=${value}`);
        setSelectedMetric(response.data);
      } else {
        fetchMetrics()
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title="Quản lý chỉ số sức khỏe" subtitle="Xem và quản lý các chỉ số sức khỏe">
      <Toast
        onClose={handleCloseToast}
        information={information}
        open={openToast}
        statusCode={statusCode}
      ></Toast>
      {loading ? (
        <VStack colorPalette="cyan">
          <Spinner color="colorPalette.600" borderWidth="5px" size="lg" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      ) : (
        <Box sx={{ p: 3 }}>
          <Button variant="contained" color="success">
            <CSVLink
              data={metrics}
              filename="metrics_nutriwise">
              Export to CSV
            </CSVLink>
            <Box display="flex" gap={4} mt={2}>
              <form>
                <NumberInput.Root>
                  <NumberInput.Input />
                </NumberInput.Root>
                <NumberInput.Root>
                </NumberInput.Root>
                <NumberInput.Root>
                </NumberInput.Root>
                <NumberInput.Root>
                </NumberInput.Root>
                <NumberInput.Root>
                </NumberInput.Root>
                <NumberInput.Root>
                </NumberInput.Root>
                <NumberInput.Root>
                </NumberInput.Root>
              </form>
            </Box>
          </Button>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleOpen(initialState, "create")}>
              Thêm metric
            </Button>
            <Search
              query={query}
              handleSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value)
                setQuery(e.target.value)
                handleSearch(e.target.value)
              }}
            />
          </Box>
          {metrics.length > 0 ? (
            <Paper sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Health Profile ID</TableCell>
                    <TableCell>Ngày đo</TableCell>
                    <TableCell>BMI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.healthMetricId}>
                      <TableCell>{metric.healthMetricId}</TableCell>
                      <TableCell>{metric.healthProfileId}</TableCell>
                      <TableCell>{metric.measurementDate}</TableCell>
                      <TableCell>{metric.bmi}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <CustomPagination
                count={totalCount}
                pageSize={pageSize}
                defaultPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Paper>
          ) : dataFetched ? (
            <Box mt={2} display="flex" justifyContent="center">
              <FuzzyText baseIntensity={0.2} color="#1a237e">
                Not found
              </FuzzyText>
            </Box>
          ) : (<Text>Hiện tại chưa có gì</Text>)}
        </Box>
      )}
    </Layout>
  );
}
export default HealthMetricsPage;