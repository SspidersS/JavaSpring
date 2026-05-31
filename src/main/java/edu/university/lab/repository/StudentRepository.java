package edu.university.lab.repository;

import edu.university.lab.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Custom finder for security & validation checks
    Optional<Student> findByEmail(String email);
}
