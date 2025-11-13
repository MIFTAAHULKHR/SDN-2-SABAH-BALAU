// app/fasilitas/page.tsx
import React from 'react';
import Image from 'next/image'; // <-- 1. Impor Image
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 

// Data untuk kartu fasilitas (Tetap sama)
const facilitiesData = [
  { imgSrc: "/Dokumentasi/R.KEPSEK.png", alt: "Ruang Kepala Sekolah", title: "Ruang Kepala Sekolah" },
  { imgSrc: "/Dokumentasi/R.KELAS.png", alt: "Ruang Kelas", title: "Ruang Kelas" },
  { imgSrc: "/Dokumentasi/UKS.png", alt: "Ruang UKS", title: "Ruang UKS" },
  { imgSrc: "/Dokumentasi/mushola.png", alt: "Mushola", title: "Mushola" },
  { imgSrc: "/Dokumentasi/LAPANGAN1.png", alt: "Lapangan Olahraga", title: "Lapangan Olahraga" },
  { imgSrc: "/Dokumentasi/perpustakaan2.png", alt: "Perpustakaan", title: "Perpustakaan" },
  { imgSrc: "/Dokumentasi/PARKIRAN.png", alt: "Area Parkir", title: "Area Parkir" },
  { imgSrc: "/Dokumentasi/toilet.png", alt: "Toilet Siswa", title: "Toilet Siswa" },
  { imgSrc: "/Dokumentasi/WESTAFEL.png", alt: "Tempat Cuci Tangan", title: "Westafel" },
];

// <-- 2. Tentukan tipe untuk props Card
interface FacilityCardProps {
  imgSrc: string;
  alt: string;
  title: string;
}

// <-- 3. Terapkan tipe props
const FacilityCard = ({ imgSrc, alt, title }: FacilityCardProps) => (
  <div className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col h-full">
    
    {/* <-- 4. Ganti <img> dengan <Image> --> */}
    <div className="relative w-full h-56 md:h-64">
      <Image
        src={imgSrc}
        alt={alt}
        fill={true} // Otomatis mengisi div
        className="object-cover" // Menjaga rasio aspek
      />
    </div>
    
    {/* Menggunakan `grow` (pengganti `flex-grow` dari perbaikan sebelumnya) */}
    <div className="p-4 md:p-5 grow">
      <h5 className="text-lg md:text-xl font-semibold text-slate-800 mb-1">
        {title}
      </h5>
      <p className="text-sm text-slate-500">
        SDN 2 Sabah Balau
      </p>
    </div>
  </div>
);

// Komponen Halaman Fasilitas
export default function FasilitasPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main>
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-10 md:mb-12">
              Fasilitas Pendukung Belajar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {facilitiesData.map((facility) => (
                <FacilityCard
                  key={facility.title}
                  imgSrc={facility.imgSrc}
                  alt={facility.alt}
                  title={facility.title}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}