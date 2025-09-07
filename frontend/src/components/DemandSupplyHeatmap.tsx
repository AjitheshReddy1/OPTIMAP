import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface HeatmapData {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

interface DemandSupplyHeatmapProps {
  data: HeatmapData[];
}

const DemandSupplyHeatmap: React.FC<DemandSupplyHeatmapProps> = ({ data }) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">Resource Demand vs Supply Heatmap</CardTitle>
        <p className="text-lg text-gray-600 mt-2">
          Visual representation of resource demand across projects and time periods
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveHeatMap
            data={data}
            margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
            valueFormat=">-.2s"
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -90,
              legend: '',
              legendOffset: 46
            }}
            axisRight={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Demand Level',
              legendPosition: 'middle',
              legendOffset: 70
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Resource Type',
              legendPosition: 'middle',
              legendOffset: -72
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Time Period',
              legendPosition: 'middle',
              legendOffset: 46
            }}
            colors={{
              type: 'diverging',
              scheme: 'red_yellow_green',
              minValue: 0,
              maxValue: 100,
              divergeAt: 0.5
            }}
            emptyColor="#555555"
            enableLabels={true}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1.8]]
            }}
            animate={true}
            motionConfig="wobbly"
            hoverTarget="cell"
            cellHoverOthersOpacity={0.25}
            tooltip={({ cell }) => (
              <div className="bg-white p-3 rounded-lg shadow-lg border">
                <div className="font-medium">{cell.serieId}</div>
                <div className="text-sm text-gray-600">{cell.data.x}</div>
                <div className="text-sm font-medium">
                  Demand: {cell.formattedValue}%
                </div>
              </div>
            )}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8 text-base font-medium">
          <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <div className="w-5 h-5 bg-red-500 rounded"></div>
            <span className="text-red-700">High Demand (80-100%)</span>
          </div>
          <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
            <div className="w-5 h-5 bg-yellow-500 rounded"></div>
            <span className="text-yellow-700">Medium Demand (40-79%)</span>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <div className="w-5 h-5 bg-green-500 rounded"></div>
            <span className="text-green-700">Low Demand (0-39%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandSupplyHeatmap;
