// IA-02 Frontend Logic
const ticketsList = document.getElementById('ticketsList');
const ticketForm = document.getElementById('ticketForm');
const titleInput = document.getElementById('titleInput');
const prioritySelect = document.getElementById('prioritySelect');

const loadTickets = async () => {
    try {
        const res = await fetch('/api/tickets');
        const data = await res.json();
        ticketsList.innerHTML = '';

        data.data.forEach(t => {
            const li = document.createElement('li');
            li.className = 'ticket-card';
            li.innerHTML = `
                <div>
                    <strong>${t.title}</strong>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Status: ${t.status}</div>
                </div>
                <span class="badge">${t.priority}</span>
            `;
            ticketsList.appendChild(li);
        });
    } catch (e) {
        console.error('Error fetching tickets', e);
    }
};

ticketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const priority = prioritySelect.value;

    if (!title) return;

    await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
    });

    titleInput.value = '';
    loadTickets();
});

loadTickets();
