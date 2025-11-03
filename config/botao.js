const firebaseConfig = {
  apiKey: "2zqhYQbVx0pimlBrCrpqopGyiw6NqVZdhqbuNVrncrA",
  authDomain: "nexcontrol.firebaseapp.com",
  databaseURL: "https://nexcontrol-default-rtdb.firebaseio.com",
  projectId: "nexcontrol",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Pega usuário logado do localStorage
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if(!usuarioLogado) {
    window.location.href = "login.html";
}

// Carrega dashboard
const relaysContainer = document.getElementById("relays-container");
const generalButtons = document.getElementById("general-buttons");

db.ref(`usuarios/${usuarioLogado.usuario}/dispositivos`).on("value", snapshot => {
    relaysContainer.innerHTML = "";
    generalButtons.innerHTML = "";

    const dados = snapshot.val() || {};

    if(Object.keys(dados).length === 0){
        relaysContainer.innerHTML = "<p>Você não tem nenhum relé conectado.</p>";
        return;
    }

    // Cria cada relé
    for(let rele in dados){
        const estado = dados[rele];
        const box = document.createElement("div");
        box.className = "relay-box";

        const status = document.createElement("div");
        status.className = "relay-status";
        status.textContent = `${rele} : ${estado ? "Ligado" : "Desligado"}`;

        const btn = document.createElement("button");
        btn.className = "btn-rele " + (estado ? "on" : "off");
        btn.textContent = estado ? "Desligar" : "Ligar";
        btn.onclick = () => {
            db.ref(`usuarios/${usuarioLogado.usuario}/dispositivos/${rele}`).set(!estado);
        };

        box.appendChild(status);
        box.appendChild(btn);
        relaysContainer.appendChild(box);
    }

    // Botões gerais
    const btnLigarTodos = document.createElement("button");
    btnLigarTodos.className = "btn-rele on";
    btnLigarTodos.textContent = "Ligar Todos";
    btnLigarTodos.onclick = () => {
        for(let rele in dados){
            db.ref(`usuarios/${usuarioLogado.usuario}/dispositivos/${rele}`).set(true);
        }
    };

    const btnDesligarTodos = document.createElement("button");
    btnDesligarTodos.className = "btn-rele off";
    btnDesligarTodos.textContent = "Desligar Todos";
    btnDesligarTodos.onclick = () => {
        for(let rele in dados){
            db.ref(`usuarios/${usuarioLogado.usuario}/dispositivos/${rele}`).set(false);
        }
    };

    generalButtons.appendChild(btnLigarTodos);
    generalButtons.appendChild(btnDesligarTodos);
});
