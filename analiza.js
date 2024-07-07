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
            displayAnalysisResults(analysisResults); // Display data for the selected date
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
    if (rows.length > 0) {
        const row = rows[0];
        const hoursOfSleep = row[3].split(':').reduce((h, m) => parseFloat(h) + parseFloat(m) / 60);
        const remSleepPercentage = parseFloat(row[4].replace('%', ''));
        const deepSleepPercentage = parseFloat(row[5].replace('%', ''));
        const heartRateBelowResting = parseFloat(row[6].replace('%', ''));
        
        // Regression formula to calculate sleep score
        const sleepScore = 55.56016261 + 
                           (1.539953811 * hoursOfSleep) + 
                           (0.588553687 * remSleepPercentage) + 
                           (-0.03744907 * deepSleepPercentage) + 
                           (0.101970572 * heartRateBelowResting);
        return { headers: data.headers, row, sleepScore };
    }
    return null;
}

function displayAnalysisResults(analysisResults) {
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = '';
    if (analysisResults && analysisResults.row) {
        const { headers, row } = analysisResults;
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
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
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
    if (!analysisResults) {
        return;
    }

    const explanationDiv = document.getElementById('calculationExplanation');
    const { row, sleepScore } = analysisResults;
    const hoursOfSleep = row[3].split(':').reduce((h, m) => parseFloat(h) + parseFloat(m) / 60).toFixed(2);
    const remSleepPercentage = parseFloat(row[4].replace('%', '')).toFixed(2);
    const deepSleepPercentage = parseFloat(row[5].replace('%', '')).toFixed(2);
    const heartRateBelowResting = parseFloat(row[6].replace('%', '')).toFixed(2);

    explanationDiv.innerHTML = `
        <h2>Explanation of Sleep Score Calculation</h2>
        <p>The sleep score is calculated using the following formula:</p>
        <p><strong>Sleep Score = 55.56016261 + (1.539953811 × Hours of Sleep) + (0.588553687 × REM Sleep) + (-0.03744907 × Deep Sleep) + (0.101970572 × Heart Rate Below Resting)</strong></p>
        <p>For the selected date, the values are:</p>
        <ul>
            <li>Hours of Sleep: ${hoursOfSleep} hours</li>
            <li>REM Sleep: ${remSleepPercentage}%</li>
            <li>Deep Sleep: ${deepSleepPercentage}%</li>
            <li>Heart Rate Below Resting: ${heartRateBelowResting}%</li>
        </ul>
        <p>Therefore, the sleep score is calculated as follows:</p>
        <p><strong>Sleep Score = 55.56016261 + (1.539953811 × ${hoursOfSleep}) + (0.588553687 × ${remSleepPercentage}) + (-0.03744907 × ${deepSleepPercentage}) + (0.101970572 × ${heartRateBelowResting})</strong></p>
        <p><strong>Calculated Sleep Score: ${sleepScore.toFixed(2)}</strong></p>
    `;
    explanationDiv.style.display = 'block';
}

function displayAdviceBasedOnScore(analysisResults) {
    if (!analysisResults) {
        return;
    }

    const adviceDiv = document.getElementById('adviceBasedOnScore');
    const { sleepScore } = analysisResults;
    
    let advice;
    let imagePath;
    if (sleepScore >= 85) {
        advice = "Your sleep score is excellent. Keep maintaining your current sleep habits.";
        imagePath = 'images/excellent_sleep.jpg';
    } else if (sleepScore >= 70) {
        advice = "Your sleep score is good. Try to improve the duration and quality of your sleep for even better results.";
        imagePath = 'images/good_sleep.jpg';
    } else {
        advice = "Your sleep score is below average. Consider reviewing your sleep habits and make necessary adjustments to improve your sleep quality.";
        imagePath = 'images/below_average_sleep.jpg';
    }

    document.getElementById('adviceText').textContent = advice;
    document.getElementById('adviceImage').src = imagePath;
    adviceDiv.style.display = 'block';
}