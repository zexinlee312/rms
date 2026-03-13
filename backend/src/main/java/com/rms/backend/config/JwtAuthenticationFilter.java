package com.rms.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String jwt = null;
        String username = null;

        System.out.println("收到请求: " + request.getMethod() + " " + request.getRequestURI());

        // 从 Cookie 中获取 Token
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("rms_jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    System.out.println("找到 JWT Cookie: " + jwt.substring(0, Math.min(10, jwt.length())) + "...");
                    break;
                }
            }
        } else {
            System.out.println("未找到任何 Cookie");
        }

        if (jwt != null) {
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("JWT 解析成功，用户: " + username);
            } catch (Exception e) {
                System.err.println("JWT 解析失败: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, username)) {
                System.out.println("认证通过，设置安全上下文");
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        username, null, new ArrayList<>());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                System.err.println("Token 验证失败（可能过期）");
            }
        }
        chain.doFilter(request, response);
    }
}

