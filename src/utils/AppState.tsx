import {signal} from "@preact/signals";

export default function createAppState() {
    const deckId = signal(0);
    const searchTest = signal('');
    return { searchText: searchTest, deckId: deckId.value}
}