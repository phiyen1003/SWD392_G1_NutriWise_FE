import { Box, Container, Grid, Typography, Button, AppBar, Toolbar, Avatar } from "@mui/material"
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Copyright,
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
} from "@mui/icons-material"
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
  Link,
} from "@mui/material"
import AIChat from "../../components/Home/AIChat"
// import AIChat from "../../components/Home/ChatComponent"
import { useState, useEffect } from "react"
import AuthModal from "../../components/Home/AuthModal"
import type { User } from "firebase/auth"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebase-config"
import { motion } from "framer-motion";

const HomePage = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowAIChat(true);
      } else {
        setShowAIChat(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowAIChat(false);
      alert("Đăng xuất thành công!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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

  const handleLoginSuccess = () => {
    setShowAIChat(false);
    alert("Đăng nhập thành công!");
    setShowAIChat(true);
    window.location.reload();
  };

  return (
<Box sx={{ display: 'flex', flexDirection: 'column' ,}}>
{user && showAIChat && (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: 400,
        height: 540,
        borderRadius: 4,
        bgcolor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        transform: showAIChat ? "scale(1)" : "scale(0.95)",
        opacity: showAIChat ? 1 : 0,
      }}
    >
      <AIChat />
    </Box> 
  )}

<AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)', px: 2 }}>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
    {/* Logo hoặc tiêu đề */}
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
      NutriWise
    </Typography>

    {/* Hiển thị thông tin người dùng hoặc nút đăng nhập */}
    {user ? (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
          {user.email?.[0].toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          {user.email}
        </Typography>
        <Button color="error" variant="outlined" onClick={handleLogout} sx={{ borderColor: 'white', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
          Đăng xuất
        </Button>
      </Box>
    ) : (
      <Button variant="contained" color="info" onClick={() => setShowLogin(true)} sx={{ fontWeight: 'bold' }}>
        Đăng nhập
      </Button>
    )}
  </Toolbar>
</AppBar>

      {/* Modal for Login/Register */}
      <AuthModal open={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />

      {/* Hero Section */}
      <Box
  sx={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    p: 0,
    m: -1,
    position: "relative",
    top: 0,
    left: 0,
  }}
>
  <Container maxWidth="md">
    {/* Tiêu đề với hiệu ứng fade-in */}
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
     <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, display: "flex", gap: 1, justifyContent: "center" }}>
  {"Sống Khỏe Mỗi Ngày Cùng NutriWise".split(" ").map((word, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.5, duration: 2 }}
      style={{ display: "inline-block" }}
    >
      {word}
    </motion.span>
  ))}
</Typography>
    </motion.div>

    {/* Mô tả với hiệu ứng trễ nhẹ */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
    >
      <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
        Giải pháp dinh dưỡng thông minh giúp bạn có một lối sống lành mạnh
      </Typography>
    </motion.div>

    {/* Nút với hiệu ứng xuất hiện từ từ */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
    >
      <Button variant="contained" size="large" sx={{ mr: 2 }} onClick={() => setShowLogin(true)}>
        Bắt đầu ngay
      </Button>
      <Button variant="contained" size="large" sx={{ mr: 2 }} onClick={() => setShowLogin(true)}>
        Đăng ký ngay
      </Button>
    </motion.div>
  </Container>
</Box>;

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

