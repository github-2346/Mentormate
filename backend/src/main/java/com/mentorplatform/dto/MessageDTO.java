package com.mentorplatform.dto;

import com.mentorplatform.model.Message;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MessageDTO {
    private Long id;
    private String sessionId;
    private Long senderId;
    private String senderName;
    private String message;
    private String type;
    private LocalDateTime timestamp;

    public static MessageDTO from(Message m) {
        return MessageDTO.builder()
            .id(m.getId())
            .sessionId(m.getSessionId())
            .senderId(m.getSender().getId())
            .senderName(m.getSender().getName())
            .message(m.getMessage())
            .type(m.getType().name())
            .timestamp(m.getTimestamp())
            .build();
    }
}
