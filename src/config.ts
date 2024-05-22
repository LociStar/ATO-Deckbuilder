const AppConfig = {
    REALM_URL: 'https://account.ato-deckbuilder.com/realms/ATO-Deckbuilder/',
    REDIRECT_URL_PROD: 'https://ato-deckbuilder.com/',
    REDIRECT_URL_DEV: 'http://localhost:5173/',
    API_URL: 'http://192.168.2.149:8080',
    //API_URL: 'https://api.ato-deckbuilder.com',
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

export {AppConfig, oidcConfig};