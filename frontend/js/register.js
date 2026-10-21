const ContinueButton = document.getElementById("continue");

if(localStorage.getItem("logado") === "true"){
    window.location.href = "/"
}
const ODS_logo = document.getElementById("odsLogo");
const email = document.getElementById("email");
const senha = document.getElementById("password");

async function register(){
    
    const resposta = await fetch("/register", {
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
    }
}

ContinueButton.addEventListener("click", async () => {
    register();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        register();
    }
});
