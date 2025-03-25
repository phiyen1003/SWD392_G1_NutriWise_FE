import type React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  LocalDining as LocalDiningIcon,
  Category as CategoryIcon,
  Chat as ChatIcon,
  Favorite as FavoriteIcon,
  FitnessCenter as FitnessCenterIcon,
  Image as ImageIcon,
  History as HistoryIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const menuItems = [
  { text: "Bảng điều khiển", icon: <DashboardIcon />, path: "/nutriwise/dashboard" },
  { text: "Quản lý người dùng", icon: <PeopleIcon />, path: "/nutriwise/users" },
  { text: "Quản lý chất gây dị ứng", icon: <LocalDiningIcon />, path: "/nutriwise/allergens" },
  { text: "Quản lý danh mục", icon: <CategoryIcon />, path: "/nutriwise/categories" },
  { text: "Quản lý trò chuyện", icon: <ChatIcon />, path: "/nutriwise/chats" },
  { text: "Quản lý công thức yêu thích", icon: <FavoriteIcon />, path: "/nutriwise/favorite-recipes" },
  { text: "Quản lý mục tiêu sức khỏe", icon: <FitnessCenterIcon />, path: "/nutriwise/health-goals" },
  // { text: "Quản lý chỉ số sức khỏe", icon: <FitnessCenterIcon />, path: "/nutriwise/health-metrics" },
  { text: "Quản lý hồ sơ sức khỏe", icon: <PeopleIcon />, path: "/nutriwise/health-profiles" },
  { text: "Quản lý nguyên liệu", icon: <LocalDiningIcon />, path: "/nutriwise/ingredients" },
  { text: "Quản lý nguyên liệu trong công thức", icon: <LocalDiningIcon />, path: "/nutriwise/ingredient-in-recipes" },
  { text: "Quản lý bữa ăn", icon: <RestaurantIcon />, path: "/nutriwise/meals" },
  { text: "Quản lý lịch sử thực đơn", icon: <HistoryIcon />, path: "/nutriwise/menu-histories" },
  { text: "Quản lý công thức trong thực đơn", icon: <MenuBookIcon />, path: "/nutriwise/menu-recipes" },
  { text: "Quản lý hình ảnh thực đơn", icon: <ImageIcon />, path: "/nutriwise/menu-recipe-images" },
  // { text: "Quản lý mục tiêu hồ sơ", icon: <FitnessCenterIcon />, path: "/nutriwise/profile-goals" },
  { text: "Quản lý công thức", icon: <MenuBookIcon />, path: "/nutriwise/recipes" },
  { text: "Quản lý mục tiêu sức khỏe công thức", icon: <FitnessCenterIcon />, path: "/nutriwise/recipe-health-goals" },
  { text: "Quản lý hình ảnh công thức", icon: <ImageIcon />, path: "/nutriwise/recipe-images" },
  { text: "Báo cáo & Thống kê", icon: <AssessmentIcon />, path: "/nutriwise/reports" },
  { text: "Cài đặt hệ thống", icon: <SettingsIcon />, path: "/nutriwise/settings" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        },
      }}
    >
      {/* Logo và tên app */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          background: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DashboardIcon sx={{ fontSize: 28 }} />
          NutriWise
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          mb: 1,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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

      <Box
        sx={{
          overflow: "auto",
          px: 2,
          py: 1,
          "& .MuiListItemButton-root": {
            borderRadius: "12px",
            mb: 1,
            position: "relative",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              transform: "translateX(4px)",
            },
            "&.active": {
              backgroundColor: "primary.main",
              color: "white",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                className={location.pathname === item.path ? "active" : ""}
                onClick={() => navigate(item.path)}
                sx={{
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === item.path ? "white" : "primary.main",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Version 1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;