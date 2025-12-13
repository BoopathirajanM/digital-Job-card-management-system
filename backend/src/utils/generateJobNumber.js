/**
 * Generate unique job number
 * Format: JOB-YYYYMMDD-XXX
 * Example: JOB-20231213-001
 */
function generateJobNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    return `JOB-${year}${month}${day}-${random}`;
}

module.exports = generateJobNumber;
