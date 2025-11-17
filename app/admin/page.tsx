// sd n2-sabah-balau/app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
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
} from "react-icons/hi";

// --- DATA MATERI SEMENTARA (BISA DISAMBUNG KE SUPABASE NANTI) ---
const dataAkademik: any = {
  "5": {
    "Matematika": {
      "Bab 1": { nama: "Bilangan Bulat dan Bilangan Desimal", youtube: "" },
      "Bab 2": { nama: "Pengukuran per Kuantitas Unit", youtube: "" },
      "Bab 3": { nama: "Perkalian Bilangan Desimal", youtube: "" },
      "Bab 4": { nama: "Kekongruenan dan Sudut Bangun Datar", youtube: "" },
      "Bab 5": { nama: "Pembagian Bilangan Desimal", youtube: "" },
      "Bab 6": { nama: "Volume", youtube: "" },
      "Bab 7": { nama: "Kelipatan dan Faktor", youtube: "" },
      "Bab 8": { nama: "Pecahan", youtube: "" },
    },
    "Bahasa Inggris": {
      "Bab 1": { nama: "The Curry is Spicy", youtube: "" },
      "Bab 2": { nama: "I Drink a Glass of Milk", youtube: "" },
      "Bab 3": { nama: "How Much Do the Apples Cost?", youtube: "" },
      "Bab 4": { nama: "I Have Stomachache", youtube: "" },
      "Bab 5": { nama: "What a Nice Shirt!", youtube: "" },
      "Bab 6": { nama: "She Listens to Music with Her Ears", youtube: "" },
      "Bab 7": { nama: "The Tiger is Big, but the Cat is Small", youtube: "" },
      "Bab 8": { nama: "The Rabit is Smaller than the Goat", youtube: "" },
      "Bab 9": { nama: "The Giraffe is the Tallest Animal on Earth", youtube: "" },
      "Bab 10": { nama: "Indonesia Independence Day is on August 17th", youtube: "" },
    },
  },
  "6": {
    "Matematika": {
      "Bab 1": { nama: "Simetri", youtube: "" },
      "Bab 2": { nama: "Simbol dan Kalimat Matematika", youtube: "" },
      "Bab 3": { nama: "Perkalian Pecahan", youtube: "" },
      "Bab 4": { nama: "Pembagian Pecahan", youtube: "" },
      "Bab 5": { nama: "Kelipatan dan Perbandingan", youtube: "" },
      "Bab 6": { nama: "Pembagian Pecahan", youtube: "" },
      "Bab 7": { nama: "Menghitung Luas Berbagai Bangun Datar", youtube: "" },
      "Bab 8": { nama: "Urutan dan Kombinasi", youtube: "" },
      "Bab 9": { nama: "Kecepatan", youtube: "" },
      "Bab 10": { nama: "Volume", youtube: "" },
    },
    "Bahasa Inggris": {
      "Bab 1": { nama: "I Ate Hamburger Yesterday", youtube: "" },
      "Bab 2": { nama: "I Went to the Zoo Last Week", youtube: "" },
      "Bab 3": { nama: "I was in Lombok Last Week", youtube: "" },
      "Bab 4": { nama: "I was Happy Yesterday", youtube: "" },
      "Bab 5": { nama: "Where did You Go Yesterday?", youtube: "" },
      "Bab 6": { nama: "My Holiday Experience", youtube: "" },
      "Bab 7": { nama: "I Will Go to Bandung", youtube: "" },
      "Bab 8": { nama: "My Mother will Bake a Cake Tomorrow", youtube: "" },
      "Bab 9": { nama: "I Will Go to Bali Next Month", youtube: "" },
      "Bab 10": { nama: "Made Wants to be a Pilot", youtube: "" },
      "Bab 11": { nama: "I Want to be a Teacher", youtube: "" },
    },
  },
};

