const params = new URLSearchParams(window.location.search);
const id = params.get("id");
let func = params.get("func");

const infosBtn = document.getElementById('infosBtn');
const checklistBtn = document.getElementById('checklistBtn');
const aiChatBtn = document.getElementById('aiChatBtn');
const scrollable = document.getElementById('scroll');

const infoDiv = document.getElementById('infoDiv');
const chatDiv = document.getElementById('chatDiv');
const checklistDiv = document.getElementById('checklistDiv');

const sendDiv = document.getElementById('sendDiv');
const sendBtn = document.getElementById('sendBtn');
const grafico = document.getElementById('graphic');
const resumo = document.getElementById('resumo');
const resumeAmount = document.getElementById('resumeAmount');
const resumeSubtitle = document.getElementById('resumeSubtitle');

const summary = document.getElementById('summary');

const back = document.getElementById('back');

const jaSim = document.getElementById('jaSim');
const aindaNao = document.getElementById('aindaNao');
const semMarcar = document.getElementById('semMarcar');
const backButton = document.getElementById('back')

let clickable = false;

const resumeTitle = document.getElementById('resumeTitle');
let checksList = [];

let jaFacoList = [];
let naoFacoList = [];

const jaFacoDiv = document.getElementById('jaFacoDiv');
const naoFacoDiv = document.getElementById('naoFacoDiv');
const sugestionsDiv = document.getElementById('sugestionsDiv')

const checks = document.getElementsByClassName('check');

for (let i = 0; i < Math.min(checks.length, 4); i++) {
    let n;

    do {
        n = Atitudes[id - 1].acoes[
            Math.floor(Math.random() * Atitudes[id - 1].acoes.length)
        ];
    } while (checksList.includes(n));

    checksList.push(n);
    checks[i].querySelector('p').textContent = n;
}

let resumoActive = false
let active = true

back.addEventListener('click', () => {
    jaFacoDiv.querySelectorAll('.itemResumo').forEach(p => p.remove());
    naoFacoDiv.querySelectorAll('.itemResumo').forEach(p => p.remove());
    sugestionsDiv.querySelector('p').textContent = "Carregando..."
    clickable = false;
    resumoActive = false;
    jaFaco = 0;
    naoFaco = 0;
    jaFacoList = [];
    naoFacoList = [];

    document.querySelectorAll('.check').forEach(check => {
        check.dataset.resposta = '';

        check.querySelectorAll('.btn').forEach(btn => {
            btn.style.backgroundColor = '';
            btn.style.color = '#1D1B20';
        });

        check.style.borderColor = '';
    });
    update('checklist');
})

let jaFaco = 0;
let naoFaco = 0;
let timersGrafico = [];

const msgBotOriginal = document.getElementById('original')

if(!localStorage.getItem('logado')){
    window.location.href = "/login"
}

msgBotOriginal.querySelector('p').textContent = `Oi! Eu sou o assistente do ODS ${id}. Pode me perguntar sobre as metas, os dados, as dificuldades para aplicar ou como contribuir no dia a dia.`
if(localStorage.getItem(`previous_id_ods${id}`)){
    localStorage.removeItem(`previous_id_ods${id}`)
}

const elements = [
    infosBtn, checklistBtn, aiChatBtn
]

const input = document.getElementById("messageTextBox");

function rolar(elemento) {
    return elemento.scrollHeight - elemento.scrollTop - elemento.clientHeight < 100;
}

summary.addEventListener('click', () => {
    if(clickable === false) return;
    resumoActive = true;
    update('resumo')
});

