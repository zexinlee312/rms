-- 创建迭代表 (Iteration/Sprint)
CREATE TABLE IF NOT EXISTS iteration (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES project(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 修改需求表，增加迭代关联
ALTER TABLE requirement ADD COLUMN IF NOT EXISTS iteration_id INTEGER REFERENCES iteration(id) ON DELETE SET NULL;

-- 插入一些初始状态的演示数据
-- 我们先清空需求表以重新演示
TRUNCATE TABLE requirement CASCADE;

-- 初始需求（在 Backlog 中）
INSERT INTO requirement (title, description, status, priority, type, project_id) VALUES 
('实现用户登录功能', '支持账号密码登录及 JWT 鉴权', 'TODO', 'HIGH', 'FEATURE', 1),
('需求管理列表页', '实现分页展示需求', 'TODO', 'MEDIUM', 'FEATURE', 1),
('项目看板开发', '支持看板视图展示迭代进度', 'TODO', 'HIGH', 'FEATURE', 1),
('修复侧边栏折叠 Bug', '侧边栏收起后宽度没有变化', 'DONE', 'URGENT', 'BUG', 1);
