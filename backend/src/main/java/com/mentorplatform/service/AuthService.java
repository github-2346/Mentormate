package com.mentorplatform.service;

import com.mentorplatform.dto.AuthRequest;
import com.mentorplatform.dto.AuthResponse;
import com.mentorplatform.dto.SignupRequest;
import com.mentorplatform.model.User;
import com.mentorplatform.repository.UserRepository;
import com.mentorplatform.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(req.getRole())
            .build();
        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return buildResponse(user, token);
    }

    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String token = jwtUtil.generateToken(user);
        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build())
            .build();
    }
}
