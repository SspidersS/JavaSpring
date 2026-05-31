package edu.university.lab.service;

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
}
