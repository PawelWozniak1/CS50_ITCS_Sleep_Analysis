document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(sessionStorage.getItem('csvData'));
    if (data) {
        populateDateSelect(data);
    }

    document.getElementById('dateForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedDate = document.getElementById('dateSelect').value;
        if (data && selectedDate) {
            const analysisResults = analyzeData(data, selectedDate);
            displayAnalysisResults(analysisResults);
            displayCalculationExplanation(analysisResults);
            displayAdviceBasedOnScore(analysisResults);
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
    return rows.length > 0 ? rows[0] : null;
}

function displayAnalysisResults(analysisResults) {
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = '';
    if (analysisResults) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headers = Object.keys(analysisResults);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = analysisResults[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
        table.appendChild(thead);
        table.appendChild(tbody);
        resultsDiv.appendChild(table);
    } else {
        resultsDiv.textContent = 'No data available for the selected date.';
    }
}

function displayCalculationExplanation(analysisResults) {
    const explanationDiv = document.getElementById('calculationExplanation');
    const hoursOfSleep = parseFloat(analysisResults['HOURS OF SLEEP'].split(':').reduce((h, m) => parseFloat(h) + parseFloat(m)/60, 0));
    const remSleepPercentage = parseFloat(analysisResults['REM SLEEP']);
    const deepSleepPercentage = parseFloat(analysisResults['DEEP SLEEP']);
    const heartRateBelowResting = parseFloat(analysisResults['HEART RATE BELOW RESTING']);
    const sleepScore = (hoursOfSleep * 0.6) + (remSleepPercentage * 0.2) + (deepSleepPercentage * 0.15) + (heartRateBelowResting * 0.05);
    
    explanationDiv.innerHTML = `
        <h2>Explanation of Sleep Score Calculation</h2>
        <p>The sleep score is calculated using the following formula:</p>
        <ul>
            <li>Hours of Sleep: ${hoursOfSleep.toFixed(2)} hours</li>
            <li>REM Sleep: ${remSleepPercentage}%</li>
            <li>Deep Sleep: ${deepSleepPercentage}%</li>
            <li>Heart Rate Below Resting: ${heartRateBelowResting}%</li>
        </ul>
        <p>The weights for each component are:</p>
        <ul>
            <li>Hours of Sleep: 0.6</li>
            <li>REM Sleep: 0.2</li>
            <li>Deep Sleep: 0.15</li>
            <li>Heart Rate Below Resting: 0.05</li>
        </ul>
        <p>The formula is: <strong>Sleep Score = (Hours of Sleep * 0.6) + (REM Sleep * 0.2) + (Deep Sleep * 0.15) + (Heart Rate Below Resting * 0.05)</strong></p>
        <p><strong>Calculated Sleep Score: ${sleepScore.toFixed(2)}</strong></p>
    `;
}

function displayAdviceBasedOnScore(analysisResults) {
    const adviceDiv = document.getElementById('adviceText');
    const hoursOfSleep = parseFloat(analysisResults['HOURS OF SLEEP'].split(':').reduce((h, m) => parseFloat(h) + parseFloat(m)/60, 0));
    const remSleepPercentage = parseFloat(analysisResults['REM SLEEP']);
    const deepSleepPercentage = parseFloat(analysisResults['DEEP SLEEP']);
    const heartRateBelowResting = parseFloat(analysisResults['HEART RATE BELOW RESTING']);
    const sleepScore = (hoursOfSleep * 0.6) + (remSleepPercentage * 0.2) + (deepSleepPercentage * 0.15) + (heartRateBelowResting * 0.05);
    
    let advice;
    if (sleepScore >= 85) {
        advice = "Your sleep score is excellent. Keep maintaining your current sleep habits.";
    } else if (sleepScore >= 70) {
        advice = "Your sleep score is good. Try to improve the duration and quality of your sleep for even better results.";
    } else {
        advice = "Your sleep score is below average. Consider reviewing your sleep habits and make necessary adjustments to improve your sleep quality.";
    }

    adviceDiv.textContent = advice;
}
