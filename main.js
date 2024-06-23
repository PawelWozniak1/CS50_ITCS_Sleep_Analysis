document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const resultsDiv = document.getElementById('results');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const text = e.target.result;
                const data = parseCSV(text);
                sessionStorage.setItem('csvData', JSON.stringify(data)); // Save data to sessionStorage
                console.log('Data saved to sessionStorage:', data);
                displayData(data);
            } catch (error) {
                resultsDiv.textContent = 'Błąd podczas przetwarzania pliku: ' + error.message;
                console.error('Error parsing CSV:', error);
            }
        };
        reader.onerror = function() {
            resultsDiv.textContent = 'Błąd podczas wczytywania pliku.';
            console.error('FileReader error:', reader.error);
        };
        reader.readAsText(file);
    } else {
        resultsDiv.textContent = 'Wybierz plik przed wysłaniem.';
        console.warn('No file selected');
    }
});

function parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        throw new Error('Plik jest pusty.');
    }
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
    return { headers, rows };
}

function displayData(data) {
    const { headers, rows } = data;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    resultsDiv.appendChild(table);
    console.log('Data displayed:', data);
}

// Load data from sessionStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(sessionStorage.getItem('csvData'));
    if (data) {
        displayData(data);
        console.log('Data loaded from sessionStorage on page load:', data);
    } else {
        console.log('No data in sessionStorage');
    }
});