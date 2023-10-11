document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const enteredCertificateId = urlParams.get("certificate_id");
    const certificateIdElement = document.getElementById("certificateId");
    const verificationStatusElement = document.getElementById("verificationStatus");
    const certificateDetailsElement = document.getElementById("certificateDetails");

    // Extract the first 8 digits to determine the CSV file name
    const csvFilePrefix = enteredCertificateId.substring(0, 8);
    const csvFileName = `csv files/cert${csvFilePrefix}.csv`;

    // Fetch the CSV file
    fetch(csvFileName)
        .then(response => response.text())
        .then(csvData => {
            const rows = csvData.trim().split('\n').slice(1);
            let matchedCertificate = null;

            // Extract the last three digits as the certificate ID
            const lastThreeDigits = enteredCertificateId.slice(-3);

            // Loop through rows and find a match based on the last three digits
            for (const row of rows) {
                const [certificate_id, name, batch, event_name, issue_date] = row.split(',');
                if (lastThreeDigits === certificate_id) {
                    matchedCertificate = { certificate_id, name, batch, event_name, issue_date };
                    break;
                }
            }

            // Display the result and details
            if (matchedCertificate) {
                certificateIdElement.textContent = enteredCertificateId;
                verificationStatusElement.textContent = "Verified";
                certificateDetailsElement.textContent = `Name: ${matchedCertificate.name}, Batch: ${matchedCertificate.batch}, Event: ${matchedCertificate.event_name}, Issue Date: ${matchedCertificate.issue_date}`;
            } else {
                certificateIdElement.textContent = "No certificate ID submitted or not found.";
                verificationStatusElement.textContent = "Not Verified";
            }
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
});
