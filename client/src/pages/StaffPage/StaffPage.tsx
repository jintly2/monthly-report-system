import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getStaffList, createStaff, updateStaff, deleteStaff } from '@/api/staff';
import type { Staff, CreateStaffDto } from '@shared/api.interface';

const mockStaff: Staff[] = [
  { id: '1', name: '孙娟', position: '运营总监', team: '运营中心', status: 'active', userId: 'u001', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '2', name: '张三', position: '数据分析师', team: '业绩分析组', status: 'active', userId: 'u002', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '3', name: '李四', position: '数据分析师', team: '业绩分析组', status: 'active', userId: 'u003', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '4', name: '王五', position: '薪酬专员', team: '奖金核算组', status: 'active', userId: 'u004', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '5', name: '赵六', position: '薪酬专员', team: '奖金核算组', status: 'active', userId: 'u005', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '6', name: '钱七', position: '业务分析师', team: '效益评估组', status: 'active', userId: 'u006', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '7', name: '孙八', position: '业务分析师', team: '效益评估组', status: 'active', userId: 'u007', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '8', name: '周九', position: '数据专员', team: '运营中心', status: 'active', userId: 'u008', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '9', name: '吴十', position: '运营专员', team: '运营中心', status: 'active', userId: 'u009', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: '10', name: '郑十一', position: '运营专员', team: '运营中心', status: 'inactive', userId: 'u010', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<CreateStaffDto>({
    name: '',
    position: '',
    team: '',
    status: 'active',
  });
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await getStaffList({ pageSize: 50 });
      setStaffList(data.items.length > 0 ? data.items : mockStaff);
    } catch (error) {
      setStaffList(mockStaff);
    }
  };

  const filteredStaff = staffList.filter(
    (s) =>
      !keyword ||
      s.name.includes(keyword) ||
      s.position.includes(keyword) ||
      s.team.includes(keyword)
  );

  const handleAdd = () => {
    setEditingStaff(null);
    setFormData({ name: '', position: '', team: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      position: staff.position,
      team: staff.team,
      status: staff.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该员工吗？')) return;
    try {
      await deleteStaff(id);
    } catch (error) {
      // 模拟删除
    }
    setStaffList(staffList.filter((s) => s.id !== id));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.position || !formData.team) {
      alert('请填写完整信息');
      return;
    }
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
        setStaffList(staffList.map((s) => (s.id === editingStaff.id ? { ...s, ...formData } : s)));
      } else {
        const newStaff = await createStaff(formData);
        setStaffList([newStaff, ...staffList]);
      }
    } catch (error) {
      // 模拟操作
      if (editingStaff) {
        setStaffList(staffList.map((s) => (s.id === editingStaff.id ? { ...s, ...formData } : s)));
      } else {
        const newStaff: Staff = {
          id: Date.now().toString(),
          ...formData,
          userId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setStaffList([newStaff, ...staffList]);
      }
    }
    setShowModal(false);
  };

  const teams = [...new Set(staffList.map((s) => s.team))];

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">总人数</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{staffList.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">在职人数</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {staffList.filter((s) => s.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">小组数量</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{teams.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 人员列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            部门人员
          </CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="搜索姓名/职位/小组"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-64"
            />
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              添加人员
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">姓名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">职位</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">所属小组</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{staff.name[0]}</span>
                        </div>
                        <span className="font-medium text-slate-800">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{staff.position}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{staff.team}</td>
                    <td className="py-3 px-4">
                      <Badge variant={staff.status === 'active' ? 'success' : 'secondary'}>
                        {staff.status === 'active' ? '在职' : '离职'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(staff)}>
                          <Pencil className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(staff.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStaff.length === 0 && (
              <div className="text-center py-8 text-slate-500">暂无人员数据</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 添加/编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingStaff ? '编辑人员' : '添加人员'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>姓名</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <Label>职位</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="mt-2"
                    placeholder="请输入职位"
                  />
                </div>
                <div>
                  <Label>所属小组</Label>
                  <Input
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="mt-2"
                    placeholder="如：业绩分析组、奖金核算组、效益评估组"
                  />
                </div>
                <div>
                  <Label>状态</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mt-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">在职</option>
                    <option value="inactive">离职</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingStaff ? '保存修改' : '确认添加'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
