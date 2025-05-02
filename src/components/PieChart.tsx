'use client'; // if using Next 13+ app dir

import { ResponsivePie } from '@nivo/pie';

const data = [
  {
    id: 'React',
    label: 'React',
    value: 35,
    color: '#3D90D7',
  },
  {
    id: 'Next.js',
    label: 'Next.js',
    value: 25,
    color: '#A0C878',
  },
  {
    id: 'Tailwind',
    label: 'Tailwind',
    value: 20,
    color: 'hsl(45, 70%, 50%)',
  },
  {
    id: 'Nivo',
    label: 'Nivo',
    value: 20,
    color: '#BE3D2A',
  },
];

export default function PieChart() {
  return (
  
    <div className="h-80 rounded-2xl shadow p-4 text-white">
    
            <div className="stats stats-vertical shadow">
                <div className="stat">
                <div className="stat-title">Downloads</div>
                <div className="stat-value">31K</div>
                <div className="stat-desc">Jan 1st - Feb 1st</div>
                </div>

                <div className="stat">
                <div className="stat-title">New Users</div>
                <div className="stat-value">4,200</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>

                <div className="stat">
                <div className="stat-title">New Registers</div>
                <div className="stat-value">1,200</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
                </div>
            </div>
      <ResponsivePie
        data={data}
        margin={{ top: 30, right: 30, bottom: 60, left: 30 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ datum: 'data.color' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLabelsSkipAngle={10}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#FFFDF6"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsTextColor="#FFFDF6"
        animate
      />
    </div>
  );
}
