import {enqueueSnackbar} from 'notistack';

export type NavTab = {
    path: string;
    label: string;
    matcher: (path: string) => boolean;
    requiresAuth?: boolean;
};

export const PRIMARY_TABS: NavTab[] = [
    {path: '/',            label: 'Guild Hall', matcher: (p) => p === '/' || p.startsWith('/deck/')},
    {path: '/deckbuilder', label: 'Forge',      matcher: (p) => p.startsWith('/deckbuilder') || p.startsWith('/deckeditor'), requiresAuth: true},
    {path: '/cards-wiki',  label: 'Library',    matcher: (p) => p.startsWith('/cards-wiki')},
    {path: '/perks',       label: 'Perks',      matcher: (p) => p.startsWith('/perks')},
    {path: '/perks/-',     label: 'Perk Builder',      matcher: (p) => p.startsWith('/perks/-')}
];

// Returns true if navigation should proceed; false if the user was blocked.
export function attemptNavigate(
    tab: NavTab,
    isAuthenticated: boolean,
    navigate: (path: string) => void,
): boolean {
    if (tab.requiresAuth && !isAuthenticated) {
        enqueueSnackbar(`You must be logged in to access ${tab.label}.`, {variant: 'warning'});
        return false;
    }
    navigate(tab.path);
    return true;
}
