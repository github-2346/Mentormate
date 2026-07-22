package com.mentorplatform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_snapshots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false)
    @Builder.Default
    private String language = "javascript";

    @Column(name = "saved_at")
    @Builder.Default
    private LocalDateTime savedAt = LocalDateTime.now();
}
