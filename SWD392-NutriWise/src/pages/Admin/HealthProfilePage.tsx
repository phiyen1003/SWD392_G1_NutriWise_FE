
import Layout from "../../components/Admin/Layout";

import HealthProfileCard from "../../components/Admin/HealthProfileCard";

export default function HealthProfilePage() {
    return (
        <Layout title="Quản lý hồ sơ sức khỏe" subtitle="Xem và quản lý các hồ sơ sức khỏe">
            <HealthProfileCard />
        </Layout>
    )
}