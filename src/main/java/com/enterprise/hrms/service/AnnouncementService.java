package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.AnnouncementRequest;
import com.enterprise.hrms.dto.AnnouncementResponse;
import com.enterprise.hrms.entity.Announcement;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType())
                .expiresAt(request.getExpiresAt())
                .isPinned(request.getIsPinned() != null ? request.getIsPinned() : false)
                .build();

        Announcement saved = announcementRepository.save(announcement);
        return mapToResponse(saved);
    }

    public AnnouncementResponse updateAnnouncement(Long id, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setType(request.getType());
        announcement.setExpiresAt(request.getExpiresAt());
        if (request.getIsPinned() != null) {
            announcement.setIsPinned(request.getIsPinned());
        }

        Announcement updated = announcementRepository.save(announcement);
        return mapToResponse(updated);
    }

    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found");
        }
        announcementRepository.deleteById(id);
    }

    public Page<AnnouncementResponse> getActiveAnnouncements(Pageable pageable) {
        return announcementRepository.findByExpiresAtAfterOrderByIsPinnedDescCreatedDateDesc(LocalDateTime.now(), pageable)
                .map(this::mapToResponse);
    }

    private AnnouncementResponse mapToResponse(Announcement announcement) {
        return AnnouncementResponse.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .type(announcement.getType())
                .expiresAt(announcement.getExpiresAt())
                .isPinned(announcement.getIsPinned())
                .createdDate(announcement.getCreatedDate())
                .createdBy(announcement.getCreatedBy())
                .build();
    }
}
