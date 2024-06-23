document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const data = JSON.parse(sessionStorage.getItem('csvData'));
    console.log('Loaded data:', data);
    if (data) {
        populateDateSelect(data);
    }

    document.getElementById('dateForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form submitted');
        const selectedDate = document.getElementById('dateSelect').value;
        console.log('Selected date:', selectedDate);
        if (data && selectedDate) {
            const analysisResults = analyzeData(data, selectedDate);
            console.log('Analysis results:', analysisResults);
            if (analysisResults.length > 0) {
                const sleepScore = calculateSleepScore(analysisResults[0]);
                console.log('Calculated sleep score:', sleepScore);
                displayAnalysisResults(analysisResults, sleepScore);
                displayMethodology(analysisResults[0], sleepScore);
                displayVisualization(analysisResults[0], sleepScore);
            } else {
                console.error('No analysis results for selected date');
            }
        } else {
            console.error('No data or date selected');
        }
    });
});

function populateDateSelect(data) {
    console.log('Populating date select');
    const dateSelect = document.getElementById('dateSelect');
    const dateIndex = data.headers.indexOf('DATE');
    console.log('Date index:', dateIndex);
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
    console.log('Analyzing data for date:', selectedDate);
    const dateIndex = data.headers.indexOf('DATE');
    const rows = data.rows.filter(row => row[dateIndex] === selectedDate);
    console.log('Filtered rows:', rows);
    return rows;
}

function calculateSleepScore(row) {
    console.log('Calculating sleep score for row:', row);
    const sleepScoreCoefficients = {
        intercept: 55.56016261,
        hoursOfSleep: 1.539953811,
        remSleep: 0.588553687,
        deepSleep: -0.03744907,
        heartRateBelowResting: 0.101970572
    };

    const hoursOfSleep = row['HOURS OF SLEEP'].split(':').reduce((acc, time) => (60 * acc) + +time) / 60;
    const remSleep = parseFloat(row['REM SLEEP']);
    const deepSleep = parseFloat(row['DEEP SLEEP']);
    const heartRateBelowResting = parseFloat(row['HEART RATE BELOW RESTING']);

    const sleepScore = sleepScoreCoefficients.intercept +
        (sleepScoreCoefficients.hoursOfSleep * hoursOfSleep) +
        (sleepScoreCoefficients.remSleep * remSleep) +
        (sleepScoreCoefficients.deepSleep * deepSleep) +
        (sleepScoreCoefficients.heartRateBelowResting * heartRateBelowResting);

    console.log('Calculated sleep score:', sleepScore);
    return sleepScore.toFixed(2);
}

function displayAnalysisResults(analysisResults, sleepScore) {
    console.log('Displaying analysis results');
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = '';
    if (analysisResults.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headers = Object.keys(analysisResults[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        analysisResults.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
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

function displayMethodology(row, sleepScore) {
    console.log('Displaying methodology');
    const methodologyDiv = document.getElementById('methodology');
    methodologyDiv.innerHTML = `
        <h2>Methodology</h2>
        <p>The sleep score is calculated using the following formula:</p>
        <p><code>Sleep Score = 55.56 + (1.54 * Hours of Sleep) + (0.59 * REM Sleep) + (-0.04 * Deep Sleep) + (0.10 * Heart Rate Below Resting)</code></p>
        <p>For the selected date, the values are:</p>
        <ul>
            <li>Hours of Sleep: ${row['HOURS OF SLEEP']}</li>
            <li>REM Sleep: ${row['REM SLEEP']}</li>
            <li>Deep Sleep: ${row['DEEP SLEEP']}</li>
            <li>Heart Rate Below Resting: ${row['HEART RATE BELOW RESTING']}</li>
        </ul>
        <p>The calculated sleep score is: ${sleepScore}</p>
    `;
}

function displayVisualization(row, sleepScore) {
    console.log('Displaying visualization');
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = '<h2>Visualization</h2>';

    const chartContainer = document.createElement('div');
    chartContainer.id = 'chartContainer';
    chartContainer.style.height = '370px';
    chartContainer.style.width = '100%';
    visualizationDiv.appendChild(chartContainer);

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
                { label: 'Hours of Sleep', y: parseFloat(row['HOURS OF SLEEP'].split(':').reduce((acc, time) => (60 * acc) + +time) / 60).toFixed(2) },
                { label: 'REM Sleep (%)', y: parseFloat(row['REM SLEEP']) },
                { label: 'Deep Sleep (%)', y: parseFloat(row['DEEP SLEEP']) },
                { label: 'Heart Rate Below Resting (%)', y: parseFloat(row['HEART RATE BELOW RESTING']) },
                { label: 'Sleep Score', y: parseFloat(sleepScore) }
            ]
        }]
    });

    chart.render();
}
