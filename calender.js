// const image = document.getElementById("image_display")
// const selection = document.getElementById("month_select")
const hamburger = document.getElementById('hamburger');
const wrapper = document.getElementById('wrapper');
/* let currentMonth = new Date().getMonth();
let month

if (currentMonth == 0) {
    month = "january"
} else if (currentMonth == 1) {
    month = "february"
} else if (currentMonth == 2) {
    month = "march"
} else if (currentMonth == 3) {
    month = "april"
} else if (currentMonth == 4) {
    month = "may"
} else if (currentMonth == 5) {
    month = "june"
} else if (currentMonth == 8) {
    month = "september"
} else if (currentMonth == 9) {
    month = "october"
} else if (currentMonth == 10) {
    month = "november"
} else if (currentMonth == 11) {
    month = "december"
} 
image.src = `schedule/${month}.png` */

// Show the slide for the current month by default.
// Slide 1 = September, 2 = October, ... 10 = June, 11 = key.
// Slides are ordered p1 (first slide) through p11 (key) in the published deck.
const calendarFrame = document.getElementById('calendar-frame');
if (calendarFrame) {
    const monthToSlide = {
        8: 1,  // September
        9: 2,  // October
        10: 3, // November
        11: 4, // December
        0: 5,  // January
        1: 6,  // February
        2: 7,  // March
        3: 8,  // April
        4: 9,  // May
        5: 10  // June
    };

    const currentMonth = new Date().getMonth();
    const slideNumber = monthToSlide[currentMonth] || 1; // default to the key during summer break

    calendarFrame.src += `&slide=id.p${slideNumber}`;
}

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

/*
function updateImage() {
    if (selection.value == "september"){
        image.src = "schedule/september.png"
    } else if (selection.value == "october"){
        image.src = "schedule/october.png"
    } else if (selection.value == "november"){
        image.src = "schedule/november.png"
    } else if (selection.value == "december"){
        image.src = "schedule/december.png"
    } else if (selection.value == "january"){
        image.src = "schedule/january.png"
    } else if (selection.value == "february"){
        image.src = "schedule/february.png"
    } else if (selection.value == "march"){
        image.src = "schedule/march.png"
    } else if (selection.value == "april"){
        image.src = "schedule/april.png"
    } else if (selection.value == "may"){
        image.src = "schedule/may.png"
    } else if (selection.value == "june"){
        image.src = "schedule/june.png"
    } else{
        image.src = `schedule/${month}.png`
    }
} */

