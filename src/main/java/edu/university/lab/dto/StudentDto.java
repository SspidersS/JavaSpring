package edu.university.lab.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {
    private Long id;
    private String name;
    private String email;
    private String groupNumber;
    private int bookCount;
    private List<BookDto> borrowedBooks;
}
