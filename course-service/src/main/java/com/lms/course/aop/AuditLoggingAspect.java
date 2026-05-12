package com.lms.course.aop;

import java.time.LocalDateTime;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class AuditLoggingAspect {

    /**
     * Intercepts all controller methods in com.lms.course.controller.
     * Logs method name, arguments, execution time, and user identity for
     * state-changing operations (POST / PUT / DELETE).
     */
    @Around("execution(* com.lms.course.controller..*(..))")
    public Object logAndAudit(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String method = joinPoint.getSignature().toShortString();

        String userId = extractUserId();
        String httpMethod = extractHttpMethod();

        // Audit log for state-changing calls only
        if (httpMethod != null && (httpMethod.equals("POST") || httpMethod.equals("PUT")
                || httpMethod.equals("DELETE"))) {
            log.info("[AUDIT] {} | user={} | method={} | timestamp={}",
                    httpMethod, userId, method, LocalDateTime.now());
        }

        try {
            Object result = joinPoint.proceed();
            long elapsed = System.currentTimeMillis() - start;
            log.info("[LOG] {} completed in {}ms | user={}", method, elapsed, userId);
            return result;
        } catch (Throwable ex) {
            log.error("[LOG] {} threw {} | user={} | message={}",
                    method, ex.getClass().getSimpleName(), userId, ex.getMessage());
            throw ex;
        }
    }

    private String extractUserId() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                String userId = attrs.getRequest().getHeader("X-User-Id");
                return userId != null ? userId : "anonymous";
            }
        } catch (Exception ignored) {
        }
        return "unknown";
    }

    private String extractHttpMethod() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                return attrs.getRequest().getMethod();
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}