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
            displayExplanation(analysisResults);
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
        const sleepScore = calculateSleepScore(row);
        return { sleepScore, row };
    }
    return null;
}

function calculateSleepScore(row) {
    const hoursOfSleep = convertTimeToHours(row[3]);
    const remSleepPercentage = parseFloat(row[4]);
    const deepSleepPercentage = parseFloat(row[5]);
    const heartRateBelowResting = parseFloat(row[6]);

    const sleepScore = (hoursOfSleep * 0.6) +
                       (remSleepPercentage * 0.2) +
                       (deepSleepPercentage * 0.15) +
                       (heartRateBelowResting * 0.05);

    return sleepScore.toFixed(2);
}

function convertTimeToHours(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + (minutes / 60);
}

function displayAnalysisResults(analysisResults) {
    const resultsDiv = document.getElementById('analysisResults');
    resultsDiv.innerHTML = '';
    if (analysisResults && analysisResults.row.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headers = ['DATE', 'SLEEP SCORE', 'HOURS OF SLEEP', 'REM SLEEP', 'DEEP SLEEP', 'HEART RATE BELOW RESTING', 'SLEEP TIME'];
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        const row = analysisResults.row;
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

function displayExplanation(analysisResults) {
    if (!analysisResults) {
        return;
    }
    const explanationDiv = document.getElementById('calculationExplanation');
    const row = analysisResults.row;

    document.getElementById('hoursOfSleep').textContent = convertTimeToHours(row[3]);
    document.getElementById('remSleepPercentage').textContent = row[4];
    document.getElementById('deepSleepPercentage').textContent = row[5];
    document.getElementById('heartRateBelowResting').textContent = row[6];

    explanationDiv.style.display = 'block';
}

function displayAdviceBasedOnScore(analysisResults) {
    if (!analysisResults) {
        return;
    }

    const adviceDiv = document.getElementById('adviceBasedOnScore');
    const sleepScore = analysisResults.sleepScore;

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
