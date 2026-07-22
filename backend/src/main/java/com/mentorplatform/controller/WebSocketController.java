package com.mentorplatform.controller;

import com.mentorplatform.dto.ChatMessageRequest;
import com.mentorplatform.dto.CodeUpdateRequest;
import com.mentorplatform.dto.MessageDTO;
import com.mentorplatform.dto.SignalMessageDTO;
import com.mentorplatform.model.User;
import com.mentorplatform.service.MessageService;
import com.mentorplatform.service.WebRTCSignalingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final WebRTCSignalingService signalingService;

    /**
     * Code sync — last-write-wins, 200ms frontend throttle.
     * Broadcasts raw update; not persisted (snapshots are optional).
     */
    @MessageMapping("/code")
    public void handleCodeUpdate(@Payload CodeUpdateRequest req) {
        messagingTemplate.convertAndSend(
            "/topic/session/" + req.getSessionId() + "/code", req);
    }

    /**
     * Chat — persist then broadcast to session topic.
     */
    @MessageMapping("/chat")
    public void handleChat(
            @Payload ChatMessageRequest req,
            @AuthenticationPrincipal User user) {
        MessageDTO saved = messageService.save(req, user);
        messagingTemplate.convertAndSend(
            "/topic/session/" + req.getSessionId() + "/chat", saved);
    }

    /**
     * WebRTC signaling — relay offer/answer/ice-candidate to session topic.
     * Clients filter by signal.to === userId.
     */
    @MessageMapping("/signal")
    public void handleSignal(@Payload SignalMessageDTO signal) {
        signalingService.relay(signal);
    }
}
