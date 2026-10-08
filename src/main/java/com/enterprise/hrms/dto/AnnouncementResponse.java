package com.enterprise.hrms.dto;

import com.enterprise.hrms.entity.Announcement.AnnouncementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private AnnouncementType type;
    private LocalDateTime expiresAt;
    private Boolean isPinned;
    private LocalDateTime createdDate;
    private String createdBy;
}
