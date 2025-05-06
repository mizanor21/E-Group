
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Calendar, ChevronDown } from 'lucide-react';

const DateSelector = ({ control, name = "date", label = "Date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate years (current year and 50 years into future)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear + i);
  
  // Months array
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
  
  // Function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Generate days based on selected month and year
  const [days, setDays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
  
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    setDays(daysArray);
    
    // Adjust day if current selection exceeds days in new month
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
    
    // Update the full date
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    setSelectedDate(newDate);
  }, [selectedMonth, selectedYear, selectedDay]);
  
  // Format the date for display
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <div className="space-y-1 relative">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      
      <Controller
        name={name}
        control={control}
        defaultValue={formatDate(selectedDate)}
        render={({ field }) => (
          <>
            <div 
              className="w-full p-2 border rounded-md flex items-center justify-between cursor-pointer bg-white border-gray-300 hover:border-green-400 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span>{formatDate(selectedDate)}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              <input type="hidden" {...field} value={formatDate(selectedDate)} />
            </div>
            
            {isOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-2 px-1">
                <div className="grid grid-cols-3 gap-2">
                  {/* Year selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 px-2">Year</label>
                    <div className="max-h-48 overflow-y-auto px-1">
                      {years.map(year => (
                        <div 
                          key={year}
                          className={`px-2 py-1 rounded cursor-pointer text-sm ${selectedYear === year ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
                          onClick={() => setSelectedYear(year)}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Month selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 px-2">Month</label>
                    <div className="max-h-48 overflow-y-auto px-1">
                      {months.map(month => (
                        <div 
                          key={month.value}
                          className={`px-2 py-1 rounded cursor-pointer text-sm ${selectedMonth === month.value ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
                          onClick={() => setSelectedMonth(month.value)}
                        >
                          {month.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Day selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 px-2">Day</label>
                    <div className="max-h-48 overflow-y-auto px-1">
                      {days.map(day => (
                        <div 
                          key={day}
                          className={`px-2 py-1 rounded cursor-pointer text-sm ${selectedDay === day ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
                          onClick={() => setSelectedDay(day)}
                        >
                          {day.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2 px-2 border-t pt-2">
                  <button 
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-3 py-1 text-sm rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors"
                    onClick={() => {
                      field.onChange(formatDate(selectedDate));
                      setIsOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default DateSelector;