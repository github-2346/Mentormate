package com.mentorplatform.websocket;

import com.mentorplatform.dto.CodeUpdateRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Stateless handler — actual relay is done in WebSocketController.
 * This class can be extended to add snapshot persistence or conflict resolution.
 */
@Slf4j
@Component
public class CodeSyncHandler {

    /**
     * Last-write-wins: no conflict resolution needed.
     * Frontend throttles sends to 200ms to limit traffic.
     */
    public void onCodeUpdate(CodeUpdateRequest req) {
        log.debug("Code update for session={} lang={} size={}",
            req.getSessionId(), req.getLanguage(),
            req.getCode() != null ? req.getCode().length() : 0);
    }
}
