-- 运营中心工作月报系统 - 数据库初始化脚本
-- PostgreSQL 14+

-- ============================================
-- 员工表
-- ============================================

CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    team VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    user_id VARCHAR(100),
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- ============================================
-- 月报表
-- ============================================

CREATE TABLE IF NOT EXISTS monthly_report (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id VARCHAR(100) NOT NULL,
    reporter_name VARCHAR(50) NOT NULL,
    report_month VARCHAR(7) NOT NULL,
    performance_items JSONB NOT NULL DEFAULT '[]',
    bonus_items JSONB NOT NULL DEFAULT '[]',
    efficiency_items JSONB NOT NULL DEFAULT '[]',
    cross_dept_collab TEXT NOT NULL DEFAULT '',
    highlights TEXT NOT NULL DEFAULT '',
    next_month_plan TEXT NOT NULL DEFAULT '',
    resources_needed TEXT NOT NULL DEFAULT '',
    review_comments JSONB NOT NULL DEFAULT '[]',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_report_reporter_month ON monthly_report(reporter_id, report_month);
CREATE INDEX IF NOT EXISTS idx_monthly_report_month ON monthly_report(report_month);
CREATE INDEX IF NOT EXISTS idx_monthly_report_status ON monthly_report(status);

-- ============================================
-- 自动更新时间触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_monthly_report_updated_at ON monthly_report;
CREATE TRIGGER update_monthly_report_updated_at
    BEFORE UPDATE ON monthly_report
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 示例数据
-- ============================================

-- 示例员工
INSERT INTO staff (name, position, team) VALUES
('孙娟', '运营总监', '运营中心'),
('张三', '数据分析师', '业绩分析组'),
('李四', '数据分析师', '业绩分析组'),
('王五', '薪酬专员', '奖金核算组'),
('赵六', '薪酬专员', '奖金核算组'),
('钱七', '业务分析师', '效益评估组'),
('孙八', '业务分析师', '效益评估组'),
('周九', '数据专员', '运营中心'),
('吴十', '运营专员', '运营中心'),
('郑十一', '运营专员', '运营中心')
ON CONFLICT DO NOTHING;
