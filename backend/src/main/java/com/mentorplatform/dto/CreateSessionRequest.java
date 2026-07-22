package com.mentorplatform.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSessionRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String language;
}
