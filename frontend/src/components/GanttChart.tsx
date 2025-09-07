import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: 'project' | 'milestone' | 'allocation';
  color: string;
  dependencies?: string[];
}

interface GanttChartProps {
  tasks: GanttTask[];
  startDate: Date;
  endDate: Date;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, startDate, endDate }) => {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const days = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTaskPosition = (task: GanttTask) => {
    const startOffset = Math.ceil((task.start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24));
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const getProgressWidth = (task: GanttTask) => {
    return `${task.progress}%`;
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">Project Timeline & Allocations</CardTitle>
        <p className="text-lg text-gray-600 mt-2">
          Visual timeline showing project schedules, milestones, and resource allocations
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="flex border-b border-gray-200">
              <div className="w-48 p-3 font-medium text-sm bg-gray-50 border-r">
                Project/Resource
              </div>
              <div className="flex-1 relative">
                <div className="flex">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className="flex-1 p-2 text-xs text-center border-r border-gray-200 bg-gray-50"
                      style={{ minWidth: '40px' }}
                    >
                      {day.getDate()}
                      <br />
                      {day.toLocaleDateString('en', { month: 'short' })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-1">
              {tasks.map((task) => {
                const position = getTaskPosition(task);
                const progressWidth = getProgressWidth(task);
                
                return (
                  <div key={task.id} className="flex border-b border-gray-100">
                    <div className="w-48 p-3 text-sm border-r bg-white">
                      <div className="font-medium">{task.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{task.type}</div>
                    </div>
                    <div className="flex-1 relative h-12 bg-gray-50">
                      <div
                        className="absolute top-1 h-10 rounded-md border-2 flex items-center px-2 text-xs font-medium text-white shadow-sm"
                        style={{
                          left: position.left,
                          width: position.width,
                          backgroundColor: task.color,
                          borderColor: task.color,
                        }}
                      >
                        <div className="flex-1 truncate">{task.name}</div>
                        <div className="ml-2 text-xs opacity-75">
                          {task.progress}%
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div
                        className="absolute top-1 h-10 rounded-l-md bg-white bg-opacity-30"
                        style={{
                          left: position.left,
                          width: progressWidth,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8 text-base font-medium">
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <div className="w-5 h-5 bg-blue-500 rounded"></div>
            <span className="text-blue-700">Projects</span>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <div className="w-5 h-5 bg-green-500 rounded"></div>
            <span className="text-green-700">Milestones</span>
          </div>
          <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
            <div className="w-5 h-5 bg-purple-500 rounded"></div>
            <span className="text-purple-700">Resource Allocations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
