package com.mentorplatform.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = "http://localhost:3000")
public class CodeExecutionController {

    @PostMapping("/run")
    public ResponseEntity<?> runCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");

        RestTemplate restTemplate = new RestTemplate();

        String pistonUrl = "https://emkc.org/api/v2/piston/execute";

        Map<String, Object> body = new HashMap<>();
        body.put("language", "java");
        body.put("version", "15.0.2");

        List<Map<String, String>> files = new ArrayList<>();
        files.add(Map.of("content", code));

        body.put("files", files);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "Mozilla/5.0");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                pistonUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        return ResponseEntity.ok(response.getBody());
    }
}
