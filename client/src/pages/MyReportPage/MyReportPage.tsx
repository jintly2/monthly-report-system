import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import type {
  PerformanceItem,
  BonusItem,
  EfficiencyItem,
} from '@shared/api.interface';

const MyReportPage: React.FC = () => {
  const [reportMonth, setReportMonth] = useState('2025-08');
  const [reporterName, setReporterName] = useState('');
  const [status, setStatus] = useState<'draft' | 'submitted'>('draft');

  // 业绩盘点
  const [performanceItems, setPerformanceItems] = useState<PerformanceItem[]>([
    { reportName: '', dataVolume: '', coverage: '', keyFindings: '' },
  ]);

  // 奖金核算
  const [bonusItems, setBonusItems] = useState<BonusItem[]>([
    { batchName: '', headcount: 0, amount: '', exceptionHandling: '', timeliness: '' },
  ]);

  // 效益评估
  const [efficiencyItems, setEfficiencyItems] = useState<EfficiencyItem[]>([
    { modelName: '', policyComparison: '', recommendations: '', adoptionStatus: '' },
  ]);

  // 通用信息
  const [crossDeptCollab, setCrossDeptCollab] = useState('');
  const [highlights, setHighlights] = useState('');
  const [nextMonthPlan, setNextMonthPlan] = useState('');
  const [resourcesNeeded, setResourcesNeeded] = useState('');

  const addPerformanceItem = () => {
    setPerformanceItems([...performanceItems, { reportName: '', dataVolume: '', coverage: '', keyFindings: '' }]);
  };

  const removePerformanceItem = (index: number) => {
    setPerformanceItems(performanceItems.filter((_, i) => i !== index));
  };

  const updatePerformanceItem = (index: number, field: keyof PerformanceItem, value: string) => {
    const updated = [...performanceItems];
    updated[index] = { ...updated[index], [field]: value };
    setPerformanceItems(updated);
  };

  const addBonusItem = () => {
    setBonusItems([...bonusItems, { batchName: '', headcount: 0, amount: '', exceptionHandling: '', timeliness: '' }]);
  };

  const removeBonusItem = (index: number) => {
    setBonusItems(bonusItems.filter((_, i) => i !== index));
  };

  const updateBonusItem = (index: number, field: keyof BonusItem, value: string | number) => {
    const updated = [...bonusItems];
    updated[index] = { ...updated[index], [field]: value };
    setBonusItems(updated);
  };

  const addEfficiencyItem = () => {
    setEfficiencyItems([...efficiencyItems, { modelName: '', policyComparison: '', recommendations: '', adoptionStatus: '' }]);
  };

  const removeEfficiencyItem = (index: number) => {
    setEfficiencyItems(efficiencyItems.filter((_, i) => i !== index));
  };

  const updateEfficiencyItem = (index: number, field: keyof EfficiencyItem, value: string) => {
    const updated = [...efficiencyItems];
    updated[index] = { ...updated[index], [field]: value };
    setEfficiencyItems(updated);
  };

  const handleSave = (submitType: 'draft' | 'submit') => {
    setStatus(submitType);
    alert(submitType === 'draft' ? '草稿已保存' : '月报已提交');
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>报告月份</Label>
              <Input
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>填报人</Label>
              <Input
                placeholder="请输入姓名"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>当前状态</Label>
              <div className="mt-2">
                <Badge variant={status === 'draft' ? 'warning' : 'success'}>
                  {status === 'draft' ? '草稿' : '已提交'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分类填报 */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">业绩盘点</TabsTrigger>
          <TabsTrigger value="bonus">奖金核算</TabsTrigger>
          <TabsTrigger value="efficiency">效益评估</TabsTrigger>
          <TabsTrigger value="general">通用信息</TabsTrigger>
        </TabsList>

        {/* 业绩盘点 */}
        <TabsContent value="performance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>业绩盘点工作</CardTitle>
              <Button variant="outline" size="sm" onClick={addPerformanceItem}>
                <Plus className="w-4 h-4 mr-1" /> 添加一项
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {performanceItems.map((item, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removePerformanceItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>报告/分析名称</Label>
                      <Input
                        placeholder="如：7月华东区业绩分析报告"
                        value={item.reportName}
                        onChange={(e) => updatePerformanceItem(index, 'reportName', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>数据处理量</Label>
                      <Input
                        placeholder="如：处理数据5000条"
                        value={item.dataVolume}
                        onChange={(e) => updatePerformanceItem(index, 'dataVolume', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>覆盖范围</Label>
                      <Input
                        placeholder="如：华东区、3条产品线"
                        value={item.coverage}
                        onChange={(e) => updatePerformanceItem(index, 'coverage', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>关键发现/问题</Label>
                      <Input
                        placeholder="如：发现XX区域增长率异常"
                        value={item.keyFindings}
                        onChange={(e) => updatePerformanceItem(index, 'keyFindings', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 奖金核算 */}
        <TabsContent value="bonus">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>奖金核算工作</CardTitle>
              <Button variant="outline" size="sm" onClick={addBonusItem}>
                <Plus className="w-4 h-4 mr-1" /> 添加一项
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {bonusItems.map((item, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removeBonusItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>核算批次</Label>
                      <Input
                        placeholder="如：7月销售奖金核算"
                        value={item.batchName}
                        onChange={(e) => updateBonusItem(index, 'batchName', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>涉及人数</Label>
                      <Input
                        type="number"
                        placeholder="如：150"
                        value={item.headcount || ''}
                        onChange={(e) => updateBonusItem(index, 'headcount', parseInt(e.target.value) || 0)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>核算金额</Label>
                      <Input
                        placeholder="如：120万元"
                        value={item.amount}
                        onChange={(e) => updateBonusItem(index, 'amount', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>发放及时性</Label>
                      <Input
                        placeholder="如：按时发放，无延迟"
                        value={item.timeliness}
                        onChange={(e) => updateBonusItem(index, 'timeliness', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>异常处理情况</Label>
                      <Textarea
                        placeholder="描述本月遇到的异常情况及处理方式"
                        value={item.exceptionHandling}
                        onChange={(e) => updateBonusItem(index, 'exceptionHandling', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 效益评估 */}
        <TabsContent value="efficiency">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>效益评估工作</CardTitle>
              <Button variant="outline" size="sm" onClick={addEfficiencyItem}>
                <Plus className="w-4 h-4 mr-1" /> 添加一项
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {efficiencyItems.map((item, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removeEfficiencyItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>模型/项目名称</Label>
                      <Input
                        placeholder="如：新销售政策测算模型"
                        value={item.modelName}
                        onChange={(e) => updateEfficiencyItem(index, 'modelName', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>采纳情况</Label>
                      <Input
                        placeholder="如：已采纳，正在实施"
                        value={item.adoptionStatus}
                        onChange={(e) => updateEfficiencyItem(index, 'adoptionStatus', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>政策方案对比</Label>
                      <Textarea
                        placeholder="描述对比了哪些方案，各自的优劣"
                        value={item.policyComparison}
                        onChange={(e) => updateEfficiencyItem(index, 'policyComparison', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>决策建议</Label>
                      <Textarea
                        placeholder="给出的具体建议和预期效果"
                        value={item.recommendations}
                        onChange={(e) => updateEfficiencyItem(index, 'recommendations', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通用信息 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>通用信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>跨部门协作事项</Label>
                <Textarea
                  placeholder="本月与销售部、财务部等其他部门的协作内容"
                  value={crossDeptCollab}
                  onChange={(e) => setCrossDeptCollab(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label>本月亮点</Label>
                <Textarea
                  placeholder="本月工作中最有价值的成果或突破"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label>下月计划</Label>
                <Textarea
                  placeholder="下月的重点工作安排"
                  value={nextMonthPlan}
                  onChange={(e) => setNextMonthPlan(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label>需要的资源支持</Label>
                <Textarea
                  placeholder="完成工作需要哪些资源或支持"
                  value={resourcesNeeded}
                  onChange={(e) => setResourcesNeeded(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => handleSave('draft')}>
          <Save className="w-4 h-4 mr-2" />
          保存草稿
        </Button>
        <Button onClick={() => handleSave('submit')}>
          <Send className="w-4 h-4 mr-2" />
          提交月报
        </Button>
      </div>
    </div>
  );
};

export default MyReportPage;
