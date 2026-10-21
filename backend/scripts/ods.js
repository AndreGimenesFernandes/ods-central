require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function response(req, res){
    const {ods, input, previous_id} = req.body;
    
    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: input,
        ...(previous_id && {
            previous_interaction_id: previous_id
        }),
        system_instruction: `Você é um assistente educacional sobre a ODS ${ods}. Responda em português de forma clara e educativa. Responda sem textos grandes para que não fique cansativo ao usuário.`
    })

    return(res.json({resposta: interaction.output_text, id: interaction.id}))

}

async function sugest(req, res) {
    const {ods, naoFaco, jaFaco} = req.body;

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: JSON.stringify({
            jaFaco: jaFaco,
            naoFaco: naoFaco
        }),
        generation_config: {
            max_output_tokens: 75
        },
        system_instruction: `Você é um assistente especializado na ODS ${ods}, da ONU.
        Você receberá duas listas: "jaFaco" e "naoFaco". Sugira de 1 a 3 ações práticas, que não sejam as já mencionadas em ambas as listas, acessíveis e relevantes para ampliar a contribuição do usuário.
        Responda apenas com sugestões curtas, em tópicos. Não inclua introduções, contextualizações, explicações, títulos ou conclusões. Não repeta ações que o usuário já realiza. Caso vá fazer em tópicos utilize " - " para demarcá-los`
    })

    return(res.json({resposta: interaction.output_text, id: interaction.id}))
}

module.exports = {
    response,
    sugest
};