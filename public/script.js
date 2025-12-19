function setupPage(page, formId, api, fields, renderRow) {
    if (!location.href.includes(page)) return;

    const form = document.getElementById(formId);
    const tbody = document.querySelector('tbody');

    async function load() {
        const res = await fetch(api);
        const data = await res.json();
        tbody.innerHTML = '';
        data.forEach(row => tbody.innerHTML += renderRow(row));
    }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {};
    fields.forEach((f, i) => payload[f] = form[i].value);

    const res = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let msg = 'Operation failed';
      try {
        const data = await res.json();
        msg = data.error || msg;
      } catch (e) { }
      alert(msg);
      return;
    }

    form.reset();
    load();
  });

  load();
}
//students

let allStudents = [];

function renderStudents(list) {
  const tbody = document.getElementById('studentsTbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  list.forEach(s => {
    tbody.innerHTML += `
        <tr>
            <td>${s.student_id}</td>
            <td>${s.first_name} ${s.last_name}</td>
            <td>${s.gender}</td>
            <td>${s.phone || ''}</td>
            <td>${s.email || ''}</td>
        </tr>`;
  });
}

/* 👇 THIS MUST BE GLOBAL (for buttons) */
function filterGender(gender) {
  renderStudents(allStudents.filter(s => s.gender === gender));
}

async function loadAllocatedStudents() {
  const res = await fetch('http://localhost:3000/reports/students-with-rooms');
  const data = await res.json();

  const tbody = document.getElementById('studentsTbody');
  tbody.innerHTML = '';

  data.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.student_id}</td>
        <td>${s.first_name} ${s.last_name}</td>
        <td>${s.gender}</td>
        <td>${s.phone || ''}</td>
        <td>${s.email || ''}</td>
      </tr>
    `;
  });
}


/* STUDENTS PAGE LOGIC */
if (location.href.includes('students.html')) {
  const form = document.getElementById('studentForm');

  async function loadStudents() {
    const res = await fetch('http://localhost:3000/students');
    allStudents = await res.json();
    renderStudents(allStudents);
  }



  form.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
      student_id: form[0].value,
      first_name: form[1].value,
      last_name: form[2].value,
      gender: form[3].value,
      phone: form[4].value,
      email: form[5].value
    };

    await fetch('http://localhost:3000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    form.reset();
    loadStudents();
  });

  loadStudents();
}


/* HOSTELS */
setupPage(
    'hostels.html',
    'hostelForm',
    'http://localhost:3000/hostels',
    ['hostel_id', 'hostel_name', 'location', 'total_rooms'],
    h => `<tr>
    <td>${h.hostel_id}</td>
    <td>${h.hostel_name}</td>
    <td>${h.location}</td>
    <td>${h.total_rooms}</td>
  </tr>`
);

/* ROOM TYPES */
setupPage(
    'roomtypes.html',
    'roomTypeForm',
    'http://localhost:3000/roomtypes',
    ['type_name', 'default_price'],
    r => `<tr>
    <td>${r.type_name}</td>
    <td>${r.default_price}</td>
  </tr>`
);

/* ROOMS (NO STATUS INPUT) */
async function loadRoomsWithHostels() {
  const res = await fetch('http://localhost:3000/reports/rooms-hostels');
  const data = await res.json();

  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  thead.innerHTML = `
        <tr>
            <th>Room ID</th>
            <th>Room Number</th>
            <th>Hostel Name</th>
            <th>Status</th>
        </tr>
    `;

  tbody.innerHTML = '';

  data.forEach(r => {
    tbody.innerHTML += `
        <tr>
            <td>${r.room_id}</td>
            <td>${r.room_number}</td>
            <td>${r.hostel_name}</td>
            <td>${r.status}</td>
        </tr>`;
  });
}

setupPage(
    'rooms.html',
    'roomForm',
    'http://localhost:3000/rooms',
    ['room_id', 'hostel_id', 'type_name', 'room_number'],
    r => `<tr>
    <td>${r.room_id}</td>
    <td>${r.hostel_id}</td>
    <td>${r.type_name}</td>
    <td>${r.room_number}</td>
    <td>${r.status}</td>
  </tr>`
);

/* ALLOCATIONS */
async function loadPayments() {
  const res = await fetch('http://localhost:3000/payments');
  const data = await res.json();

  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = document.getElementById('paymentsTbody');

  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Student ID</th>
      <th>Amount</th>
      <th>Date</th>
      <th>Description</th>
    </tr>
  `;

  tbody.innerHTML = '';
  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.payment_id}</td>
        <td>${p.student_id}</td>
        <td>${p.amount}</td>
        <td>${p.payment_date}</td>
        <td>${p.description || ''}</td>
      </tr>
    `;
  });
}

setupPage(
    'allocations.html',
    'allocationForm',
    'http://localhost:3000/allocations',
    ['allocation_id', 'student_id', 'room_id', 'allocation_date', 'checkout_date'],
    a => `<tr>
    <td>${a.allocation_id}</td>
    <td>${a.student_id}</td>
    <td>${a.room_id}</td>
    <td>${a.allocation_date}</td>
    <td>${a.checkout_date}</td>
  </tr>`
);

/* PAYMENTS */
setupPage(
    'payments.html',
    'paymentForm',
    'http://localhost:3000/payments',
    ['payment_id', 'student_id', 'amount', 'payment_date', 'description'],
    p => `<tr>
    <td>${p.payment_id}</td>
    <td>${p.student_id}</td>
    <td>${p.amount}</td>
    <td>${p.payment_date}</td>
    <td>${p.description}</td>
  </tr>`
);
