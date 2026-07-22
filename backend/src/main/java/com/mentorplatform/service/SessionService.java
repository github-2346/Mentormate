package com.mentorplatform.service;

import com.mentorplatform.dto.CreateSessionRequest;
import com.mentorplatform.dto.SessionDTO;
import com.mentorplatform.model.Session;
import com.mentorplatform.model.User;
import com.mentorplatform.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;

    @Transactional
    public SessionDTO create(CreateSessionRequest req, User mentor) {
        Session session = Session.builder()
            .mentor(mentor)
            .title(req.getTitle())
            .language(req.getLanguage())
            .status(Session.Status.PENDING)
            .build();
        return SessionDTO.from(sessionRepository.save(session));
    }

    public List<SessionDTO> getMySessions(User user) {
        return sessionRepository.findAllByUser(user)
            .stream().map(SessionDTO::from).toList();
    }

    public List<SessionDTO> getAllSessions() {
        return sessionRepository.findAllByOrderByCreatedAtDesc()
            .stream().map(SessionDTO::from).toList();
    }

    public SessionDTO getById(String id) {
        return SessionDTO.from(findOrThrow(id));
    }

    @Transactional
    public SessionDTO join(String id, User student) {
        Session session = findOrThrow(id);
        if (session.getStatus() != Session.Status.PENDING) {
            throw new IllegalStateException("Session is not joinable");
        }
        if (session.getMentor().getId().equals(student.getId())) {
            throw new IllegalStateException("Mentor cannot join as student");
        }
        session.setStudent(student);
        return SessionDTO.from(sessionRepository.save(session));
    }

    @Transactional
    public SessionDTO start(String id, User mentor) {
        Session session = findOrThrow(id);
        assertMentor(session, mentor);
        if (session.getStatus() != Session.Status.PENDING) {
            throw new IllegalStateException("Session cannot be started — current status: " + session.getStatus());
        }
        session.setStatus(Session.Status.ACTIVE);
        session.setStartedAt(LocalDateTime.now());
        return SessionDTO.from(sessionRepository.save(session));
    }

    @Transactional
    public SessionDTO end(String id, User mentor) {
        Session session = findOrThrow(id);
        assertMentor(session, mentor);
        if (session.getStatus() == Session.Status.ENDED) {
            throw new IllegalStateException("Session is already ended");
        }
        session.setStatus(Session.Status.ENDED);
        session.setEndedAt(LocalDateTime.now());
        return SessionDTO.from(sessionRepository.save(session));
    }

    private Session findOrThrow(String id) {
        return sessionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Session not found: " + id));
    }

    private void assertMentor(Session session, User user) {
        if (!session.getMentor().getId().equals(user.getId())) {
            throw new SecurityException("Only the mentor can perform this action");
        }
    }
}
