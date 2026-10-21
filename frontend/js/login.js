const ContinueButton = document.getElementById("continue");

if(localStorage.getItem("logado") === "true"){
    window.location.href = "/"
}
const ODS_logo = document.getElementById("odsLogo");
const email = document.getElementById("email");
const senha = document.getElementById("password");
const incorrect = document.getElementById('incorrect');

incorrect.style.display = 'none'

async function login(){
    
    const resposta = await fetch("/login", {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value.toLowerCase(),
            senha: senha.value,
        })
    });

    
    const result = await resposta.json();

    if(result === true){
        localStorage.setItem("logado", "true");
        ODS_logo.style.transform = "scale(3)";
        

        setTimeout(() => {
            window.location.href = "/"
        }, 2000);
    }else{
        incorrect.style.display = '';
        setTimeout(() => {
            incorrect.style.display = 'none'
        }, 2500);
    }
}

ContinueButton.addEventListener("click", async () => {
    login();

});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        login();
    }
});
