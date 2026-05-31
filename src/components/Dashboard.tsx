/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Users, Database, Globe, Layers, ArrowRight } from 'lucide-react';
import { Student, Book } from '../types';

interface DashboardProps {
  students: Student[];
  books: Book[];
  onNavigate: (tab: 'roster' | 'search' | 'code-assets') => void;
}

export default function Dashboard({ students, books, onNavigate }: DashboardProps) {
  const totalStudents = students.length;
  const totalBooks = books.length;
  const totalRented = books.filter(b => b.studentId !== null).length;

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 animate-fade-in bg-[#FDFCFB]">
      {/* Intro Section */}
      <div className="border-b border-black pb-8">
        <p className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 mb-2">University Lab Project Overview</p>
        <h2 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] leading-tight">
          Academic Literature <br />
          <span className="italic font-light">Management System</span>
        </h2>
        <p className="mt-4 text-neutral-700 max-w-2xl font-serif leading-relaxed text-lg">
          Welcome to the simulator interface for the Student Library management application. Built under 
          Spring Boot 3.x, H2 DB and Thymeleaf architecture to demonstrate architectural layered design 
          complying with clean enterprise code standards.
        </p>
      </div>

      {/* Hero Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('roster')}
          className="border border-black bg-white p-6 cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">01. IN-MEMORY DB</span>
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-4xl font-display font-bold mt-4">{totalStudents}</h4>
            <p className="font-serif italic text-sm text-neutral-600">Registered Students</p>
          </div>
          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-neutral-500 hover:text-black">
            Manage Students <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('search')}
          className="border border-black bg-white p-6 cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">02. EXTERNAL REST API</span>
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-4xl font-display font-bold mt-4">{totalRented}</h4>
            <p className="font-serif italic text-sm text-neutral-600">Rented Books Checked Out</p>
          </div>
          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-neutral-500 hover:text-black">
            Query OpenLibrary <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('code-assets')}
          className="border border-black bg-white p-6 cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">03. SPRING ARCHITECTURE</span>
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-4xl font-display font-bold mt-4">15</h4>
            <p className="font-serif italic text-sm text-neutral-600">Production Class Modules</p>
          </div>
          <div className="flex items-center text-[10px] uppercase font-bold tracking-widest text-neutral-500 hover:text-black">
            Inspect Architecture <ArrowRight className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>

      {/* Architectural Guidelines */}
      <div className="border border-black bg-[#F5F2EF] p-8 md:p-10 relative">
        <span className="absolute top-4 right-4 text-[9px] font-mono border border-black/20 px-2 py-0.5 uppercase">
          Spring Spec v3.2.1
        </span>
        <h3 className="text-2xl font-serif mb-6 italic">Architecture and DTO Flow</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="border-b border-black/10 md:border-b-0 md:border-r border-black/20 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">1</div>
              <h5 className="font-display text-xs font-bold uppercase tracking-wider">Controller (Thymeleaf)</h5>
            </div>
            <p className="text-xs text-neutral-600 font-serif leading-relaxed">
              Handles HTTP GET/POST triggers, populates UI Models, and renders HTML templates using thymeleaf variables.
            </p>
          </div>

          <div className="border-b border-black/10 md:border-b-0 md:border-r border-black/20 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">2</div>
              <h5 className="font-display text-xs font-bold uppercase tracking-wider">DTO Conversion</h5>
            </div>
            <p className="text-xs text-neutral-600 font-serif leading-relaxed">
              Strict separation layer. Converts raw relational entities into clean Data Transfer Objects using conversion mappers.
            </p>
          </div>

          <div className="border-b border-black/10 md:border-b-0 md:border-r border-black/20 pb-4 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">3</div>
              <h5 className="font-display text-xs font-bold uppercase tracking-wider">Service Logic</h5>
            </div>
            <p className="text-xs text-neutral-600 font-serif leading-relaxed">
              Applies transactional rules, business checks, fetches books from OpenLibrary REST API, and maps records into database registers.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">4</div>
              <h5 className="font-display text-xs font-bold uppercase tracking-wider">Data Repository (JPA)</h5>
            </div>
            <p className="text-xs text-neutral-600 font-serif leading-relaxed">
              Standardized JPA abstraction to map database schemas to live object representations in the H2 in-memory storage engine.
            </p>
          </div>
        </div>
      </div>

      {/* Database Schema representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-black pt-8">
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-4 font-mono">Entity Schema (One-to-Many Annotation)</h4>
          <div className="bg-[#1A1A1A] p-6 text-white font-mono text-xs rounded-none space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] leading-relaxed">
            <div>
              <span className="text-amber-400">@Entity</span><br />
              <span className="text-blue-300">public class</span> <span className="text-teal-300">Student</span> &#123; <br />
              &nbsp;&nbsp;<span className="text-amber-400">@Id</span> <span className="text-amber-400">@GeneratedValue</span> Long id;<br />
              &nbsp;&nbsp;String name;<br />
              &nbsp;&nbsp;String email;<br />
              &nbsp;&nbsp;<span className="text-amber-400">@OneToMany</span>(mappedBy = <span className="text-emerald-300">"student"</span>, cascade = CascadeType.ALL)<br />
              &nbsp;&nbsp;List&lt;Book&gt; borrowedBooks;<br />
              &#125;
            </div>
            <div className="border-t border-neutral-700 pt-4">
              <span className="text-amber-400">@Entity</span><br />
              <span className="text-blue-300">public class</span> <span className="text-teal-300">Book</span> &#123; <br />
              &nbsp;&nbsp;<span className="text-amber-400">@Id</span> <span className="text-amber-400">@GeneratedValue</span> Long id;<br />
              &nbsp;&nbsp;String title;<br />
              &nbsp;&nbsp;String author;<br />
              &nbsp;&nbsp;String isbn;<br />
              &nbsp;&nbsp;<span className="text-amber-400">@ManyToOne</span> <span className="text-amber-400">@JoinColumn</span>(name = <span className="text-emerald-300">"student_id"</span>)<br />
              &nbsp;&nbsp;Student student;<br />
              &#125;
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-4">Instructor Lab Assignment Objectives</h4>
            <ul className="space-y-4 font-serif text-sm text-neutral-700">
              <li className="flex gap-2">
                <span className="font-bold font-sans">✓</span>
                <span>Learn server side rendering concepts using state-driven Thymeleaf templates.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold font-sans">✓</span>
                <span>Establish strict transactional mapping using DTO architecture to separate persistent layouts from representation scopes.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold font-sans">✓</span>
                <span>Integrate external rest specifications by fetching JSON APIs with RestTemplate and jackson-databind.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold font-sans">✓</span>
                <span>Setup entity validations on the in-memory H2 database.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1A1A1A] text-white p-6 mt-6 md:mt-0">
            <h5 className="font-display font-bold uppercase tracking-widest text-xs mb-2">Ready to Run</h5>
            <p className="text-xs opacity-85 leading-relaxed font-serif">
              You can explore the system in real time using the Sidebar menu. All changes are simulated across
              the database stores flawlessly. Click <strong>"Source Code Codebase"</strong> to review the Java codes requested.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
