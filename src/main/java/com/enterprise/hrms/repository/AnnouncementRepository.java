package com.enterprise.hrms.repository;

import com.enterprise.hrms.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    Page<Announcement> findByExpiresAtAfterOrderByIsPinnedDescCreatedDateDesc(LocalDateTime now, Pageable pageable);
}
