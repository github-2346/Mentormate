package com.mentorplatform.dto;

import com.mentorplatform.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank @Size(min = 2, max = 100)
    private String name;

    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    @NotNull
    private User.Role role;
}
