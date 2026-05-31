/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Book } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'academic_library_students',
  BOOKS: 'academic_library_books',
};

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Alexander Hamilton", email: "alexander@columbia.edu", groupNumber: "GRP-204" },
  { id: 2, name: "Elizabeth Schuyler", email: "eliza@schuyler.org", groupNumber: "GRP-204" },
  { id: 3, name: "Aaron Burr", email: "aaron@princeton.edu", groupNumber: "GRP-101" },
  { id: 4, name: "Marquis de Lafayette", email: "lafayette@patriottroop.fr", groupNumber: "GRP-305" },
];

const INITIAL_BOOKS: Book[] = [
  { id: 101, title: "The Federalist Papers", author: "Alexander Hamilton & James Madison", isbn: "9780451528810", studentId: 1 },
  { id: 102, title: "Report on Public Credit", author: "Alexander Hamilton", isbn: "9781140029311", studentId: 1 },
  { id: 103, title: "Orphanage Chronicles & Charity Foundations", author: "Elizabeth Schuyler", isbn: "9781501126129", studentId: 2 },
  { id: 104, title: "Reflections on Liberty and Constitution", author: "Marquis de Lafayette", isbn: "9780809051398", studentId: 4 },
];

export function initializeDatabase(forceReset = false) {
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
}

export function getStudentsFromDb(): Student[] {
  initializeDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
}

export function getBooksFromDb(): Book[] {
  initializeDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
  return raw ? JSON.parse(raw) : INITIAL_BOOKS;
}

export function saveStudentsToDb(students: Student[]) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function saveBooksToDb(books: Book[]) {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
}

export function addStudentToDb(student: Omit<Student, 'id'>): Student {
  const students = getStudentsFromDb();
  const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent: Student = { ...student, id: nextId };
  students.push(newStudent);
  saveStudentsToDb(students);
  return newStudent;
}

export function updateStudentInDb(id: number, updatedData: Omit<Student, 'id'>): Student {
  const students = getStudentsFromDb();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error(`Student not found with ID ${id}`);
  }
  const updatedStudent: Student = { ...updatedData, id };
  students[index] = updatedStudent;
  saveStudentsToDb(students);
  return updatedStudent;
}

export function deleteStudentFromDb(id: number) {
  // Delete student
  const students = getStudentsFromDb().filter(s => s.id !== id);
  saveStudentsToDb(students);

  // Cascade delete or set null on books
  // Lab assignment request: A single student may borrow multiple books. 
  // Let's cascade delete the rented books just like JPA cascade operations.
  const books = getBooksFromDb().filter(b => b.studentId !== id);
  saveBooksToDb(books);
}

export function addBookToStudentInDb(studentId: number, title: string, author: string, isbn: string): Book {
  const books = getBooksFromDb();
  
  // Clean potentially duplicated ISBNs (behave like real catalog database, or JPA merge)
  const existingIndex = books.findIndex(b => b.isbn === isbn);
  if (existingIndex !== -1) {
    books[existingIndex].studentId = studentId;
    saveBooksToDb(books);
    return books[existingIndex];
  }

  const nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 101;
  const newBook: Book = {
    id: nextId,
    title,
    author,
    isbn,
    studentId
  };
  books.push(newBook);
  saveBooksToDb(books);
  return newBook;
}

export function removeBookFromDb(bookId: number) {
  const books = getBooksFromDb().filter(b => b.id !== bookId);
  saveBooksToDb(books);
}
