// app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { createClient } from '@/lib/supabaseClient'; // Impor klien Supabase


// Impor ikon
import {
  HiViewGrid,
  HiExternalLink,
  HiLogout,
  HiUserCircle,
  HiAcademicCap,
  HiCalculator,
  HiGlobe,
  HiSave,
  HiArrowLeft,
  HiOutlineRefresh // Ikon loading
} from 'react-icons/hi';

// --- Tipe Data (Baru) ---
interface BabData {
  nama: string;
  youtube: string;
}
interface MateriMap {
  [kelas: string]: {
    [pelajaran: string]: {
      [babKey: string]: BabData;
    };
  };
}
// -------------------------

// Komponen Sidebar (Modifikasi: Tambah Logout)
const Sidebar = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-8 text-white">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/Dokumentasi/logo.png" alt="Logo Sekolah" width={40} height={40} />
        <span className="text-xl font-bold">Admin Panel</span>
      </Link>

      <div className="mt-8 flex flex-1 flex-col justify-between">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link href="/admin" className="flex items-center rounded-lg bg-white px-4 py-3 text-blue-600 font-semibold shadow">
              <HiViewGrid className="mr-3" size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/" className="flex items-center rounded-lg px-4 py-3 text-white/80 transition-all hover:bg-white/10 hover:text-white">
              <HiExternalLink className="mr-3" size={20} />
              Lihat Situs
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-3 text-red-300 transition-all hover:bg-red-500 hover:text-white"
            >
              <HiLogout className="mr-3" size={20} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};


// Komponen Utama Halaman Dashboard
export default function AdminPage() {

  const router = useRouter();

const [isCheckingAuth, setIsCheckingAuth] = useState(true);
const [view, setView] = useState('pilih-kelas');
const [currentKelas, setCurrentKelas] = useState(null);
const [currentPelajaran, setCurrentPelajaran] = useState(null);
const [currentBab, setCurrentBab] = useState(null);
const [currentBabData, setCurrentBabData] = useState(null);
const [youtubeLink, setYoutubeLink] = useState('');

useEffect(() => {
  // Tunggu sampai kode dijalankan di sisi browser
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false); // user ditemukan → lanjut render dashboard
    }
  }
}, [router]);

