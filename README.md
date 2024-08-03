# Sleep Analysis Web Application
#### Video Demo:  <URL HERE>
#### Description: The Sleep Analysis Web Application is a tool designed to help users analyze their sleep data, calculate a sleep score, and receive personalized advice based on their sleep quality. This project utilizes HTML, CSS, and JavaScript to provide a user-friendly interface for analyzing sleep patterns and improving sleep health.

## Project Overview

Welcome to the **Sleep Analysis Web Application**, a tool designed to help users analyze their sleep data, calculate a sleep score, and receive personalized advice based on their sleep quality. This project is built using HTML, CSS, and JavaScript, and it leverages the power of web technologies to provide a user-friendly interface for sleep data analysis.

## Features

- **Data Upload**: Users can upload their sleep data in CSV format.
- **Date Selection**: Users can select a specific date to analyze their sleep data.
- **Sleep Score Calculation**: The application calculates a sleep score based on hours of sleep, REM sleep percentage, deep sleep percentage, and heart rate below resting.
- **Personalized Advice**: Based on the calculated sleep score, users receive personalized advice to improve their sleep quality.

## Files and Their Functionality

### 1. `index.html`
The main entry point of the application. It contains the HTML structure for the home page, where users can upload their sleep data.

### 2. `analiza.html`
This file contains the HTML structure for the analysis page. It includes elements such as the date selection form, tables for displaying sleep data, and sections for explaining the sleep score calculation and providing advice.

### 3. `data.html`
The data page provides users with a link to download sample sleep data if they do not have their own data to upload. This helps users to experience the functionality of the application even without a personal sleep tracker.

### 4. `styles.css`
This file contains the CSS styles that define the look and feel of the application. It ensures a consistent and visually appealing design across all pages.

### 5. `home.js`
Handles the functionality for the home page, including reading the uploaded CSV file, parsing the data, and storing it in the session storage.

### 6. `analiza.js`
Contains the logic for the analysis page. It includes functions for populating the date selection dropdown, analyzing the sleep data for the selected date, displaying the analysis results, explaining the sleep score calculation, and providing personalized advice.

## Design Choices and Rationale

#### User-Friendly Interface
The application is designed with a focus on simplicity and ease of use. The navigation menu allows users to quickly switch between uploading data, analyzing data, and accessing sample data. The forms and tables are straightforward, making it easy for users to interact with the application.

#### Data Storage
Session storage is used to store the uploaded CSV data. This choice ensures that the data persists across different pages within the same session, providing a seamless user experience. However, the data is cleared once the session ends, aligning with the requirement to start with a clean slate each time the application is reopened.

#### Sleep Score Calculation
The sleep score is calculated using a regression formula based on hours of sleep, REM sleep percentage, deep sleep percentage, and heart rate below resting. This approach provides a quantifiable measure of sleep quality, allowing for consistent analysis and comparison.

#### Personalized Advice
The application provides personalized advice based on the calculated sleep score. This feature enhances the practical value of the application, offering users actionable insights to improve their sleep habits.

## Detailed Code Explanation

### `analiza.js`

- **Event Listener Initialization**: When the DOM content is loaded, the script initializes by checking if there is data in the session storage and populates the date selection dropdown.
- **Form Submission Handling**: Upon form submission, the selected date is retrieved, and the corresponding sleep data is analyzed. The results are then displayed, along with an explanation of the sleep score calculation and personalized advice.
- **Data Analysis Function**: The `analyzeData` function filters the data for the selected date and calculates the sleep score using a regression formula.
- **Results Display Function**: The `displayAnalysisResults` function creates a table to display the sleep data for the selected date.
- **Calculation Explanation Function**: The `displayCalculationExplanation` function explains how the sleep score is calculated, showing the formula and the computed values.
- **Advice Display Function**: The `displayAdviceBasedOnScore` function provides personalized advice based on the calculated sleep score, enhancing the user's understanding of their sleep quality.

## Challenges and Considerations

One of the main challenges was ensuring that the data uploaded by the user is accurately parsed and stored. Handling different date formats and ensuring consistent data presentation required careful attention to detail. Additionally, providing meaningful and actionable advice based on the sleep score necessitated a thoughtful approach to defining the thresholds for different advice categories.

## Conclusion

The **Sleep Analysis Web Application** is a comprehensive tool designed to help users understand and improve their sleep quality. By leveraging web technologies and providing a user-friendly interface, the application offers valuable insights into sleep patterns and provides actionable advice for better sleep health. We hope this tool will be beneficial to anyone looking to improve their sleep quality and overall well-being.