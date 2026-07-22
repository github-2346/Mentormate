package com.mentorplatform.repository;

import com.mentorplatform.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySessionIdOrderByTimestampAsc(String sessionId);
}
