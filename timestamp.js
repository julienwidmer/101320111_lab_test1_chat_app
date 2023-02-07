// Make custom timestamp (required for User, Private and Group Message Models)
function getTimestamp() {
    // Get current date
    const date = new Date();
    // Format date to locale format (i.e. 02/06/2023, 10:17 p.m.)
    const formattedDate = date.toLocaleString('en-CA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Format date as timestamp (i.e. 02/06/2023, 10:17 p.m. --> 02-06-2023 10:18 PM)
    return formattedDate.replaceAll("/", "-") // replace day, month and year separators
        .replace(",", "") // remove year and time separator
        // change AM and PM format
        .replace("p.m.", "PM")
        .replace("a.m.", "AM");
};

module.exports = { getTimestamp };