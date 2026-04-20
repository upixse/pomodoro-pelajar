import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Plus, Trash2, BookOpen, Coffee, Wind, Instagram, Facebook } from 'lucide-react';

// Konstanta waktu dalam detik
const TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const QUOTES = [
  "Sedikit demi sedikit, lama-lama menjadi bukit.",
  "Masa depan adalah milik mereka yang menyiapkannya hari ini.",
  "Pendidikan adalah senjata paling ampuh untuk mengubah dunia.",
  "Beri dirimu istirahat, kamu sudah bekerja keras!",
  "Fokuslah pada tujuanmu, bukan hambatannya.",
  "Setiap detik yang kamu gunakan untuk belajar adalah investasi."
];

export default function App() {
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(TIMES.focus);
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Membaca Bab 3 Biologi', completed: false },
    { id: 2, text: 'Latihan Soal Matematika', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [quote, setQuote] = useState(QUOTES[0]);

  // Mengubah waktu saat mode berubah
  useEffect(() => {
    setTimeLeft(TIMES[mode]);
    setIsActive(false);
    
    // Ganti quote saat ganti mode
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, [mode]);

  // Logika Timer
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Mainkan notifikasi sederhana jika diperlukan (browser alert / sound)
      alert(mode === 'focus' ? 'Waktu Fokus Selesai! Saatnya istirahat.' : 'Waktu Istirahat Selesai! Yuk kembali fokus.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  // Format Waktu ke MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMES[mode]);
  };

  // Logika Task
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Pengaturan UI berdasarkan Mode
  const modeConfig = {
    focus: {
      color: 'text-rose-500',
      bgColor: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      borderColor: 'border-rose-100',
      icon: <BookOpen size={18} />,
      label: 'Fokus Belajar'
    },
    shortBreak: {
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: <Coffee size={18} />,
      label: 'Istirahat Pendek'
    },
    longBreak: {
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      borderColor: 'border-blue-100',
      icon: <Wind size={18} />,
      label: 'Istirahat Panjang'
    }
  };

  const currentConfig = modeConfig[mode];

  // Kalkulasi untuk Circular Progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / TIMES[mode]) * circumference;

  return (
    <div className={`min-h-screen flex justify-center bg-stone-100 font-sans transition-colors duration-500`}>
      {/* Kontainer bergaya Mobile App */}
      <div className="w-full max-w-md bg-white shadow-2xl relative overflow-hidden flex flex-col sm:my-8 sm:rounded-[2.5rem] border border-stone-200">
        
        {/* Header Section */}
        <div className={`${currentConfig.lightBg} p-6 pb-8 transition-colors duration-500 rounded-b-3xl shadow-sm`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-2xl font-bold ${currentConfig.color} flex items-center gap-2`}>
              🍅 PomoPelajar
            </h1>
            <div className={`px-3 py-1.5 rounded-full bg-white/60 text-sm font-medium ${currentConfig.color} shadow-sm backdrop-blur-sm`}>
              {tasks.filter(t => t.completed).length}/{tasks.length} Selesai
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center bg-white/60 p-1.5 rounded-2xl backdrop-blur-md shadow-sm mb-8 relative z-10">
            {Object.entries(modeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex-1 py-2.5 px-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  mode === key 
                    ? `${config.bgColor} text-white shadow-md transform scale-[1.02]` 
                    : 'text-stone-500 hover:bg-white/50'
                }`}
              >
                {config.icon}
                <span className="hidden sm:inline">{config.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative flex justify-center items-center py-4">
            {/* SVG Progress Circle */}
            <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-current text-white/50"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className={`stroke-current ${currentConfig.color} transition-all duration-1000 ease-linear`}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-5xl sm:text-6xl font-extrabold tracking-tighter ${currentConfig.color}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-stone-500 font-medium mt-1 uppercase tracking-widest text-xs">
                {currentConfig.label}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-6">
            <button 
              onClick={resetTimer}
              className={`p-3.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all ${currentConfig.color} hover:scale-105 active:scale-95 border ${currentConfig.borderColor}`}
            >
              <RotateCcw size={24} />
            </button>
            
            <button 
              onClick={toggleTimer}
              className={`p-5 rounded-full ${currentConfig.bgColor} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 transform -translate-y-2`}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

             {/* Dummy button untuk balance layout */}
             <div className="w-[54px] h-[54px]"></div>
          </div>
        </div>

        {/* Content Section (Tasks & Motivation) */}
        <div className="flex-1 p-6 flex flex-col gap-6 bg-white overflow-y-auto">
          
          {/* Motivation Quote */}
          <div className={`p-4 rounded-2xl ${currentConfig.lightBg} border ${currentConfig.borderColor} text-center`}>
            <p className={`text-sm italic font-medium ${currentConfig.color} opacity-80`}>
              "{quote}"
            </p>
          </div>

          {/* Task List */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-stone-800">Target Belajar</h2>
            </div>

            {/* Add Task Input */}
            <form onSubmit={addTask} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Apa yang ingin dipelajari?"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow focus:border-transparent placeholder-stone-400"
                style={{ '--tw-ring-color': currentConfig.bgColor }}
              />
              <button 
                type="submit"
                disabled={!newTask.trim()}
                className={`p-3 rounded-xl text-white ${currentConfig.bgColor} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
              >
                <Plus size={20} />
              </button>
            </form>

            {/* List */}
            <div className="flex-1 space-y-2 pb-2 pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-sm">
                  Belum ada target. Yuk, tambahkan target belajarmu! 🎯
                </div>
              ) : (
                tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      task.completed 
                        ? 'bg-stone-50 border-stone-100 opacity-60' 
                        : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                    }`}
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 transition-colors ${task.completed ? currentConfig.color : 'text-stone-300 hover:text-stone-400'}`}
                    >
                      {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}`}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-stone-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="py-5 bg-stone-50 border-t border-stone-100 flex flex-col items-center justify-center gap-3 mt-auto">
          <div className="flex gap-5 text-stone-400">
            <a href="#" aria-label="Instagram" className={`hover:${currentConfig.color} transition-colors`}>
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className={`hover:${currentConfig.color} transition-colors`}>
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="TikTok" className={`hover:${currentConfig.color} transition-colors`}>
              {/* Ikon SVG TikTok Custom karena tidak ada secara default di beberapa versi icon pack */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
          </div>
          <p className="text-xs text-stone-400 font-medium tracking-wide">
            @Upik.Setyawan
          </p>
        </div>

      </div>
    </div>
  );
}