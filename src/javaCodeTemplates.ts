/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const JAVA_CODE_FILES: CodeFile[] = [
  {
    name: "pom.xml",
    path: "pom.xml",
    language: "xml",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.1</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>edu.university.lab</groupId>
    <artifactId>student-library-manager</artifactId>
    <version>1.0.0</version>
    <name>student-library-manager</name>
    <description>Academic Literature Management System - Standard Student Library Lab Assignment</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web Starter for REST endpoints & routing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Thymeleaf Template Engine for Server-Side Rendering -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <!-- Spring Data JPA for Database Persistence -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- H2 In-Memory Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok Annotation Processor to eliminate Boilerplate -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot DevTools for Auto-restarts -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test Core -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: "application.properties",
    path: "src/main/resources/application.properties",
    language: "properties",
    content: `# Database Configuration (H2 In-Memory DB)
spring.datasource.url=jdbc:h2:mem:studentdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console Settings
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=true

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Thymeleaf Cache Management (Disabled for fast development refresh)
spring.thymeleaf.cache=false
spring.thymeleaf.suffix=.html
spring.thymeleaf.prefix=classpath:/templates/`
  },
  {
    name: "Student.java",
    path: "src/main/java/edu/university/lab/entity/Student.java",
    language: "java",
    content: `package edu.university.lab.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private string name;

    @Column(nullable = false, unique = true)
    private string email;

    @Column(nullable = false)
    private string groupNumber;

    // One-to-Many Relationship: One student can borrow multiple books
    // CascadeType.ALL ensures cascading of deletions and saves
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Book> borrowedBooks = new ArrayList<>();

    // Helper method to add a book to the student, ensuring synched bidirectional relationship
    public void addBook(Book book) {
        borrowedBooks.add(book);
        book.setStudent(this);
    }

    // Helper method to remove a book from the student
    public void removeBook(Book book) {
        borrowedBooks.remove(book);
        book.setStudent(null);
    }
}`
  },
  {
    name: "Book.java",
    path: "src/main/java/edu/university/lab/entity/Book.java",
    language: "java",
    content: `package edu.university.lab.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private string title;

    @Column(nullable = false)
    private string author;

    @Column(nullable = false, unique = true)
    private string isbn;

    // Many-to-One Relationship: A book is borrowed by exactly one student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;
}`
  },
  {
    name: "StudentDto.java",
    path: "src/main/java/edu/university/lab/dto/StudentDto.java",
    language: "java",
    content: `package edu.university.lab.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {
    private Long id;
    private string name;
    private string email;
    private string groupNumber;
    private int bookCount;
    private List<BookDto> borrowedBooks;
}`
  },
  {
    name: "BookDto.java",
    path: "src/main/java/edu/university/lab/dto/BookDto.java",
    language: "java",
    content: `package edu.university.lab.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDto {
    private Long id;
    private string title;
    private string author;
    private string isbn;
    private Long studentId;
}`
  },
  {
    name: "StudentMapper.java",
    path: "src/main/java/edu/university/lab/mapper/StudentMapper.java",
    language: "java",
    content: `package edu.university.lab.mapper;

import edu.university.lab.dto.StudentDto;
import edu.university.lab.entity.Student;
import java.util.ArrayList;
import java.util.stream.Collectors;

public class StudentMapper {

    public static StudentDto toDto(Student student) {
        if (student == null) return null;
        
        return StudentDto.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .groupNumber(student.getGroupNumber())
                .bookCount(student.getBorrowedBooks() != null ? student.getBorrowedBooks().size() : 0)
                .borrowedBooks(student.getBorrowedBooks() != null ? 
                        student.getBorrowedBooks().stream()
                               .map(BookMapper::toDto)
                               .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    public static Student toEntity(StudentDto dto) {
        if (dto == null) return null;

        return Student.builder()
                .id(dto.getId())
                .name(dto.getName())
                .email(dto.getEmail())
                .groupNumber(dto.getGroupNumber())
                .build();
    }
}`
  },
  {
    name: "BookMapper.java",
    path: "src/main/java/edu/university/lab/mapper/BookMapper.java",
    language: "java",
    content: `package edu.university.lab.mapper;

import edu.university.lab.dto.BookDto;
import edu.university.lab.entity.Book;

public class BookMapper {

    public static BookDto toDto(Book book) {
        if (book == null) return null;

        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .studentId(book.getStudent() != null ? book.getStudent().getId() : null)
                .build();
    }

    public static Book toEntity(BookDto dto) {
        if (dto == null) return null;

        return Book.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .isbn(dto.getIsbn())
                .build();
    }
}`
  },
  {
    name: "StudentRepository.java",
    path: "src/main/java/edu/university/lab/repository/StudentRepository.java",
    language: "java",
    content: `package edu.university.lab.repository;

import edu.university.lab.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Custom finder for security & validation checks
    Optional<Student> findByEmail(string email);
}`
  },
  {
    name: "BookRepository.java",
    path: "src/main/java/edu/university/lab/repository/BookRepository.java",
    language: "java",
    content: `package edu.university.lab.repository;

import edu.university.lab.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByStudentId(Long studentId);
    Optional<Book> findByIsbn(string isbn);
}`
  },
  {
    name: "StudentService.java",
    path: "src/main/java/edu/university/lab/service/StudentService.java",
    language: "java",
    content: `package edu.university.lab.service;

import edu.university.lab.dto.StudentDto;
import edu.university.lab.entity.Student;
import edu.university.lab.mapper.StudentMapper;
import edu.university.lab.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
        return StudentMapper.toDto(student);
    }

    @Transactional
    public StudentDto createStudent(StudentDto studentDto) {
        if (studentRepository.findByEmail(studentDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + studentDto.getEmail());
        }
        Student student = StudentMapper.toEntity(studentDto);
        Student saved = studentRepository.save(student);
        return StudentMapper.toDto(saved);
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found. ID: " + id));
        
        student.setName(studentDto.getName());
        student.setEmail(studentDto.getEmail());
        student.setGroupNumber(studentDto.getGroupNumber());
        
        Student saved = studentRepository.save(student);
        return StudentMapper.toDto(saved);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student does not exist. ID: " + id);
        }
        studentRepository.deleteById(id);
    }
}`
  },
  {
    name: "BookService.java",
    path: "src/main/java/edu/university/lab/service/BookService.java",
    language: "java",
    content: `package edu.university.lab.service;

import edu.university.lab.dto.BookDto;
import edu.university.lab.entity.Book;
import edu.university.lab.entity.Student;
import edu.university.lab.mapper.BookMapper;
import edu.university.lab.repository.BookRepository;
import edu.university.lab.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public BookDto assignBookToStudent(Long studentId, BookDto bookDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found. ID: " + studentId));

        // Check if book with this ISBN already exists
        Book book = bookRepository.findByIsbn(bookDto.getIsbn())
                .orElseGet(() -> BookMapper.toEntity(bookDto));

        // Assign/Update relationship
        student.addBook(book);
        bookRepository.save(book);
        studentRepository.save(student);

        return BookMapper.toDto(book);
    }

    @Transactional
    public void removeBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found. ID: " + bookId));
        
        if (book.getStudent() != null) {
            book.getStudent().removeBook(book);
        }
        bookRepository.delete(book);
    }

    @Transactional(readOnly = true)
    public List<BookDto> getBooksByStudent(Long studentId) {
        return bookRepository.findByStudentId(studentId).stream()
                .map(BookMapper::toDto)
                .collect(Collectors.toList());
    }
}`
  },
  {
    name: "ExternalBookApiService.java",
    path: "src/main/java/edu/university/lab/service/ExternalBookApiService.java",
    language: "java",
    content: `package edu.university.lab.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.university.lab.dto.BookDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalBookApiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Queries OpenLibrary Search API to fetch books based on a query title.
     * Parses the returned JSON nodes using standard jackson-databind.
     */
    public List<BookDto> searchBooksOnOpenLibrary(string query) {
        List<BookDto> foundBooks = new ArrayList<>();
        
        if (query == null || query.strip().isEmpty()) {
            return foundBooks;
        }

        string apiUrl = UriComponentsBuilder.fromHttpUrl("https://openlibrary.org/search.json")
                .queryParam("q", query)
                .toUriString();

        try {
            log.info("Sending request to OpenLibrary: {}", apiUrl);
            string responseJson = restTemplate.getForObject(apiUrl, string.class);
            
            if (responseJson != null) {
                // Parse the response using Jackson Tree Model
                JsonNode rootNode = objectMapper.readTree(responseJson);
                JsonNode docsNode = rootNode.path("docs");
                
                if (docsNode.isArray()) {
                    int limit = Math.min(docsNode.size(), 8); // Gather top 8 hits
                    for (int i = 0; i < limit; i++) {
                        JsonNode doc = docsNode.get(i);
                        
                        string title = doc.path("title").asText("Unknown Title");
                        
                        // Extract authors
                        string author = "Unknown Author";
                        JsonNode authorNode = doc.path("author_name");
                        if (authorNode.isArray() && authorNode.size() > 0) {
                            author = authorNode.get(0).asText();
                        }
                        
                        // Extract ISBN
                        string isbn = "ISBN-" + System.currentTimeMillis() + "-" + i;
                        JsonNode isbnNode = doc.path("isbn");
                        if (isbnNode.isArray() && isbnNode.size() > 0) {
                            isbn = isbnNode.get(0).asText();
                        }

                        foundBooks.add(BookDto.builder()
                                .title(title)
                                .author(author)
                                .isbn(isbn)
                                .studentId(null)
                                .build());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to query OpenLibrary API. Falling back nicely.", e);
            // Fallback mock search for reliability in isolated servers
            foundBooks.addAll(generateFallbackBooks(query));
        }

        return foundBooks;
    }

    private List<BookDto> generateFallbackBooks(string query) {
        List<BookDto> fallback = new ArrayList<>();
        fallback.add(BookDto.builder()
                .title(query + " Handbook: Advanced Patterns")
                .author("Prof. Arthur Dent")
                .isbn("978" + (long)(Math.random() * 10000000000L))
                .build());
        fallback.add(BookDto.builder()
                .title("Introduction to " + query)
                .author("Dr. Ford Prefect")
                .isbn("978" + (long)(Math.random() * 10000000000L))
                .build());
        return fallback;
    }
}`
  },
  {
    name: "StudentController.java",
    path: "src/main/java/edu/university/lab/controller/StudentController.java",
    language: "java",
    content: `package edu.university.lab.controller;

import edu.university.lab.dto.StudentDto;
import edu.university.lab.dto.BookDto;
import edu.university.lab.service.StudentService;
import edu.university.lab.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final BookService bookService;

    // View landing/home page showing student roster
    @GetMapping
    public string listStudents(Model model) {
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("newStudent", new StudentDto());
        return "index"; // template index.html
    }

    // Process new student creation form
    @PostMapping("/add")
    public string addStudent(@ModelAttribute("newStudent") StudentDto studentDto) {
        studentService.createStudent(studentDto);
        return "redirect:/students";
    }

    // View edit student page
    @GetMapping("/edit/{id}")
    public string editStudentForm(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        return "edit"; // edit student form
    }

    // Process editing student data
    @PostMapping("/update/{id}")
    public string updateStudent(@PathVariable Long id, @ModelAttribute("student") StudentDto studentDto) {
        studentService.updateStudent(id, studentDto);
        return "redirect:/students";
    }

    // Remove student completely from database
    @GetMapping("/delete/{id}")
    public string deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return "redirect:/students";
    }

    // View Student Profile (shows active list of borrowed literature)
    @GetMapping("/profile/{id}")
    public string viewStudentProfile(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        model.addAttribute("newBook", new BookDto());
        return "profile"; // profile.html
    }

    // Manually register a library book assignation directly on student
    @PostMapping("/profile/{id}/books/add")
    public string assignBook(@PathVariable("id") Long studentId, @ModelAttribute("newBook") BookDto bookDto) {
        bookService.assignBookToStudent(studentId, bookDto);
        return "redirect:/students/profile/" + studentId;
    }

    // Return/remove a borrowed book
    @GetMapping("/profile/{studentId}/books/remove/{bookId}")
    public string unassignBook(@PathVariable Long studentId, @PathVariable Long bookId) {
        bookService.removeBook(bookId);
        return "redirect:/students/profile/" + studentId;
    }
}`
  },
  {
    name: "BookController.java",
    path: "src/main/java/edu/university/lab/controller/BookController.java",
    language: "java",
    content: `package edu.university.lab.controller;

import edu.university.lab.dto.BookDto;
import edu.university.lab.dto.StudentDto;
import edu.university.lab.service.BookService;
import edu.university.lab.service.StudentService;
import edu.university.lab.service.ExternalBookApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final ExternalBookApiService externalBookApiService;
    private final StudentService studentService;
    private final BookService bookService;

    // Form page for searching in external APIs and checking out
    @GetMapping("/search")
    public string searchForm(@RequestParam(value = "query", required = false) string query, Model model) {
        model.addAttribute("query", query);
        model.addAttribute("students", studentService.getAllStudents());
        
        if (query != null && !query.strip().isEmpty()) {
            List<BookDto> found = externalBookApiService.searchBooksOnOpenLibrary(query);
            model.addAttribute("foundBooks", found);
        }
        
        return "search"; // search.html
    }

    // Direct checkout handler matching Search Assignment screen trigger
    @PostMapping("/checkout")
    public string checkoutBook(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") string title,
            @RequestParam("author") string author,
            @RequestParam("isbn") string isbn) {
        
        BookDto bookDto = BookDto.builder()
                .title(title)
                .author(author)
                .isbn(isbn)
                .build();
                
        bookService.assignBookToStudent(studentId, bookDto);
        return "redirect:/students/profile/" + studentId;
    }
}`
  },
  {
    name: "index.html",
    path: "src/main/resources/templates/index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Academic Literature System - Roster</title>
    <!-- Thymeleaf template uses visual design styles from Editorial theme -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #FDFCFB; color: #1A1A1A; font-family: 'Georgia', serif; }
        .editorial-border { border: 1px solid #1A1A1A !important; }
        .block-shadow { box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); }
        .btn-editorial { background-color: #1A1A1A; color: #FFF; border-radius: 0; border: 1px solid #1A1A1A; }
        .btn-editorial:hover { background-color: #FDFCFB; color: #1A1A1A; }
    </style>
</head>
<body class="p-5">
    <div class="container border-start border-end border-dark min-vh-100 p-5">
        <!-- Header -->
        <div class="row border-bottom border-dark pb-4 mb-5">
            <div class="col-8">
                <span class="text-uppercase tracking-widest text-muted small">Lab Assignment 02</span>
                <h1 class="display-3 italic">Student Registry</h1>
            </div>
            <div class="col-4 text-end">
                <a href="/books/search" class="btn btn-outline-dark rounded-0 px-4 py-2">Search External DB & Assign</a>
            </div>
        </div>

        <div class="row">
            <!-- Left Panel: Student Registration Form -->
            <div class="col-md-4 pe-5 border-end border-dark">
                <h3 class="h4 mb-4">Register Student</h3>
                <form th:action="@{/students/add}" th:object="\${newStudent}" method="post">
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Full Name</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{name}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Email</label>
                        <input type="email" class="form-control rounded-0 editorial-border" th:field="*{email}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Group Number</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{groupNumber}" required>
                    </div>
                    <button type="submit" class="btn btn-editorial rounded-0 w-full text-uppercase small">Add Student Record</button>
                </form>
            </div>

            <!-- Right Panel: Student List Grid -->
            <div class="col-md-8 ps-5">
                <h3 class="h4 mb-4">Academic Roster</h3>
                <div class="table-responsive">
                    <table class="table table-hover border border-dark align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th class="text-uppercase font-monospace small">ID</th>
                                <th class="text-uppercase font-monospace small">Name</th>
                                <th class="text-uppercase font-monospace small">Group</th>
                                <th class="text-uppercase font-monospace small">Books</th>
                                <th class="text-uppercase font-monospace small text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr th:each="student : \${students}">
                                <td class="font-monospace" th:text="\${student.id}">001</td>
                                <td>
                                    <a class="fw-bold text-dark text-decoration-none border-bottom border-dark" 
                                       th:href="@{/students/profile/{id}(id=\${student.id})}" th:text="\${student.name}">Alexander</a>
                                </td>
                                <td th:text="\${student.groupNumber}">GRP-101</td>
                                <td>
                                    <span class="badge bg-dark rounded-circle px-2 py-1" th:text="\${student.bookCount}">0</span>
                                </td>
                                <td class="text-center">
                                    <div class="btn-group">
                                        <a th:href="@{/students/profile/{id}(id=\${student.id})}" class="btn btn-sm btn-outline-dark rounded-0">Profile</a>
                                        <a th:href="@{/students/delete/{id}(id=\${student.id})}" class="btn btn-sm btn-danger text-white rounded-0">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    name: "profile.html",
    path: "src/main/resources/templates/profile.html",
    language: "html",
    content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Thymeleaf - User Profile & Borrow Logs</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #FDFCFB; color: #1A1A1A; font-family: 'Georgia', serif; }
        .editorial-border { border: 1px solid #1A1A1A !important; }
        .btn-editorial { background-color: #1A1A1A; color: #FFF; border-radius: 0; border: 1px solid #1A1A1A; }
    </style>
</head>
<body class="p-5">
    <div class="container border border-dark p-5 align-self-center min-vh-100">
        <!-- Back navigation link -->
        <div class="mb-4">
            <a href="/students" class="text-dark font-monospace text-uppercase small text-decoration-none">&larr; Back to Student Roster</a>
        </div>

        <div class="row align-items-baseline mb-5 border-bottom border-dark pb-3">
            <div class="col-8">
                <span class="text-uppercase small text-muted font-monospace" th:text="'Group: ' + \${student.groupNumber}">GRP-101</span>
                <h1 class="display-4 italic" th:text="\${student.name}">Student Profile</h1>
                <p class="font-monospace text-muted small" th:text="\${student.email}">student@university.edu</p>
            </div>
            <div class="col-4 text-end">
                <a href="/books/search" class="btn btn-editorial rounded-0 px-3">Assign Web Book</a>
            </div>
        </div>

        <div class="row">
            <!-- Checked out books logs list -->
            <div class="col-md-7 border-end border-dark pe-5">
                <h3 class="h4 mb-4">Checked out Literature</h3>
                <div th:if="\${#lists.isEmpty(student.borrowedBooks)}" class="alert alert-light border border-dark rounded-0 p-4">
                    <p class="mb-0 italic text-muted">This student hasn't borrowed any literature yet.</p>
                </div>
                <div th:each="book : \${student.borrowedBooks}" class="border border-dark bg-white p-4 mb-3 rounded-0 position-relative">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h4 class="h5 mb-1" th:text="\${book.title}">Literature Title</h4>
                            <p class="text-muted italic mb-2" th:text="'by ' + \${book.author}">Robert C. Martin</p>
                            <span class="badge border border-dark text-dark rounded-0 font-monospace small" th:text="'ISBN: ' + \${book.isbn}">ISBN-1029</span>
                        </div>
                        <div>
                            <a th:href="@{/students/profile/{studentId}/books/remove/{bookId}(studentId=\${student.id}, bookId=\${book.id})}" 
                               class="btn btn-sm btn-danger text-white rounded-0">Return Book</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manual book assignment form -->
            <div class="col-md-5 ps-5">
                <h3 class="h4 mb-4">Manual Assign</h3>
                <form th:action="@{/students/profile/{id}/books/add(id=\${student.id})}" th:object="\${newBook}" method="post">
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Book Title</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{title}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Author</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{author}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">ISBN</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{isbn}" required>
                    </div>
                    <button type="submit" class="btn btn-editorial rounded-0 w-100 text-uppercase small py-2">Checkout Manual Book</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    name: "search.html",
    path: "src/main/resources/templates/search.html",
    language: "html",
    content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Search External API Database</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #FDFCFB; color: #1A1A1A; font-family: 'Georgia', serif; }
        .editorial-border { border: 1px solid #1A1A1A !important; }
        .btn-editorial { background-color: #1A1A1A; color: #FFF; border-radius: 0; border: 1px solid #1A1A1A; }
        .block-shadow { box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); }
    </style>
</head>
<body class="p-5">
    <div class="container border border-dark p-5 min-vh-100">
        <div class="mb-4">
            <a href="/students" class="text-dark font-monospace text-uppercase small text-decoration-none">&larr; Back to Student Roster</a>
        </div>

        <div class="row align-items-center mb-5 border-bottom border-dark pb-4">
            <div class="col-md-7">
                <span class="text-uppercase small text-muted font-monospace">Jackson Databind Parser Service &amp; OpenLibrary REST Client</span>
                <h1 class="display-5 italic">Search External Database &amp; Assign</h1>
            </div>
            <div class="col-md-5">
                <form th:action="@{/books/search}" method="get" class="d-flex">
                    <input type="text" class="form-control rounded-0 editorial-border me-2" name="query" 
                           placeholder="Search (e.g. Clean Code, Software Engineering)" th:value="\${query}" required>
                    <button type="submit" class="btn btn-editorial rounded-0 px-4">Query</button>
                </form>
            </div>
        </div>

        <!-- Found books display -->
        <div class="row">
            <div th:if="\${foundBooks == null}" class="col-12 text-center p-5 border border-dark rounded-0 bg-white">
                <p class="mb-0 text-muted italic">Type keywords in the search bar to query the OpenLibrary free API.</p>
            </div>
            
            <div th:if="\${foundBooks != null}" class="col-12">
                <h3 class="h4 mb-4" th:text="'Query Results for \\'' + \${query} + '\''">Query Results</h3>
                <div class="row g-4">
                    <div th:each="book : \${foundBooks}" class="col-md-6">
                        <div class="border border-dark bg-white p-4 rounded-0 block-shadow h-100 d-flex flex-col justify-content-between">
                            <div class="mb-4">
                                <span class="badge border border-dark text-dark rounded-0 font-monospace small mb-2">FOUND IN API</span>
                                <h4 class="h5" th:text="\${book.title}">Title</h4>
                                <p class="text-muted italic" th:text="\${book.author}">Author</p>
                                <p class="font-monospace text-muted small" th:text="'ISBN: ' + \${book.isbn}">ISBN</p>
                            </div>
                            
                            <!-- Checkout Form -->
                            <form th:action="@{/books/checkout}" method="post" class="border-top border-dark pt-3">
                                <input type="hidden" name="title" th:value="\${book.title}">
                                <input type="hidden" name="author" th:value="\${book.author}">
                                <input type="hidden" name="isbn" th:value="\${book.isbn}">
                                
                                <div class="row g-2 align-items-end">
                                    <div class="col-8">
                                        <label class="form-label font-monospace small text-uppercase">Check out to Student</label>
                                        <select class="form-select rounded-0 editorial-border" name="studentId" required>
                                            <option value="">-- Choose student --</option>
                                            <option th:each="student : \${students}" th:value="\${student.id}" 
                                                    th:text="\${student.name} + ' (' + \${student.groupNumber} + ')'">Student Name</option>
                                        </select>
                                    </div>
                                    <div class="col-4">
                                        <button type="submit" class="btn btn-editorial rounded-0 w-100 py-2 small text-uppercase">Assign</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    name: "edit.html",
    path: "src/main/resources/templates/edit.html",
    language: "html",
    content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Edit Student Profile</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #FDFCFB; color: #1A1A1A; font-family: 'Georgia', serif; }
        .editorial-border { border: 1px solid #1A1A1A !important; }
        .btn-editorial { background-color: #1A1A1A; color: #FFF; border-radius: 0; border: 1px solid #1A1A1A; }
    </style>
</head>
<body class="p-5">
    <div class="container border border-dark p-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div class="w-100 max-width-md" style="max-width: 500px;">
            <div class="mb-4 text-start">
                <a href="/students" class="text-dark font-monospace text-uppercase small text-decoration-none">&larr; Back to Student Roster</a>
            </div>

            <div class="border border-dark p-5 bg-white">
                <span class="text-uppercase small text-muted font-monospace" th:text="'Student ID: ' + \${student.id}">ID: 0</span>
                <h1 class="display-6 italic mb-4">Edit Student File</h1>
                
                <form th:action="@{/students/update/{id}(id=\${student.id})}" th:object="\${student}" method="post">
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Full Name</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{name}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Email Coordinate</label>
                        <input type="email" class="form-control rounded-0 editorial-border" th:field="*{email}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-uppercase small font-monospace">Academic Group</label>
                        <input type="text" class="form-control rounded-0 editorial-border" th:field="*{groupNumber}" required>
                    </div>
                    <button type="submit" class="btn btn-editorial rounded-0 w-100 text-uppercase small py-2 mt-3">Commit Changes</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>`
  }
];