// Kalau masih mengecek auth, jangan render dashboard dulu
if (isCheckingAuth) {
  return <div className="p-10 text-center text-slate-600">Memeriksa sesi login...</div>;
}


  const supabase = createClient();
  const router = useRouter();


  // State untuk data materi dari Supabase
  const [dataAkademik, setDataAkademik] = useState<MateriMap | null>(null);
  
  // State UI
  const [view, setView] = useState('pilih-kelas');
  const [currentKelas, setCurrentKelas] = useState<string | null>(null);
  const [currentPelajaran, setCurrentPelajaran] = useState<string | null>(null);
  const [currentBab, setCurrentBab] = useState<string | null>(null);
  const [currentBabData, setCurrentBabData] = useState<BabData | null>(null);
  
  // State Form
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State loading
  const [statusMessage, setStatusMessage] = useState(''); // State pesan sukses/error

  // --- FUNGSI BARU: Load data dari Supabase ---
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('materi')
        .select('bab_id, nama_bab, kelas, mapel, video_url');

      if (error) {
        setStatusMessage(`Error loading data: ${error.message}`);
        return;
      }
      
      // Ubah data array dari Supabase menjadi objek terstruktur
      const materiMap: MateriMap = {};
      for (const item of data) {
        const { kelas, mapel, bab_id, nama_bab, video_url } = item;
        
        // Buat key bab (cth: "bab1" dari "k5-mtk-bab1")
        const babKey = bab_id.split('-').pop() || bab_id;
        // Buat key mapel (cth: "Matematika" dari "matematika")
        const mapelKey = mapel === 'matematika' ? 'Matematika' : 'Bahasa Inggris';
        
        if (!materiMap[kelas]) materiMap[kelas] = {};
        if (!materiMap[kelas][mapelKey]) materiMap[kelas][mapelKey] = {};
        
        materiMap[kelas][mapelKey][babKey] = {
          nama: nama_bab,
          youtube: video_url || ''
        };
      }
      setDataAkademik(materiMap);
      setIsLoading(false);
    }
    
    // Cek otentikasi (meskipun sudah ada middleware, ini bagus untuk client)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
      } else {
        fetchData();
      }
    });
  }, [router, supabase]);
  // ------------------------------------------

  const handleKelasClick = (kelas: string) => {
    setCurrentKelas(kelas);
    setView('pilih-pelajaran');
  };

  const handlePelajaranClick = (pelajaran: string) => {
    setCurrentPelajaran(pelajaran);
    setView('pilih-bab');
  };

  const handleBabClick = (babKey: string, babData: BabData) => {
    setCurrentBab(babKey);
    setCurrentBabData(babData);
    setYoutubeLink(babData.youtube || ''); // Isi form dengan link dari database
    setStatusMessage(''); // Bersihkan pesan status
    setView('form-materi');
  };

  // --- FUNGSI UPDATE: Simpan ke Supabase ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentKelas || !currentPelajaran || !currentBab) return;
    
    setIsLoading(true);
    setStatusMessage('');

    // Buat ID unik untuk update
    const mapelId = currentPelajaran === 'Matematika' ? 'matematika' : 'bahasa-inggris';
    const bab_id = `k${currentKelas}-${mapelId}-${currentBab}`;

    // Update data di Supabase
    const { error } = await supabase
      .from('materi')
      .update({ video_url: youtubeLink })
      .eq('bab_id', bab_id);

    setIsLoading(false);
    if (error) {
      setStatusMessage(`Error: ${error.message}`);
    } else {
      setStatusMessage('Sukses! Link video telah diperbarui.');
      // Update state lokal agar UI sinkron
      if (dataAkademik) {
        const newData = { ...dataAkademik };
        newData[currentKelas][currentPelajaran][currentBab].youtube = youtubeLink;
        setDataAkademik(newData);
      }
    }
  };
  // -----------------------------------------

  const getBabList = () => {
    if (currentKelas && currentPelajaran && dataAkademik && dataAkademik[currentKelas] && dataAkademik[currentKelas][currentPelajaran]) {
      // Urutkan bab (misal: bab1, bab2, bab10)
      const sortedKeys = Object.keys(dataAkademik[currentKelas][currentPelajaran]).sort((a, b) => {
        const numA = parseInt(a.replace('bab', ''), 10);
        const numB = parseInt(b.replace('bab', ''), 10);
        return numA - numB;
      });
      
      return sortedKeys.map(key => [key, dataAkademik[currentKelas!][currentPelajaran!][key]]);
    }
    return [];
  };
  
  // Tampilan Loading
  if (isLoading && !dataAkademik) {
    return (
      <div className="flex bg-gray-50 text-slate-800">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto h-screen flex justify-center items-center">
          <HiOutlineRefresh className="animate-spin text-blue-600" size={48} />
          <span className="text-xl ml-4">Memuat data materi...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 text-slate-800">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto h-screen">
        
        <h1 className="text-4xl font-bold text-slate-800">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">Selamat datang, admin. Kelola konten website dari sini.</p>
        
        <hr className="my-6" />

        <div className="rounded-xl bg-white p-6 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Kelola Materi Pembelajaran</h2>
          
          {/* Tampilan Pilih Kelas */}
          <section id="pilih-kelas" style={{ display: view === 'pilih-kelas' ? 'block' : 'none' }}>
            <h5 className="text-xl font-semibold mb-4">Langkah 1: Pilih Kelas</h5>
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="card-admin"
                onClick={() => handleKelasClick('5')}
              >
                <HiUserCircle size={48} className="text-blue-600 mb-3" />
                <h3 className="text-2xl font-semibold">Kelas 5</h3>
              </div>
              <div 
                className="card-admin"
                onClick={() => handleKelasClick('6')}
              >
                <HiAcademicCap size={48} className="text-blue-600 mb-3" />
                <h3 className="text-2xl font-semibold">Kelas 6</h3>
              </div>
            </div>
          </section>

          {/* Tampilan Pilih Pelajaran */}
          <section id="pilih-pelajaran" style={{ display: view === 'pilih-pelajaran' ? 'block' : 'none' }}>
            <h5 className="text-xl font-semibold mb-4">Langkah 2: Pilih Mata Pelajaran (Kelas {currentKelas})</h5>
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="card-admin-list"
                onClick={() => handlePelajaranClick('Matematika')}
              >
                <HiCalculator size={24} className="text-blue-600 mr-3" />
                <h4 className="text-lg font-semibold">Matematika (MTK)</h4>
              </div>
              <div 
                className="card-admin-list"
                onClick={() => handlePelajaranClick('Bahasa Inggris')}
              >
                <HiGlobe size={24} className="text-blue-600 mr-3" />
                <h4 className="text-lg font-semibold">Bahasa Inggris</h4>
              </div>
            </div>
            <button 
              className="btn-kembali"
              onClick={() => setView('pilih-kelas')}
            >
              <HiArrowLeft className="mr-1" />
              Kembali
            </button>
          </section>

          {/* Tampilan Pilih Bab */}
          <section id="pilih-bab" style={{ display: view === 'pilih-bab' ? 'block' : 'none' }}>
            <h5 className="text-xl font-semibold mb-4">Langkah 3: Pilih Bab yang Ingin Diubah</h5>
            <div className="max-w-2xl">
              <div className="flex flex-col rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                
                {getBabList().map(([babKey, babObject]) => { 
                  const bab = babObject as BabData; 
                  const babNum = babKey.replace('bab', '');
                  return (
                    <div 
                      key={babKey}
                      className="flex items-center p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => handleBabClick(babKey, bab)} 
                    >
                      <strong className="text-slate-800">Bab {babNum}.</strong>
                      <span className="ml-2">{bab.nama}</span> 
                    </div>
                  );
                })}
              </div>
            </div>
            <button 
              className="btn-kembali"
              onClick={() => setView('pilih-pelajaran')}
            >
              <HiArrowLeft className="mr-1" />
              Kembali
            </button>
          </section>

          {/* Tampilan Form Materi */}
          <section id="form-materi" style={{ display: view === 'form-materi' ? 'block' : 'none' }}>
            <h5 className="text-xl font-semibold mb-2">Langkah 4: Masukkan Link YouTube Baru</h5>
            <h6 className="text-slate-500 font-normal mb-4">
              Materi: {currentBab?.replace('bab', 'Bab ')} - {currentBabData?.nama}
            </h6>
            
            <form onSubmit={handleSubmit} className="max-w-2xl">
              <div className="mb-4">
                <label htmlFor="youtube-link" className="block text-sm font-medium text-slate-700 mb-1">Link Video YouTube:</label>
                <input 
                  type="url" 
                  id="youtube-link" 
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  placeholder="https://www.youtube.com/embed/..." 
                  required 
                />
                <div className="text-xs text-slate-500 mt-1">Pastikan link menggunakan format "embed".</div>
              </div>

              {/* Tampilan status/loading */}
              {statusMessage && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                  statusMessage.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {statusMessage}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn-simpan disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <HiOutlineRefresh className="animate-spin mr-2" />
                ) : (
                  <HiSave className="mr-2" />
                )}
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button 
                type="button" 
                className="btn-kembali ml-3"
                onClick={() => setView('pilih-bab')}
              >
                <HiArrowLeft className="mr-1" />
                Kembali
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
