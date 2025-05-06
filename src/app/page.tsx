import Link from "next/link"; // Brukes for intern navigasjon i Next.js

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
            {/* Tittel */}
            <h1 className="text-3xl font-bold mb-4 text-center text-white">
                Velkommen til Workmans interne KPI-nettside
            </h1>

            {/* Kort introduskjonstekst */}
            <p className="text-lg text-gray-300 mb-8 text-center">
                Hva vil du se? Velg et alternativ:
            </p>

            {/* To knapper for navigasjon */}
            <div className="flex gap-4">
                <Link href="/arbeidstyper"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                    Se alle arbeidstyper
                </Link>
                <Link
                href="/ansatte"
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
                >
                    Se alle registrerte ansatte
                </Link>
            </div>
        </main>
    );
}