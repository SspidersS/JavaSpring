package edu.university.lab.mapper;

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
}
