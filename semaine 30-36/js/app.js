// ======= Configuration Firebase =======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";

// Remplace par ta config Firebase
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_PROJECT.firebaseapp.com",
  projectId: "TON_PROJECT",
  storageBucket: "TON_PROJECT.appspot.com",
  messagingSenderId: "TON_SENDER_ID",
  appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const planCollection = collection(db, "planning");

let planData = [];

// ======= Rendu Tableau =======
function renderTable(data){
  const tbody = document.querySelector('#planningTable tbody');
  tbody.innerHTML = '';
  data.forEach((item)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td contenteditable class="editable" data-key="semaine" data-id="${item.id}">${item.semaine}</td>
      <td contenteditable class="editable" data-key="jour" data-id="${item.id}">${item.jour}</td>
      <td contenteditable class="editable" data-key="outil" data-id="${item.id}">${item.outil}</td>
      <td contenteditable class="editable" data-key="fichier" data-id="${item.id}">${item.fichier}</td>
      <td contenteditable class="editable" data-key="code" data-id="${item.id}">${item.code}</td>
      <td contenteditable class="editable" data-key="objectif" data-id="${item.id}">${item.objectif}</td>
      <td contenteditable class="editable" data-key="resultat" data-id="${item.id}">${item.resultat}</td>
      <td class="status ${item.statut}" onclick="toggleStatus('${item.id}', '${item.statut}')">${item.statut}</td>
      <td><button onclick="deleteRow('${item.id}')">Supprimer</button></td>
    `;
    tbody.appendChild(tr);
  });
  populateFilter();
}

// ======= Ajouter Ligne =======
async function addRow(){
  const newRow = { semaine:'', jour:'', outil:'', fichier:'', code:'', objectif:'', resultat:'', statut:'Gratuit' };
  const docRef = await addDoc(planCollection, newRow);
  newRow.id = docRef.id;
  planData.push(newRow);
  renderTable(planData);
}
window.addRow = addRow;

// ======= Supprimer Ligne =======
async function deleteRow(id){
  if(confirm('Supprimer cette ligne ?')){
    await deleteDoc(doc(db,'planning',id));
  }
}
window.deleteRow = deleteRow;

// ======= Toggle Statut =======
async function toggleStatus(id, current){
  const newStatut = current==='Premium' ? 'Gratuit' : 'Premium';
  await updateDoc(doc(db,'planning',id), { statut: newStatut });
}
window.toggleStatus = toggleStatus;

// ======= Édition directe =======
document.addEventListener('input', async (e)=>{
  if(e.target.classList.contains('editable')){
    const key = e.target.dataset.key;
    const id = e.target.dataset.id;
    const value = e.target.innerText;
    await updateDoc(doc(db,'planning',id), { [key]: value });
  }
});

// ======= Recherche & Filtrage =======
document.getElementById('searchInput').addEventListener('input', function(){
  const value = this.value.toLowerCase();
  renderTable(planData.filter(item=>Object.values(item).some(v=>String(v).toLowerCase().includes(value))));
});

const filterSelect = document.getElementById('filterSemaine');

function populateFilter(){
  const semaines = [...new Set(planData.map(p=>p.semaine))].sort((a,b)=>a-b);
  filterSelect.innerHTML='<option value="">Toutes les semaines</option>';
  semaines.forEach(s=>{
    const opt = document.createElement('option');
    opt.value=s;
    opt.textContent=`Semaine ${s}`;
    filterSelect.appendChild(opt);
  });
}

filterSelect.addEventListener('change', function(){
  const value=this.value;
  if(value==='') renderTable(planData);
  else renderTable(planData.filter(p=>p.semaine==value));
});

function resetFilters(){
  document.getElementById('searchInput').value='';
  filterSelect.value='';
  renderTable(planData);
}
window.resetFilters = resetFilters;

// ======= Synchronisation temps réel =======
onSnapshot(planCollection, (snapshot)=>{
  planData = snapshot.docs.map(doc=>({ id: doc.id, ...doc.data() }));
  renderTable(planData);
});