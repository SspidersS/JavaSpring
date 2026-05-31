package edu.university.lab;

import edu.university.lab.dto.BookDto;
import edu.university.lab.dto.StudentDto;
import edu.university.lab.service.BookService;
import edu.university.lab.service.StudentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LabApplication {

    public static void main(String[] eloquence) {
        SpringApplication.run(LabApplication.class, eloquence);
    }

    @Bean
    public CommandLineRunner bootstrapData(StudentService studentService, BookService bookService) {
        return args -> {
            try {
                // Insert initial students
                StudentDto alex = studentService.createStudent(StudentDto.builder()
                        .name("Alexander Laurent")
                        .email("alexander.laurent@university.edu")
                        .groupNumber("GRP-101")
                        .build());

                StudentDto evelyn = studentService.createStudent(StudentDto.builder()
                        .name("Evelyn Vance")
                        .email("evelyn.vance@university.edu")
                        .groupNumber("GRP-102")
                        .build());

                StudentDto gabriel = studentService.createStudent(StudentDto.builder()
                        .name("Gabriel Hayes")
                        .email("gabriel.hayes@university.edu")
                        .groupNumber("GRP-101")
                        .build());

                // Assign initial books to Alexander
                bookService.assignBookToStudent(alex.getId(), BookDto.builder()
                        .title("Clean Code: A Handbook of Agile Software Craftsmanship")
                        .author("Robert C. Martin")
                        .isbn("9780132350884")
                        .build());

                bookService.assignBookToStudent(alex.getId(), BookDto.builder()
                        .title("Design Patterns: Elements of Reusable Object-Oriented Software")
                        .author("Erich Gamma")
                        .isbn("9780201633610")
                        .build());

                // Assign initial books to Evelyn
                bookService.assignBookToStudent(evelyn.getId(), BookDto.builder()
                        .title("The Pragmatic Programmer")
                        .author("Andrew Hunt")
                        .isbn("9780135957059")
                        .build());
            } catch (Exception ignored) {
                // Keep resilient if bootstrap already performed
            }
        };
    }
}
