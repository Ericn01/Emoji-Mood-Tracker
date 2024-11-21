export class MoodCalendarData{
    constructor(entries, endDate){
        this.entries = entries;
        this.startDate = this.findEarliestDate(); 
        this.endDate = endDate;
        this.calendarData = this.setupCalendarData();
    }

    // Sets up the calendar data structure for each day between the start date and end date
    setupCalendarData(){
        const today = new Date();
        const calendarData = {};
         // Loop through each day in the range
        for (let date = new Date(this.startDate); date <= this.endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay();
            const dayKey = date.toISOString().split('T')[0]; // Use ISO date as the key for uniqueness

            calendarData[dayKey] = {
                moodEmoji: "No Emoji Data",
                moodValue: "No Mood Value",
                dayOfWeek,
                isAWeekendDay: [0, 6].includes(dayOfWeek),
                isToday: date.toDateString() === today.toDateString(),
                numEntries: 0
            };
        }

    // Update calendar data with entries
        this.entries.forEach((entry) => {
            const entryDateKey = entry.date.toISOString().split('T')[0];
            if (calendarData[entryDateKey]) { // Check if the date exists in the calendar
                calendarData[entryDateKey].moodEmoji = entry.emojiMood;
                calendarData[entryDateKey].moodValue = entry.moodValue;
                calendarData[entryDateKey].numEntries += 1;
            }
        });
        return calendarData;
    }
    // returns a subset (month) of the calendarData
    getMonthCalendarData (date) {
        let monthCalendarEntries = [];
        const calendarEntries = Object.entries(this.calendarData);
        if (calendarEntries){
            monthCalendarEntries = calendarEntries.filter ( ([dayKey, entryData]) => {
                const dayKeyDate = new Date(dayKey);
                return (
                    dayKeyDate.getFullYear() === date.getFullYear() &&
                    dayKeyDate.getMonth() === date.getMonth()
                );
            });
        }
        
        const dayKeyEntries = monthCalendarEntries.map ( (entry) => {return new Date(entry[0]).getDate();});
        monthCalendarEntries.forEach( (elem, index) => elem[0] = dayKeyEntries[index]);
        return Object.fromEntries(monthCalendarEntries);
    }

    /**
    * Given two date values, we return all the dates between them at 1 month intervals
    * @param {*} startDate 
    * @param {*} endDate  
    * @returns 
    */
    generateMonthsBetweenDates = (startDate, endDate) => {
        const dates = []
        let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        while (currentDate < endDate) {
            dates.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return dates;
    }

    // Helper method to locate the earliest entry date.
    findEarliestDate () {
        return new Date(Math.min(...this.entries.map(moodEntry => moodEntry.date))).toISOString().split('T')[0];
    }
}

export class MoodCalendar {
    // Given a start date and an end date, we 
    constructor(calendarData, calendarContainer, date) {
        this.calendarContainer = calendarContainer; // HTML calendar container
         // Sets up the basic calendar data structure
        this.calendarMonthData = calendarData;

        this.initializeHTMLElements();
        this.renderCalendarMonth(date);
    }

    initializeHTMLElements(){
        this.calendarHTML = document.createElement('div');
        this.calendarHTML.className = 'calendar-month';

        this.monthHeader = document.createElement('div');
        this.monthHeader.className = 'calendar-header';

        this.weekdayHeader = document.createElement('div');
        this.weekdayHeader.className = 'calendar-weekdays';

        this.daysGrid = document.createElement('div');
        this.className = 'calendar-days-grid';
    }

    renderCalendarMonth(date){
        // Renders the calendar data --> will be broken down into several smaller methods
        const {firstDayOfMonth, daysInMonth} = this.getKeyCalendarValues(date)
        // Create the HTML for the calendar date header and the weekday headers
        this.setupCalendarHeaders(date);
        // Fill empty cells
        this.fillEmptyCells(firstDayOfMonth);
        // Fill non empty cells with content
        this.fillDaysOfTheMonth(daysInMonth);
        // Renders the empty cells to complete the last week
        this.renderRemainingCells(firstDayOfMonth, daysInMonth);

        this.calendarHTML.appendChild(this.daysGrid);
        this.calendarContainer.appendChild(this.calendarHTML);
    }

    setupCalendarHeaders(date){
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.monthHeader.textContent = date.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
        weekdays.forEach(day => {
            const weekDayHTML = document.createElement('div');
            weekDayHTML.className = 'weekday-header';
            weekDayHTML.textContent = day;
            this.weekdayHeader.appendChild(weekDayHTML);
        });
        // Appending the elements to the calendar
        this.calendarHTML.appendChild(this.monthHeader);
        this.calendarHTML.appendChild(this.weekdayHeader);
    }

    fillEmptyCells(firstDayOfMonth){
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            this.daysGrid.appendChild(emptyCell);
        }
    }

    getKeyCalendarValues(date){
        // Given a date, we provide the corresponding data
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        return {
            firstDayOfMonth: firstDayOfMonth,
            daysInMonth: daysInMonth
        }
    }

    fillDaysOfTheMonth(daysInMonth){
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Get data for this day
            const dayData = this.calendarMonthData[day];
            console.log(dayData);
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
            this.daysGrid.appendChild(dayCell);
        }
    }
    // Calculate and add empty cells to complete the last week
    renderRemainingCells(firstDayOfMonth, daysInMonth){
        const totalDays = firstDayOfMonth + daysInMonth;
        const remainingCells = 7 - (totalDays % 7);
        if (remainingCells !== 7) {  // Don't add a row if it divides evenly
            for (let i = 0; i < remainingCells; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                this.daysGrid.appendChild(emptyCell);
            }
        }
    }
}