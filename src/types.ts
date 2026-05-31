/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: number;
  name: string;
  email: string;
  groupNumber: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  studentId: number | null; // One-to-many link to student ID
}

export interface StudentDto {
  id: number;
  name: string;
  email: string;
  groupNumber: string;
  bookCount: number;
  borrowedBooks: BookDto[];
}

export interface BookDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  studentId: number | null;
}

export type ActiveTab = 'dashboard' | 'roster' | 'search' | 'code-assets';

export interface OpenLibraryDoc {
  title: string;
  author_name?: string[];
  isbn?: string[];
  key: string;
}

export interface OpenLibraryResponse {
  docs: OpenLibraryDoc[];
}
