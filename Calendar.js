


const earliestDate = (entries) => {
    return entries.map(moodEntry => moodEntry.date).find(entryDate => Math.min(entryDate));
}

const generateMonthsBetweenDates = (startDate, endDate) => {
    const dates = []
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (currentDate < endDate) {
        dates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return dates;
}


export const getMonthCalendarData = (date, entries) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const today = new Date();

    // Initialize calendar data for the entire month
    const calendarData = {};
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
        const dayOfWeek = dayDate.getDay();
        calendarData[day] = {
            moodEmoji: "No Emoji Data",
            moodValue: "No Mood Value",
            dayOfWeek,
            isAWeekendDay: [0, 6].includes(dayOfWeek),
            isToday: dayDate.toDateString() === today.toDateString(),
            numEntries: 0
        };
    }
    console.log(calendarData);
    // Update calendar date with entries
    entries.forEach((entry) => {
        const entryMonth = entry.date.getMonth();
        const entryYear = entry.date.getFullYear();
        const day = entry.date.getDate();
        
        if (entryMonth === date.getMonth() && entryYear === date.getFullYear()) {
            if (calendarData[day]) {  // Verifying that the day exists in our calendar
                calendarData[day].moodEmoji = entry.emojiMood;  // Changed from moodEmoji to match your class
                calendarData[day].moodValue = entry.moodValue;
                calendarData[day].numEntries += 1;
            }
        }
    });
    return calendarData;
}

export const renderCalendarMonth = (calendarData, date) => {
    // Calculate key calendar values
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Create basic structure
    const calendarHTML = document.createElement('div');
    calendarHTML.className = 'calendar-month';
    
    // 1. Month Header
    const monthHeader = document.createElement('div');
    monthHeader.className = 'calendar-header';
    monthHeader.textContent = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // 2. Weekday Headers
    const weekdayHeader = document.createElement('div');
    weekdayHeader.className = 'calendar-weekdays';
    weekdays.forEach(day => {
        const weekDayHTML = document.createElement('div');
        weekDayHTML.className = 'weekday-header';
        weekDayHTML.textContent = day;
        weekdayHeader.appendChild(weekDayHTML);
    });
    
    // 3. Days Grid
    const daysGrid = document.createElement('div');
    daysGrid.className = 'calendar-days-grid';
    
    // 3a. Add empty cells before the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        daysGrid.appendChild(emptyCell);
    }
    
    // 3b. Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        // Get data for this day
        const dayData = calendarData[day];
        
        // Basic day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        // Apply special classes
        if (dayData.isToday) {
            dayCell.classList.add('today');
        }
        if (dayData.isAWeekendDay) {
            dayCell.classList.add('weekend');
        }
        
        // Add mood data if it exists
        if (dayData.moodEmoji !== "No Emoji Data") {
            const moodContainer = document.createElement('div');
            moodContainer.className = 'mood-container';
            
            // Emoji display
            const emojiDisplay = document.createElement('span');
            emojiDisplay.className = 'mood-emoji';
            emojiDisplay.textContent = dayData.moodEmoji[1]; // Using the emoji part
            
            // Mood value display
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'mood-value';
            valueDisplay.textContent = dayData.moodValue.toFixed(1);
            
            moodContainer.appendChild(emojiDisplay);
            moodContainer.appendChild(valueDisplay);
            
            // Multiple entries indicator
            if (dayData.numEntries > 1) {
                const multipleIndicator = document.createElement('div');
                multipleIndicator.className = 'multiple-entries';
                multipleIndicator.textContent = `+${dayData.numEntries - 1}`;
                moodContainer.appendChild(multipleIndicator);
            }
            
            dayCell.appendChild(moodContainer);
        }
        
        dayCell.appendChild(dayNumber);
        daysGrid.appendChild(dayCell);
    }
    
    // 3c. Calculate and add empty cells to complete the last week
    const totalDays = firstDayOfMonth + daysInMonth;
    const remainingCells = 7 - (totalDays % 7);
    if (remainingCells !== 7) {  // Don't add a row if it divides evenly
        for (let i = 0; i < remainingCells; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            daysGrid.appendChild(emptyCell);
        }
    }
    
    // Combine all elements
    calendarHTML.appendChild(monthHeader);
    calendarHTML.appendChild(weekdayHeader);
    calendarHTML.appendChild(daysGrid);
    
    return calendarHTML;
};