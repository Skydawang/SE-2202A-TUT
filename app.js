// Step 2: Course Class Definition
class Course {
    constructor(data) {
        this.id = data.id || "UNKNOWN-ID";
        this.title = data.title || "Untitled Course";
        this.department = data.department || "General";
        this.level = typeof data.level === 'number' ? data.level : parseInt(data.level) || 0;
        this.credits = typeof data.credits === 'number' ? data.credits : parseInt(data.credits) || 3;
        this.instructor = data.instructor || "TBA";
        this.description = data.description || "No description available.";
        this.semester = data.semester || "";
    }

    getId() { return this.id; }
    getTitle() { return this.title; }
    getDepartment() { return this.department; }
    getLevel() { return this.level; }
    getCredits() { return this.credits; }
    getInstructor() { return this.instructor; }
    getDescription() { return this.description; }
    getSemester() { return this.semester; }

    // Matches page_details.png layout exactly
    getDetailsHTML() {
        return `
            <div class="detail-content">
                <h3>${this.id}</h3>
                <p><strong>Title:</strong> ${this.title}</p>
                <p><strong>Department:</strong> ${this.department}</p>
                <p><strong>Level:</strong> ${this.level}</p>
                <p><strong>Credits:</strong> ${this.credits}</p>
                <p><strong>Instructor:</strong> ${this.instructor}</p>
                <p><strong>Semester:</strong> ${this.semester || "Not specified"}</p>
                <p>${this.description}</p>
            </div>
        `;
    }
}

let allCourses = [];
let filteredCourses = [];

const fileInput = document.getElementById('file-input');
const errorMessageDiv = document.getElementById('error-message');
const courseListUl = document.getElementById('course-list');
const courseDetailDiv = document.getElementById('course-detail');

const filterDept = document.getElementById('filter-department');
const filterLevel = document.getElementById('filter-level');
const filterCredits = document.getElementById('filter-credits');
const filterInstructor = document.getElementById('filter-instructor');
const sortBySelect = document.getElementById('sort-by');

// Step 3: Data Loading & Error Handling (Matches page_error.png)
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            hideError();
            const rawData = JSON.parse(e.target.result);
            
            if (!Array.isArray(rawData)) {
                throw new Error("Invalid JSON file format.");
            }

            allCourses = rawData.map(item => new Course(item));
            filteredCourses = [...allCourses];

            initFilters();
            renderCourses(filteredCourses);
            courseDetailDiv.innerHTML = "";
        } catch (error) {
            showError("Invalid JSON file format.");
            allCourses = [];
            filteredCourses = [];
            courseListUl.innerHTML = `<li class="placeholder-item">Failed to load courses.</li>`;
            courseDetailDiv.innerHTML = "";
        }
    };
    reader.readAsText(file);
});

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.className = "error-visible";
}

function hideError() {
    errorMessageDiv.textContent = "";
    errorMessageDiv.className = "error-hidden";
}

// Step 4: Dynamically populate filters using Set
function initFilters() {
    const departments = new Set();
    const levels = new Set();
    const credits = new Set();
    const instructors = new Set();

    allCourses.forEach(course => {
        departments.add(course.getDepartment());
        levels.add(course.getLevel());
        credits.add(course.getCredits());
        instructors.add(course.getInstructor());
    });

    populateDropdown(filterDept, departments);
    populateDropdown(filterLevel, levels, (a, b) => a - b);
    populateDropdown(filterCredits, credits, (a, b) => a - b);
    populateDropdown(filterInstructor, instructors);
}

function populateDropdown(selectElement, valuesSet, sortFn = null) {
    selectElement.innerHTML = '<option value="">All</option>';
    let valuesArray = Array.from(valuesSet);
    
    if (sortFn) {
        valuesArray.sort(sortFn);
    } else {
        valuesArray.sort();
    }

    valuesArray.forEach(val => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val;
        selectElement.appendChild(option);
    });
}

[filterDept, filterLevel, filterCredits, filterInstructor].forEach(element => {
    element.addEventListener('change', applyFiltersAndSorting);
});

sortBySelect.addEventListener('change', applyFiltersAndSorting);

// Step 4 & 5: Required filter & sort array methods
function applyFiltersAndSorting() {
    const selectedDept = filterDept.value;
    const selectedLevel = filterLevel.value;
    const selectedCredits = filterCredits.value;
    const selectedInstructor = filterInstructor.value;
    const sortCriteria = sortBySelect.value;

    // Must use filter method
    filteredCourses = allCourses.filter(course => {
        if (selectedDept && course.getDepartment() !== selectedDept) return false;
        if (selectedLevel && course.getLevel() !== Number(selectedLevel)) return false;
        if (selectedCredits && course.getCredits() !== Number(selectedCredits)) return false;
        if (selectedInstructor && course.getInstructor() !== selectedInstructor) return false;
        return true;
    });

    // Must use sort method
    if (sortCriteria) {
        filteredCourses.sort((a, b) => {
            if (sortCriteria === 'id-asc') {
                return a.getId().localeCompare(b.getId());
            } else if (sortCriteria === 'id-desc') {
                return b.getId().localeCompare(a.getId());
            } else if (sortCriteria === 'title-asc') {
                return a.getTitle().localeCompare(b.getTitle());
            } else if (sortCriteria === 'title-desc') {
                return b.getTitle().localeCompare(a.getTitle());
            } else if (sortCriteria === 'semester-earliest') {
                return compareSemesters(a.getSemester(), b.getSemester());
            } else if (sortCriteria === 'semester-latest') {
                return compareSemesters(b.getSemester(), a.getSemester());
            }
            return 0;
        });
    }

    renderCourses(filteredCourses);
}

function compareSemesters(semA, semB) {
    if (!semA) return 1;
    if (!semB) return -1;

    const seasonOrder = { "Winter": 1, "Spring": 2, "Summer": 3, "Fall": 4 };
    
    const partsA = semA.split(' ');
    const partsB = semB.split(' ');
    
    const yearA = parseInt(partsA[1]) || 0;
    const yearB = parseInt(partsB[1]) || 0;
    
    if (yearA !== yearB) {
        return yearA - yearB;
    }
    
    const seasonA = seasonOrder[partsA[0]] || 0;
    const seasonB = seasonOrder[partsB[0]] || 0;
    
    return seasonA - seasonB;
}

// Step 6: Render course list and handle click events for details
function renderCourses(courses) {
    courseListUl.innerHTML = "";

    if (courses.length === 0) {
        courseListUl.innerHTML = `<li class="placeholder-item">No courses match the selected filters.</li>`;
        return;
    }

    courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course.getId();
        
        li.addEventListener('click', () => {
            document.querySelectorAll('#course-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');

            courseDetailDiv.innerHTML = course.getDetailsHTML();
        });

        courseListUl.appendChild(li);
    });
}