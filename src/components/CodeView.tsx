/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, FileCode, Folder, BookOpen, Layers, Terminal, Compass } from 'lucide-react';
import { JAVA_CODE_FILES, CodeFile } from '../javaCodeTemplates';

export default function CodeView() {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Group codes logically to help user find what they need
  const categories = [
    {
      name: "Config & Build",
      files: ["pom.xml", "application.properties"]
    },
    {
      name: "Database Entities",
      files: ["Student.java", "Book.java"]
    },
    {
      name: "Repositories Status",
      files: ["StudentRepository.java", "BookRepository.java"]
    },
    {
      name: "DTOs & Mappers",
      files: ["StudentDto.java", "BookDto.java", "StudentMapper.java", "BookMapper.java"]
    },
    {
      name: "Core Services",
      files: ["StudentService.java", "BookService.java", "ExternalBookApiService.java"]
    },
    {
      name: "Controllers APIs",
      files: ["StudentController.java", "BookController.java"]
    },
    {
      name: "Thymeleaf Templates",
      files: ["index.html", "profile.html", "search.html"]
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const activeFile = JAVA_CODE_FILES[activeFileIndex] || JAVA_CODE_FILES[0];

  const handleFileSelectByName = (name: string) => {
    const idx = JAVA_CODE_FILES.findIndex(f => f.name === name);
    if (idx !== -1) {
      setActiveFileIndex(idx);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col md:flex-row animate-fade-in bg-[#FDFCFB]">
      
      {/* File Indexer list (Left Rail of Java code) */}
      <div className="w-full md:w-80 border-r border-black p-6 flex flex-col overflow-y-auto">
        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Class Modules</span>
          <h3 className="text-2xl font-serif">Java Codes</h3>
          <p className="text-xs text-neutral-500 font-serif mt-1">
            Complete, copyable components for the university lab submission.
          </p>
        </div>

        {/* Categories of codes */}
        <div className="space-y-6 flex-grow">
          {categories.map((cat, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <h5 className="text-[10px] font-mono leading-none uppercase tracking-widest text-[#1A1A1A] font-bold pb-1.5 border-b border-black">
                {cat.name}
              </h5>
              
              <div className="space-y-1 pl-1">
                {cat.files.map(fileName => {
                  const fileData = JAVA_CODE_FILES.find(f => f.name === fileName);
                  if (!fileData) return null;
                  const isSelected = activeFile.name === fileName;
                  
                  return (
                    <button
                      key={fileName}
                      onClick={() => handleFileSelectByName(fileName)}
                      className={`w-full text-left font-mono text-[11px] px-3 py-1.5 flex items-center gap-2 group transition-all rounded-none ${
                        isSelected 
                          ? 'bg-black text-white' 
                          : 'text-[#1A1A1A] hover:bg-neutral-100'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-neutral-400 group-hover:text-[#1A1A1A]'}`} />
                      <span className="truncate">{fileName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor representation panel */}
      <div className="flex-1 p-6 md:p-8 bg-neutral-900 text-white flex flex-col overflow-hidden">
        {/* Editor Info Bar */}
        <div className="flex items-center justify-between border-b border-neutral-700 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-neutral-600"></div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 leading-none">TARGET PATH</p>
              <p className="text-xs font-mono text-amber-300 mt-0.5">{activeFile.path}</p>
            </div>
          </div>

          <button
            onClick={() => handleCopy(activeFile.content)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-mono tracking-wider transition-colors uppercase rounded-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Source
              </>
            )}
          </button>
        </div>

        {/* Java source Code Editor Container */}
        <div className="flex-grow overflow-auto bg-neutral-950 p-6 border border-neutral-800 font-mono text-[11.5px] leading-relaxed relative">
          <span className="absolute right-4 top-4 text-[9px] text-neutral-600 uppercase border border-neutral-800/60 px-1.5 font-mono">
            {activeFile.language}
          </span>
          <pre className="whitespace-pre">{activeFile.content}</pre>
        </div>

        {/* System log status */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-neutral-500" />
            <span>Format: UTF-8 standard text. Perfect for copying into Eclipse, VS Code, or IntelliJ.</span>
          </div>
          <div className="text-right">
            <span>Lines: {activeFile.content.split('\n').length}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
