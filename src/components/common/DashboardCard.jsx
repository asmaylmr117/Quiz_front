import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-lg flex-grow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-200 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`h-12 w-12 flex items-center justify-center rounded-full bg-white bg-opacity-5 ${color}`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
    </div>
  </div>
);

export default DashboardCard;
