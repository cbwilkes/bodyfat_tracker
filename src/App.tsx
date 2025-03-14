import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';

const weightStep = 0.5;

interface WeekData {
  date: string;
  week: number;
  leanMass: number;
  newWeight: number;
  bodyFat: number;
  lbsTotal: number;
  maxLossPerWeek: number;
  lbsToGoal: number;
  weightChange: number;
}

function App() {
  const [formValues, setFormValues] = useState({
    startDate: new Date().toISOString().split('T')[0],
    currentWeight: 227.0,
    goalWeight: 195.0,
    leanMass: 170.5,
    weeklyLossPercent: 1.0,
    numberOfWeeks: 20,
  });

  const [tableData, setTableData] = useState<WeekData[]>([]);
  const [goalReachedDate, setGoalReachedDate] = useState<WeekData | undefined>(
    undefined
  );

  const calculateTableData = () => {
    const data: WeekData[] = [];
    let currentWeight = formValues.currentWeight;
    let startingWeight = formValues.currentWeight;
    let currentDate = new Date(formValues.startDate);

    for (let week = 1; week <= formValues.numberOfWeeks; week++) {
      const weeklyLoss = currentWeight * (formValues.weeklyLossPercent / 100);
      const newWeight = currentWeight - weeklyLoss;
      const bodyFat =
        ((currentWeight - formValues.leanMass) / currentWeight) * 100;
      const maxLossPerWeek = currentWeight * 0.0175; // 1.75% max recommended weekly loss

      const weightLossDiff = startingWeight - newWeight;
      const weeklyChange = currentWeight - newWeight;
      const lbsToGoal = newWeight - formValues.goalWeight;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        week,
        leanMass: Number(formValues.leanMass.toFixed(1)),
        lbsToGoal: Number(lbsToGoal.toFixed(1)),
        bodyFat: Number(bodyFat.toFixed(1)),
        lbsTotal: Number(weightLossDiff.toFixed(1)),
        newWeight: Number(newWeight.toFixed(1)),
        maxLossPerWeek: Number(maxLossPerWeek.toFixed(1)),
        weightChange: Number(weeklyChange.toFixed(1)),
      });

      currentWeight = newWeight;
      currentDate.setDate(currentDate.getDate() + 7);
    }

    setTableData(data);

    const goalDate = data.find(
      (weightStep) => weightStep.newWeight <= formValues.goalWeight
    );

    setGoalReachedDate(goalDate);
  };

  useEffect(() => {
    calculateTableData();
  }, [formValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'startDate' ? value : Number(value),
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-8">Tracker</h1>
          <nav>
            <button className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5" />
              <span>Body Fat Percentage Tracker</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Top Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Progress Overview
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Current Weight</p>
              <p className="text-2xl font-bold text-blue-700">
                {formValues.currentWeight} lbs
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Goal Weight Loss</p>
              <p className="text-2xl font-bold text-green-700">
                {tableData.length > 0
                  ? (formValues.currentWeight - formValues.goalWeight).toFixed(
                      1
                    )
                  : '0.0'}{' '}
                lbs
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600 mb-1">Target Date</p>
              <p className="text-2xl font-bold text-orange-700">
                {goalReachedDate ? goalReachedDate.date : '--'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Current Body Fat</p>
              <p className="text-2xl font-bold text-purple-700">
                {tableData.length > 0 ? tableData[0].bodyFat : '0.0'}%
              </p>
            </div>
          </div>
        </div>

        {/* Loss Calculation Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Loss Calculations
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Starting Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formValues.startDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="currentWeight"
                className="block text-sm font-medium text-gray-700"
              >
                Current Weight
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="currentWeight"
                  id="currentWeight"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                  step={weightStep}
                  value={formValues.currentWeight}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">lbs</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="goalWeight"
                className="block text-sm font-medium text-gray-700"
              >
                Goal Weight
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="goalWeight"
                  id="goalWeight"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                  step={weightStep}
                  value={formValues.goalWeight}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">lbs</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="leanMass"
                className="block text-sm font-medium text-gray-700"
              >
                Lean Mass
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="leanMass"
                  id="leanMass"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.0"
                  step={weightStep}
                  value={formValues.leanMass}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">lbs</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="weeklyLossPercent"
                className="block text-sm font-medium text-gray-700"
              >
                Weekly % Loss
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="weeklyLossPercent"
                  id="weeklyLossPercent"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  value={formValues.weeklyLossPercent}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="numberOfWeeks"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Weeks
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="numberOfWeeks"
                  id="numberOfWeeks"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="20"
                  min="1"
                  max="52"
                  value={formValues.numberOfWeeks}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Week #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Body Fat %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total lbs Loss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lbs Until Goal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Loss/wk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lean Mass
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.week}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.newWeight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.bodyFat}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.weightChange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.lbsTotal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.lbsToGoal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.maxLossPerWeek}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.leanMass}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
