package com.mentorplatform.websocket;

import com.mentorplatform.dto.SignalMessageDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SignalingHandler {
    public void onSignal(SignalMessageDTO signal) {
        log.debug("WebRTC signal type={} from={} to={} session={}",
            signal.getType(), signal.getFrom(), signal.getTo(), signal.getSessionId());
    }
}
