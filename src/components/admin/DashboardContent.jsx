import React from 'react';
import { Users, HelpCircle, XCircle, CheckCircle } from 'lucide-react';
import DashboardCard from '../common/DashboardCard';

const DashboardContent = ({ stats }) => (
  <div className="p-4 sm:p-0">
    <h2 className="text-3xl font-bold text-white mb-6 md:mb-8">Dashboard Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="text-blue-400" />
      <DashboardCard title="Passed Students" value={stats.passedStudents} icon={<CheckCircle />} color="text-green-400" />
      <DashboardCard title="Failed Students" value={stats.failedStudents} icon={<XCircle />} color="text-red-400" />
      <DashboardCard title="Total Questions" value={stats.totalQuestions} icon={<HelpCircle />} color="text-yellow-400" />
    </div>
  </div>
);

export default DashboardContent;
