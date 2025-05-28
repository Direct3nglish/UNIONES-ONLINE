const isAdmin = ['soporte.online', 'dilsen.pastor'].includes(localStorage.getItem('user') || '');
const tableBody = document.getElementById('tableBody');
const movements = ['unión', 'reasignación', 'creación de nivel', 'cierre de clase'];

function createRow(data = {}) {
    const row = document.createElement('tr');
    const keys = [
        'grupo', 'coach', 'nivel', 'horario', 'movimientoPropuesto',
        'estudiantes', 'comentarios', 'decision', 'movimientoRealizar',
        'anuncio', 'claseAnuncio'
    ];

    keys.forEach((key, i) => {
        const cell = document.createElement('td');
        if (!isAdmin) {
            cell.textContent = data[key] || '';
        } else if (key === 'movimientoRealizar') {
            const select = document.createElement('select');
            movements.forEach(mov => {
                const option = document.createElement('option');
                option.value = mov;
                option.text = mov;
                if (data[key] === mov) option.selected = true;
                select.appendChild(option);
            });
            cell.appendChild(select);
        } else if (key === 'anuncio') {
            const select = document.createElement('select');
            ['sí', 'no'].forEach(val => {
                const option = document.createElement('option');
                option.value = val;
                option.text = val;
                if (data[key] === val) option.selected = true;
                select.appendChild(option);
            });
            select.onchange = () => {
                const claseCell = row.cells[10];
                claseCell.contentEditable = (select.value === 'sí');
                if (select.value !== 'sí') claseCell.textContent = '';
            };
            cell.appendChild(select);
        } else if (key === 'claseAnuncio') {
            cell.contentEditable = data['anuncio'] === 'sí';
            cell.textContent = data[key] || '';
        } else {
            cell.contentEditable = true;
            cell.textContent = data[key] || '';
        }
        row.appendChild(cell);
    });
    tableBody.appendChild(row);
}

function saveTable() {
    const rows = [...tableBody.rows];
    const data = rows.map(row => {
        const values = [...row.cells].map((cell, i) => {
            if (cell.querySelector('select')) return cell.querySelector('select').value;
            return cell.textContent.trim();
        });
        return {
            grupo: values[0],
            coach: values[1],
            nivel: values[2],
            horario: values[3],
            movimientoPropuesto: values[4],
            estudiantes: values[5],
            comentarios: values[6],
            decision: values[7],
            movimientoRealizar: values[8],
            anuncio: values[9],
            claseAnuncio: values[10]
        };
    });
    localStorage.setItem('unionData', JSON.stringify(data));
    alert('Información guardada en localStorage.');
}

function loadTable() {
    const stored = localStorage.getItem('unionData');
    if (stored) {
        const data = JSON.parse(stored);
        data.forEach(d => createRow(d));
    } else {
        for (let i = 0; i < 5; i++) createRow();
    }
}

window.onload = loadTable;