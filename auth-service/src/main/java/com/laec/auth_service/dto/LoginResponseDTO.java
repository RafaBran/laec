package com.laec.auth_service.dto;

public class LoginResponseDTO {
    private String token;
    private String tipo;
    private String nome;
    private Integer id;
    private String email;

    // Constructors
    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, String tipo, String nome, Integer id, String email) {
        this.token = token;
        this.tipo = tipo;
        this.nome = nome;
        this.id = id;
        this.email = email;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
