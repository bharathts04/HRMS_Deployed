package com.enterprise.hrms.repository;

import com.enterprise.hrms.entity.JobPosition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
    Page<JobPosition> findByStatus(JobPosition.PositionStatus status, Pageable pageable);
    Page<JobPosition> findByDepartmentId(Long departmentId, Pageable pageable);
}