document.addEventListener('click', (ev) => {
    const bttn = ev.target.closest('.check .btn');

    if (!bttn) return;

    const check = bttn.closest('.check');
    const txt = bttn.closest('div').querySelector('p');
    const jaFazia = check.dataset.resposta === 'jaFaco';
    const novaResposta = bttn.classList.contains('jaFaco')
        ? 'jaFaco'
        : 'naoFaco';

    if (check.dataset.resposta === novaResposta) return;

    if (jaFazia) {
        jaFaco--;
        jaFacoList = jaFacoList.filter(item => item !== txt.textContent);
    } else if (check.dataset.resposta === 'naoFaco') {
        naoFaco--;
        naoFacoList = naoFacoList.filter(item => item !== txt.textContent);
    }

    if (novaResposta === 'jaFaco') {
        jaFaco++;
        jaFacoList.push(txt.textContent);
    } else {
        naoFaco++;
        naoFacoList.push(txt.textContent)
    }

    check.dataset.resposta = novaResposta;

    check.querySelectorAll('.btn').forEach((btn) => {
        btn.style.backgroundColor = '';
        btn.style.color = '#1D1B20';
    });

    bttn.style.backgroundColor =
        novaResposta === 'jaFaco' ? '#1E7A46' : '#1D1B20';

    bttn.style.color = '#FFFFFF';
    check.style.borderColor =
        novaResposta === 'jaFaco' ? '#1E7A46' : '#1D1B20';

    update('checklist');
});



async function mensagem(texto){
    const roll1 = rolar(scrollable)
    const div = document.createElement('div');
    let previous = undefined;
    div.classList.add('mensagemUser');
    div.innerHTML = marked.parse(texto);
    chatDiv.append(div);

    if (roll1) {
        scrollable.scrollTo({
            top: scrollable.scrollHeight,
            behavior: "smooth"
        });
    }

    if(localStorage.getItem(`previous_id_ods${id}`)){
        previous = localStorage.getItem(`previous_id_ods${id}`)
    }

    active = false
    sendBtn.style.opacity = '.5'

    const response = await fetch("/ods", {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ods: id,
            input: texto,
            previous_id: previous
        })
    });

    const data = await response.json();
    const novaMsg = msgBotOriginal.cloneNode(true);
    novaMsg.removeAttribute("id");
    novaMsg.querySelector('p').remove()
    novaMsg.querySelector('div').innerHTML = marked.parse(data.resposta);
    chatDiv.appendChild(novaMsg)

    if (roll1) {
        scrollable.scrollTo({
            top: scrollable.scrollHeight,
            behavior: "smooth"
        });
    }

    localStorage.setItem(`previous_id_ods${id}`, data.id);

    active = true
    sendBtn.style.opacity = '1'
}

sendBtn.addEventListener('click', (ev) => {
    if(input.value && active === true){
        mensagem(input.value);
        input.value = "";
    }
})

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (input.value.trim() && active === true) {
            mensagem(input.value);
            input.value = "";
        }
    }
});

function ativar(elemento){
    for (const element of elements) {
        if (element === elemento) {
            element.style.backgroundColor = "#1d1b20";
            element.style.color = "#E2E2EA";
        } else {
            element.style.backgroundColor = "#E2E2EA";
            element.style.color = "#1d1b20";
        }
    }
}

document.addEventListener("click", (ev) => {
    const button = ev.target.closest("button");

    if (!button) return;

    switch (button) {
        case infosBtn:
            func = "info";
            break;

        case checklistBtn:
            func = "checklist";
            break;

        case aiChatBtn:
            func = "chat";
            break;

        default:
            return;
    }

    history.pushState({}, "", `/ods?id=${id}&func=${func}`);
    update(func)
});

