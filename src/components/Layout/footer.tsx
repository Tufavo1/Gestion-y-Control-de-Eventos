"use client";
import Image from 'next/image';
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative border-t border-gray-200 bg-white">
            {/* linea divisora */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-gray-300 to-orange-500" />

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
                    {/* Logo y descripción */}
                    <div>
                        <Link href="/" className="group inline-flex items-center gap-2 font-sans text-2xl font-black text-gray-900">
                            <Image src="/img/icono.png" alt="Logo de CuponME" width={48} height={48} className="h-12 w-12 rounded-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
                            <span className="leading-none">
                                <span className="transition-colors duration-300 group-hover:text-orange-500">
                                    CUPON
                                </span>
                                <span className="ml-1 font-light tracking-wide text-orange-500 transition-colors duration-300 group-hover:text-gray-800">
                                    ME
                                </span>
                            </span>
                        </Link>

                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            Plataforma enfocada en innovación digital, conectando ideas, eventos y comunidades.
                        </p>
                    </div>

                    {/* Accesos rápidos */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Accesos rápidos</h3>
                        <ul className="mt-4 space-y-2 text-sm font-medium">
                            <li>
                                <a href="#eventos" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Eventos
                                </a>
                            </li>
                            <li>
                                <a href="#nosotros" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Nosotros
                                </a>
                            </li>
                            <li>
                                <a href="#servicios" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Servicios
                                </a>
                            </li>
                            <li>
                                <a href="#contacto" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal y Políticas */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Legal</h3>
                        <ul className="mt-4 space-y-2 text-sm font-medium">
                            <li>
                                <Link href="/legal/terminos" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacidad" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/cookies" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Política de Cookies
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/licencias" className="text-gray-600 underline underline-offset-4 hover:text-orange-600">
                                    Licencias & Créditos
                                </Link>
                            </li>
                        </ul>
                        <p className="mt-3 text-xs text-gray-500">Última actualización: Ago 2025</p>
                    </div>

                    {/* Contacto y Redes */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Contacto</h3>
                        <ul className="mt-4 space-y-3 text-sm font-medium text-gray-600">
                            <li>📍 Santiago, Chile</li>
                            <li className="flex items-center gap-2">
                                {/* WhatsApp */}
                                <svg className="h-5 w-5" viewBox="0 0 71 72" fill="none" aria-hidden="true">
                                    <path d="M12.5762 56.8405L15.8608 44.6381C13.2118 39.8847 12.3702 34.3378 13.4904 29.0154C14.6106 23.693 17.6176 18.952 21.9594 15.6624C26.3012 12.3729 31.6867 10.7554 37.1276 11.1068C42.5685 11.4582 47.6999 13.755 51.5802 17.5756C55.4604 21.3962 57.8292 26.4844 58.2519 31.9065C58.6746 37.3286 57.1228 42.7208 53.8813 47.0938C50.6399 51.4668 45.9261 54.5271 40.605 55.7133C35.284 56.8994 29.7125 56.1318 24.9131 53.5513L12.5762 56.8405ZM25.508 48.985L26.2709 49.4365C29.7473 51.4918 33.8076 52.3423 37.8191 51.8555C41.8306 51.3687 45.5681 49.5719 48.4489 46.7452C51.3298 43.9185 53.1923 40.2206 53.7463 36.2279C54.3002 32.2351 53.5143 28.1717 51.5113 24.6709C49.5082 21.1701 46.4003 18.4285 42.6721 16.8734C38.9438 15.3184 34.8045 15.0372 30.8993 16.0736C26.994 17.11 23.5422 19.4059 21.0817 22.6035C18.6212 25.801 17.2903 29.7206 17.2963 33.7514C17.293 37.0937 18.2197 40.3712 19.9732 43.2192L20.4516 44.0061L18.6153 50.8167L25.508 48.985Z" fill="#00D95F" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M44.026 36.885c-.448-.36-.972-.613-1.532-.741a3.05 3.05 0 0 0-1.702.006c-.84.348-1.383 1.664-1.926 2.322a1 1 0 0 1-1.036-.078c-3.077-1.202-5.656-3.407-7.319-6.256a1.1 1.1 0 0 1 .302-1.213c.606-.598 1.05-1.339 1.293-2.154.054-.9-.153-1.795-.595-2.58-.342-1.101-.992-2.081-1.875-2.825-.455-.205-.959-.274-1.453-.198-.493.076-.954.292-1.327.623-.647.557-1.161 1.252-1.504 2.033-.342.782-.504 1.63-.475 2.482.002.479.063.955.181 1.419.3 1.114.762 2.179 1.371 3.16.439.752.918 1.479 1.435 2.18 1.68 2.302 3.793 4.255 6.22 5.753 1.218.761 2.52 1.38 3.88 1.844 1.412.639 2.972.884 4.513.709.878-.133 1.71-.479 2.423-1.008.712-.529 1.284-1.224 1.664-2.024.223-.484.29-1.024.193-1.548-.233-1.07-1.668-1.703-2.548-2.219Z" fill="#00D95F" />
                                </svg>
                                <span className="select-all">+56 9 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-2">
                                {/* Gmail */}
                                <svg className="h-5 w-5" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                                    <path d="M13.0065 56.1236H21.4893V35.5227L9.37109 26.4341V52.4881C9.37109 54.4997 11.001 56.1236 13.0065 56.1236Z" fill="#4285F4" />
                                    <path d="M50.5732 56.1236H59.056C61.0676 56.1236 62.6914 54.4937 62.6914 52.4881V26.4341L50.5732 35.5227" fill="#34A853" />
                                    <path d="M50.5732 19.7693V35.5229L62.6914 26.4343V21.587C62.6914 17.0912 57.5594 14.5282 53.9663 17.2245" fill="#FBBC04" />
                                    <path d="M21.4893 35.5227V19.769L36.0311 30.6754L50.5729 19.769V35.5227L36.0311 46.429" fill="#EA4335" />
                                    <path d="M9.37109 21.587V26.4343L21.4893 35.5229V19.7693L18.0962 17.2245C14.4971 14.5282 9.37109 17.0912 9.37109 21.587Z" fill="#C5221F" />
                                </svg>
                                <span className="select-all">dinovancejr1098@gmail.com</span>
                            </li>
                        </ul>

                        {/* Redes */}
                        <div className="mt-5 flex gap-3">
                            <a href="#" aria-label="Facebook" className="rounded-lg p-1 text-gray-500 transition-all hover:-translate-y-1 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                <svg width="28" height="28" viewBox="0 0 93 92" fill="none">
                                    <rect x="1.14" width="91.56" height="91.56" rx="15" fill="#337FFF" />
                                    <path d="M57.423 48.64 58.728 40.36h-8.037v-5.383c0-2.265 1.122-4.477 4.71-4.477h3.705v-7.052c-2.157-.343-4.337-.529-6.522-.556-6.614 0-10.933 3.972-10.933 11.154v6.315h-7.332V48.64h7.332V68.67h9.041V48.64h6.731Z" fill="#fff" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="rounded-lg p-1 text-gray-500 transition-all hover:-translate-y-1 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 93 92" fill="none">
                                    <rect x="1.13867" width="91.5618" height="91.5618" rx="15" fill="url(#paint0_linear_7092_54439)" />
                                    <path d="M38.3762 45.7808C38.3762 41.1786 42.1083 37.4468 46.7132 37.4468C51.3182 37.4468 55.0522 41.1786 55.0522 45.7808C55.0522 50.383 51.3182 54.1148 46.7132 54.1148C42.1083 54.1148 38.3762 50.383 38.3762 45.7808ZM33.8683 45.7808C33.8683 52.8708 39.619 58.618 46.7132 58.618C53.8075 58.618 59.5581 52.8708 59.5581 45.7808C59.5581 38.6908 53.8075 32.9436 46.7132 32.9436C39.619 32.9436 33.8683 38.6908 33.8683 45.7808ZM57.0648 32.4346C57.0646 33.0279 57.2404 33.608 57.5701 34.1015C57.8997 34.595 58.3684 34.9797 58.9168 35.2069C59.4652 35.4342 60.0688 35.4939 60.6511 35.3784C61.2334 35.2628 61.7684 34.9773 62.1884 34.5579C62.6084 34.1385 62.8945 33.6041 63.0105 33.0222C63.1266 32.4403 63.0674 31.8371 62.8404 31.2888C62.6134 30.7406 62.2289 30.2719 61.7354 29.942C61.2418 29.6122 60.6615 29.436 60.0679 29.4358H60.0667C59.2708 29.4361 58.5077 29.7522 57.9449 30.3144C57.3821 30.8767 57.0655 31.6392 57.0648 32.4346ZM36.6072 66.1302C34.1683 66.0192 32.8427 65.6132 31.9618 65.2702C30.7939 64.8158 29.9606 64.2746 29.0845 63.4002C28.2083 62.5258 27.666 61.6938 27.2133 60.5266C26.8699 59.6466 26.4637 58.3214 26.3528 55.884C26.2316 53.2488 26.2073 52.4572 26.2073 45.781C26.2073 39.1048 26.2336 38.3154 26.3528 35.678C26.4639 33.2406 26.8731 31.918 27.2133 31.0354C27.668 29.8682 28.2095 29.0354 29.0845 28.1598C29.9594 27.2842 30.7919 26.7422 31.9618 26.2898C32.8423 25.9466 34.1683 25.5406 36.6072 25.4298C39.244 25.3086 40.036 25.2844 46.7132 25.2844C53.3904 25.2844 54.1833 25.3106 56.8223 25.4298C59.2612 25.5408 60.5846 25.9498 61.4677 26.2898C62.6356 26.7422 63.4689 27.2854 64.345 28.1598C65.2211 29.0342 65.7615 29.8682 66.2161 31.0354C66.5595 31.9154 66.9658 33.2406 67.0767 35.678C67.1979 38.3154 67.2221 39.1048 67.2221 45.781C67.2221 52.4572 67.1979 53.2466 67.0767 55.884C66.9656 58.3214 66.5573 59.6462 66.2161 60.5266C65.7615 61.6938 65.2199 62.5266 64.345 63.4002C63.4701 64.2738 62.6356 64.8158 61.4677 65.2702C60.5872 65.6134 59.2612 66.0194 56.8223 66.1302C54.1855 66.2514 53.3934 66.2756 46.7132 66.2756C40.033 66.2756 39.2432 66.2514 36.6072 66.1302ZM36.4001 20.9322C33.7371 21.0534 31.9174 21.4754 30.3282 22.0934C28.6824 22.7316 27.2892 23.5878 25.897 24.977C24.5047 26.3662 23.6502 27.7608 23.0116 29.4056C22.3933 30.9948 21.971 32.8124 21.8497 35.4738C21.7265 38.1394 21.6982 38.9916 21.6982 45.7808C21.6982 52.57 21.7265 53.4222 21.8497 56.0878C21.971 58.7494 22.3933 60.5668 23.0116 62.156C23.6502 63.7998 24.5049 65.196 25.897 66.5846C27.289 67.9732 28.6824 68.8282 30.3282 69.4682C31.9204 70.0862 33.7371 70.5082 36.4001 70.6294C39.0687 70.7506 39.92 70.7808 46.7132 70.7808C53.5065 70.7808 54.3592 70.7526 57.0264 70.6294C59.6896 70.5082 61.5081 70.0862 63.0983 69.4682C64.7431 68.8282 66.1373 67.9738 67.5295 66.5846C68.9218 65.1954 69.7745 63.7998 70.4149 62.156C71.0332 60.5668 71.4575 58.7492 71.5768 56.0878C71.698 53.4202 71.7262 52.57 71.7262 45.7808C71.7262 38.9916 71.698 38.1394 71.5768 35.4738C71.4555 32.8122 71.0332 30.9938 70.4149 29.4056C69.7745 27.7618 68.9196 26.3684 67.5295 24.977C66.1395 23.5856 64.7431 22.7316 63.1003 22.0934C61.5081 21.4754 59.6894 21.0514 57.0284 20.9322C54.3612 20.811 53.5085 20.7808 46.7152 20.7808C39.922 20.7808 39.0687 20.809 36.4001 20.9322Z" fill="white" />
                                    <defs>
                                        <linearGradient id="paint0_linear_7092_54439" x1="90.9407" y1="91.5618" x2="-0.621143" y2="-2.46459e-06" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#FBE18A" />
                                            <stop offset="0.21" stopColor="#FCBB45" />
                                            <stop offset="0.38" stopColor="#F75274" />
                                            <stop offset="0.52" stopColor="#D53692" />
                                            <stop offset="0.74" stopColor="#8F39CE" />
                                            <stop offset="1" stopColor="#5B4FE9" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="rounded-lg p-1 text-gray-500 transition-all hover:-translate-y-1 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                <svg width="28" height="28" viewBox="0 0 93 93" fill="none">
                                    <rect x="1.14" y="1" width="91.56" height="91.56" rx="15" fill="#006699" />
                                    <path d="M37.134 63.43V40.907h-7.487V63.43h7.487Zm-3.742-25.598c2.61 0 4.235-1.73 4.235-3.892-.05-2.21-1.626-3.891-4.186-3.891-2.563 0-4.236 1.681-4.236 3.892 0 2.16 1.625 3.89 4.137 3.89h.05ZM41.278 63.43h7.486V50.854c0-.672.048-1.346.246-1.826.541-1.346 1.773-2.739 3.842-2.739 2.708 0 3.792 2.065 3.792 5.094V63.43h7.486V50.516c0-6.918-3.693-10.138-8.619-10.138-4.038 0-5.812 2.257-6.797 3.794h.05v-3.266h-7.486c.098 2.113 0 22.524 0 22.524Z" fill="#fff" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* barra inferior */}
                <div className="mt-10 border-t border-gray-300 pt-6">
                    <div className="text-center text-black font-bold">
                        &copy; {new Date().getFullYear()} Dinovance. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
}
