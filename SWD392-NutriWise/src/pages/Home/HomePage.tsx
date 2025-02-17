import { Box, Container, Grid, Typography, Button } from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Copyright,
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import {
  Paper,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Link
} from '@mui/material';

const HomePage = () => {
  
  // Thay đổi statsCards thành các tính năng nổi bật
  const features = [
    { 
      title: 'Thực đơn đa dạng', 
      description: 'Hơn 1000+ công thức nấu ăn lành mạnh',
      icon: <MenuBookIcon sx={{ fontSize: 40 }} color="primary" /> 
    },
    { 
      title: 'Tư vấn dinh dưỡng', 
      description: 'Đội ngũ chuyên gia dinh dưỡng hàng đầu',
      icon: <PeopleIcon sx={{ fontSize: 40 }} color="secondary" /> 
    },
    { 
      title: 'Theo dõi sức khỏe', 
      description: 'Công cụ theo dõi chỉ số sức khỏe thông minh',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} color="success" /> 
    },
    { 
      title: 'Cộng đồng', 
      description: 'Kết nối với cộng đồng người yêu sức khỏe',
      icon: <PeopleIcon sx={{ fontSize: 40 }} color="warning" /> 
    },
  ];

  // Thay đổi servicePackages thành các gói dịch vụ cho trang chủ
  const pricingPlans = [
    {
      name: 'Gói Cơ bản',
      price: '199.000đ/tháng',
      features: [
        'Truy cập thực đơn cơ bản',
        'Công cụ tính BMI',
        'Tư vấn qua email',
        'Cộng đồng hỗ trợ'
      ]
    },
    {
      name: 'Gói Premium',
      price: '499.000đ/tháng',
      features: [
        'Tất cả tính năng cơ bản',
        'Tư vấn dinh dưỡng 1-1',
        'Thực đơn cá nhân hóa',
        'Theo dõi chỉ số sức khỏe'
      ]
    },
    {
      name: 'Gói Doanh nghiệp',
      price: 'Liên hệ',
      features: [
        'Tất cả tính năng Premium',
        'Giải pháp cho doanh nghiệp',
        'Quản lý nhóm',
        'Báo cáo chi tiết'
      ]
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box sx={{
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        p: 4
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
            Sống Khỏe Mỗi Ngày Cùng NutriWise
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Giải pháp dinh dưỡng thông minh giúp bạn có một lối sống lành mạnh
          </Typography>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <Button variant="contained" size="large" sx={{ mr: 2 }}>
              Bắt đầu ngay
            </Button>
          </Link>
          <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white' }}>
            Tìm hiểu thêm
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          Tính năng nổi bật
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Paper sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                {feature.icon}
                <Typography variant="h6" sx={{ my: 2 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
            Bảng giá dịch vụ
          </Typography>
          <Grid container spacing={4}>
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                      {plan.price}
                    </Typography>
                    <List>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <DashboardIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button variant="contained" fullWidth>
                      Đăng ký ngay
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* New Blog Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          Kiến thức dinh dưỡng
        </Typography>
        <Grid container spacing={4}>
          {/* Example blog items */}
          {[
            {
              title: 'Lợi ích của việc ăn uống lành mạnh',
              excerpt: 'Khám phá những lợi ích sức khỏe từ việc ăn uống đúng cách...',
              link: '#'
            },
            {
              title: 'Cách xây dựng thực đơn dinh dưỡng',
              excerpt: 'Hướng dẫn chi tiết để xây dựng thực đơn dinh dưỡng phù hợp...',
              link: '#'
            },
            {
              title: 'Những thực phẩm nên có trong chế độ ăn',
              excerpt: 'Tìm hiểu về những thực phẩm tốt cho sức khỏe...',
              link: '#'
            },
          ].map((blog, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                  {blog.title}
                </Typography>
                <Typography color="text.secondary">
                  {blog.excerpt}
                </Typography>
                <Link href={blog.link} sx={{ mt: 2, textDecoration: 'none', color: 'primary.main' }}>
                  Đọc thêm
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Expert Blogs Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          Blog Chuyên Gia Về Dinh Dưỡng
        </Typography>
        <Grid container spacing={4}>
          {/* Example blog items */}
          {[
            {
              title: 'Lợi ích của việc ăn uống lành mạnh',
              excerpt: 'Khám phá những lợi ích sức khỏe từ việc ăn uống đúng cách...',
              link: '#'
            },
            {
              title: 'Cách xây dựng thực đơn dinh dưỡng',
              excerpt: 'Hướng dẫn chi tiết để xây dựng thực đơn dinh dưỡng phù hợp...',
              link: '#'
            },
            {
              title: 'Những thực phẩm nên có trong chế độ ăn',
              excerpt: 'Tìm hiểu về những thực phẩm tốt cho sức khỏe...',
              link: '#'
            },
          ].map((blog, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                  {blog.title}
                </Typography>
                <Typography color="text.secondary">
                  {blog.excerpt}
                </Typography>
                <Link href={blog.link} sx={{ mt: 2, textDecoration: 'none', color: 'primary.main' }}>
                  Đọc thêm
                </Link>
              </Paper>
            </Grid>
          ))}
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
  );
};

export default HomePage;