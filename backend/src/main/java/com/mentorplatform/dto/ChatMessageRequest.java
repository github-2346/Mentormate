package com.mentorplatform.dto;

import com.mentorplatform.model.Message;
import lombok.Data;

@Data
public class ChatMessageRequest {
    private String sessionId;
    private String message;
    private Message.MessageType type;
}
