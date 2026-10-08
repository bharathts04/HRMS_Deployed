package com.enterprise.hrms.repository;

import com.enterprise.hrms.entity.Salary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    Page<Salary> findByEmployeeId(Long employeeId, Pageable pageable);
    Optional<Salary> findByEmployeeIdAndMonthAndYear(Long employeeId, String month, String year);
}
