import PeopleIcon from "@mui/icons-material/People"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import AssessmentIcon from "@mui/icons-material/Assessment"

// Dữ liệu thống nhất cho cả Dashboard và ReportPage
export const monthlyData = [
  { name: "T1", users: 4000, revenue: 24000 },
  { name: "T2", users: 3000, revenue: 18000 },
  { name: "T3", users: 5000, revenue: 30000 },
  { name: "T4", users: 2780, revenue: 16680 },
  { name: "T5", users: 6890, revenue: 41340 },
  { name: "T6", users: 4390, revenue: 26340 },
  { name: "T7", users: 7890, revenue: 47340 },
  { name: "T8", users: 5680, revenue: 34080 },
  { name: "T9", users: 4560, revenue: 27360 },
  { name: "T10", users: 6780, revenue: 40680 },
  { name: "T11", users: 7890, revenue: 47340 },
  { name: "T12", users: 8900, revenue: 53400 },
]

export const servicePackages = [
  { name: "Gói Cơ bản", value: 700, color: "#0088FE" },
  { name: "Gói Nâng cao", value: 270, color: "#00C49F" },
  { name: "Gói Premium", value: 100, color: "#FFBB28" },
  { name: "Gói Doanh nghiệp", value: 89, color: "#FF8042" },
]

export const recentUsers = [
  {
    avatar: "https://i.pravatar.cc/150?img=1",
    name: "Nguyễn Văn X",
    email: "nguyenvanx@gmail.com",
    role: "Người dùng",
    lastLogin: "2 phút trước",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "Trần Thị Y",
    email: "tranthiy@gmail.com",
    role: "Premium",
    lastLogin: "15 phút trước",
  },
  {
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Lê Văn Z",
    email: "levanz@gmail.com",
    role: "Doanh nghiệp",
    lastLogin: "1 giờ trước",
  },
]

export const statsCards = [
  { title: "Tổng người dùng", value: "3,234", icon: PeopleIcon, color: "primary" },
  { title: "Tổng đơn hàng", value: "1,159", icon: ShoppingCartIcon, color: "secondary" },
  { title: "Doanh thu", value: "$32,345", icon: AttachMoneyIcon, color: "success" },
  { title: "Báo cáo", value: "78", icon: AssessmentIcon, color: "warning" },
]


export const mockMeals = [
  { id: 1, name: "Salad", calories: 200, category: "Rau", image: "https://picsum.photos/200/200?random=1" },
  { id: 2, name: "Grilled Chicken", calories: 300, category: "Thịt", image: "https://picsum.photos/200/200?random=2" },
  { id: 3, name: "Fruit Smoothie", calories: 250, category: "Nước uống", image: "https://picsum.photos/200/200?random=3" },
  { id: 4, name: "Chocolate Cake", calories: 150, category: "Tráng miệng", image: "https://picsum.photos/200/200?random=4" },
  { id: 5, name: "Pasta", calories: 400, category: "Món chính", image: "https://picsum.photos/200/200?random=5" },
];