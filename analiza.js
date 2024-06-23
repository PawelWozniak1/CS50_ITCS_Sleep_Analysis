document.addEventListener('DOMContentLoaded', function() {
    const storedData = sessionStorage.getItem('csvData');
    if (storedData) {
        const data = JSON.parse(storedData);
        console.log("Loaded data from sessionStorage:", data); // Log loaded data
        populateDateSelect(data);
    }

    document.getElementById('dateForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedDate = document.getElementById('dateSelect').value;
        if (storedData && selectedDate) {
            const data = JSON.parse(storedData);
            console.log("Selected date:", selectedDate); // Log selected date
            const analysisResults = analyzeData(data, selectedDate);
            console.log("Analysis results:", analysisResults); // Log analysis results
            const sleepScore = calculateSleepScore(analysisResults[0], data.headers);
            console.log("Calculated sleep score:", sleepScore); // Log calculated sleep score
            displayAnalysisResults(analysisResults, sleepScore, data.headers);
            displayMethodology(analysisResults[0], sleepScore, data.headers);
            displayVisualization(analysisResults[0], sleepScore, data.headers);
        }
    });
});

function populateDateSelect(data) {
    const dateSelect = document.getElementById('dateSelect');
    const dateIndex = data.headers.indexOf('DATE');
    if (dateIndex !== -1) {
        const dates = [...new Set(data.rows.map(row => row[dateIndex]))];
        dates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateSelect.appendChild(option);
        });
    }
}

function analyzeData(data, selectedDate) {
    const dateIndex = data.headers.indexOf('DATE');
    const rows = data.rows.filter(row => row[dateIndex] === selectedDate);
    return rows;
}

function calculateSleepScore(row, headers) {
    const sleepScoreCoefficients = {
        intercept: 55.56016261,
        hoursOfSleep: 1.539953811,
        remSleep: 0.588553687,
        deepSleep: -0.03744907,
        heartRateBelowResting: 0.101970572
    };

    const hoursOfSleepIndex = headers.indexOf('HOURS OF SLEEP');
    const remSleepIndex = headers.indexOf('REM SLEEP');
    const deepSleepIndex = headers.indexOf('DEEP SLEEP');
    const heartRateIndex = headers.indexOf('HEART RATE BELOW RESTING');

    const hoursOfSleep = row[hoursOfSleepIndex].split(':').reduce((acc, time) => (60 * acc) + +time) / 60;
    const remSleep = parseFloat(row[remSleepIndex]);
    const deepSleep = parseFloat(row[deepSleepIndex]);
    const heartRateBelowResting = parseFloat(row[heartRateIndex]);

    const sleepScore = sleepScoreCoefficients.intercept +
        (sleepScoreCoefficients.hoursOfSleep * hoursOfSleep) +
        (sleepScoreCoefficients.remSleep * remSleep) +
        (sleepScoreCoefficients.deepSleep * deepSleep) +
        (sleepScoreCoefficients.heartRateBelowResting * heartRateBelowResting);

    return sleepScore.toFixed(2);
}

function displayAnalysisResults(analysisResults, sleepScore, headers) {
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = '';
    if (analysisResults.length > 0) {
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
        analysisResults.forEach(row => {
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

        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = `Calculated Sleep Score: ${sleepScore}`;
        resultsDiv.appendChild(scoreDiv);
    } else {
        resultsDiv.textContent = 'No data available for the selected date.';
    }
}

function displayMethodology(row, sleepScore, headers) {
    const methodologyDiv = document.getElementById('methodology');
    methodologyDiv.innerHTML = `
        <h2>Methodology</h2>
        <p>The sleep score is calculated using the following formula:</p>
        <p><code>Sleep Score = 55.56 + (1.54 * Hours of Sleep) + (0.59 * REM Sleep) + (-0.04 * Deep Sleep) + (0.10 * Heart Rate Below Resting)</code></p>
        <p>For the selected date, the values are:</p>
        <ul>
            <li>Hours of Sleep: ${row[headers.indexOf('HOURS OF SLEEP')]}</li>
            <li>REM Sleep: ${row[headers.indexOf('REM SLEEP')]}</li>
            <li>Deep Sleep: ${row[headers.indexOf('DEEP SLEEP')]}</li>
            <li>Heart Rate Below Resting: ${row[headers.indexOf('HEART RATE BELOW RESTING')]}</li>
        </ul>
        <p>The calculated sleep score is: ${sleepScore}</p>
    `;
}

function displayVisualization(row, sleepScore, headers) {
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = '<h2>Visualization</h2>';

    const chartContainer = document.createElement('div');
    chartContainer.id = 'chartContainer';
    chartContainer.style.height = '370px';
    chartContainer.style.width = '100%';
    visualizationDiv.appendChild(chartContainer);

    const hoursOfSleep = row[headers.indexOf('HOURS OF SLEEP')].split(':').reduce((acc, time) => (60 * acc) + +time) / 60;

    const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'light2',
        title: {
            text: 'Sleep Score Breakdown'
        },
        axisY: {
            title: 'Values'
        },
        data: [{
            type: 'column',
            dataPoints: [
                { label: 'Hours of Sleep', y: hoursOfSleep },
                { label: 'REM Sleep (%)', y: parseFloat(row[headers.indexOf('REM SLEEP')]) },
                { label: 'Deep Sleep (%)', y: parseFloat(row[headers.indexOf('DEEP SLEEP')]) },
                { label: 'Heart Rate Below Resting (%)', y: parseFloat(row[headers.indexOf('HEART RATE BELOW RESTING')]) },
                { label: 'Sleep Score', y: parseFloat(sleepScore) }
            ]
        }]
    });

    chart.render();
}
