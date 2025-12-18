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

        await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

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
