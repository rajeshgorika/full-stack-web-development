// Internal Assessment 01 Solution
const employees = [
    { id: 1, name: 'Aditya Sharma', dept: 'Engineering', role: 'Full Stack Engineer' },
    { id: 2, name: 'Priya Verma', dept: 'Design', role: 'UI/UX Designer' },
    { id: 3, name: 'Rahul Reddy', dept: 'Engineering', role: 'DevOps Specialist' },
    { id: 4, name: 'Sneha Patel', dept: 'Marketing', role: 'Product Marketing Manager' },
    { id: 5, name: 'Vikram Joshi', dept: 'Engineering', role: 'Backend Developer' },
    { id: 6, name: 'Ananya Rao', dept: 'Design', role: 'Visual Designer' }
];

const searchInput = document.getElementById('searchInput');
const deptFilter = document.getElementById('deptFilter');
const employeeGrid = document.getElementById('employeeGrid');

const renderEmployees = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDept = deptFilter.value;

    const filtered = employees.filter(emp => {
        const matchesName = emp.name.toLowerCase().includes(searchTerm);
        const matchesDept = selectedDept === 'all' || emp.dept === selectedDept;
        return matchesName && matchesDept;
    });

    employeeGrid.innerHTML = '';

    if (filtered.length === 0) {
        employeeGrid.innerHTML = '<p style="color: #64748b;">No employees match the filter criteria.</p>';
        return;
    }

    filtered.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'emp-card';
        card.innerHTML = `
            <h4>${emp.name}</h4>
            <p style="font-size: 13px; color: #64748b;">${emp.role}</p>
            <span class="badge">${emp.dept}</span>
        `;
        employeeGrid.appendChild(card);
    });
};

searchInput.addEventListener('input', renderEmployees);
deptFilter.addEventListener('change', renderEmployees);

// Initial render
renderEmployees();
