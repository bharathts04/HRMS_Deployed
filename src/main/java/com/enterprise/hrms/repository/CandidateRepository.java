package com.enterprise.hrms.repository;

import com.enterprise.hrms.entity.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Page<Candidate> findByJobPositionId(Long jobPositionId, Pageable pageable);
    Page<Candidate> findByStatus(Candidate.CandidateStatus status, Pageable pageable);
}
