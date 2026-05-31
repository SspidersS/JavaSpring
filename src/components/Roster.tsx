/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Book as BookIcon, ChevronRight, Trash2, Edit3, X, Library, UserCheck, Plus, Link as LinkIcon } from 'lucide-react';
import { Student, Book } from '../types';

interface RosterProps {
  students: Student[];
  books: Book[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: number, student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: number) => void;
  onAddBook: (studentId: number, title: string, author: string, isbn: string) => void;
  onRemoveBook: (bookId: number) => void;
  onNavigateToSearch: (query?: string) => void;
}

export default function Roster({
  students,
  books,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddBook,
  onRemoveBook,
  onNavigateToSearch,
}: RosterProps) {
  // Navigation inside Roster
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states for adding/editing students
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [groupNumber, setGroup] = useState('');

  // Form states for checking out custom/manual literature
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualIsbn, setManualIsbn] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !groupNumber) return;

    // Check email uniqueness
    if (students.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      alert("Validation failed: A student with this email already exists!");
      return;
    }

    onAddStudent({ name, email, groupNumber });
    showNotification(`Student "${name}" registered successfully!`);
    
    // Clear forms
    setName('');
    setEmail('');
    setGroup('');
  };

  const handleStartEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setGroup(student.groupNumber);
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    // Check email uniqueness (excluding current)
    if (students.some(s => s.id !== editingStudent.id && s.email.toLowerCase() === email.toLowerCase())) {
      alert("Validation failed: A student with this email already exists!");
      return;
    }

    onUpdateStudent(editingStudent.id, { name, email, groupNumber });
    showNotification(`Student "${name}" updated successfully!`);

    // Reset editing
    setEditingStudent(null);
    setName('');
    setEmail('');
    setGroup('');
  };

  const handleManualCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !manualTitle || !manualAuthor || !manualIsbn) return;

    onAddBook(selectedStudent.id, manualTitle, manualAuthor, manualIsbn);
    showNotification(`Assigned "${manualTitle}" to ${selectedStudent.name}!`);

    // Clear forms
    setManualTitle('');
    setManualAuthor('');
    setManualIsbn('');
  };

  const handleDelete = (student: Student) => {
    if (confirm(`Are you sure you want to delete "${student.name}"? This operation cascade-deletes all checkout records on the H2 tables.`)) {
      onDeleteStudent(student.id);
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null);
      }
      showNotification(`Student "${student.name}" deleted.`);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col md:flex-row animate-fade-in bg-[#FDFCFB]">
      
      {/* LEFT COLUMN: Student list / table */}
      <div className="flex-1 border-r border-black p-6 md:p-8 overflow-y-auto flex flex-col min-w-[320px]">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Database Records</span>
            <h3 className="text-3xl font-serif">Academic Roster</h3>
          </div>
          {editingStudent && (
            <button 
              onClick={() => {
                setEditingStudent(null);
                setName('');
                setEmail('');
                setGroup('');
              }}
              className="border border-black px-3 py-1 text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white flex items-center gap-1"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Notifications */}
        {notification && (
          <div className="bg-neutral-900 text-white p-3 mb-6 text-xs font-mono uppercase tracking-widest border border-black animate-pulse flex justify-between items-center">
            <span>{notification}</span>
            <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setNotification(null)} />
          </div>
        )}

        {/* List of students styled to look exactly like the design specification card */}
        <div className="space-y-4 flex-1">
          {students.length === 0 ? (
            <div className="border border-dashed border-black p-8 text-center text-sm font-serif text-neutral-400">
              No student records in H2. Use the database helper form on the side to register.
            </div>
          ) : (
            students.map(student => {
              const studentBooks = books.filter(b => b.studentId === student.id);
              const isSelected = selectedStudent?.id === student.id;
              
              return (
                <div 
                  key={student.id}
                  id={`student-row-${student.id}`}
                  className={`border-b pb-4 p-3 transition-all duration-200 cursor-pointer group flex justify-between items-center ${
                    isSelected 
                      ? 'bg-black text-white border-black px-3' 
                      : 'border-neutral-200 hover:bg-[#F5F2EF]'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex-1 pr-4">
                    <p className={`text-[10px] font-mono tracking-tighter mb-1 uppercase ${
                      isSelected ? 'text-neutral-400' : 'text-neutral-500'
                    }`}>
                      {student.groupNumber} / ID: {String(student.id).padStart(4, '0')}
                    </p>
                    <h4 className="text-lg font-serif font-semibold leading-tight group-hover:underline decoration-1 underline-offset-4">
                      {student.name}
                    </h4>
                    <p className={`text-xs ${isSelected ? 'text-neutral-300' : 'text-neutral-500'} font-mono mt-0.5`}>
                      {student.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        isSelected ? 'text-white/80' : 'text-neutral-400'
                      }`}>
                        {studentBooks.length} {studentBooks.length === 1 ? 'Book' : 'Books'}
                      </span>
                    </div>

                    {/* Action buttons inside item */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        title="Edit Student Info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(student);
                        }}
                        className={`p-1.5 border border-black hover:bg-amber-100 hover:text-black ${
                          isSelected ? 'bg-white text-black' : 'bg-transparent text-[#1A1A1A]'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete Student completely"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(student);
                        }}
                        className={`p-1.5 border border-black hover:bg-red-500 hover:text-white ${
                          isSelected ? 'bg-white text-black' : 'bg-transparent text-[#1A1A1A]'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-black'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Registers / Profile Detail Views */}
      <div className="w-full md:w-[480px] bg-neutral-100 p-6 md:p-8 flex flex-col overflow-y-auto">
        
        {/* IF STUDENT SELECTED: Show Profile view (detailed checked out log literature) */}
        {selectedStudent ? (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Profile info card */}
            <div className="border border-black bg-white p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <span className="absolute top-4 right-4 text-[9px] font-mono border border-black px-2 py-0.5 uppercase bg-black text-white">
                Active Student
              </span>
              <p className="text-xs uppercase tracking-widest font-mono text-neutral-400 mb-1">{selectedStudent.groupNumber}</p>
              <h3 className="text-3xl font-serif font-black">{selectedStudent.name}</h3>
              <p className="text-xs font-mono text-neutral-500 mt-1">{selectedStudent.email}</p>

              <div className="flex gap-2 mt-4 pt-4 border-t border-dashed border-neutral-300">
                <button
                  onClick={() => handleStartEdit(selectedStudent)}
                  className="text-[10px] font-bold uppercase tracking-widest bg-neutral-200 text-black px-3 py-1 hover:bg-neutral-300"
                >
                  Edit Info
                </button>
                <button
                  onClick={() => onNavigateToSearch(selectedStudent.name)}
                  className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1 hover:bg-neutral-800 flex items-center gap-1"
                >
                  <Library className="w-3 h-3" /> search & assign
                </button>
              </div>
            </div>

            {/* List of checked out logs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-[#1A1A1A] font-mono">
                Assigned Books ({books.filter(b => b.studentId === selectedStudent.id).length})
              </h4>
              <div className="space-y-3">
                {books.filter(b => b.studentId === selectedStudent.id).length === 0 ? (
                  <div className="border border-black bg-white p-6 italic text-center text-sm font-serif text-neutral-500">
                    This student hasn't borrowed any literature yet.
                  </div>
                ) : (
                  books.filter(b => b.studentId === selectedStudent.id).map(book => (
                    <div 
                      key={book.id}
                      className="border border-black bg-white p-4 relative flex justify-between items-start"
                    >
                      <div>
                        <h5 className="font-serif font-black text-base">{book.title}</h5>
                        <p className="text-xs text-neutral-600 italic font-serif">by {book.author}</p>
                        <span className="inline-block mt-2 font-mono text-[9px] uppercase border border-black/20 px-1 py-0.5 bg-neutral-50 text-neutral-500">
                          ISBN: {book.isbn}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveBook(book.id)}
                        className="text-[9px] font-bold uppercase tracking-widest text-red-600 border border-red-200 px-2 py-1 bg-red-55 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                        title="Return/Remove Book"
                      >
                        Return
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Form for manual checkout assignment */}
            <div className="border border-black bg-white p-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[#1A1A1A] font-mono flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Manual Assignment Log
              </h4>

              <form onSubmit={handleManualCheckout} className="space-y-4">
                <div>
                  <label className="block text-[9px] tracking-widest uppercase font-mono mb-1 font-semibold text-neutral-500">Book Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Test Driven Development"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full border border-black p-2.5 text-xs focus:ring-1 focus:ring-black outline-none bg-white font-serif"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] tracking-widest uppercase font-mono mb-1 font-semibold text-neutral-500">Author</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kent Beck"
                      value={manualAuthor}
                      onChange={(e) => setManualAuthor(e.target.value)}
                      className="w-full border border-black p-2.5 text-xs focus:ring-1 focus:ring-black outline-none bg-white font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-widest uppercase font-mono mb-1 font-semibold text-neutral-500">ISBN</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9780321146533"
                      value={manualIsbn}
                      onChange={(e) => setManualIsbn(e.target.value)}
                      className="w-full border border-black p-2.5 text-xs focus:ring-1 focus:ring-black outline-none bg-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors"
                >
                  Finalize Book Checkout
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* IF NO STUDENT SELECTED OR LISTS COMPILATION: Show database insert helper */
          <div className="space-y-6">
            <div className="border border-black bg-white p-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-[#1A1A1A] font-mono flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> 
                {editingStudent ? 'Update Database Entity' : 'Register Student Database Entity'}
              </h4>

              <form onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent} className="space-y-4">
                <div>
                  <label className="block text-[9px] tracking-widest uppercase font-mono mb-1 font-semibold text-neutral-500">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alexander Hamilton"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-black p-2.5 text-xs focus:outline-none bg-white font-serif"
                  />
                </div>

                <div>
                  <label className="block text-[9px] tracking-widest uppercase font-mono mb-1 font-semibold text-neutral-500">Email Address (Unique)</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@columbia.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-black p-2.5 text-xs focus:outline-none bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] tracking-widest uppercase font-mono mb-1 font-semibold text-neutral-500">Academic Group Code</label>
                  <input
                    type="text"
                    required
                    placeholder="GRP-204"
                    value={groupNumber}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full border border-black p-2.5 text-xs focus:outline-none bg-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                >
                  {editingStudent ? 'Persist Changed Records' : 'Write Records to H2 Table'}
                </button>

                {editingStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStudent(null);
                      setName('');
                      setEmail('');
                      setGroup('');
                    }}
                    className="w-full border border-black bg-white text-black py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-neutral-100 transition-all"
                  >
                    Cancel / Discard Configs
                  </button>
                )}
              </form>
            </div>

            <div className="border border-black p-6 bg-[#1A1A1A] text-white space-y-3">
              <h5 className="font-display font-bold uppercase tracking-widest text-xs">Simulating Spring Data JPA</h5>
              <p className="text-[11px] font-serif leading-relaxed opacity-80">
                Any modifications execute transactional commands on local state stores immediately, mirroring how safe repositories update the table.
                Selecting a student displays their specific profile rendering logs and manuals catalog indexes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
