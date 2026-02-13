// Filtrage par semaine
const weekFilter = document.getElementById('weekFilter');
const tableRows = document.querySelectorAll('#planningTable tbody tr');

weekFilter.addEventListener('change', () => {
    const value = weekFilter.value;
    tableRows.forEach(row => {
        if (value === 'all' || row.dataset.week === value) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Ajouter data-label pour responsive mobile
document.querySelectorAll('#planningTable tbody tr').forEach(row => {
    row.querySelectorAll('td').forEach((td, idx) => {
        const thText = document.querySelectorAll('#planningTable th')[idx].innerText;
        td.setAttribute('data-label', thText);
    });
});