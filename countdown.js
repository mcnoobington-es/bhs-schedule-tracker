let scheduleData = null;

async function loadScheduleData() {
    const response = await fetch('scheduleData.json');
    scheduleData = await response.json();
    updateCountdown();
}

function toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isHoliday(date) {
    const dateStr = toDateString(date);
    return scheduleData.holidays.some(h => h.date === dateStr);
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function isSchoolDay(date) {
    return !isWeekend(date) && !isHoliday(date);
}

function countSchoolDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
        if (isSchoolDay(current)) {
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    return count;
}

function updateCountdown() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(2026, 5, 17); // June 17, 2026

    const daysLeft = countSchoolDays(today, endDate);
    document.getElementById('countdown-number').textContent = daysLeft;

    // Calculate progress bar based on full school year (Sept 1, 2025 -> July 17, 2026)
    const schoolYearStart = new Date(2025, 8, 1); // September 1, 2025
    const totalDays = countSchoolDays(schoolYearStart, endDate);
    const daysPassed = totalDays - daysLeft;
    const progressPct = totalDays > 0 ? Math.round((daysPassed / totalDays) * 100) : 0;

    document.getElementById('progress-bar').style.width = progressPct + '%';
    document.getElementById('progress-label').textContent = progressPct + '% of the school year complete';
}

loadScheduleData();
