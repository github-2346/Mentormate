package com.mentorplatform.service;

import com.mentorplatform.dto.ChatMessageRequest;
import com.mentorplatform.dto.MessageDTO;
import com.mentorplatform.model.Message;
import com.mentorplatform.model.User;
import com.mentorplatform.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    /**
     * Persist a chat message and return its DTO for broadcasting.
     */
    public MessageDTO save(ChatMessageRequest request, User sender) {
        Message.MessageType type = (request.getType() != null)
            ? request.getType()
            : Message.MessageType.TEXT;

        Message message = Message.builder()
            .sessionId(request.getSessionId())
            .sender(sender)
            .message(request.getMessage())
            .type(type)
            .build();

        return MessageDTO.from(messageRepository.save(message));
    }

    public List<MessageDTO> getBySession(String sessionId) {
        return messageRepository.findBySessionIdOrderByTimestampAsc(sessionId)
            .stream().map(MessageDTO::from).toList();
    }
}
