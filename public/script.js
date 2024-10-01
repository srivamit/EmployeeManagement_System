document.getElementById('employee-form').addEventListener('submit', addEmployee);
document.getElementById('search').addEventListener('input', searchEmployees);
document.getElementById('sort-options').addEventListener('change', sortEmployees);
document.getElementById('export-csv').addEventListener('click', exportCSV);
document.getElementById('export-pdf').addEventListener('click', exportPDF);

let employees = []; // Store employee data

function addEmployee(e) {
    e.preventDefault();
    const employee = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        position: document.getElementById('position').value,
        department: document.getElementById('department').value,
        salary: document.getElementById('salary').value,
        hire_date: document.getElementById('hire_date').value,
    };
    
    fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
    })
    .then(response => response.json())
    .then(() => {
        alert('Employee added!');
        loadEmployees();
    });
}

function loadEmployees() {
    fetch('http://localhost:3000/api/employees')
        .then(response => response.json())
        .then(data => {
            employees = data; // Store the employee data
            renderEmployeeList(employees); // Render the list
            renderPerformanceChart(data); // Load chart after employee data is fetched
        });
}

function renderEmployeeList(data) {
    const tbody = document.querySelector('#employee-list tbody');
    tbody.innerHTML = '';
    data.forEach(employee => {
        tbody.innerHTML += `<tr>
            <td>${employee.employee_id}</td>
            <td>${employee.first_name} ${employee.last_name}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
            <td>
                <button onclick="editEmployee(${employee.employee_id})">Edit</button>
                <button onclick="deleteEmployee(${employee.employee_id})">Delete</button>
            </td>
        </tr>`;
    });
}

function searchEmployees() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredEmployees = employees.filter(employee => 
        employee.first_name.toLowerCase().includes(query) ||
        employee.last_name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
    );
    renderEmployeeList(filteredEmployees);
}

function sortEmployees() {
    const sortBy = document.getElementById('sort-options').value;
    const sortedEmployees = [...employees];
    
    if (sortBy === 'first_name') {
        sortedEmployees.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (sortBy === 'last_name') {
        sortedEmployees.sort((a, b) => a.last_name.localeCompare(b.last_name));
    } else if (sortBy === 'salary') {
        sortedEmployees.sort((a, b) => a.salary - b.salary);
    } else if (sortBy === 'hire_date') {
        sortedEmployees.sort((a, b) => new Date(a.hire_date) - new Date(b.hire_date));
    }
    
    renderEmployeeList(sortedEmployees);
}

function deleteEmployee(id) {
    fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'DELETE',
    }).then(() => {
        alert('Employee deleted!');
        loadEmployees();
    });
}

function exportCSV() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + ["ID,Name,Email,Phone,Position,Department,Salary"].join(",") + "\n"
        + employees.map(emp => 
            `${emp.employee_id},${emp.first_name} ${emp.last_name},${emp.email},${emp.phone},${emp.position},${emp.department},${emp.salary}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
}

function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee List", 14, 22);
    doc.setFontSize(12);

    const tableData = employees.map(emp => [
        emp.employee_id,
        emp.first_name + ' ' + emp.last_name,
        emp.email,
        emp.phone,
        emp.position,
        emp.department,
        emp.salary,
    ]);

    doc.autoTable({
        head: [['ID', 'Name', 'Email', 'Phone', 'Position', 'Department', 'Salary']],
        body: tableData,
        startY: 30,
    });

    doc.save('employees.pdf');
}

function renderPerformanceChart(data) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(emp => emp.first_name + ' ' + emp.last_name),
            datasets: [{
                label: 'Salary',
                data: data.map(emp => emp.salary),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load employees on initial page load
loadEmployees();
