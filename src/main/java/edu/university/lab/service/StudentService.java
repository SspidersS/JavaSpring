package edu.university.lab.service;

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
}
