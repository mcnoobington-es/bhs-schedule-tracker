// Get DOM elements
const whatDay = document.getElementById("whatDay");
const whatPeriod = document.getElementById("whatPeriod");
const nextPeriod = document.getElementById("nextPeriod");
const divider = document.getElementById("divider");
const hamburger = document.getElementById('hamburger');
const wrapper = document.getElementById('wrapper');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        // Toggle active class on hamburger (for animation)
        hamburger.classList.toggle('active');
        
        // Toggle active class on wrapper (to show/hide menu)
        wrapper.classList.toggle('active');
    });

    // Close menu when clicking a link
    const menuLinks = wrapper.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            wrapper.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = wrapper.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && wrapper.classList.contains('active')) {
            hamburger.classList.remove('active');
            wrapper.classList.remove('active');
        }
    });
}

// Global variable to store schedule data
let scheduleData = null;

// Load the JSON data when page loads
async function loadScheduleData() {
    try {
        const response = await fetch('scheduleData.json');
        scheduleData = await response.json();
        console.log('Schedule data loaded:', scheduleData);
        updateDisplay();
        
        // Update every minute
        setInterval(updateDisplay, 60000);
    } catch (error) {
        console.error('Error loading schedule data:', error);
        whatDay.textContent = 'Error loading schedule';
    }
}

// Calculate if today is A day or B day
function calculateDayType(date, scheduleData) {
    const startDate = new Date(scheduleData.schedule_config.cycle_start_date);
    const currentDate = new Date(date);
    
    // Calculate days since start (only count weekdays)
    let dayCount = 0;
    let tempDate = new Date(startDate);
    
    while (tempDate <= currentDate) {
        const dayOfWeek = tempDate.getDay();
        // Only count Monday-Friday (1-5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Check if it's not a holiday
            const dateString = tempDate.toISOString().split('T')[0];
            const isHoliday = scheduleData.holidays.some(holiday => holiday.date === dateString);
            if (!isHoliday) {
                dayCount++;
            }
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }
    
    // Determine A or B day based on cycle start
    const isEven = dayCount % 2 === 0;
    if (scheduleData.schedule_config.first_day_type === 'A') {
        return isEven ? 'B' : 'A';
    } else {
        return isEven ? 'A' : 'B';
    }
}

// Check if today is a holiday
function isHoliday(date, scheduleData) {
    const dateString = date.toISOString().split('T')[0];
    return scheduleData.holidays.find(holiday => holiday.date === dateString);
}

// Check if today is special schedule
function getSpecialSchedule(date, scheduleData){
    const dateString = date.toISOString().split("T")[0]
    return scheduleData.special_schedules.find(schedule => schedule.date === dateString);
}

// Check if today is a weekend
function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
}

// Convert time string (HH:MM) to minutes since midnight
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Convert minutes since midnight back to time string
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Get current period information
function getCurrentPeriodInfo(dayType, currentTime, specialSchedule = null) {
    const periods = specialSchedule ? specialSchedule.schedule_override.period_times : scheduleData.day_types[dayType].period_times;
    const currentMinutes = timeToMinutes(currentTime);
    
    // Create array of all periods with their times
    const periodArray = [];
    for (const [period, times] of Object.entries(periods)) {
        periodArray.push({
            name: period,
            start: timeToMinutes(times.start),
            end: timeToMinutes(times.end)
        });
    }
    
    // Sort by start time
    periodArray.sort((a, b) => a.start - b.start);
    
    // Find current period
    for (let i = 0; i < periodArray.length; i++) {
        const period = periodArray[i];
        if (currentMinutes >= period.start && currentMinutes < period.end) {
            // Currently in this period
            const minutesLeft = period.end - currentMinutes;
            const nextPeriodInfo = i + 1 < periodArray.length ? periodArray[i + 1] : null;
            
            return {
                current: {
                    name: period.name,
                    endTime: minutesToTime(period.end),
                    minutesLeft: minutesLeft
                },
                next: nextPeriodInfo ? {
                    name: nextPeriodInfo.name,
                    startTime: minutesToTime(nextPeriodInfo.start)
                } : null
            };
        }
    }
    
    // Not currently in a period, find next one
    for (const period of periodArray) {
        if (currentMinutes < period.start) {
            const minutesUntil = period.start - currentMinutes;
            return {
                current: null,
                next: {
                    name: period.name,
                    startTime: minutesToTime(period.start),
                    minutesUntil: minutesUntil
                }
            };
        }
    }
    
    // School day is over
    return { current: null, next: null };
}

