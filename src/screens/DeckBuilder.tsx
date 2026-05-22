import {useAuth} from 'react-oidc-context';
import {useNavigate} from 'react-router-dom';

import {AppConfig} from '../config';
import DeckFormC, {DeckFormPayload} from '../components/directionC/DeckFormC';

export default function DeckBuilder() {
    const auth = useAuth();
    const navigate = useNavigate();

    async function uploadDeck(payload: DeckFormPayload): Promise<void> {
        const response = await fetch(AppConfig.API_URL + '/deck/upload', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + auth.user?.access_token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        navigate('/deck/' + data.id);
    }

    return (
        <DeckFormC
            mode="create"
            subtitle="craft a new deck folio"
            breadcrumbTail="New Folio"
            primaryActionLabel="Publish to Hall"
            onSave={uploadDeck}
        />
    );
}
