package com.canteen.dto;

import com.canteen.model.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Double walletBalance;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String name, String email, Role role, Double walletBalance) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.walletBalance = walletBalance;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Double getWalletBalance() { return walletBalance; }
    public void setWalletBalance(Double walletBalance) { this.walletBalance = walletBalance; }
}