async function update(mode){
    document.title = `ODS ${id} - ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    document.getElementById('title').textContent = `ODS ${id} - ${ODS[id].nome}`
    if(mode !== 'checklist'){
        clickable = false
    }
    if(mode === 'info'){
        document.title = `ODS ${id} - Informações`

        document.getElementById('objetivo').textContent = ODS[id].objetivo
        document.getElementById('problema').textContent = ODS[id].principal_problema
        document.getElementById('importancia').textContent = ODS[id].importancia

        const dificuldades = document.getElementsByClassName('dificuldades')
        for(let i = 0; i < dificuldades.length; i++){
            if(dificuldades[i]){
                dificuldades[i].textContent = ` - ${ODS[id].dificuldades_para_aplicar[i]}`
            }
        }

        const contribuir = document.getElementsByClassName('contribuir')
        for(let i = 0; i < contribuir.length; i++){
            if(contribuir[i]){
                contribuir[i].textContent = ` - ${ODS[id].como_contribuir[i]}`
            }
        }
    }
    if(mode === 'checklist'){
        if(jaSim){
            jaSim.textContent = jaFaco
        }
        if(aindaNao){
            aindaNao.textContent = naoFaco
        }
        if(semMarcar){
            semMarcar.textContent = 4 - (jaFaco + naoFaco)
        }
        if(resumeAmount){
            resumeAmount.textContent = `${jaFaco}/4`
        }
        if(jaFaco + naoFaco >= 4){
            clickable = true
        }
        if(clickable === true){
            summary.style.backgroundColor = "#1D1B20"
            summary.style.cursor = 'pointer'
            summary.disabled = false;
        }else{
            summary.style.backgroundColor = "#7a7a7a"
            summary.style.cursor = 'default'
            summary.disabled = true;
        }
        if(grafico){
            timersGrafico.forEach(timer => clearTimeout(timer));
            timersGrafico = [];
            grafico.style.background = `conic-gradient(
                #1E7A46 0% 0%,
                #1D1B20 0% 0%,
                #DCDCE3 0%% 100%
                )`;
            for(let i = 0; i < 101; i++){
                const x = i / 100;

                const y = x - Math.sin(2 * Math.PI * x) / (2 * Math.PI);

                const timer = setTimeout(() => {
                    const verde = jaFaco * 25 * y;
                    const total = (jaFaco + naoFaco) * 25 * y;

                    grafico.style.background = `conic-gradient(
                        #1E7A46 0% ${verde}%,
                        #1D1B20 ${verde}% ${total}%,
                        #DCDCE3 ${total}% 100%
                    )`;
                }, 1000 * x);
                timersGrafico.push(timer);
            }
        }

    }

    if(mode != 'info'){
        infoDiv.style.display = 'none';
    }
    if(mode != 'checklist'){
        checklistDiv.style.display = 'none';
    }
    if(mode != 'chat'){
        chatDiv.style.display = 'none';
        sendDiv.style.display = 'none';
    }
    if(mode != 'resumo'){
        resumo.style.display = 'none';
        backButton.style.display = 'none';
    }


    switch(mode){
        case "info":
            ativar(infosBtn)
            infoDiv.style.display = ''
            break;
        case "checklist":
            if(resumoActive === true){
                update('resumo')
            }else{
                checklistDiv.style.display = '';
            }
            ativar(checklistBtn);
            break;
        case "chat":
            ativar(aiChatBtn);
            chatDiv.style.display = '';
            sendDiv.style.display = '';
            break;
        case "resumo":
            resumo.style.display = '';
            backButton.style.display = '';
            break;
        default:
            history.replaceState({}, "", `/ods?id=${id}&func=info`);
            ativar(infosBtn);
            break;
    }

        if(mode === 'resumo'){
        resumeTitle.textContent = `Seu resumo no ODS ${id}`
        resumeSubtitle.textContent = `Você já faz ${jaFaco} mas ainda não faz ${naoFaco} das 4 ações. Veja o que dá para começar agora.`

        jaFacoDiv.querySelector('div').innerHTML = jaFaco
        naoFacoDiv.querySelector('div').innerHTML = naoFaco

        for (let item of jaFacoList) {
            const p = document.createElement('p');
            p.classList.add('itemResumo');
            p.textContent = `- ${item}`;
            jaFacoDiv.append(p);
        }

        for (let item of naoFacoList) {
            const p = document.createElement('p');
            p.classList.add('itemResumo');
            p.textContent = `- ${item}`;
            naoFacoDiv.append(p);
        }

        const response = await fetch("/sugestions", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ods: id,
                naoFaco: naoFacoList,
                jaFaco: jaFacoList
            })
        });

        const data = await response.json();

        console.log(data.resposta);
        const ptxt = sugestionsDiv.querySelector('p');
        ptxt.innerHTML = data.resposta.replace(/ - /g, '<br><br>- ').replace(/^<br><br>/, '');

        
    }

}

update(func)


