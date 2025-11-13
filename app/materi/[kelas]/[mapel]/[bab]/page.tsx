// app/materi/[kelas]/[mapel]/[bab]/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Quiz from '@/components/Quiz'; // Impor komponen Kuis
import { BiArrowBack } from 'react-icons/bi';
import { createServerClient } from '@supabase/ssr'; // Klien server
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr'; // Impor tipe

// Tipe data untuk halaman ini
interface MateriPageProps {
  params: {
    kelas: string;
    mapel: string;
    bab: string;
  };
}

// Fungsi untuk membuat Supabase Server Client
function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Tambahkan set dan remove (opsional tapi best practice)
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}

// Fungsi untuk mengambil data materi
async function getMateri(bab_id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('materi')
    .select(`
      nama_bab,
      video_url,
      kuis ( soal, pilihan, jawaban )
    `)
    .eq('bab_id', bab_id)
    .single(); // Ambil satu baris data

  if (error) {
    console.error("Error fetching materi:", error.message);
    return null;
  }
  return data;
}

// Ini adalah Server Component
export default async function MateriPage({ params }: MateriPageProps) {
  // Buat ID unik berdasarkan parameter URL
  // Cth: URL ".../k5/matematika/bab1" akan menjadi ID "k5-matematika-bab1"
  const bab_id = `${params.kelas}-${params.mapel}-${params.bab}`;

  const materi = await getMateri(bab_id);

  if (!materi) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="py-16 md:py-20 flex-grow">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Materi Tidak Ditemukan
            </h1>
            <p className="text-slate-600 mb-8">
              Materi yang Anda cari (ID: {bab_id}) tidak ada di database kami.
            </p>
            <Link
              href="/akademik"
              className="inline-flex items-center px-6 py-2 border border-slate-300 text-slate-600 rounded-full font-semibold hover:bg-slate-50 transition-all duration-200"
            >
              <BiArrowBack className="mr-2" />
              Kembali ke Akademik
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Tentukan link kembali berdasarkan parameter
  // Cth: /akademik/k5/matematika
  const linkKembali = `/akademik/${params.kelas}/${params.mapel}`;
  
  // Ambil data kuis (pastikan formatnya benar)
  const questions = (materi.kuis || []).map((q: any) => ({
    soal: q.soal,
    pilihan: q.pilihan, // Asumsi ini sudah array string
    jawaban: q.jawaban, // Asumsi ini sudah number (index)
  }));

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="py-16 md:py-20 flex-grow">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-slate-800 text-center mb-4">
            Pusat Akademik Siswa
          </h1>
          <h2 className="text-3xl font-semibold text-slate-700 text-center mb-12">
            {materi.nama_bab}
          </h2>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">
              Video Pembelajaran
            </h3>

            <div className="aspect-video w-full mb-10 rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <iframe
                src={materi.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"} // Fallback video
                title={`Video Pembelajaran: ${materi.nama_bab}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* --- BAGIAN KUIS BARU --- */}
            <div className="mb-12">
              <Quiz questions={questions} />
            </div>

            <div className="text-center mt-12">
              <Link
                href={linkKembali}
                className="inline-flex items-center px-6 py-2 border border-slate-300 text-slate-600 rounded-full font-semibold hover:bg-slate-50 transition-all duration-200"
              >
                <BiArrowBack className="mr-2" />
                Kembali ke Pilih Bab
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}