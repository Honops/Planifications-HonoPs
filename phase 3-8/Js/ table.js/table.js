const table = document.getElementById("usersTable");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function() {
  const filter = this.value.toLowerCase();
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(filter)
      ? ""
      : "none";
  });
});

document.querySelectorAll("th").forEach(header => {
  header.addEventListener("click", () => {
    const key = header.dataset.sort;
    sortTable(key);
  });
});

function sortTable(key) {
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const aText = a.querySelector(`[data-${key}]`).innerText;
    const bText = b.querySelector(`[data-${key}]`).innerText;
    return aText.localeCompare(bText);
  });

  tbody.innerHTML = "";
  rows.forEach(row => tbody.appendChild(row));
}