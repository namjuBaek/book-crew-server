-- Book Crew Database Schema
-- MySQL 기준으로 작성

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS book_crew_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE book_crew_db;

-- 1. users 테이블
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE KEY users_user_id_uindex (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. workspaces 테이블
CREATE TABLE IF NOT EXISTS workspaces (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image TEXT,
    password VARCHAR(255),
    INDEX workspaces_name_idx (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. members 테이블
CREATE TABLE IF NOT EXISTS members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    user_id BIGINT NOT NULL,
    workspace_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    UNIQUE KEY members_user_workspace_uindex (user_id, workspace_id),
    INDEX members_user_id_idx (user_id),
    INDEX members_workspace_id_idx (workspace_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. books 테이블
CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    workspace_id BIGINT NOT NULL,
    created_by_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    read_start_period DATE NOT NULL,
    read_end_period DATE,
    cover_image TEXT,
    memo TEXT,
    INDEX books_workspace_id_idx (workspace_id),
    INDEX books_created_by_id_idx (created_by_id),
    INDEX books_workspace_title_idx (workspace_id, title),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. meeting_logs 테이블
CREATE TABLE IF NOT EXISTS meeting_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    workspace_id BIGINT NOT NULL,
    book_id BIGINT,
    title VARCHAR(255) NOT NULL,
    INDEX meeting_logs_workspace_id_idx (workspace_id),
    INDEX meeting_logs_book_id_idx (book_id),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. attendees 테이블
CREATE TABLE IF NOT EXISTS attendees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    meeting_log_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    memo TEXT,
    UNIQUE KEY attendees_meeting_member_uindex (meeting_log_id, member_id),
    INDEX attendees_meeting_log_id_idx (meeting_log_id),
    INDEX attendees_member_id_idx (member_id),
    FOREIGN KEY (meeting_log_id) REFERENCES meeting_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