// Format minutes into readable text
function formatMinutes(minutes) {
    if (minutes < 1) return 'less than a minute';
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return hours === 1 ? '1 hour' : `${hours} hours`;
    } else {
        return `${hours}h ${remainingMinutes}m`;
    }
}

// Get next school day info
function getNextSchoolDayInfo() {
    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1); // Start with tomorrow
    
    // Keep looking until we find a school day (max 14 days to avoid infinite loop)
    for (let i = 0; i < 14; i++) {
        // Skip weekends
        if (!isWeekend(nextDay)) {
            // Check if it's not a holiday
            const holiday = isHoliday(nextDay, scheduleData);
            if (!holiday) {
                // This is a school day!
                const dayType = calculateDayType(nextDay, scheduleData);
                const dayName = getDayName(nextDay);
                const isToday = i === 0; // tomorrow is index 0
                
                return {
                    date: nextDay,
                    dayType: dayType,
                    dayName: dayName,
                    isToday: isToday,
                    daysAway: i + 1
                };
            }
        }
        // Move to next day
        nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return null; // Couldn't find a school day (shouldn't happen normally)
}

// Get day name (Monday, Tuesday, etc.)
function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

// Main function to update the display
function updateDisplay() {
    if (!scheduleData) return;
    
    const now = new Date();
    // Get current time in HH:MM format more safely
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    // Check if it's weekend
    if (isWeekend(now)) {
        document.body.style.backgroundColor = "#ede9d0"
        whatDay.textContent = "No school today!";
        whatPeriod.textContent = "Enjoy your weekend!";
        
        // Show next school day
        const nextSchoolDay = getNextSchoolDayInfo();
        if (nextSchoolDay) {
            if (nextSchoolDay.daysAway === 1) {
                nextPeriod.textContent = `Tomorrow (${nextSchoolDay.dayName}) is ${nextSchoolDay.dayType} day`;
            } else {
                nextPeriod.textContent = `Next school day: ${nextSchoolDay.dayName} is ${nextSchoolDay.dayType} day`;
            }
        } else {
            nextPeriod.textContent = "";
        }
        return;
    }
    
    // Check if it's a holiday
    const holiday = isHoliday(now, scheduleData);
    if (holiday) {
        document.body.style.backgroundColor = "#ede9d0"
        whatDay.textContent = `Holiday: ${holiday.name}`;
        whatPeriod.textContent = "No school today!";
        
        // Show next school day
        const nextSchoolDay = getNextSchoolDayInfo();
        if (nextSchoolDay) {
            if (nextSchoolDay.daysAway === 1) {
                nextPeriod.textContent = `Tomorrow (${nextSchoolDay.dayName}) is ${nextSchoolDay.dayType} day`;
            } else {
                nextPeriod.textContent = `Next school day: ${nextSchoolDay.dayName} is ${nextSchoolDay.dayType} day`;
            }
        } else {
            nextPeriod.textContent = "";
        }
        return;
    }
    
    // Check for special schedule
    const specialSchedule = getSpecialSchedule(now, scheduleData);
    
    // Calculate day type (A or B)
    const dayType = calculateDayType(now, scheduleData);
    
    // Show special schedule notice if applicable
    if (specialSchedule) {
        whatDay.textContent = `${specialSchedule.name}`;
        document.body.style.backgroundColor = "#ffa500"; // Orange for special days
    } else {
        whatDay.textContent = `${dayType} day`;
        if (dayType === "A") {
            document.body.style.backgroundColor = "#eb1d25"
        } else if (dayType === "B") {
            document.body.style.backgroundColor = "#bffcf9"
        }
    }
    
    // Get current period info (pass special schedule if it exists)
    const periodInfo = getCurrentPeriodInfo(dayType, currentTime, specialSchedule);
    
    if (periodInfo.current) {
        // Currently in a period
        const period = periodInfo.current;
        let periodName = period.name;
        
        // Format period name nicely
        if (periodName === 'homeroom') periodName = 'Homeroom';
        else if (periodName.startsWith('passing_period')) periodName = 'Passing Period';
        else if (periodName === 'lunch') periodName = 'Lunch';
        else if (periodName === 'party') periodName = 'Party'; // Special case for Halloween party
        else if (periodName === 'concert') periodName = 'Concert'; // Special case for Concert
        else if (periodName === 'market') periodName = 'Christmas Market'; // Special case for christmas market
        else if (periodName === 'debrief') periodName = 'Big Group Debrief (7th floor)';
        else if (!isNaN(periodName)) periodName = `Period ${periodName}`;
        
        whatPeriod.textContent = `${periodName} ends at ${period.endTime} (${formatMinutes(period.minutesLeft)})`;
        
        if (periodInfo.next) {
            let nextPeriodName = periodInfo.next.name;
            if (nextPeriodName === 'homeroom') nextPeriodName = 'Homeroom';
            else if (nextPeriodName.startsWith('passing_period')) nextPeriodName = 'Passing Period';
            else if (nextPeriodName === 'lunch') nextPeriodName = 'Lunch';
            else if (nextPeriodName === 'party') nextPeriodName = 'Halloween Party';
            else if (nextPeriodName === 'debrief') nextPeriodName = 'Big Group Debrief (7th floor)';
            else if (!isNaN(nextPeriodName)) nextPeriodName = `Period ${nextPeriodName}`;
            
            nextPeriod.textContent = `Next: ${nextPeriodName} (${periodInfo.next.startTime})`;
        } else {
            nextPeriod.textContent = "School day ends after this period";
        }
    } else if (periodInfo.next) {
        // Between periods
        whatPeriod.textContent = "Between periods";
        
        let nextPeriodName = periodInfo.next.name;
        if (nextPeriodName === 'homeroom') nextPeriodName = 'Homeroom';
        else if (nextPeriodName.startsWith('passing_period')) nextPeriodName = 'Passing Period';
        else if (nextPeriodName === 'lunch') nextPeriodName = 'Lunch';
        else if (nextPeriodName === 'party') nextPeriodName = 'Halloween Party';
        else if (!isNaN(nextPeriodName)) nextPeriodName = `Period ${nextPeriodName}`;
        
        if (periodInfo.next.minutesUntil) {
            nextPeriod.textContent = `${nextPeriodName} starts in ${formatMinutes(periodInfo.next.minutesUntil)} (${periodInfo.next.startTime})`;
        } else {
            nextPeriod.textContent = `Next: ${nextPeriodName} (${periodInfo.next.startTime})`;
        }
    } else {
        // School day is over - show tomorrow's schedule
        document.body.style.backgroundColor = "#ede9d0"
        whatPeriod.textContent = "School day has ended!";
        
        const nextSchoolDay = getNextSchoolDayInfo();
        if (nextSchoolDay) {
            if (nextSchoolDay.daysAway === 1) {
                nextPeriod.textContent = `Tomorrow (${nextSchoolDay.dayName}) is ${nextSchoolDay.dayType} day`;
            } else {
                nextPeriod.textContent = `Next school day: ${nextSchoolDay.dayName} is ${nextSchoolDay.dayType} day`;
            }
        } else {
            nextPeriod.textContent = "";
        }
    }
}

// Start the application when page loads
document.addEventListener('DOMContentLoaded', loadScheduleData);