package com.canteen.service;

import com.canteen.dto.AuthRequest;
import com.canteen.dto.AuthResponse;
import com.canteen.dto.RegisterRequest;
import com.canteen.model.User;
import com.canteen.repository.UserRepository;
import com.canteen.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getWalletBalance());
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User(
                request.getName(),
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                request.getRole() != null ? request.getRole() : com.canteen.model.Role.ROLE_CUSTOMER,
                500.00 // Welcome wallet balance
        );

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getWalletBalance());
    }

    public User topUpWallet(Long userId, Double amount) {
        if (amount == null || amount <= 0) {
            throw new RuntimeException("Top up amount must be greater than 0");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setWalletBalance(Math.round((user.getWalletBalance() + amount) * 100.0) / 100.0);
        return userRepository.save(user);
    }
}
