import {useEffect} from 'react';
import {Stack, Typography} from '@mui/material';
import {getDescription} from "../utils/utils";
import {PerkNodeProps} from "../types/types";
import {useSignal} from "@preact/signals";

interface PerkDescriptionProps {
    perkData: PerkNodeProps | null,
    isLocked: boolean,
    isSelected: boolean,
    teamSelectedCharacters?: string[],
    nodeCost?: number,
    nodeRequired?: boolean,
    notStack?: boolean,
    nodeRow?: number,
    pointsAvailable?: number,
    canModify?: boolean,
    iconLockActive?: boolean,
    perkNodeConnected?: PerkNodeProps | null,
    pointsNeeded: number,
    isDisabled: boolean
}

const PerkDescription: React.FC<PerkDescriptionProps> = ({
                                                             perkData,
                                                             isLocked = true,
                                                             isSelected,
                                                             teamSelectedCharacters,
                                                             nodeRequired = false,
                                                             pointsAvailable = 0,
                                                             canModify = true,
                                                             iconLockActive = false,
                                                             perkNodeConnected = null,
                                                             pointsNeeded,
                                                             isDisabled
                                                         }) => {
    const description = useSignal<React.ReactNode[]>();
    const nodeCost = perkData?.cost == "PerkCostBase" ? 1 : 3;
    const notStack = perkData?.noStack;
    const nodeRow = perkData!.row;


    useEffect(() => {
        const buildDescription = async () => {
            const descElements: React.ReactNode[] = [];
            let currentPerkData = perkData;

            // Handle connected perks
            if (perkData?.perksConnected && perkData.perksConnected.length !== 0) {
                if (perkData.perksConnected.length !== 0 && perkNodeConnected) {
                    currentPerkData = perkNodeConnected;
                } else {
                    const descText = await getDescription('chooseOnePerk');

                    // Sanitize the description text
                    // const sanitizedHTML = DOMPurify.sanitize(descText);

                    // Render the sanitized HTML safely
                    descElements.push(
                        <span
                            style={{ fontSize: 'large' }}
                            dangerouslySetInnerHTML={{ __html: descText }}
                        />
                    );

                    currentPerkData = null;
                    currentPerkData = null;
                }
            }

            if (currentPerkData) {
                let descText = '';
                if (currentPerkData.description) {
                    descText = currentPerkData.description;
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.maxHealth) {
                    descText = await getDescription('itemMaxHp');
                    descText = formatString(descText, currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.additionalCurrency) {
                    descText = await getDescription('itemInitialCurrencySingle');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.additionalShards) {
                    descText = await getDescription('itemInitialShardsSingle');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.speedQuantity) {
                    descText = await getDescription('itemSpeed');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.healQuantity) {
                    descText = await getDescription('itemHealDone');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.energyBegin) {
                    descText = await getDescription('itemInitialEnergy');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.auraCurseBonus) {
                    descText = await getDescription('perkAuraDescription');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.resistModified === 'All') {
                    descText = await getDescription('itemAllResistances');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (currentPerkData.damageFlatBonus === 'All') {
                    descText = await getDescription('itemAllDamages');
                    descText = formatString(capitalize(descText), currentPerkData.iconTextValue);
                    descElements.push(<span>{descText}</span>);
                } else if (
                    currentPerkData.damageFlatBonus &&
                    currentPerkData.damageFlatBonus !== 'All'
                ) {
                    const damageTypeText = await getDescription(currentPerkData.damageFlatBonus.toLowerCase());
                    descText = await getDescription('itemSingleDamage');
                    descText = formatString(
                        capitalize(descText),
                        damageTypeText,
                        currentPerkData.iconTextValue
                    );
                    descElements.push(<span>{descText}</span>);
                }

                // Handle NotStack
                if (notStack || (perkNodeConnected && perkNodeConnected.noStack)) {
                    const notStackText = await getDescription('notStack');
                    descElements.push(
                        <span style={{color: '#A0A0A0'}}>
              {notStackText}
            </span>
                    );
                }

                // Handle Cost
                const cardsCostText = await getDescription('cardsCost');
                descElements.push(
                    <span style={{color: '#A0A0A0'}}>
            [{formatString(cardsCostText, `: ${nodeCost}`)}]
          </span>
                );
                if (!isDisabled) // only show following text if the node is enabled
                    //Handle Locked and Required Nodes
                    if (isLocked) {
                        let lockedText = '';
                        if (!nodeRequired) {
                            const requiredPointsText = await getDescription('requiredPoints');
                            lockedText = formatString(requiredPointsText, pointsNeeded);
                        } else {
                            lockedText = await getDescription('previousRequired');
                        }
                        descElements.push(
                            <span style={{color: '#FF6666'}}>{lockedText}</span>
                        );
                    } else if (!isSelected) {
                        if (pointsAvailable > 0) {
                            if (pointsAvailable < nodeCost) {
                                const requiredPointsText = await getDescription('requiredPoints');
                                const pointsNeeded = nodeCost - pointsAvailable;
                                const lockedText = formatString(requiredPointsText, pointsNeeded);
                                descElements.push(
                                    <span style={{color: '#FF6666'}}>{lockedText}</span>
                                );
                            } else if (canModify && !iconLockActive) {
                                const selectText = await getDescription('rankPerkPress');
                                descElements.push(
                                    <span style={{color: '#3BA12A'}}>{selectText}</span>
                                );
                            }
                        } else {
                            const notEnoughText = await getDescription('rankPerkNotEnough');
                            descElements.push(
                                <span style={{color: '#FF6666'}}>{notEnoughText}</span>
                            );
                            // Disable component if needed
                        }
                    }
            }

            // Handle team selected characters
            if (teamSelectedCharacters && teamSelectedCharacters.length > 0) {
                const partyText = await getDescription('partyMembersWithPerk');
                descElements.push(
                    <span style={{color: '#E5A462', fontSize: '20px'}}>
            {partyText}: {teamSelectedCharacters.join(', ')}
          </span>
                );
            }
            description.value = descElements;
        };

        buildDescription();
    }, [
        perkData,
        isLocked,
        isSelected,
        teamSelectedCharacters,
        nodeCost,
        nodeRequired,
        notStack,
        nodeRow,
        pointsAvailable,
        canModify,
        iconLockActive,
        perkNodeConnected,
    ]);

    // String formatting function
    function formatString(template: string, ...args: any[]) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    }

    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <Stack>
            {description.value?.map((element) => (
                <Typography variant="body1">{element}</Typography>
            ))}
        </Stack>
    );
};

export default PerkDescription;
