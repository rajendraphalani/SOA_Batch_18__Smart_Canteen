package com.canteen.controller;

import com.canteen.dto.AuthRequest;
import com.canteen.dto.AuthResponse;
import com.canteen.dto.RegisterRequest;
import com.canteen.model.User;
import com.canteen.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(java.util.Collections.singletonMap("error", "Not authenticated"));
        }
        return ResponseEntity.ok(new AuthResponse(
                null, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getWalletBalance()
        ));
    }

    @PostMapping("/wallet/topup")
    public ResponseEntity<?> topUpWallet(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> payload) {
        if (user == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Not authenticated"));
        }
        Object amountObj = payload.get("amount");
        if (amountObj == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Amount is required"));
        }
        Double amount;
        try {
            amount = Double.valueOf(amountObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Invalid amount number"));
        }
        try {
            User updated = authService.topUpWallet(user.getId(), amount);
            return ResponseEntity.ok(Map.of(
                    "message", "Wallet topped up successfully",
                    "walletBalance", updated.getWalletBalance()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
