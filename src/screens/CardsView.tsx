import CardsLoader from "../components/CardsLoader";

export default function CardsView() {
    return (
        <CardsLoader fixed_buttons={false}
                     charClass={''}
                     secondaryCharClass={''}
                     onCardClick={() => {
                     }}/>
    );
}