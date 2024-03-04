const AppConfig = {
    REALM_URL: 'https://keycloak.organizer-bot.com/realms/ATO-Deckbuilder/',
    REDIRECT_URL_PROD: '',
    REDIRECT_URL_DEV: 'http://localhost:5173/',
    API_URL: '',
    //API_URL: 'http://192.168.2.149:8080',
}

const oidcConfig = {
    authority: AppConfig.REALM_URL,
    client_id: "web-app",
    redirect_uri: AppConfig.REDIRECT_URL_DEV,
    automaticSilentRenew: true,
    onSigninCallback: () => {
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname)
    },
    // ...
};

export {AppConfig, oidcConfig}