import InstagramService from "../services/InstagramService";

(async () => {
    await InstagramService.login();
    console.log("Instagram iniciado");

    setInterval(async () => {
        try {
            await InstagramService.inbox();
        } catch (err) {
            console.log("Erro: ", err);
        }
    }, 60000);
});