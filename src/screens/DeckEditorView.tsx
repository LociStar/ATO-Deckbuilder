import {useEffect, useState} from 'preact/hooks';
import {useAuth} from 'react-oidc-context';
import {useNavigate} from 'react-router-dom';
import {enqueueSnackbar} from 'notistack';

import {Deck} from '../types/types';
import {AppConfig} from '../config';
import DeckFormC, {DeckFormInitial, DeckFormPayload} from '../components/directionC/DeckFormC';

export default function DeckEditor() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [initialDeck, setInitialDeck] = useState<DeckFormInitial | undefined>(undefined);
    const [isOwner, setIsOwner] = useState(true);
    const deckId = Number(window.location.href.split('/').pop());

    useEffect(() => {
        fetch(AppConfig.API_URL + '/deck/' + deckId, {method: 'GET'})
            .then((response) => response.json())
            .then((data: Deck) => {
                const owner = data.username === auth.user?.profile.preferred_username;
                setIsOwner(owner);
                if (!owner) {
                    enqueueSnackbar('You are not the owner of this deck.', {
                        variant: 'error',
                        autoHideDuration: 12000,
                    });
                }
                setInitialDeck({
                    title: data.title,
                    description: data.description,
                    characterId: data.characterId,
                    cardList: data.cardList,
                    difficulty: data.difficulty,
                    tags: data.tags,
                });
            });
    }, []);

    async function updateDeck(payload: DeckFormPayload): Promise<void> {
        await fetch(AppConfig.API_URL + '/deck/' + deckId + '/update', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + auth.user?.access_token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        navigate('/deck/' + deckId);
    }

    async function deleteDeck(): Promise<void> {
        await fetch(AppConfig.API_URL + '/deck/' + deckId + '/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + auth.user?.access_token,
            },
        });
        navigate('/');
    }

    return (
        <DeckFormC
            mode="edit"
            initialDeck={initialDeck}
            readOnly={!isOwner}
            subtitle="revising an existing folio"
            breadcrumbTail="Edit Folio"
            primaryActionLabel="Save Changes"
            onSave={updateDeck}
            onDelete={deleteDeck}
        />
    );
}
