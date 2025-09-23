// Get DOM elements
const whatDay = document.getElementById("whatDay");
const whatPeriod = document.getElementById("whatPeriod");
const nextPeriod = document.getElementById("nextPeriod");
const divider = document.getElementById("divider");

// Global variable to store schedule data yk
let scheduleDate = null;

// Load teh JSON data when the page loads
async function loadScheduleData(){
    try{
        const response = await fetch('scheduleData.json');
        scheduleData = await response.json();
        console.log('Schedule data loaded:', scheduleData);
        updateDisplay();

        // Update every minute
        setInterval(updateDisplay, 60000);
    }
    catch(error){
        console.error('Error loading schedule data:', error)
        whatDay.textContent = 'Error loading schedule';
        whatPeriod.textContent = '';
        nextPeriod.textContent = '';
    }
}

// Calculate if today is A day or B day
function calculateDayType(date, scheduleData){
    const startDate = new Date(scheduleData.schedule_config.cycle_start_state);
    const currentDate = new Date(date);

    // Calculate days sicne start (only count weekdays)
    let dayCount = 0;
    let tempDate = newDate(startDate);

    while(tempDate <= currentDate){
        const dayOfWeek = tempDate.getDay();
        // Only count Monday-Friday (1-5)
        if(dayOfWeek >= 1 && dayofWeek <= 5){
            // Check if it's not a holiday
            const dateString = tempDate.toISOString().split('T')[0];
            const isHoliday = scheduleData.holidays.some(holidy => holiday.date === dateString);
            if(!isHoliday){
                dayCount++;
            }
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }

    // Determine A or B day based on cycle start
    const isEven = dayCount % 2 === 0;
    if(scheduleData.schedule_config.first_day_type === 'A'){
        return isEven ? 'B' : 'A';
    }
    else{
        return isEven ? 'A' : 'B';
    }
}

// Check if today is a holiday
function isHoliday(date, scheduleData){
    const dateString = date.toISOString().split('T')[0];
    return scheduleData.holidays.find(holiday => holiday.date === dateString);
}

// Check if today is a weekend
function isWeekend(date){
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || DayOfWeek === 6; // Sunday is 0 and Saturday is 6
}