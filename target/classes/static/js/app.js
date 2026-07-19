const BASE = 'http://localhost:8080/api';

// ─── HTTP helpers ────────────────────────────────────────────
async function apiFetch(url, options = {}) {
    try {
        const res = await fetch(BASE + url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options,
        });
        if (!res.ok) {
            const msg = await res.text().catch(() => 'Request failed');
            throw new Error(msg);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

// ─── Currency formatting ──────────────────────────────────────
function fmt(n) {
    return '₹' + Number(n).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// ─── Dashboard ─────────────────────────────────────────────────
async function loadDashboard() {
    try {
        const report = await apiFetch('/transactions/report');
        const income = report.totalIncome || 0;
        const expense = report.totalExpense || 0;
        document.getElementById('totalIncome').textContent = fmt(income);
        document.getElementById('totalExpense').textContent = fmt(expense);
        document.getElementById('balance').textContent = fmt(income - expense);

        const txs = await apiFetch('/transactions');
        const tbody = document.getElementById('recentTbody');
        const recent = txs.slice(0, 5);
        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No transactions yet.</td></tr>';
        } else {
            tbody.innerHTML = recent.map(tx => rowHtml(tx)).join('');
        }
    } catch (e) {
        document.getElementById('recentTbody').innerHTML =
            '<tr><td colspan="5" class="text-center">Could not load data. Is the server running?</td></tr>';
    }
}

// ─── Add Transaction ───────────────────────────────────────────
async function initAddTransaction() {
    try {
        const cats = await apiFetch('/categories');
        const sel = document.getElementById('category');
        sel.innerHTML = '<option value="">-- Select Category --</option>'
            + cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (e) {
        document.getElementById('category').innerHTML = '<option value="">Categories unavailable</option>';
    }

    document.getElementById('date').valueAsDate = new Date();

    document.getElementById('transactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgEl = document.getElementById('formMessage');
        msgEl.className = 'form-message';

        const payload = {
            description: document.getElementById('description').value.trim(),
            amount: parseFloat(document.getElementById('amount').value),
            date: document.getElementById('date').value,
            type: document.getElementById('type').value,
            category: { id: parseInt(document.getElementById('category').value) },
        };

        if (!payload.description || !payload.amount || !payload.date || !payload.category.id) {
            msgEl.textContent = 'Please fill in all fields.';
            msgEl.className = 'form-message error';
            return;
        }

        try {
            await apiFetch('/transactions', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            msgEl.textContent = 'Transaction added successfully!';
            msgEl.className = 'form-message success';
            document.getElementById('transactionForm').reset();
            document.getElementById('date').valueAsDate = new Date();
        } catch (err) {
            msgEl.textContent = 'Failed to add transaction. Is the server running?';
            msgEl.className = 'form-message error';
        }
    });
}

// ─── Transactions List ─────────────────────────────────────────
async function loadTransactions() {
    try {
        const txs = await apiFetch('/transactions');
        const tbody = document.getElementById('transactionsTbody');
        if (txs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No transactions yet.</td></tr>';
        } else {
            tbody.innerHTML = txs.map(tx => {
                const date = tx.date || '';
                const desc = escHtml(tx.description);
                const amount = fmt(tx.amount);
                const type = tx.type === 'INCOME'
                    ? '<span class="badge-income">Income</span>'
                    : '<span class="badge-expense">Expense</span>';
                const cat = tx.category ? escHtml(tx.category.name) : '—';
                return `<tr>
                    <td>${date}</td>
                    <td>${desc}</td>
                    <td>${amount}</td>
                    <td>${type}</td>
                    <td>${cat}</td>
                    <td><button class="btn btn-danger" onclick="deleteTx(${tx.id})">Delete</button></td>
                </tr>`;
            }).join('');
        }
    } catch (e) {
        document.getElementById('transactionsTbody').innerHTML =
            '<tr><td colspan="6" class="text-center">Could not load data. Is the server running?</td></tr>';
    }
}

async function deleteTx(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
        await apiFetch('/transactions/' + id, { method: 'DELETE' });
        loadTransactions();
    } catch (e) {
        alert('Failed to delete.');
    }
}

// ─── Reports ───────────────────────────────────────────────────
async function loadReports() {
    try {
        const report = await apiFetch('/transactions/report');
        const income = report.totalIncome || 0;
        const expense = report.totalExpense || 0;
        document.getElementById('rptIncome').textContent = fmt(income);
        document.getElementById('rptExpense').textContent = fmt(expense);
        document.getElementById('rptBalance').textContent = fmt(income - expense);

        const breakdown = report.expenseByCategory || [];
        const tbody = document.getElementById('breakdownTbody');
        const chart = document.getElementById('chartContainer');

        if (breakdown.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No expense data.</td></tr>';
            chart.innerHTML = '<p class="text-center">No expense data to chart.</p>';
            return;
        }

        const maxAmt = Math.max(...breakdown.map(b => b.amount));
        tbody.innerHTML = breakdown.map(b => {
            const pct = expense > 0 ? ((b.amount / expense) * 100).toFixed(1) : 0;
            return `<tr>
                <td>${escHtml(b.category || 'Uncategorized')}</td>
                <td>${fmt(b.amount)}</td>
                <td>${pct}%</td>
            </tr>`;
        }).join('');

        chart.innerHTML = breakdown.map(b => {
            const pct = maxAmt > 0 ? (b.amount / maxAmt) * 100 : 0;
            return `<div class="chart-bar-row">
                <div class="chart-bar-label">${escHtml(b.category || 'Uncategorized')}</div>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width:${pct}%">${fmt(b.amount)}</div>
                </div>
            </div>`;
        }).join('');
    } catch (e) {
        document.getElementById('breakdownTbody').innerHTML =
            '<tr><td colspan="3" class="text-center">Could not load data. Is the server running?</td></tr>';
    }
}

// ─── Shared helpers ────────────────────────────────────────────
function rowHtml(tx) {
    const date = tx.date || '';
    const desc = escHtml(tx.description);
    const amount = fmt(tx.amount);
    const type = tx.type === 'INCOME'
        ? '<span class="badge-income">Income</span>'
        : '<span class="badge-expense">Expense</span>';
    const cat = tx.category ? escHtml(tx.category.name) : '—';
    return `<tr><td>${date}</td><td>${desc}</td><td>${amount}</td><td>${type}</td><td>${cat}</td></tr>`;
}

function escHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
