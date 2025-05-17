'use client'
import { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { Calendar } from "lucide-react";
import { format, isValid, parse, isWithinInterval, startOfYear, endOfYear } from "date-fns";

const DateSelector = ({ control, name, label, watch, required = true }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  
  // Watch for accounting period changes to validate date
  const accountingPeriod = watch("accountingPeriod");
  const watchedDate = watch(name);

  // Extract start and end years from accounting period (format: "2023-2024")
  const getAccountingYearRange = (period) => {
    if (!period) return { startYear: new Date().getFullYear(), endYear: new Date().getFullYear() + 1 };
    
    const [startYear, endYear] = period.split("-").map(year => parseInt(year));
    return { startYear, endYear };
  };

  // Check if date is within accounting period
  const isDateWithinAccountingPeriod = (date) => {
    if (!isValid(date) || !accountingPeriod) return false;
    
    const { startYear, endYear } = getAccountingYearRange(accountingPeriod);
    const startDate = startOfYear(new Date(startYear, 0, 1));
    const endDate = endOfYear(new Date(endYear, 0, 1));
    
    return isWithinInterval(date, { start: startDate, end: endDate });
  };

  // Update input value when form value changes
  useEffect(() => {
    if (watchedDate && isValid(new Date(watchedDate))) {
      setInputValue(format(new Date(watchedDate), "dd/MM/yyyy"));
    }
  }, [watchedDate]);

  // Handle outside click to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendar && 
        calendarRef.current && 
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Set cursor position after auto-formatting
  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [inputValue, cursorPosition]);

  // Generate days for the calendar
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        disabled: !isDateWithinAccountingPeriod(currentDate)
      });
    }
    
    return days;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ 
        required: required ? "Date is required" : false,
        validate: value => {
          if (required && !value) return "Date is required";
          
          if (value) {
            const date = new Date(value);
            if (!isValid(date)) return "Invalid date format";
            if (!isDateWithinAccountingPeriod(date)) return "Date must be within accounting period";
          }
          return true;
        }
      }}
      render={({ field, fieldState: { error: fieldError } }) => {
        const [calendarDate, setCalendarDate] = useState(() => (field.value ? new Date(field.value) : new Date()));
        const daysInCalendar = generateCalendarDays(calendarDate);
        
        const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        // Format and validate input as user types
        const handleInputChange = (e) => {
          let value = e.target.value;
          const prevValue = inputValue;
          const selectionStart = e.target.selectionStart;
          
          // Only allow numbers and slashes
          value = value.replace(/[^\d/]/g, '');
          
          // Auto-format as DD/MM/YYYY
          if (value.length > 0) {
            // Handle deleting a slash
            if (value.length < prevValue.length && 
                (prevValue[selectionStart] === '/' || prevValue[selectionStart-1] === '/')) {
              // Just remove the character and don't try to format
              setInputValue(value);
              setCursorPosition(selectionStart);
              return;
            }
            
            // Format day (first 2 digits)
            if (value.length <= 2) {
              // No formatting yet
            } 
            // Add first slash after day
            else if (value.length > 2) {
              if (value.charAt(2) !== '/') {
                value = value.slice(0, 2) + '/' + value.slice(2);
              }
              
              // Format month (next 2 digits)
              if (value.length > 5) {
                if (value.charAt(5) !== '/') {
                  value = value.slice(0, 5) + '/' + value.slice(5);
                }
                
                // Limit year to 4 digits
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }
              }
            }
          }
          
          setInputValue(value);
          
          // Calculate new cursor position after formatting
          let newPosition = selectionStart;
          if (value.length > prevValue.length) {
            // If we added a slash automatically, move cursor position forward
            if ((selectionStart === 2 && value.charAt(2) === '/') || 
                (selectionStart === 5 && value.charAt(5) === '/')) {
              newPosition++;
            }
          }
          setCursorPosition(newPosition);
          
          // Auto-advance cursor for day/month completion
          if (value.length === 2 && prevValue.length === 1) {
            // Day completed, move to month
            setCursorPosition(3);
          } else if (value.length === 5 && prevValue.length === 4) {
            // Month completed, move to year
            setCursorPosition(6);
          }
          
          // Try to parse the date
          if (value.length >= 8) {
            try {
              // Parse date in DD/MM/YYYY format
              const parsedDate = parse(value, "dd/MM/yyyy", new Date());
              
              if (isValid(parsedDate)) {
                if (isDateWithinAccountingPeriod(parsedDate)) {
                  field.onChange(format(parsedDate, "yyyy-MM-dd"));
                  setCalendarDate(parsedDate);
                  setError("");
                } else {
                  setError("Date must be within accounting period");
                }
              } else {
                setError("Invalid date");
              }
            } catch {
              setError("Invalid date format");
            }
          } else if (value.length > 0) {
            setError(""); // Clear error while typing
          }
        };
        
        // Handle keyboard navigation
        const handleKeyDown = (e) => {
          // Enter key: validate and close calendar if open
          if (e.key === 'Enter') {
            if (showCalendar) {
              setShowCalendar(false);
            }
            
            // Try to validate and parse the date
            if (inputValue.length >= 8) {
              try {
                const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
                if (isValid(parsedDate)) {
                  field.onChange(format(parsedDate, "yyyy-MM-dd"));
                }
              } catch {
                // Invalid date, ignore
              }
            }
          }
          
          // Escape key: close calendar
          else if (e.key === 'Escape') {
            setShowCalendar(false);
          }
          
          // Tab key: format date if valid
          else if (e.key === 'Tab' && !e.shiftKey) {
            if (inputValue.length >= 8) {
              try {
                const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
                if (isValid(parsedDate)) {
                  field.onChange(format(parsedDate, "yyyy-MM-dd"));
                }
              } catch {
                // Invalid date, ignore
              }
            }
          }
        };
        
        const handleDateSelect = (day) => {
          if (day && !day.disabled) {
            field.onChange(format(day.date, "yyyy-MM-dd"));
            setInputValue(format(day.date, "dd/MM/yyyy"));
            setShowCalendar(false);
            setError("");
          }
        };
        
        const handlePrevMonth = () => {
          setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
        };
        
        const handleNextMonth = () => {
          setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
        };
        
        const today = new Date();
        const { startYear, endYear } = getAccountingYearRange(accountingPeriod);
        
        return (
          <div className="w-full space-y-1 relative">
            <label className="block text-sm">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="DD/MM/YYYY"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowCalendar(true)}
                className={`w-full p-2 border rounded-md pr-10 ${
                  error || fieldError ? 'border-red-300' : 'border-green-300'
                } focus:outline-none focus:ring-1 focus:ring-green-500`}
                maxLength={10}
              />
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>
            
            {(error || fieldError) && (
              <p className="mt-1 text-sm text-red-600">{error || fieldError.message}</p>
            )}
            
            {accountingPeriod && (
              <p className="mt-1 text-xs text-gray-500">
                Valid range: 01/01/{startYear} - 31/12/{endYear}
              </p>
            )}
            
            {showCalendar && (
              <div 
                ref={calendarRef}
                className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-64 p-2"
              >
                <div className="flex justify-between items-center mb-2">
                  <button 
                    type="button" 
                    onClick={handlePrevMonth}
                    className="text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &lt;
                  </button>
                  <div className="font-medium">
                    {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                  </div>
                  <button 
                    type="button" 
                    onClick={handleNextMonth}
                    className="text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &gt;
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {weekdays.map(day => (
                    <div key={day} className="font-semibold text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {daysInCalendar.map((day, index) => (
                    <div key={index} className="py-1">
                      {day && (
                        <button
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          disabled={day.disabled}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                            day.disabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : field.value && format(new Date(field.value), "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd")
                              ? 'bg-green-500 text-white font-semibold'
                              : format(day.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
                              ? 'border border-green-400 font-medium hover:bg-green-100'
                              : 'hover:bg-green-100'
                          }`}
                        >
                          {day.date.getDate()}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 flex justify-between items-center border-t pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      if (isDateWithinAccountingPeriod(now)) {
                        field.onChange(format(now, "yyyy-MM-dd"));
                        setInputValue(format(now, "dd/MM/yyyy"));
                        setCalendarDate(now);
                        setShowCalendar(false);
                      }
                    }}
                    className="text-xs text-green-600 hover:text-green-800 px-2 py-1 hover:bg-green-50 rounded"
                    disabled={!isDateWithinAccountingPeriod(today)}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default DateSelector;