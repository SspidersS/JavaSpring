/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Search, FolderCode, RefreshCw, Layers } from 'lucide-react';
import { Student, Book, ActiveTab } from './types';
import {
  getStudentsFromDb,
  getBooksFromDb,
  addStudentToDb,
  updateStudentInDb,
  deleteStudentFromDb,
  addBookToStudentInDb,
  removeBookFromDb,
  initializeDatabase
} from './dbStore';
import Dashboard from './components/Dashboard';
import Roster from './components/Roster';
import SearchAssign from './components/SearchAssign';
import CodeView from './components/CodeView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  
  // Passed query for search assign navigation
  const [passedSearchQuery, setPassedSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    initializeDatabase();
    refreshLocalData();
  }, []);

  const refreshLocalData = () => {
    setStudents(getStudentsFromDb());
    setBooks(getBooksFromDb());
  };

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    addStudentToDb(studentData);
    refreshLocalData();
  };

  const handleUpdateStudent = (id: number, studentData: Omit<Student, 'id'>) => {
    updateStudentInDb(id, studentData);
    refreshLocalData();
  };

  const handleDeleteStudent = (id: number) => {
    deleteStudentFromDb(id);
    refreshLocalData();
  };

  const handleAddBook = (studentId: number, title: string, author: string, isbn: string) => {
    addBookToStudentInDb(studentId, title, author, isbn);
    refreshLocalData();
  };

  const handleRemoveBook = (bookId: number) => {
    removeBookFromDb(bookId);
    refreshLocalData();
  };

  // Nav helper from dashboard or other buttons
  const navigateToTab = (tab: 'roster' | 'search' | 'code-assets') => {
    if (tab === 'code-assets') {
      setActiveTab('code-assets');
    } else {
      setActiveTab(tab);
    }
  };

  // Dedicated search assignment navigation
  const handleNavigateToSearch = (query?: string) => {
    setPassedSearchQuery(query || '');
    setActiveTab('search');
  };

  // Navigate to roster with selected student row highlights
  const handleNavigateToRosterWithSelected = (studentId?: number) => {
    setActiveTab('roster');
    
    // Auto-scroll or toggle detail view helper
    setTimeout(() => {
      const el = document.getElementById(`student-row-${studentId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.click();
      }
    }, 100);
  };

  const handleForceRestDB = () => {
    if (confirm("Reset local database state to lab assignment seeds? This discards all active edits.")) {
      initializeDatabase(true);
      refreshLocalData();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-neutral-800 p-0 md:p-3 flex items-center justify-center font-sans">
      
      {/* Outer bounds structured container resembling editorial showcase borders */}
      <div className="bg-[#FDFCFB] text-[#1A1A1A] w-full max-w-7xl h-screen md:h-[90vh] flex flex-col md:flex-row overflow-hidden border-2 md:border-8 border-black shadow-2xl relative">
        
        {/* SIDEBAR: Elegant layout match to Design HTML theme */}
        <aside className="w-full md:w-64 bg-[#1A1A1A] text-white flex flex-col p-6 md:p-8 justify-between border-b md:border-b-0 md:border-r border-black shrink-0">
          <div>
            <div className="mb-8 md:mb-10">
              <h2 className="text-[10px] tracking-[0.3em] font-bold uppercase mb-2 text-neutral-400 font-mono">Lab Project</h2>
              <h1 className="text-3xl font-serif italic font-light leading-none">
                Archives 
                <span className="block mt-1 font-sans font-bold not-italic text-lg tracking-tight text-amber-300">
                  System v3.1
                </span>
              </h1>
            </div>
            
            {/* Nav stack links with subtle border underlines */}
            <nav className="space-y-5">
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="w-full text-left block group"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5 opacity-50" />
                  <span className={`text-[10px] uppercase tracking-widest font-bold transition-all ${
                    activeTab === 'dashboard' ? 'text-amber-300 opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`}>
                    01. Dashboard
                  </span>
                </div>
                <div className={`h-px mt-1 w-full transition-all duration-200 ${
                  activeTab === 'dashboard' ? 'bg-amber-300' : 'bg-white/10 group-hover:bg-white/30'
                }`}></div>
              </button>

              <button 
                onClick={() => setActiveTab('roster')} 
                className="w-full text-left block group"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 opacity-50" />
                  <span className={`text-[10px] uppercase tracking-widest font-bold transition-all ${
                    activeTab === 'roster' ? 'text-amber-300 opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`}>
                    02. Student Roster
                  </span>
                </div>
                <div className={`h-px mt-1 w-full transition-all duration-200 ${
                  activeTab === 'roster' ? 'bg-amber-300' : 'bg-white/10 group-hover:bg-white/30'
                }`}></div>
              </button>

              <button 
                onClick={() => handleNavigateToSearch('')} 
                className="w-full text-left block group"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 opacity-50" />
                  <span className={`text-[10px] uppercase tracking-widest font-bold transition-all ${
                    activeTab === 'search' ? 'text-amber-300 opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`}>
                    03. OpenLibrary Search
                  </span>
                </div>
                <div className={`h-px mt-1 w-full transition-all duration-200 ${
                  activeTab === 'search' ? 'bg-amber-300' : 'bg-white/10 group-hover:bg-white/30'
                }`}></div>
              </button>

              <button 
                onClick={() => setActiveTab('code-assets')} 
                className="w-full text-left block group"
              >
                <div className="flex items-center gap-2">
                  <FolderCode className="w-3.5 h-3.5 opacity-50" />
                  <span className={`text-[10px] uppercase tracking-widest font-bold transition-all ${
                    activeTab === 'code-assets' ? 'text-amber-300 opacity-100' : 'opacity-60 group-hover:opacity-100'
                  }`}>
                    04. Java Codebase
                  </span>
                </div>
                <div className={`h-px mt-1 w-full transition-all duration-200 ${
                  activeTab === 'code-assets' ? 'bg-amber-300' : 'bg-white/10 group-hover:bg-white/30'
                }`}></div>
              </button>
            </nav>
          </div>

          {/* Sidebar meta block info */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
            <div className="text-[10px] uppercase tracking-tighter leading-relaxed opacity-40 font-mono">
              Spring Boot 3.2.1 <br/>
              Java 17 (LTS) <br/>
              H2 In-Memory DB Active
            </div>
            
            <button
              onClick={handleForceRestDB}
              className="text-[9px] font-mono tracking-widest text-neutral-400 hover:text-white uppercase flex items-center gap-1.5 cursor-pointer pt-2"
            >
              <RefreshCw className="w-3 h-3" /> Reset Database
            </button>
          </div>
        </aside>

        {/* MAIN BODY LAYOUT */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#FDFCFB]">
          
          {/* Header section with connected status indicator */}
          <header className="h-20 border-b border-black flex items-center justify-between px-6 md:px-10 shrink-0">
            <div className="flex items-baseline gap-4">
              <span className="font-serif italic text-2xl">Academic Literature Manager</span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-black text-white rounded-none">
                Thymeleaf Rendered
              </span>
            </div>
            <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest">
              <span className="hidden sm:inline opacity-70">H2 Connection ACTIVE</span>
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
            </div>
          </header>

          {/* Dynamic Content Views */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'dashboard' && (
              <Dashboard 
                students={students} 
                books={books} 
                onNavigate={navigateToTab} 
              />
            )}
            {activeTab === 'roster' && (
              <Roster 
                students={students}
                books={books}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onAddBook={handleAddBook}
                onRemoveBook={handleRemoveBook}
                onNavigateToSearch={handleNavigateToSearch}
              />
            )}
            {activeTab === 'search' && (
              <SearchAssign 
                students={students}
                onAddBook={handleAddBook}
                passedQuery={passedSearchQuery}
                onNavigateToRoster={handleNavigateToRosterWithSelected}
              />
            )}
            {activeTab === 'code-assets' && (
              <CodeView />
            )}
          </div>

          {/* Footer banner */}
          <footer className="h-12 border-t border-black bg-white px-6 md:px-10 flex items-center justify-between shrink-0 text-[#1A1A1A]">
            <div className="text-[9px] uppercase font-bold tracking-[0.2em]">
              University Lab Assignment &copy; 2026 / Academic Literature Manager
            </div>
            <div className="text-[9px] font-mono opacity-80 hidden sm:block">
              Memory Usage: 42MB / 512MB [H2_RUNNING]
            </div>
          </footer>

        </main>
      </div>

    </div>
  );
}
