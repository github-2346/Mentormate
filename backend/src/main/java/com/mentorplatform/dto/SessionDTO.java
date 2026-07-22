package com.mentorplatform.dto;

import com.mentorplatform.model.Session;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SessionDTO {
    private String id;
    private Long mentorId;
    private Long studentId;
    private String mentorName;
    private String studentName;
    private String title;
    private String language;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public static SessionDTO from(Session s) {
        return SessionDTO.builder()
            .id(s.getId())
            .mentorId(s.getMentor().getId())
            .studentId(s.getStudent() != null ? s.getStudent().getId() : null)
            .mentorName(s.getMentor().getName())
            .studentName(s.getStudent() != null ? s.getStudent().getName() : null)
            .title(s.getTitle())
            .language(s.getLanguage())
            .status(s.getStatus().name())
            .createdAt(s.getCreatedAt())
            .startedAt(s.getStartedAt())
            .endedAt(s.getEndedAt())
            .build();
    }
}
