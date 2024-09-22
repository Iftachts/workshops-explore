let workshops = [];

function loadWorkshops() {
    console.log('Loading workshops...');
    Papa.parse('kenes2024_without_keywords.csv', {
        download: true,
        header: true,
        complete: function(results) {
            console.log('CSV parsing complete. Rows:', results.data.length);
            workshops = results.data;
            populateFilters();
            displayWorkshops(workshops);
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });
}

function populateFilters() {
    const facilitators = new Set();
    const audiences = new Set();
    const types = new Set();

    workshops.forEach(workshop => {
        if (workshop['שם המנחה']) facilitators.add(workshop['שם המנחה']);
        if (workshop['קהל יעד']) audiences.add(workshop['קהל יעד']);
        if (workshop['אופי הסדנה']) types.add(workshop['אופי הסדנה']);
    });

    populateSelect('facilitator', facilitators);
    populateSelect('audience', audiences);
    populateSelect('type', types);
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">הכל</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

function displayWorkshops(workshopsToDisplay) {
    const workshopsContainer = document.getElementById('workshops');
    workshopsContainer.innerHTML = '';

    workshopsToDisplay.forEach(workshop => {
        const workshopCard = document.createElement('div');
        workshopCard.className = 'workshop-card';
        workshopCard.innerHTML = `
            <h2>${workshop['שם הסדנה'] || 'ללא כותרת'}</h2>
            <p><strong>מנחה:</strong> ${workshop['שם המנחה'] || 'לא צוין'}</p>
            <p><strong>קהל יעד:</strong> ${workshop['קהל יעד'] || 'לא צוין'}</p>
            <p><strong>סוג הסדנה:</strong> ${workshop['אופי הסדנה'] || 'לא צוין'}</p>
            <p><strong>תיאור:</strong> ${workshop['תקציר'] || 'אין תיאור זמין'}</p>
        `;
        workshopsContainer.appendChild(workshopCard);
    });
}

function filterWorkshops() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const facilitator = document.getElementById('facilitator').value;
    const audience = document.getElementById('audience').value;
    const type = document.getElementById('type').value;

    const filteredWorkshops = workshops.filter(workshop => {
        return (
            (workshop['שם הסדנה'] && workshop['שם הסדנה'].toLowerCase().includes(searchTerm)) &&
            (!facilitator || workshop['שם המנחה'] === facilitator) &&
            (!audience || workshop['קהל יעד'] === audience) &&
            (!type || workshop['אופי הסדנה'] === type)
        );
    });

    displayWorkshops(filteredWorkshops);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded. Loading workshops...');
    loadWorkshops();
    document.getElementById('search').addEventListener('input', filterWorkshops);
    document.getElementById('facilitator').addEventListener('change', filterWorkshops);
    document.getElementById('audience').addEventListener('change', filterWorkshops);
    document.getElementById('type').addEventListener('change', filterWorkshops);
});

console.log('app.js loaded');
