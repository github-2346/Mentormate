package com.mentorplatform.controller;

import com.mentorplatform.dto.MessageDTO;
import com.mentorplatform.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<MessageDTO>> getHistory(@PathVariable String sessionId) {
        return ResponseEntity.ok(messageService.getBySession(sessionId));
    }
}
