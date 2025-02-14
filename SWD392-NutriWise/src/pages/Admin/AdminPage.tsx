import { Box, Card, Container, Grid, Typography, Paper, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, IconButton, Link } from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Assessment as AssessmentIcon,
  Dashboard as DashboardIcon,
//   Category as CategoryIcon,
//   Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Copyright,
  Restaurant as RestaurantIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const drawerWidth = 240;
  const location = useLocation();
  const navigate = useNavigate();
  
  // Menu items cho sidebar
  const menuItems = [
    { 
      text: 'Bảng điều khiển', 
      icon: <DashboardIcon />, 
      path: '/nutriwise/dashboard' 
    },
    { 
      text: 'Quản lý người dùng', 
      icon: <PeopleIcon />, 
      path: '/nutriwise/users' 
    },
    { 
      text: 'Kế hoạch dinh dưỡng', 
      icon: <RestaurantIcon />, 
      path: '/nutriwise/nutrition-plans' 
    },
    { 
      text: 'Quản lý thực đơn', 
      icon: <MenuBookIcon />, 
      path: '/nutriwise/meals' 
    },
    { 
      text: 'Báo cáo & Thống kê', 
      icon: <AssessmentIcon />, 
      path: '/nutriwise/reports' 
    },
    { 
      text: 'Cài đặt hệ thống', 
      icon: <SettingsIcon />, 
      path: '/nutriwise/settings' 
    },
  ];

  // Dữ liệu mẫu cho các thẻ thống kê
  const statsCards = [
    { title: 'Tổng người dùng', value: '3,234', icon: <PeopleIcon sx={{ fontSize: 40 }} color="primary" /> },
    { title: 'Tổng đơn hàng', value: '1,159', icon: <ShoppingCartIcon sx={{ fontSize: 40 }} color="secondary" /> },
    { title: 'Doanh thu', value: '$32,345', icon: <AttachMoneyIcon sx={{ fontSize: 40 }} color="success" /> },
    { title: 'Báo cáo', value: '78', icon: <AssessmentIcon sx={{ fontSize: 40 }} color="warning" /> },
  ];

  // Dữ liệu mẫu cho biểu đồ doanh thu
  const revenueData = [
    { name: 'T1', revenue: 4000 },
    { name: 'T2', revenue: 3000 },
    { name: 'T3', revenue: 5000 },
    { name: 'T4', revenue: 2780 },
    { name: 'T5', revenue: 6890 },
    { name: 'T6', revenue: 4390 },
    { name: 'T7', revenue: 7890 },
  ];

  // Dữ liệu mẫu cho biểu đồ gói dịch vụ
  const servicePackages = [
    { name: 'Gói Cơ bản', value: 700, color: '#0088FE' },
    { name: 'Gói Nâng cao', value: 270, color: '#00C49F' },
    { name: 'Gói Premium', value: 100, color: '#FFBB28' },
    { name: 'Gói Doanh nghiệp', value: 89, color: '#FF8042' },
  ];

  // Dữ liệu mẫu cho bảng thanh toán gần đây
  const recentPayments = [
    { 
      id: '#12345',
      user: 'Nguyễn Văn A',
      package: 'Gói Premium',
      amount: '599,000đ',
      status: 'Thành công',
      date: '2024-03-15'
    },
    { 
      id: '#12344',
      user: 'Trần Thị B',
      package: 'Gói Cơ bản',
      amount: '199,000đ',
      status: 'Đang xử lý',
      date: '2024-03-14'
    },
    { 
      id: '#12343',
      user: 'Lê Văn C',
      package: 'Gói Nâng cao',
      amount: '399,000đ',
      status: 'Thành công',
      date: '2024-03-14'
    },
    { 
      id: '#12342',
      user: 'Phạm Thị D',
      package: 'Gói Doanh nghiệp',
      amount: '999,000đ',
      status: 'Thành công',
      date: '2024-03-13'
    },
  ];

  // Dữ liệu mẫu cho bảng người dùng mới
  const recentUsers = [
    {
      avatar: 'https://i.pravatar.cc/150?img=1',
      name: 'Nguyễn Văn X',
      email: 'nguyenvanx@gmail.com',
      role: 'Người dùng',
      lastLogin: '2 phút trước'
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=2',
      name: 'Trần Thị Y',
      email: 'tranthiy@gmail.com',
      role: 'Premium',
      lastLogin: '15 phút trước'
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=3',
      name: 'Lê Văn Z',
      email: 'levanz@gmail.com',
      role: 'Doanh nghiệp',
      lastLogin: '1 giờ trước'
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          },
        }}
      >
        {/* Logo và tên app */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          background: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DashboardIcon sx={{ fontSize: 28 }} />
            NutriWise
          </Typography>
        </Box>

        {/* User Profile Section */}
        <Box sx={{ 
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          mb: 1
        }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            src="https://i.pravatar.cc/150?img=5"
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary">
              admin@nutriwise.com
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          overflow: 'auto',
          px: 2,
          py: 1,
          '& .MuiListItemButton-root': {
            borderRadius: '12px',
            mb: 1,
            position: 'relative',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              transform: 'translateX(4px)',
            },
            '&.active': {
              backgroundColor: 'primary.main',
              color: 'white',
              '& .MuiListItemIcon-root': {
                color: 'white',
              },
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }
          }
        }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton 
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => navigate(item.path)}
                  sx={{
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: location.pathname === item.path ? 'white' : 'primary.main'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ 
          mt: 'auto', 
          p: 2, 
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            Version 1.0.0
          </Typography>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Box sx={{
            mb: 4,
            p: 3,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
            boxShadow: '0 4px 20px rgba(26, 35, 126, 0.2)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                color: 'white',
                fontWeight: 700,
                mb: 1
              }}>
                Bảng điều khiển
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400
              }}>
                Chào mừng trở lại, Admin User! 👋
              </Typography>
            </Box>
            
            <Box sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}>
              <Box sx={{
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DashboardIcon sx={{ color: 'white' }} />
                <Typography sx={{ color: 'white' }}>
                  {new Date().toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    mb: 2
                  }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#424242'
                  }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    mt: 1,
                    fontWeight: 700,
                    color: 'primary.main'
                  }}>
                    {card.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                p: 3, 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: '#424242'
                }}>
                  Thống kê doanh thu
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 3, 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: '#424242'
                }}>
                  Phân bố gói dịch vụ
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicePackages}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {servicePackages.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                {/* Legend cho biểu đồ tròn */}
                <Box sx={{ mt: 2 }}>
                  {servicePackages.map((entry, index) => (
                    <Box
                      key={`legend-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: entry.color,
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">
                        {entry.name} ({entry.value} người dùng)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Bảng thanh toán gần đây */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#424242',
                    mb: 2
                  }}>
                    Thanh toán gần đây
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã đơn</TableCell>
                          <TableCell>Người dùng</TableCell>
                          <TableCell>Gói dịch vụ</TableCell>
                          <TableCell>Số tiền</TableCell>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell>Ngày</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentPayments.map((payment) => (
                          <TableRow key={payment.id} hover>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>{payment.user}</TableCell>
                            <TableCell>{payment.package}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>
                              <Chip
                                label={payment.status}
                                color={payment.status === 'Thành công' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{payment.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Card>
            </Grid>

            {/* Bảng người dùng mới */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#424242',
                    mb: 2
                  }}>
                    Người dùng mới đăng nhập
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Người dùng</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Vai trò</TableCell>
                          <TableCell>Đăng nhập lần cuối</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentUsers.map((user, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={user.avatar} sx={{ mr: 2 }} />
                                <Typography variant="body2">{user.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                color={
                                  user.role === 'Premium' ? 'primary' :
                                  user.role === 'Doanh nghiệp' ? 'secondary' : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'white',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    NutriWise
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giải pháp dinh dưỡng thông minh cho cuộc sống khỏe mạnh của bạn.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton size="small" sx={{ 
                    color: '#1877f2',
                    '&:hover': { backgroundColor: 'rgba(24, 119, 242, 0.04)' }
                  }}>
                    <Facebook />
                  </IconButton>
                  <IconButton size="small" sx={{ 
                    color: '#1da1f2',
                    '&:hover': { backgroundColor: 'rgba(29, 161, 242, 0.04)' }
                  }}>
                    <Twitter />
                  </IconButton>
                  <IconButton size="small" sx={{ 
                    color: '#0a66c2',
                    '&:hover': { backgroundColor: 'rgba(10, 102, 194, 0.04)' }
                  }}>
                    <LinkedIn />
                  </IconButton>
                  <IconButton size="small" sx={{ 
                    color: '#e4405f',
                    '&:hover': { backgroundColor: 'rgba(228, 64, 95, 0.04)' }
                  }}>
                    <Instagram />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Liên kết nhanh
                </Typography>
                <Grid container spacing={1}>
                  {['Trang chủ', 'Về chúng tôi', 'Dịch vụ', 'Blog', 'Liên hệ'].map((text) => (
                    <Grid item xs={6} key={text}>
                      <Link
                        href="#"
                        underline="hover"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          py: 0.5,
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {text}
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Thông tin liên hệ
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Email: contact@nutriwise.com
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Điện thoại: (84) 123 456 789
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
                </Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Copyright sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  2024 NutriWise. Đã đăng ký bản quyền.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="#" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Điều khoản sử dụng
                </Link>
                <Link href="#" underline="hover" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Chính sách bảo mật
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;