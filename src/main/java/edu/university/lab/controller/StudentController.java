package edu.university.lab.controller;

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
    public String listStudents(Model model) {
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("newStudent", new StudentDto());
        return "index"; // template index.html
    }

    // Process new student creation form
    @PostMapping("/add")
    public String addStudent(@ModelAttribute("newStudent") StudentDto studentDto) {
        studentService.createStudent(studentDto);
        return "redirect:/students";
    }

    // View edit student page
    @GetMapping("/edit/{id}")
    public String editStudentForm(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        return "edit"; // edit student form
    }

    // Process editing student data
    @PostMapping("/update/{id}")
    public String updateStudent(@PathVariable Long id, @ModelAttribute("student") StudentDto studentDto) {
        studentService.updateStudent(id, studentDto);
        return "redirect:/students";
    }

    // Remove student completely from database
    @GetMapping("/delete/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return "redirect:/students";
    }

    // View Student Profile (shows active list of borrowed literature)
    @GetMapping("/profile/{id}")
    public String viewStudentProfile(@PathVariable Long id, Model model) {
        model.addAttribute("student", studentService.getStudentById(id));
        model.addAttribute("newBook", new BookDto());
        return "profile"; // profile.html
    }

    // Manually register a library book assignation directly on student
    @PostMapping("/profile/{id}/books/add")
    public String assignBook(@PathVariable("id") Long studentId, @ModelAttribute("newBook") BookDto bookDto) {
        bookService.assignBookToStudent(studentId, bookDto);
        return "redirect:/students/profile/" + studentId;
    }

    // Return/remove a borrowed book
    @GetMapping("/profile/{studentId}/books/remove/{bookId}")
    public String unassignBook(@PathVariable Long studentId, @PathVariable Long bookId) {
        bookService.unassignBook(bookId);
        return "redirect:/students/profile/" + studentId;
    }
}
