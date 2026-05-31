package edu.university.lab.entity;

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
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String groupNumber;

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
}
