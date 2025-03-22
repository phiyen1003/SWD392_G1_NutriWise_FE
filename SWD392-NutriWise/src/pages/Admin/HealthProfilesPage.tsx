import React, { useEffect, useState, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TableSortLabel } from "@mui/material";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { Delete } from "@mui/icons-material";

import { HealthProfileDTO } from "../../types/types";
import apiClient from "../../api/apiClient";

import Layout from "../../components/Admin/Layout";
import HealthProfileModal from "../../components/Admin/HealthProfileModal";
import { CustomPagination } from "../../components/PagingComponent";
import { Toast } from "../../components/ToastComponent";
import { Search } from "../../components/SearchComponent";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";

const HealthProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<HealthProfileDTO[]>([]);
  const [selectedHealthProfile, setSelectedHealthProfile] = useState<HealthProfileDTO>();

  const [open, setOpen] = useState<boolean>(false);

  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>('');

  const [modalAction, setModalAction] = useState<"create" | "update">("create");

  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const [orderBy, setOrderBy] = useState<keyof HealthProfileDTO>("healthProfileId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState<string>('');

  const initialState: HealthProfileDTO = {
    healthProfileId: 0,
    fullName: '',
    gender: '',
    dateOfBirth: null,
    height: 0,
    weight: 0
  }

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/HealthProfile/all-health-profiles?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`);
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      console.log(paginationHeader);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setProfiles(response.data);
    } catch (error) {
      onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setLoading(false);
    }
  }, [orderBy, order, currentPage]);


  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const onToast = (status: number, openToast: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(openToast);
    setInformation(info);
  }

  const handleOpen = (healthProf: HealthProfileDTO, action: "create" | "update") => {
    setSelectedHealthProfile(healthProf);
    setModalAction(action);
    setOpen(true);
  };

  const handleSort = (property: keyof HealthProfileDTO) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  const handleSearch = async (value: string) => {
    try {
      if (value !== '') {
        const response = await apiClient.get(`/HealthProfile/health-profile-search?fullName=${query}`);
        setProfiles(response.data);
      } else {
        fetchProfiles()
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onDelete = (profileId: number) => {
    setLoadingId(profileId);
    setTimeout(async () => {
      try {
        const response = await apiClient.delete(`/HealthProfile/health-profile-deletion/${profileId}`);
        if (response.status === 200) {
          onToast(200, true, 'Đã xóa thành phần dị ứng');

          if (profiles.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchProfiles();
          }
        }
      } catch (e) {
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa thành phần dị ứng');
      } finally {
        setLoadingId(null)
      }
    }, 300)
  }

  return (
    <Layout title="Quản lý hồ sơ sức khỏe" subtitle="Xem và quản lý các hồ sơ sức khỏe">
      <Toast
        onClose={() => setOpenToast(false)}
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleOpen(initialState, 'create')}>
              Thêm hồ sơ sức khỏe
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
          {profiles.length > 0 ? (
            <Paper sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "healthProfileId"}
                        direction={order}
                        onClick={() => handleSort("healthProfileId")}>
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "fullName"}
                        direction={order}
                        onClick={() => handleSort("fullName")}>
                        Họ tên
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      Giới tính
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "height"}
                        direction={order}
                        onClick={() => handleSort("height")}>
                        Chiều cao
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "weight"}
                        direction={order}
                        onClick={() => handleSort("weight")}>
                        Cân nặng
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.healthProfileId}>
                      <TableCell>{profile.healthProfileId}</TableCell>
                      <TableCell>{profile.fullName}</TableCell>
                      <TableCell>{profile.gender}</TableCell>
                      <TableCell>{profile.height}</TableCell>
                      <TableCell>{profile.weight}</TableCell>
                      <TableCell>
                        <Box display={"flex"} gap={3}>
                          <Button color="info"
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpen(profile, "update")}
                          >
                            Sửa
                          </Button>

                          <Button color="error"
                            variant="contained"
                            size="small"
                            startIcon={<Delete />}
                            loading={loadingId === profile.healthProfileId}
                            onClick={() => onDelete(profile.healthProfileId!)}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <HealthProfileModal
                  open={open}
                  action={modalAction}
                  healthProfile={selectedHealthProfile!}
                  title={modalAction === 'create' ? 'Thêm hồ sơ sức khỏe' : 'Chỉnh sửa hồ sơ sức khỏe'}
                  setHealthProfiles={setProfiles}
                  handleClose={() => setOpen(false)} />
              </Table>
              <CustomPagination
                count={totalCount}
                pageSize={pageSize}
                defaultPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Paper>
          ) : (
            <Box mt={2} display={"flex"} justifyContent={"center"}>
              <FuzzyText
               baseIntensity={0.2} 
               color="#1a237e"
              >Not found</FuzzyText>
            </Box>
          )}
        </Box>
      )
      }
    </Layout >
  );
};

export default HealthProfilesPage;