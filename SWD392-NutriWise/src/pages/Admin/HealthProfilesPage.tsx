import React, { useEffect, useState, useCallback } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TableSortLabel } from "@mui/material";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { Delete } from "@mui/icons-material";

import { HealthProfileDTO, ProfileDTO } from "../../types/types";
import apiClient from "../../api/apiClient";

import Layout from "../../components/Admin/Layout";
import HealthProfileModal, { FormData, ToastProps } from "../../components/Admin/HealthProfileModal";
import { CustomPagination } from "../../components/PagingComponent";
import { Search } from "../../components/SearchComponent";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";
import { Link } from "react-router-dom";

import { SubmitHandler, useForm, Controller } from "react-hook-form";

import { updateHealthProfile } from "../../api/healthProfileApi";

const HealthProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<HealthProfileDTO[]>([]);
  const [selectedHealthProfile, setSelectedHealthProfile] = useState<ProfileDTO>();
  const [dataFetched, setDataFetched] = useState<boolean>(false);


  const [open, setOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<ToastProps>({
    information: '',
    openToast: false,
    statusCode: 0
  });

  const [modalAction, setModalAction] = useState<"create" | "update">("create");

  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loadingUpdId, setLoadingUpdId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const [orderBy, setOrderBy] = useState<keyof HealthProfileDTO>("healthProfileId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState<string>('');

  const [profileId, setProfileId] = useState<number>();

  const token = localStorage.getItem('token');

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
      const response = await apiClient.get(`/admin/Dashboard/healthprofiles?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      // console.log(paginationHeader);
      // setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setProfiles(response.data);
    } catch (error) {
      console.error(error);
      onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setDataFetched(true);
      setLoading(false);
    }
  }, [orderBy, order, currentPage]);


  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const onToast = (status: number, open: boolean, info: string) => {
    setToast({
      information: info,
      openToast: open,
      statusCode: status
    })
  };

  const getProfile = async (id: number) => {
    const profile = await apiClient.get(`/admin/Dashboard/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return profile.data
  }

  const handleOpen = async (healthProf: HealthProfileDTO, action: "create" | "update") => {
    setLoadingUpdId(`${healthProf.healthProfileId} upd`);
    if (action === 'update') {
      const profile = await getProfile(healthProf.healthProfileId);
      setSelectedHealthProfile(profile);
      setProfileId(healthProf.healthProfileId);
    } else {
      const profile: ProfileDTO = {
        email: '',
        userId: 0,
        username: '',
        fullName: '',
        healthProfile: {
          healthProfileId: 0,
          height: 0,
          weight: 0,
          dateOfBirth: '',
          fullName: '',
          gender: ''
        }
      }
      setSelectedHealthProfile(profile);
    }
    setModalAction(action);
    setOpen(true);
    setLoadingUpdId('');
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
          onToast(200, true, 'Đã xóa thành công');

          if (profiles.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchProfiles();
          }
        }
      } catch (e) {
        onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
      } finally {
        setLoadingId(null)
      }
    }, 300)
  }

  const onSubmitModal: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoadingButton(true);
      if (!formData) return;

      const response = await updateHealthProfile(Number(selectedHealthProfile?.healthProfile.healthProfileId), formData.healthProfile);

      if (response) {
        setProfiles((prev: HealthProfileDTO[]) =>
          prev.map(((a) => (a?.healthProfileId === profileId ? response : a)))
        );
      }
    } catch (error) {
      onToast(500, true, "Có lỗi xảy ra trong quá trình xử lý.");
    } finally {
      setLoadingButton(false);
      setOpen(false);
    }
  }

  return (
    <Layout title="Quản lý hồ sơ sức khỏe" subtitle="Xem và quản lý các hồ sơ sức khỏe">
      {loading ? (
        <VStack colorPalette="cyan">
          <Spinner color="colorPalette.600" borderWidth="5px" size="lg" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      ) : (
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
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
                      <TableCell>
                        <Link to={`/nutriwise/health-profiles/${profile.healthProfileId}`}>
                          {profile.healthProfileId}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/nutriwise/health-profiles/${profile.healthProfileId}`}>
                          {profile.fullName}
                        </Link>
                      </TableCell>
                      <TableCell>{profile.gender?.slice(0,1).toUpperCase().concat(profile.gender.slice(1))}</TableCell>
                      <TableCell>{profile.height}</TableCell>
                      <TableCell>{profile.weight}</TableCell>
                      <TableCell>
                        <Box display={"flex"} gap={3}>
                          <Button color="info"
                            size="small"
                            variant="outlined"
                            loading={loadingUpdId === `${profile.healthProfileId} upd`}
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
                  loading={loadingButton}
                  onSubmitModal={onSubmitModal}
                  toast={toast}
                  profile={selectedHealthProfile!}
                  title={modalAction === 'create' ? 'Thêm hồ sơ sức khỏe' : 'Chỉnh sửa hồ sơ sức khỏe'}
                  handleClose={() => setOpen(false)} />
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
          ) : (<Text>Hiện tại chưa có thành phần dị ứng nào</Text>)}
        </Box>
      )}
    </Layout >
  );
};

export default HealthProfilesPage;