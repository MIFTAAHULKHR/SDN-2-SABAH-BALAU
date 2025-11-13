import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}


export interface Kelas {
  id: number;
  tingkat: number;
  nama_kelas: string;
}

export interface MataPelajaran {
  id: number;
  id_kelas: number;
  nama_pelajaran: string;
}

export interface SubBab {
  id: number;
  id_mata_pelajaran: number;
  judul_sub_bab: string;
  deskripsi: string | null;
  url_video: string;
}