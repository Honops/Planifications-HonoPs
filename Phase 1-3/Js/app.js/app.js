const ADMIN_PASSWORD = "honops2026";

let tasks = JSON.parse(localStorage.getItem("honopsElite")) || [];

const TOTAL_DAYS = 9 * 4 * 5; // approximation 9 mois, 5j/semaine (~180 jours)

function login() {
    const input = document.getElementById("adminPassword").value;

    if (input === ADMIN_PASSWORD) {
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        updateStats();
        renderTasks();
    } else {
        alert("Mot de passe incorrect");
    }
}

function saveTasks() {
    localStorage.setItem("honopsElite", JSON.stringify(tasks));
    updateStats();
}

function updateStats() {
    const doneTasks = tasks.filter(t => t.status === "done").length;
    const percent = tasks.length === 0 ? 0 :
        Math.round((doneTasks / tasks.length) * 100);

    document.getElementById("progressPercent").innerText =
        "Progression : " + percent + "%";

    document.getElementById("progressFill").style.width = percent + "%";

    const remaining = TOTAL_DAYS - doneTasks;
    document.getElementById("daysRemaining").innerText =
        "Jours restants estimés : " + remaining;
}

function renderTasks() {

    document.getElementById("todo").innerHTML = "";
    document.getElementById("inprogress").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach((task, index) => {

        const div = document.createElement("div");
        div.className = "task";
        div.draggable = true;
        div.dataset.index = index;

        div.innerHTML = `
            <strong>Jour ${task.day}</strong><br>
            ${task.objective}
        `;

        div.addEventListener("dragstart", () => {
            div.classList.add("dragging");
        });

        div.addEventListener("dragend", () => {
            div.classList.remove("dragging");
            saveTasks();
        });

        document.getElementById(task.status).appendChild(div);
    });
}

document.querySelectorAll(".dropzone").forEach(zone => {

    zone.addEventListener("dragover", e => {
        e.preventDefault();
    });

    zone.addEventListener("drop", e => {

        const dragging = document.querySelector(".dragging");
        if (!dragging) return;

        zone.appendChild(dragging);

        const index = dragging.dataset.index;
        tasks[index].status = zone.id;

        saveTasks();
        renderTasks();
    });
});