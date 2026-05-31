package edu.university.lab.controller;

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
    public String searchForm(@RequestParam(value = "query", required = false) String query, Model model) {
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
    public String checkoutBook(
            @RequestParam("studentId") Long studentId,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("isbn") String isbn) {
        
        BookDto bookDto = BookDto.builder()
                .title(title)
                .author(author)
                .isbn(isbn)
                .build();
                
        bookService.assignBookToStudent(studentId, bookDto);
        return "redirect:/students/profile/" + studentId;
    }
}
