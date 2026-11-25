package com.cidadeemdia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Usuários de teste (somente para a atividade)
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        var cidadao = User.withUsername("cidadao")
                .password(encoder.encode("senha123"))
                .roles("CIDADAO")
                .build();

        var atendente = User.withUsername("atendente")
                .password(encoder.encode("senha456"))
                .roles("ATENDENTE", "CIDADAO")
                .build();

        var admin = User.withUsername("admin")
                .password(encoder.encode("admin123"))
                .roles("ADMIN", "ATENDENTE", "CIDADAO")
                .build();

        return new InMemoryUserDetailsManager(cidadao, atendente, admin);
    }

    // Todas as regras de acesso ficam aqui, num lugar só
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .httpBasic(basic -> { })
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/usuarios/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/v1/categorias").hasAnyRole("ADMIN", "ATENDENTE")
                .requestMatchers(HttpMethod.PUT, "/api/v1/categorias/*").hasAnyRole("ADMIN", "ATENDENTE")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/categorias/*").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/v1/ocorrencias/*/status").hasAnyRole("ADMIN", "ATENDENTE")
                .requestMatchers(HttpMethod.PUT, "/api/v1/ocorrencias/*").hasAnyRole("ADMIN", "ATENDENTE")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/ocorrencias/*").hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/v1/historicos-status").hasAnyRole("ADMIN", "ATENDENTE")
                .requestMatchers(HttpMethod.PUT, "/api/v1/historicos-status/*").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/historicos-status/*").hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT, "/api/v1/confirmacoes/*").hasAnyRole("ADMIN", "ATENDENTE")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/confirmacoes/*").hasRole("ADMIN")

                .anyRequest().authenticated()
            );

        return http.build();
    }
}
