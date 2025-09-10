import Footer from "@/components/Layout/footer";
import { Navbar } from "@/components/Layout/navbar";
import Profile from "@/components/profile/user/userDashboard";

export default function Forbidden() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <Navbar />
            <Profile />
            <Footer />
        </main>
    );
}
