package com.mentorplatform.dto;

import lombok.Data;

@Data
public class CodeUpdateRequest {
    private String sessionId;
    private String code;
    private String language;
    private Long senderId;
}
