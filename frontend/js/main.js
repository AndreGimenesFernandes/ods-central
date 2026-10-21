document.addEventListener("click", (ev) => {
    const button = ev.target.closest("button");

    if(button){
        window.location.href = `/ods?id=${button.id}&func=info`
    }
});

if(!localStorage.getItem('logado')){
    window.location.href = "/login"
}

const searchBar = document.getElementById('searchBar')

const valuesIDs = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
};

const valuesNames = {
    1: 'Erradicação da pobreza',
    2: 'Fome zero e agricultura sustentável',
    3: 'Saúde e bem-estar',
    4: 'Educação de qualidade',
    5: 'Igualdade de gênero',
    6: 'Água potável e saneamento',
    7: 'Energia limpa e acessível',
    8: 'Trabalho decente e crescimento econômico',
    9: 'Indústria, inovação e infraestrutura',
    10: 'Redução das desigualdades',
    11: 'Cidades e comunidades sustentáveis',
    12: 'Consumo e produção responsáveis',
    13: 'Ação contra a mudança global do clima',
    14: 'Vida na água',
    15: 'Vida terrestre',
    16: 'Paz, justiça e instituições eficazes',
    17: 'Parcerias e meios de implementação'
};

searchBar.addEventListener('input', (ev) => {
    const txt = searchBar.value;
    for(const id in valuesIDs){
        const div = document.getElementById(valuesIDs[id]);
        if(!valuesNames[id].toLowerCase().includes(txt.toLowerCase()) &&  !id.includes(txt) && div){
            div.style.display = 'none';
        }else if(div){
            div.style.display = '';
        };
    };
});