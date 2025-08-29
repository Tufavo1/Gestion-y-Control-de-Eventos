"use client";

import Footer from "@/components/Layout/footer";
import { Navbar } from "@/components/Layout/navbar";
import ForgotPasswordForm from "@/components/Login/ForgotPassForm";


export default function LoginPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* llamo a los componentes */}
            <Navbar />

            <section className="flex-1 grid place-items-center bg-gray-50 px-4 py-9">
                <ForgotPasswordForm />
            </section>

            <Footer />
        </main>
    );
}
