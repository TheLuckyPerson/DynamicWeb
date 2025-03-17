import { random } from "nanoid";
import EmptyDice from "./assets/EmptyDice.svg";
import React, { useEffect, useState } from 'react';
import DiceConfigMenu from "./DiceConfigMenu";

// Delay function
function delayMs(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// RollButton component
type RollButtonProps = {
    rollAction: () => void;
};

function RollButton(props: RollButtonProps) {
    return (
        <button className="button" onClick={props.rollAction}>
            Roll All
        </button>
    );
}

// DicePickContainer component
type DicePickContainerProps = {
    roll: string;
    selected: number;
    onAdd: () => void;
    onSubtract: () => void;
};

function DicePickContainer(props: DicePickContainerProps) {
    let dicePickClass = "dicePickContainer";
    let selectTxt = "";

    if (props.selected > 0) {
        dicePickClass = "dicePickContainer selected";
        selectTxt = `${props.selected}x`;
    }

    return (
        <div className={dicePickClass}>
            <DicePickDisplay
                className="w-20 h-auto"
                faceSize={4}
                diceDisplay={props.roll}
            />
            <div className="addRemoveButtonContainer">
                <button
                    className="bg-red-500 addRemoveButton"
                    onClick={props.onSubtract}
                >
                    -
                </button>

                <button
                    className="bg-green-500 addRemoveButton"
                    onClick={props.onAdd}
                >
                    +
                </button>
            </div>

            <span className="absolute top-0 right-0 text-xl font-bold text-white">
                {selectTxt}
            </span>
        </div>
    );
}

// DicePickDisplay component
type DicePickDisplayProps = {
    min?: number;
    max?: number;
    faceSize: number;
    diceDisplay: string;
    className?: string;
};

function DicePickDisplay(props: DicePickDisplayProps) {
    let minMaxDisplay = "";

    if (props.min !== undefined && props.min >= 0) {
        minMaxDisplay = `${props.min}-${props.max}`;
    }

    return (
        <div className={`relative ${props.className} color-white`}>
            <img src={EmptyDice} alt="Dice" className="" />

            <span
                className={`absolute bottom-0 inset-0 flex text-${props.faceSize / 2}xl justify-center text-black font-bold`}
            >
                {minMaxDisplay}
            </span>

            <span
                className={`absolute inset-0 flex items-center text-${props.faceSize}xl justify-center text-black font-bold`}
            >
                {props.diceDisplay}
            </span>
        </div>
    );
}

// DiceSelectionRow component
type DiceSelectionRowProps = {
    dices: { min: number; max: number; selectAmt: number }[];
    addDiceCall: (index: number, amt: number) => void;
};

function DiceSelectionRow(props: DiceSelectionRowProps) {
    return (
        <div>
            <div className="text-center">Select Dice(s)</div>
            <div className="diceSelectionRowContainer">
                {props.dices.map((dice, index) => (
                    <DicePickContainer
                        key={index}
                        roll={`${dice.min}-${dice.max}`}
                        selected={dice.selectAmt}
                        onAdd={() => {
                            props.addDiceCall(index, 1);
                        }}
                        onSubtract={() => {
                            props.addDiceCall(index, -1);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// DiceMenu component
type DiceMenuProps = {
    authToken: string
    fetchedDices: any
    isLoading: boolean
};

type Dice = {
    min: number;
    max: number;
    selectAmt: number;
};

type RolledDice = {
    min: number;
    max: number;
    val: number;
};

function DiceMenu(props: DiceMenuProps) {
    const [diceSelection, setDiceSelection] = useState<Dice[]>([]);
    const [totalRoll, setTotalRoll] = useState<number>(0);
    const [rolledDice, setRolledDice] = useState<RolledDice[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setDiceSelection([
                    { min: 1, max: 6, selectAmt: 0 },
                    { min: 1, max: 4, selectAmt: 0 },
                    { min: 1, max: 8, selectAmt: 0 },
                    { min: 1, max: 10, selectAmt: 0 },
                    { min: 1, max: 12, selectAmt: 0 },
                    { min: 1, max: 20, selectAmt: 0 },
                ]);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    function RollDie(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function ResetDiceSelect() {
        const newSelection = [...diceSelection];
        const updatedSelection = newSelection.map((dice) => ({
            ...dice,
            selectAmt: 0,
        }));
        setDiceSelection(updatedSelection);
        setRolledDice([]);
        setTotalRoll(0);
    }

    function SetDiceFromMenu(selections: number[])
    {
        const newSelection = [...diceSelection];
        const updatedSelection = newSelection.map((dice, idx) => ({
            ...dice,
            selectAmt: selections[idx],
        }));
        setDiceSelection(updatedSelection);


        const diceDisplay: RolledDice[] = [];

        updatedSelection.forEach((dice) => {
            for (let i = 0; i < dice.selectAmt; i++) {
                let rand = RollDie(dice.min, dice.max);
                diceDisplay.push({
                    min: dice.min,
                    max: dice.max,
                    val: rand,
                });
            }
        });

        setRolledDice(diceDisplay);

        let total = 0;
        for (let i = 0; i < diceDisplay.length; i++) {
            total += diceDisplay[i].val;
        }
        setTotalRoll(total);
    }

    function AddDiceSelect(idx: number, amt: number) {
        let newAmt = diceSelection[idx].selectAmt + amt;
        let totalAmt = 0;

        if (newAmt < 0) {
            return;
        }

        const newSelection = [...diceSelection];
        newSelection[idx] = { ...newSelection[idx], selectAmt: newAmt };

        for (let i = 0; i < newSelection.length; i++) {
            totalAmt += newSelection[i].selectAmt;
        }

        if (totalAmt > 10) {
            return;
        }

        setDiceSelection(newSelection);

        const diceDisplay: RolledDice[] = [];

        newSelection.forEach((dice) => {
            for (let i = 0; i < dice.selectAmt; i++) {
                let rand = RollDie(dice.min, dice.max);
                diceDisplay.push({
                    min: dice.min,
                    max: dice.max,
                    val: rand,
                });
            }
        });

        setRolledDice(diceDisplay);

        let total = 0;
        for (let i = 0; i < diceDisplay.length; i++) {
            total += diceDisplay[i].val;
        }
        setTotalRoll(total);
    }

    function DiceAction() {
        const updatedDice = rolledDice.map((dice) => {
            return {
                ...dice,
                val:
                    Math.floor(Math.random() * (dice.max - dice.min + 1)) +
                    dice.min, // Generate a random value within the range
            };
        });

        setRolledDice(updatedDice);
        let total = 0;
        for (let i = 0; i < updatedDice.length; i++) {
            total += updatedDice[i].val;
        }
        setTotalRoll(total);
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="rolledDiceDisplay">
                {rolledDice.map((dice, index) => (
                    <DicePickDisplay
                        key={index}
                        className="w-40 h-auto"
                        faceSize={9}
                        diceDisplay={dice.val.toString()}
                        min={dice.min}
                        max={dice.max}

                    />
                ))}
            </div>

            <h1 className="font-bold">Total Roll {totalRoll}</h1>
            <RollButton rollAction={DiceAction} />
            {props.authToken ? (
                <DiceConfigMenu
                    authToken={props.authToken}
                    fetchedDices={props.fetchedDices}
                    isLoading={props.isLoading} 
                    diceSelection={diceSelection}
                    setDiceSelect={SetDiceFromMenu}
                    />
            ) :
                <h1 className="text-red-500 font-bold">
                    Please sign in to save your dice configurations.
                </h1>
            }
            <DiceSelectionRow
                dices={diceSelection}
                addDiceCall={AddDiceSelect}
            />

            <button className="button" onClick={ResetDiceSelect}>
                Reset Selection
            </button>
        </div>
    );
}

export default DiceMenu;
