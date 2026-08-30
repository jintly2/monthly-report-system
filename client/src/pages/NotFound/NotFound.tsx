import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="mt-4 text-lg text-slate-600">页面不存在</p>
      <Link to="/dashboard" className="mt-6 text-blue-600 hover:underline">
        返回首页
      </Link>
    </div>
  );
};

export default NotFound;
