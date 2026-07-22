package com.mentorplatform.websocket;

import com.mentorplatform.dto.MessageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class ChatHandler {
    public void onNewMessage(MessageDTO msg) {
        log.debug("Chat message in session={} from={}", msg.getSessionId(), msg.getSenderName());
    }
}
