package com.mentorplatform.repository;

import com.mentorplatform.model.Session;
import com.mentorplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, String> {

    /**
     * All sessions where the user is either mentor or student, newest first.
     */
    @Query("SELECT s FROM Session s WHERE s.mentor = :user OR s.student = :user ORDER BY s.createdAt DESC")
    List<Session> findAllByUser(@Param("user") User user);

    List<Session> findAllByOrderByCreatedAtDesc();
}
