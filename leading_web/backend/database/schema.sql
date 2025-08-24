-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id INTEGER UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar_url VARCHAR(500),
    display_name VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    company VARCHAR(255),
    blog VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 反馈类别表
CREATE TABLE IF NOT EXISTS feedback_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#666666', -- 十六进制颜色
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 反馈表
CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    type ENUM('bug', 'feature') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    votes_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES feedback_categories(id)
);

-- 投票表
CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feedback_id INTEGER NOT NULL,
    vote_type ENUM('up', 'down') NOT NULL DEFAULT 'up',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, feedback_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    feedback_id INTEGER NOT NULL,
    parent_id INTEGER,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 软件版本表
CREATE TABLE IF NOT EXISTS software_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version VARCHAR(50) NOT NULL UNIQUE,
    platform ENUM('windows', 'mac', 'linux') NOT NULL,
    architecture ENUM('x64', 'x86', 'arm64') NOT NULL,
    download_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    sha256 VARCHAR(64),
    release_notes TEXT,
    is_stable BOOLEAN DEFAULT true,
    is_latest BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 下载统计表
CREATE TABLE IF NOT EXISTS download_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version_id INTEGER NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    country VARCHAR(2),
    downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (version_id) REFERENCES software_versions(id)
);

-- 索引
CREATE INDEX idx_feedbacks_type ON feedbacks(type);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);
CREATE INDEX idx_feedbacks_votes ON feedbacks(votes_count);
CREATE INDEX idx_feedbacks_created ON feedbacks(created_at);
CREATE INDEX idx_votes_feedback ON votes(feedback_id);
CREATE INDEX idx_comments_feedback ON comments(feedback_id);
CREATE INDEX idx_software_versions_platform ON software_versions(platform);
CREATE INDEX idx_download_stats_version ON download_stats(version_id);

-- 触发器：更新反馈的投票数
CREATE TRIGGER update_feedback_votes_count
    AFTER INSERT ON votes
    FOR EACH ROW
BEGIN
    UPDATE feedbacks SET votes_count = (
        SELECT COUNT(*) FROM votes WHERE feedback_id = NEW.feedback_id AND vote_type = 'up'
    ) - (
        SELECT COUNT(*) FROM votes WHERE feedback_id = NEW.feedback_id AND vote_type = 'down'
    ) WHERE id = NEW.feedback_id;
END;

CREATE TRIGGER update_feedback_votes_count_delete
    AFTER DELETE ON votes
    FOR EACH ROW
BEGIN
    UPDATE feedbacks SET votes_count = (
        SELECT COUNT(*) FROM votes WHERE feedback_id = OLD.feedback_id AND vote_type = 'up'
    ) - (
        SELECT COUNT(*) FROM votes WHERE feedback_id = OLD.feedback_id AND vote_type = 'down'
    ) WHERE id = OLD.feedback_id;
END;
