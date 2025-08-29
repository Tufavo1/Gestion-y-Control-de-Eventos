"use client";


export default function AuthSocialButtons() {
    const handleSocialClick = (provider: string) => {
        console.log(`Iniciar sesión con ${provider}`);
        // Aquí ira el redirigir a OAuth / API backend
    };

    return (
        <div className="mt-6 space-y-3">

            <button type="button" onClick={() => handleSocialClick("Google")} className="flex items-center bg-gray-100 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <svg className="h-6 w-6" viewBox="-0.5 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <g fill="none" fillRule="evenodd">
                        <path d="M9.827 24c0-1.524.253-2.985.705-4.356L2.623 13.604C1.082 16.734.214 20.26.214 24c0 3.737.868 7.261 2.407 10.389l7.905-6.051A14.13 14.13 0 0 1 9.827 24" fill="#FBBC05" />
                        <path d="M23.714 10.133c3.311 0 6.302 1.173 8.652 3.093l6.836-6.827C35.036 2.773 29.695.533 23.714.533c-9.287 0-17.268 5.311-21.091 13.071l7.909 6.04c1.823-5.532 7.018-9.511 13.182-9.511" fill="#EB4335" />
                        <path d="M23.714 37.867c-6.164 0-11.359-3.979-13.182-9.511l-7.909 6.038C6.446 42.156 14.427 47.467 23.714 47.467c5.732 0 11.205-2.036 15.311-5.849l-7.507-5.804c-2.118 1.334-4.785 2.053-7.804 2.053" fill="#34A853" />
                        <path d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714v9.067h12.604c-.63 3.091-2.345 5.467-4.8 7.013l7.507 5.804C43.34 37.614 46.145 31.649 46.145 24" fill="#4285F4" />
                    </g>
                </svg>
                <span>Continuar con Google</span>
            </button>

        </div>
    );
}
