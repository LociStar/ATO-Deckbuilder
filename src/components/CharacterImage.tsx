import {AppConfig} from "../config.ts";
import {Container} from "@mui/material";
import {alpha} from "@mui/material/styles";

export default function CharacterImage({characterId}: { characterId: string }) {

    return (
        <Container>
            <img
                src={AppConfig.API_URL + `/character/image/${characterId}`}
                alt={`Character ${characterId}`}
                style={{
                    borderRadius: 5,
                    backdropFilter: 'blur(50px)',
                    backgroundColor: alpha('#000000', 0.5)
                }}
            />
        </Container>
    );
}