// ---------- SIDEBAR ----------
const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const router = useRouter();

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLogout();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-72 flex-col overflow-y-auto bg-gradient-to-b from-blue-600 to-cyan-400 px-6 py-8 text-white shadow-2xl">
      {/* Logo + Title */}
      <Link href="/" className="flex items-center space-x-3 mb-10">
        <Image
          src="/Dokumentasi/logo.png"
          alt="Logo Sekolah"
          width={40}
          height={40}
        />
        <span className="text-2xl font-bold tracking-tight">Admin Panel</span>
      </Link>

      {/* Menu */}
      <nav className="flex-1 flex flex-col justify-between">
        <ul className="space-y-2">
          <li>
            <div className="flex items-center rounded-xl bg-white px-4 py-3 text-blue-600 font-semibold shadow-md">
              <HiViewGrid className="mr-3" size={20} />
              Dashboard
            </div>
          </li>
          <li>
            <Link
              href="/akademik"
              className="flex items-center rounded-xl px-4 py-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              <HiExternalLink className="mr-3" size={20} />
              Lihat Situs
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogoutClick}
          className="mt-8 flex items-center rounded-xl px-4 py-3 text-red-200 transition-all hover:bg-red-500 hover:text-white"
        >
          <HiLogout className="mr-3" size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

