import { random } from "nanoid";
import EmptyDice from "./assets/EmptyDice.svg";
import React, { useEffect, useState } from 'react';
import { Spinner } from "./Spinner";

/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function RollButton(props) {
    return (
        <button
            className="button"
            onClick={props.rollAction}>
            Roll All
        </button>
    )
}

function DicePickContainer(props) {
    let color = "white"
    let selectTxt = ""

    if (props.selected > 0) {
        color = "blue"
        selectTxt = `${props.selected}x`
    }

    return (
        <div className={`bg-${color}-100 dicePickContainer`}>
            <DicePickDisplay
                className="w-20 h-auto bg-white-600"
                faceSize="4"
                diceDisplay={props.roll}
            />

            {/* Add Remove Buttons */}
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

            <span className="absolute top-0 right-0 text-xl font-bold text-black">
                {selectTxt}
            </span>
        </div>


    );
}

function DiceSelectionRow(props) {
    return (
        <div>
            <div className="text-center">
                Select Dice(s)
            </div>
            <div className="diceSelectionRowContainer">
                {props.dices.map((dice, index) => (
                    <DicePickContainer
                        key={index}
                        roll={`${dice.min}-${dice.max}`}
                        selected={dice.selectAmt}
                        onAdd={() => {
                            props.addDiceCall(index, 1)
                        }}
                        onSubtract={() => {
                            props.addDiceCall(index, -1)
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function DicePickDisplay(props) {
    let minMaxDisplay = ""

    if (props.min >= 0) {
        minMaxDisplay = `${props.min}-${props.max}`
    }

    return (
        <div className={`relative ${props.className}`}>
            <img src={EmptyDice} alt="Empty Dice" className="" />

            <span className={`absolute bottom-0 inset-0 flex text-${props.faceSize / 2}xl justify-center text-black font-bold`}>
                {minMaxDisplay}
            </span>

            <span className={`absolute inset-0 flex items-center text-${props.faceSize}xl justify-center text-black font-bold`}>
                {props.diceDisplay}
            </span>
        </div>
    );
}

function DiceMenu(props) {
    const [isLoading, setLoading] = React.useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                await delayMs(1000)
                // const response = await fetch(url)
                // const data = await response.json();
                setDiceSelection([
                    {
                        min: 1,
                        max: 6,
                        selectAmt: 0
                    },
                    {
                        min: 1,
                        max: 4,
                        selectAmt: 0
                    },
                    {
                        min: 1,
                        max: 8,
                        selectAmt: 0
                    },
                    {
                        min: 1,
                        max: 10,
                        selectAmt: 0
                    },
                    {
                        min: 1,
                        max: 12,
                        selectAmt: 0
                    },
                    {
                        min: 1,
                        max: 20,
                        selectAmt: 0
                    },
                ])
            } catch (error) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const [diceSelection, setDiceSelection] = React.useState(
        []
    );

    const [totalRoll, setTotalRoll] = React.useState(0);

    function RollDie(min, max) {
        let rand = Math.floor(Math.random() * (max - min + 1)) + min
        return rand
    }

    function ResetDiceSelect() {
        const newSelection = [...diceSelection];

        const updatedSelection = newSelection.map(dice => ({
            ...dice,
            selectAmt: 0
        }));
        setDiceSelection(updatedSelection);
        setRolledDice([]);
        setTotalRoll(0)
    }

    // called when user wants to add or sub another dice
    function AddDiceSelect(idx, amt) {
        let newAmt = diceSelection[idx].selectAmt + amt;
        let totalAmt = 0

        if (newAmt < 0) {
            return
        }

        const newSelection = [...diceSelection];

        newSelection[idx] = {
            ...newSelection[idx],
            selectAmt: newAmt
        };

        for (let i = 0; i < newSelection.length; i++) {
            totalAmt += newSelection[i].selectAmt
        }

        if (totalAmt > 10) {
            return
        }

        setDiceSelection(newSelection);

        const diceDisplay = [];

        newSelection.forEach(dice => {
            for (let i = 0; i < dice.selectAmt; i++) {
                let rand = RollDie(dice.min, dice.max)
                diceDisplay.push({
                    min: dice.min,
                    max: dice.max,
                    val: rand
                }); // Add dice object to the array
            }
        });
        console.log(diceDisplay)

        setRolledDice(diceDisplay);

        let total = 0
        for (let i = 0; i < diceDisplay.length; i++) {
            total += diceDisplay[i].val
        }
        setTotalRoll(total)
    }

    const [rolledDice, setRolledDice] = React.useState(
        [

        ]
    );

    function DiceAction() {
        const updatedDice = rolledDice.map(dice => {
            return {
                ...dice,
                val: Math.floor(Math.random() * (dice.max - dice.min + 1)) + dice.min // Generate a random value within the range
            };
        });

        setRolledDice(updatedDice);
        let total = 0
        for (let i = 0; i < updatedDice.length; i++) {
            total += updatedDice[i].val
        }
        setTotalRoll(total)
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Rolled Dice Display */}
            <div className="rolledDiceDisplay">
                {rolledDice.map((dice, index) => {
                    return (
                        <DicePickDisplay
                            key={index}
                            className="w-40 h-auto"
                            faceSize="9"
                            diceDisplay={dice.val}
                            min={dice.min}
                            max={dice.max}
                        />
                    );
                })}
            </div>
            
            <RollButton rollAction={DiceAction} />
            <h1 className="font-bold">Total Roll {totalRoll}</h1>
            {isLoading ?
                <Spinner /> :
                <DiceSelectionRow
                    dices={diceSelection}
                    addDiceCall={AddDiceSelect}>
                </DiceSelectionRow>
            }
            <button
                className="button"
                onClick={ResetDiceSelect}>
                Reset Selection
            </button>
        </div>
    );
}

export default DiceMenu;
