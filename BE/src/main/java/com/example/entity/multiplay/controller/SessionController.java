package com.example.entity.multiplay.controller;

import com.example.entity.multiplay.serviceImpl.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SessionController {

    @Autowired
    private SessionService sessionService;


    //세션 생성하기
    @PostMapping("/sessions/{userId}")
    public ResponseEntity<?> createSession(@PathVariable(name="userId") Long userId) {
        try {
            Map<String, String> sessionInfo = sessionService.createSessionWithToken(userId);
            return ResponseEntity.ok(sessionInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating session: " + e.getMessage());
        }
    }

    @PostMapping("/sessions/{codeValue}/token")
    public ResponseEntity<?> generateToken(@PathVariable(name="codeValue") String inviteCode) {
        System.out.println("입장 요청");
        try {
            String sessionId = sessionService.getSessionIdByInviteCode(inviteCode);
            String token = sessionService.generateToken(sessionId);
            return ResponseEntity.ok(Map.of("sessionId", sessionId, "token", token));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Error generating token: " + e.getMessage());
        }
    }
}
