import {signal} from "@preact/signals";

export default function createAppState() {
    const deckId = signal(0);
    const searchText = signal('');
    const appMenuOpen = signal(false);
    return { searchText: searchText, deckId: deckId.value, appMenuOpen: appMenuOpen}
}