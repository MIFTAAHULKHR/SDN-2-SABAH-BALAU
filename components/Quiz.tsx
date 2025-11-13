// components/Quiz.tsx
"use client";

import React, { useState } from 'react';
import { BiRevision, BiCheckCircle, BiXCircle } from 'react-icons/bi';

// Tipe data untuk soal, sesuaikan dengan tabel 'kuis' di Supabase
interface Question {
  soal: string;
  pilihan: string[];
  jawaban: number; // index dari jawaban yang benar
}

interface QuizProps {
  questions: Question[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
        Belum ada kuis untuk materi ini.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Sudah menjawab

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.jawaban;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-xl border border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Kuis Selesai!
        </h3>
        <p className="text-4xl font-bold text-blue-600 mb-2">
          Skor Anda: {score} / {questions.length}
        </p>
        <p className="text-lg text-slate-600 mb-6">
          ({((score / questions.length) * 100).toFixed(0)}%)
        </p>
        <button
          onClick={handleRestart}
          className="inline-flex items-center px-6 py-2 border border-slate-300 text-slate-600 rounded-full font-semibold hover:bg-slate-50 transition-all duration-200"
        >
          <BiRevision className="mr-2" />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-slate-800">
          Kuis Interaktif
        </h3>
        <span className="text-sm font-semibold text-slate-500">
          Soal {currentQuestionIndex + 1} dari {questions.length}
        </span>
      </div>

      <p className="text-lg text-slate-700 mb-6 min-h-[60px]">
        {currentQuestion.soal}
      </p>

      <div className="space-y-3">
        {currentQuestion.pilihan.map((opsi, index) => {
          let- (index)}
          >
            {/* Ikon hasil */}
            {selectedAnswer === index && (
              isCorrect ? (
                <BiCheckCircle className="mr-3 text-green-500" size={20} />
              ) : (
                <BiXCircle className="mr-3 text-red-500" size={20} />
              )
            )}
            
            {/* Teks Opsi */}
            <span className="flex-grow">{opsi}</span>

            {/* Ikon Jawaban Benar (jika salah menjawab) */}
            {selectedAnswer !== null && !isCorrect && index === currentQuestion.jawaban && (
              <BiCheckCircle className="ml-3 text-green-500" size={20} />
            )}
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <div className="text-right mt-6">
          <button
            onClick={handleNext}
            className="px-8 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all"
          >
            {currentQuestionIndex < questions.length - 1 ? "Lanjut" : "Lihat Hasil"}
          </button>
        </div>
      )}
    </div>
  );
}