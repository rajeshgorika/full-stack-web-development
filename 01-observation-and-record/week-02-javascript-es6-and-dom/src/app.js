// Week 02: JavaScript ES6 & DOM Manipulation

// --- Part 1: DOM Manipulation ---
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Please enter a valid task description.');
        return;
    }

    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'danger';
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskInput.value = '';
};

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Seed sample tasks
['Review HTML5 Semantic Elements', 'Practice Flexbox and Grid Layout', 'Learn ES6 Arrow Functions & Destructuring'].forEach(item => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = item;
    li.appendChild(span);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'danger';
    deleteBtn.addEventListener('click', () => li.remove());
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
});


// --- Part 2: Async/Await Fetch API ---
const fetchUsersBtn = document.getElementById('fetchUsersBtn');
const fetchStatus = document.getElementById('fetchStatus');
const usersContainer = document.getElementById('usersContainer');

const fetchRemoteUsers = async () => {
    fetchStatus.textContent = 'Fetching users from remote API...';
    fetchStatus.style.color = '#2563eb';
    usersContainer.innerHTML = '';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        
        fetchStatus.textContent = `Successfully fetched ${users.length} users.`;
        fetchStatus.style.color = '#16a34a';

        // Render with ES6 Array method (forEach / map) and template literals
        users.slice(0, 6).forEach(({ name, email, company }) => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <h4>${name}</h4>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company?.name || 'N/A'}</p>
            `;
            usersContainer.appendChild(card);
        });
    } catch (error) {
        fetchStatus.textContent = `Error loading users: ${error.message}`;
        fetchStatus.style.color = '#dc2626';
    }
};

fetchUsersBtn.addEventListener('click', fetchRemoteUsers);
