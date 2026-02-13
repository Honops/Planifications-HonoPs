const users = [
  { name: "Al Honoreble", email: "al@honops.com", objective: "Création", country: "Sénégal", premium: "Oui" },
  { name: "Maria", email: "maria@test.com", objective: "Voyage", country: "Espagne", premium: "Non" },
  { name: "John", email: "john@test.com", objective: "Communauté", country: "USA", premium: "Oui" }
];

const tbody = document.querySelector("#usersTable tbody");

function loadUsers() {
  tbody.innerHTML = "";
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-name>${user.name}</td>
      <td data-email>${user.email}</td>
      <td data-objective>${user.objective}</td>
      <td data-country>${user.country}</td>
      <td data-premium>${user.premium}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("totalUsers").innerText = users.length;
  document.getElementById("premiumUsers").innerText =
    users.filter(u => u.premium === "Oui").length;
  document.getElementById("countries").innerText =
    [...new Set(users.map(u => u.country))].length;
}

loadUsers();
