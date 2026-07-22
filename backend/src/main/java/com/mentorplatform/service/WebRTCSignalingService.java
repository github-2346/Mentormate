package com.mentorplatform.service;

import com.mentorplatform.dto.SignalMessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebRTCSignalingService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Relay WebRTC signaling message (offer/answer/ice-candidate) to the session's signal topic.
     * All participants in the session subscribe and filter by signal.to === their userId.
     */
    public void relay(SignalMessageDTO signal) {
        messagingTemplate.convertAndSend(
            "/topic/session/" + signal.getSessionId() + "/signal", signal);
    }
}
