-- =====================================================
-- ATUALIZAR SENHAS PARA FORMATO COMPATÍVEL COM SPRING
-- =====================================================
-- ATENÇÃO: As senhas do banco foram criadas com pgcrypto (crypt/gen_salt)
-- O Spring Security BCrypt é compatível, mas precisamos garantir que
-- novas senhas sejam criadas via aplicação Spring Boot

-- Verificar formato atual das senhas
SELECT 
    email,
    LEFT(senha, 10) as senha_inicio,
    LENGTH(senha) as tamanho_senha
FROM usuarios;

-- As senhas atuais no formato pgcrypto (crypt com bcrypt) já são compatíveis
-- com BCryptPasswordEncoder do Spring Security!
-- Formato: $2a$ ou $2b$ (ambos funcionam)

-- Para testar login:
-- Email: admin@laec.com | Senha: admin123
-- Email: ueliton@unialfa.com.br | Senha: professor123
-- Email: rafael.brandao@unialfa.com.br | Senha: tecnico123

-- =====================================================
-- FIM
-- =====================================================
