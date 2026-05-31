package edu.university.lab.mapper;

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
}
