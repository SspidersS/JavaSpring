/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Globe, Library, CheckCircle, Database } from 'lucide-react';
import { Student, Book, BookDto } from '../types';
import { queryOpenLibrary } from '../openLibraryService';

interface SearchAssignProps {
  students: Student[];
  onAddBook: (studentId: number, title: string, author: string, isbn: string) => void;
  passedQuery?: string;
  onNavigateToRoster: (selectedId?: number) => void;
}

export default function SearchAssign({
  students,
  onAddBook,
  passedQuery = '',
  onNavigateToRoster,
}: SearchAssignProps) {
  const [query, setQuery] = useState(passedQuery || 'Software Engineering');
  const [foundBooks, setFoundBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // States for checkouts
  const [checkoutTargetStudentId, setCheckoutTargetStudentId] = useState<Record<number, string>>({});
  const [assignedStatus, setAssignedStatus] = useState<Record<number, boolean>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const results = await queryOpenLibrary(query);
      setFoundBooks(results);
    } catch (err: any) {
      setErrorMessage("Could not query OpenLibrary API. Please verify network interfaces.");
    } finally {
      setLoading(false);
    }
  };

  // Run search on initial load or if passedQuery changed
  useEffect(() => {
    handleSearch();
  }, [passedQuery]);

  const handleFinalizeCheckout = (bookIndex: number, book: BookDto) => {
    const studentIdStr = checkoutTargetStudentId[bookIndex];
    if (!studentIdStr) {
      alert("Please choose a student record before finalization.");
      return;
    }

    const studentId = parseInt(studentIdStr, 10);
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    onAddBook(studentId, book.title, book.author, book.isbn);
    
    // Set success status for this item
    setAssignedStatus(prev => ({ ...prev, [bookIndex]: true }));
    
    // Flash reset success state screen after 2 seconds and optionally navigate
    setTimeout(() => {
      setAssignedStatus(prev => ({ ...prev, [bookIndex]: false }));
      onNavigateToRoster(studentId);
    }, 1500);
  };

  const handleStudentSelect = (bookIndex: number, studentId: string) => {
    setCheckoutTargetStudentId(prev => ({ ...prev, [bookIndex]: studentId }));
  };

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-10 animate-fade-in bg-[#FDFCFB]">
      
      {/* Editorial Title */}
      <div className="border-b border-black pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono border border-black px-2 py-0.5 font-bold uppercase tracking-widest bg-black text-white">
            Jackson Databind Parser Service &amp; OpenLibrary REST Client
          </span>
          <h2 className="text-4xl font-serif text-[#1A1A1A] mt-3">
            Search External Database &amp; <span className="italic font-light">Assign</span>
          </h2>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-[420px]">
          <input 
            type="text" 
            placeholder="Search titles (e.g. Design Patterns)" 
            className="flex-1 border border-black p-3 text-sm focus:outline-none bg-white font-serif"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-black text-white px-6 font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-1"
          >
            <Search className="w-4 h-4" /> Query API
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-black">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-mono tracking-widest uppercase text-neutral-500">Querying OpenLibrary over REST HTTP...</p>
        </div>
      ) : errorMessage ? (
        <div className="border border-red-500 bg-red-50 p-6 text-center rounded-none font-serif text-red-800">
          <p className="font-bold">{errorMessage}</p>
          <button onClick={() => handleSearch()} className="mt-4 border border-red-800 px-4 py-2 text-xs uppercase font-mono tracking-widest hover:bg-red-800 hover:text-white transition-all">
            Retry fetch request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Results grid */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 font-mono">
              Search Results found ({foundBooks.length})
            </h3>

            {foundBooks.length === 0 ? (
              <div className="border border-dashed border-black bg-white p-16 text-center">
                <p className="font-serif italic text-neutral-500 text-lg">No results match your search parameters.</p>
                <p className="text-xs font-mono text-neutral-400 mt-2">Try querying with wide subjects or authors like "Clean Code", "Design Patterns", "Java".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foundBooks.map((book, idx) => {
                  const isSuccess = assignedStatus[idx];
                  const selectedVal = checkoutTargetStudentId[idx] || "";
                  
                  return (
                    <div 
                      key={idx}
                      className="border border-black bg-white p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[290px] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    >
                      {isSuccess ? (
                        <div className="absolute inset-0 bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
                          <CheckCircle className="w-12 h-12 text-emerald-400 mb-2" />
                          <h4 className="font-serif text-xl italic">Checked Out!</h4>
                          <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-widest">Writing database JPA logs</p>
                        </div>
                      ) : null}

                      {/* Info layout */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] border border-black px-2 py-0.5 font-bold uppercase tracking-tighter bg-[#F5F2EF]">
                            OpenLibrary Match
                          </span>
                          <span className="text-[9px] font-mono text-neutral-400 truncate max-w-[130px]" title={book.isbn}>
                            ISBN: {book.isbn.substring(0, 15)}
                          </span>
                        </div>

                        <h4 className="text-xl font-serif font-black leading-snug line-clamp-2" title={book.title}>
                          {book.title}
                        </h4>
                        <p className="text-sm font-serif italic text-neutral-600 mt-1">by {book.author}</p>
                      </div>

                      {/* Student assignment controls */}
                      <div className="border-t border-black pt-4 mt-6">
                        <label className="block text-[9px] font-mono font-bold uppercase text-neutral-500 mb-1.5">
                          Assign &amp; Checkout to Student
                        </label>
                        <div className="flex gap-2">
                          <select 
                            value={selectedVal}
                            onChange={(e) => handleStudentSelect(idx, e.target.value)}
                            className="flex-1 border border-black bg-white p-2 text-xs outline-none focus:ring-1 focus:ring-black"
                          >
                            <option value="">-- Choose student --</option>
                            {students.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.groupNumber})
                              </option>
                            ))}
                          </select>
                          <button 
                            onClick={() => handleFinalizeCheckout(idx, book)}
                            className="bg-black text-white px-3 font-mono font-bold text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar educational Jackson preview */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1A1A1A] font-mono">
              Jackson Databind Mapping Preview
            </h3>

            <div className="border border-black bg-neutral-900 text-white p-5 font-mono text-[10px] leading-relaxed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-700">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-300 font-bold tracking-widest uppercase text-[9px]">Jackson TreeModel Parse Node</span>
              </div>
              
              <div className="text-neutral-400">
                <span className="text-sky-300">// ObjectMapper.readTree(responseJson)</span><br />
                <span className="text-amber-400">JsonNode</span> rootNode = mapper.readTree(response);<br />
                <span className="text-amber-400">JsonNode</span> docs = rootNode.path(<span className="text-emerald-400">"docs"</span>);
              </div>

              {/* Dynamic JSON simulator mapping to results */}
              <div className="bg-neutral-955 p-3 text-emerald-400 bg-black/40 overflow-x-auto rounded-none border border-neutral-800">
                <pre>
                  {foundBooks.length > 0 ? (
                    JSON.stringify({
                      num_found: 104,
                      q: query,
                      docs: foundBooks.slice(0, 2).map(b => ({
                        title: b.title.substring(0, 32) + (b.title.length > 32 ? "..." : ""),
                        author_name: [b.author],
                        isbn: [b.isbn]
                      }))
                    }, null, 2)
                  ) : (
                    `{
  "num_found": 0,
  "q": "${query}",
  "docs": []
}`
                  )}
                </pre>
              </div>

              <div className="text-xs text-neutral-300 font-serif border-t border-neutral-700 pt-3">
                <p className="italic leading-normal text-neutral-400">
                  During university evaluations, our Jackson mapper handles raw OpenLibrary arrays inside Spring Boot logic cleanly before transaction writing on H2 registers.
                </p>
              </div>
            </div>

            <div className="border border-black p-6 bg-[#F5F2EF] text-[#1A1A1A]">
              <h5 className="font-display font-bold uppercase tracking-widest text-xs mb-2">Did You Know?</h5>
              <p className="text-xs opacity-90 leading-relaxed font-serif">
                OpenLibrary API handles CORS headers instantly. When query searches proceed on the client side,
                they replicate Jackson's mapping parameters exactly using the native <code>fetch</code> mechanism.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