// ---------- HALAMAN ADMIN ----------
export default function AdminPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [view, setView] = useState<
    "pilih-kelas" | "pilih-pelajaran" | "pilih-bab" | "form-materi"
  >("pilih-kelas");
  const [currentKelas, setCurrentKelas] = useState<string | null>(null);
  const [currentPelajaran, setCurrentPelajaran] = useState<string | null>(null);
  const [currentBab, setCurrentBab] = useState<string | null>(null);
  const [currentBabData, setCurrentBabData] = useState<any>(null);
  const [youtubeLink, setYoutubeLink] = useState("");

  // 🔐 Cek login via localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("admin_users");
    console.log("ADMIN_CHECK_LOCALSTORAGE", stored);
    if (!stored) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_users");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-600">
        Memeriksa sesi login...
      </div>
    );
  }

  // ---- HANDLER LANGKAH-LANGKAH ----
  const handleKelasClick = (kelas: string) => {
    setCurrentKelas(kelas);
    setCurrentPelajaran(null);
    setCurrentBab(null);
    setView("pilih-pelajaran");
  };

  const handlePelajaranClick = (pelajaran: string) => {
    setCurrentPelajaran(pelajaran);
    setCurrentBab(null);
    setView("pilih-bab");
  };

  const handleBabClick = (babKey: string, babData: { nama: string; youtube: string }) => {
    setCurrentBab(babKey);
    setCurrentBabData(babData);
    setYoutubeLink(babData.youtube || "");
    setView("form-materi");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKelas || !currentPelajaran || !currentBab) return;

    // 1. Update data lokal (biar UI langsung berubah)
    dataAkademik[currentKelas][currentPelajaran][currentBab].youtube = youtubeLink;

    // 2. Simpan ke Supabase
    const { error } = await supabase
      .from("videos")                      // ← pastikan nama tabel benar
      .upsert(
        {
          kelas: currentKelas,
          pelajaran: currentPelajaran,
          bab: currentBab,
          youtube_url: youtubeLink,               // atau nama kolom misal: "youtube_url"
        },
        {
          onConflict: "kelas,pelajaran,bab",
        }
      );

    if (error) {
      console.error("Gagal simpan ke Supabase:", error);
      alert("Gagal menyimpan ke database: " + error.message);
      return;
    }

    alert(
      `Perubahan tersimpan!\n\n${currentPelajaran} - ${currentBab} sekarang menggunakan link:\n${youtubeLink}`
    );
    setView("pilih-bab");
  };


  const getBabList = () => {
    if (
      currentKelas &&
      currentPelajaran &&
      dataAkademik[currentKelas] &&
      dataAkademik[currentKelas][currentPelajaran]
    ) {
      return Object.entries(dataAkademik[currentKelas][currentPelajaran]);
    }
    return [];
  };

  // ---------- RENDER ----------
  return (
    <div className="flex bg-gray-50 text-slate-800">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 h-screen overflow-y-auto p-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-slate-500">
            Selamat datang, admin. Kelola konten website dari sini.
          </p>
          <hr className="mt-6 border-slate-200" />
        </header>

        {/* Card Utama */}
        <section className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">
            Kelola Materi Pembelajaran
          </h2>

          {/* ---------- LANGKAH 1: PILIH KELAS ---------- */}
          {view === "pilih-kelas" && (
            <div className="mt-6">
              <h5 className="text-xl font-semibold mb-4">
                Langkah 1: Pilih Kelas
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleKelasClick("5")}
                  className="card-admin flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-8 py-10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <HiUserCircle size={48} className="text-blue-600 mb-3" />
                  <h3 className="text-2xl font-semibold">Kelas 5</h3>
                </button>
                <button
                  onClick={() => handleKelasClick("6")}
                  className="card-admin flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-8 py-10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <HiAcademicCap size={48} className="text-blue-600 mb-3" />
                  <h3 className="text-2xl font-semibold">Kelas 6</h3>
                </button>
              </div>
            </div>
          )}

          {/* ---------- LANGKAH 2: PILIH PELAJARAN ---------- */}
          {view === "pilih-pelajaran" && (
            <div className="mt-6">
              <h5 className="text-xl font-semibold mb-4">
                Langkah 2: Pilih Mata Pelajaran (Kelas {currentKelas})
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => handlePelajaranClick("Matematika")}
                  className="card-admin-list flex items-center rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <HiCalculator size={24} className="text-blue-600 mr-3" />
                  <span className="text-lg font-semibold">Matematika (MTK)</span>
                </button>
                <button
                  onClick={() => handlePelajaranClick("Bahasa Inggris")}
                  className="card-admin-list flex items-center rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <HiGlobe size={24} className="text-blue-600 mr-3" />
                  <span className="text-lg font-semibold">Bahasa Inggris</span>
                </button>
              </div>

              <button
                className="btn-kembali mt-6 inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => setView("pilih-kelas")}
              >
                <HiArrowLeft className="mr-1" />
                Kembali
              </button>
            </div>
          )}

          {/* ---------- LANGKAH 3: PILIH BAB ---------- */}
          {view === "pilih-bab" && (
            <div className="mt-6">
              <h5 className="text-xl font-semibold mb-4">
                Langkah 3: Pilih Bab yang Ingin Diubah
              </h5>
              <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                {getBabList().map(([babKey, babObject]) => {
                  const bab = babObject as { nama: string; youtube: string };
                  return (
                    <button
                      key={babKey}
                      onClick={() => handleBabClick(babKey, bab)}
                      className="flex w-full items-center justify-between px-5 py-4 border-b border-slate-100 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">
                          {babKey}.
                        </span>
                        <span className="ml-2 text-slate-700">{bab.nama}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {bab.youtube ? "Sudah ada link" : "Belum ada link"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                className="btn-kembali mt-6 inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => setView("pilih-pelajaran")}
              >
                <HiArrowLeft className="mr-1" />
                Kembali
              </button>
            </div>
          )}

          {/* ---------- LANGKAH 4: FORM LINK YOUTUBE ---------- */}
          {view === "form-materi" && (
            <div className="mt-6 max-w-3xl">
              <h5 className="text-xl font-semibold mb-2">
                Langkah 4: Masukkan Link YouTube Baru
              </h5>
              <h6 className="text-slate-500 font-normal mb-4">
                Materi: {currentBab} - {currentBabData?.nama}
              </h6>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="youtube-link"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Link Video YouTube:
                  </label>
                  <input
                    type="url"
                    id="youtube-link"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                    placeholder="https://www.youtube.com/embed/..."
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan link menggunakan format{" "}
                    <span className="font-mono">/embed/</span>.
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                  >
                    <HiSave className="mr-2" />
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("pilih-bab")}
                    className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <HiArrowLeft className="mr-1" />
                    Kembali
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
