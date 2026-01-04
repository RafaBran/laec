package com.laec.gateway_service.filter;

import com.laec.gateway_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter implements GatewayFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // Rotas que não precisam de autenticação
    private static final List<String> OPEN_ENDPOINTS = List.of(
            "/api/auth/login",
            "/api/auth/register"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().toString();

        // Permite rotas abertas sem validação
        if (isOpenEndpoint(path)) {
            return chain.filter(exchange);
        }

        // Verifica se o header Authorization existe
        if (!request.getHeaders().containsKey("Authorization")) {
            return onError(exchange, "Token não fornecido", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        
        // Valida formato do token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Formato de token inválido", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        // Valida o token JWT
        try {
            if (!jwtUtil.isTokenValid(token)) {
                return onError(exchange, "Token inválido", HttpStatus.UNAUTHORIZED);
            }

            // Token válido, adiciona informações do usuário no header
            String email = jwtUtil.extractEmail(token);
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Email", email)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            return onError(exchange, "Erro ao validar token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isOpenEndpoint(String path) {
        return OPEN_ENDPOINTS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");
        
        String errorResponse = String.format("{\"error\":\"%s\",\"status\":%d}", 
                message, status.value());
        
        return response.writeWith(Mono.just(response.bufferFactory()
                .wrap(errorResponse.getBytes())));
    }
}
