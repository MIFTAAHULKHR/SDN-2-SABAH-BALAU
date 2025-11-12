import React from 'react';
import Link from 'next/link';
// Menggunakan path alias '@/
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BiArrowBack } from 'react-icons/bi';

// PERBAIKAN: Nama fungsi diubah agar sesuai dengan file
export default function MateriBing5Bab4Page() {
  
  const videoEmbedUrl = "https://www.youtube.com/embed/fLViblUZl_Y";
  const videoTitle = "Materi Bab 4: I Have Stomachache";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* PERBAIKAN: Padding (py) dikecilkan untuk HP */}
      <main className="py-10 md:py-16 flex-grow">
        <div className="container mx-auto px-4">
          
          {/* Judul Halaman */}
          {/* PERBAIKAN: Ukuran font dikecilkan untuk HP (text-3xl) */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4">
            Pusat Akademik Siswa
          </h1>
          {/* PERBAIKAN: Ukuran font dikecilkan untuk HP (text-2xl) dan margin-bottom (mb-10) */}
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 text-center mb-10 md:mb-12">
            I Have Stomachache
          </h2>

          {/* Wrapper Konten (Pusat, lebar terbatas) */}
          <div className="max-w-4xl mx-auto">
            
            {/* PERBAIKAN: Ukuran font dikecilkan untuk HP (text-xl) */}
            <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4">
              Video Pembelajaran
            </h3>
            
            {/* Kontainer Video Responsif (Rasio 16:9) */}
            <div className="aspect-video w-full mb-10 rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <iframe
                src={videoEmbedUrl}
                title={`Video Pembelajaran: ${videoTitle}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Tombol Kembali (Navigasi) */}
            {/* PERBAIKAN: Margin-top (mt) dikecilkan untuk HP (mt-8) */}
            <div className="text-center mt-8 md:mt-12">
              <Link 
                href="/akademik/kelas-5/bahasa-inggris" // Link kembali ke halaman "Pilih Bab"
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