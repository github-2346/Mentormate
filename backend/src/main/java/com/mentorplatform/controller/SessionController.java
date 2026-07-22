package com.mentorplatform.controller;

import com.mentorplatform.dto.CreateSessionRequest;
import com.mentorplatform.dto.SessionDTO;
import com.mentorplatform.model.User;
import com.mentorplatform.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<SessionDTO> create(
        @Valid @RequestBody CreateSessionRequest req,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(sessionService.create(req, user));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SessionDTO>> getMine(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sessionService.getMySessions(user));
    }

    @GetMapping
    public ResponseEntity<List<SessionDTO>> getAll() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(sessionService.getById(id));
    }

    @PostMapping("/{id}/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SessionDTO> join(
        @PathVariable String id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(sessionService.join(id, user));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<SessionDTO> start(
        @PathVariable String id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(sessionService.start(id, user));
    }

    @PostMapping("/{id}/end")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<SessionDTO> end(
        @PathVariable String id,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(sessionService.end(id, user));
    }
}
