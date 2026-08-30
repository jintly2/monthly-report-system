import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import MyReportPage from './pages/MyReportPage/MyReportPage';
import ReportQueryPage from './pages/ReportQueryPage/ReportQueryPage';
import ReviewPage from './pages/ReviewPage/ReviewPage';
import StaffPage from './pages/StaffPage/StaffPage';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="my-report" element={<MyReportPage />} />
        <Route path="report-query" element={<ReportQueryPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
