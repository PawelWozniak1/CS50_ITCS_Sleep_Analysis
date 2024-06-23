document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        console.log('File loaded');
        const csvData = e.target.result;
        const parsedData = Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        });
        console.log('Parsed data:', parsedData);

        sessionStorage.setItem('csvData', JSON.stringify(parsedData.data));
        console.log('Data saved to sessionStorage');

        window.location.href = 'analiza.html';
    };

    reader.readAsText(file);
});
