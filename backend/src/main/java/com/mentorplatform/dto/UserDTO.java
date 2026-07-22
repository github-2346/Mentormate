package com.mentorplatform.dto;

import com.mentorplatform.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;

    public static UserDTO from(User u) {
        return UserDTO.builder()
            .id(u.getId())
            .name(u.getName())
            .email(u.getEmail())
            .role(u.getRole().name())
            .build();
    }
}
