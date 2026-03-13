-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- 实际应存储加密后的哈希
    nickname VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建项目成员关联表
CREATE TABLE IF NOT EXISTS project_member (
    project_id INTEGER REFERENCES project(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'MEMBER', -- OWNER, ADMIN, MEMBER
    PRIMARY KEY (project_id, user_id)
);

-- 完善需求表
CREATE TABLE IF NOT EXISTS requirement (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT',
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    type VARCHAR(50) DEFAULT 'FEATURE',
    project_id INTEGER REFERENCES project(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始测试数据 (密码均为 admin，明文仅供测试)
INSERT INTO users (username, password, nickname) VALUES ('admin', 'admin', '系统管理员') ON CONFLICT DO NOTHING;
INSERT INTO users (username, password, nickname) VALUES ('lee', 'admin', '李工程师') ON CONFLICT DO NOTHING;

INSERT INTO project (name, description, owner_id) VALUES ('需求管理系统', '核心内部管理系统重构项目', 1) ON CONFLICT DO NOTHING;
INSERT INTO project (name, description, owner_id) VALUES ('问题单系统', '缺陷追踪与质量保证平台', 1) ON CONFLICT DO NOTHING;
INSERT INTO project (name, description, owner_id) VALUES ('AI 助手集成', '将 LLM 能力引入研发流程', 2) ON CONFLICT DO NOTHING;

INSERT INTO project_member (project_id, user_id, role) VALUES (1, 1, 'OWNER') ON CONFLICT DO NOTHING;
INSERT INTO project_member (project_id, user_id, role) VALUES (2, 1, 'OWNER') ON CONFLICT DO NOTHING;
INSERT INTO project_member (project_id, user_id, role) VALUES (3, 1, 'MEMBER') ON CONFLICT DO NOTHING;
INSERT INTO project_member (project_id, user_id, role) VALUES (3, 2, 'OWNER') ON CONFLICT DO NOTHING;
