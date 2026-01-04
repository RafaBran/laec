package com.laec.auth_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginRequestDTO {
    private String username;
    
    @JsonProperty("senha")
    private String senha;
    
    private boolean rememberMe = false;

    // Constructors
    public LoginRequestDTO() {
    }

    public LoginRequestDTO(String username, String senha) {
        this.username = username;
        this.senha = senha;
    }

    public LoginRequestDTO(String username, String senha, boolean rememberMe) {
        this.username = username;
        this.senha = senha;
        this.rememberMe = rememberMe;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    public boolean isRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
    
    // Aceita tanto "password" quanto "senha"
    @JsonProperty("password")
    public void setPassword(String password) {
        this.senha = password;
    }
}
