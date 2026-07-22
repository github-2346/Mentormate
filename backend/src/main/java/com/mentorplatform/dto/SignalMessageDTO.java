package com.mentorplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignalMessageDTO {
    private String type;       // offer | answer | ice-candidate
    private Long from;
    private Long to;
    private String sessionId;
    private Object payload;    // RTCSessionDescription or RTCIceCandidate JSON
}
