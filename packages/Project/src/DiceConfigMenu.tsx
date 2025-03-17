import React, { useState } from 'react';
import { Spinner } from "./Spinner";
import { sendPostRequest } from './auth/sendPostRequest';

interface Dice {
    _id: string;
    name: string;
    selected: number[];
}

interface DiceConfigMenuProps {
    authToken: string,
    fetchedDices: Dice[];
    isLoading: boolean;
    diceSelection: any;
    setDiceSelect: any;
}
function DiceConfigMenu({ authToken, fetchedDices, isLoading, diceSelection, setDiceSelect }: DiceConfigMenuProps) {
    const [selectedDiceName, setSelectedDiceName] = useState<string>("");
    const [configName, setConfigName] = useState<string>("");
    const [saveError, setSaveError] = useState<string | null>(null);

    function loadDices() {
        if (!selectedDiceName) {
            setConfigName("")
            return
        }

        const selectedDice = fetchedDices.find(dice => dice.name === selectedDiceName);
        if (selectedDice) {
            console.log(selectedDice.selected)
            setDiceSelect(selectedDice.selected);
        }
        setConfigName(selectedDiceName)
    }

    async function saveConfig() {
        const selectedNumbers = diceSelection
            ? diceSelection.map((dice: any) => Number(dice.selectAmt))
            : [];

        const username = authToken ? JSON.parse(atob(authToken.split('.')[1])).username : null;

        const configData = {
            name: configName,
            selected: selectedNumbers,
            user: username || "",
        };

        console.log(JSON.stringify(configData))
        try {
            const response = await fetch("/api/dices", {
                method: "POST",
                body: JSON.stringify(configData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (!response.ok) {
                const errorMessage = response.status === 401
                    ? "Failed"
                    : "Please select dice(s) and enter a name";
                setSaveError(errorMessage);
                return;
            }

            setSaveError(null);
            window.location.reload();
        } catch (error) {
            setSaveError(""+error);
        }
    }

    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Dice Configurations</h2>

            {isLoading ? (
                <div className="flex justify-center items-center">
                    <Spinner />
                </div>
            ) : (
                <>
                    {saveError && (
                        <div className="bg-red-500 text-white p-2 rounded-lg mb-4">
                            {saveError}
                        </div>
                    )}

                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            className="p-2 border rounded-lg w-full"
                            placeholder="Enter config name"
                            value={configName}
                            onChange={(e) => { setConfigName(e.target.value) }}
                        />
                        <button onClick={saveConfig} className="bg-blue-500 text-white p-2 rounded-lg">
                            Save Config
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        <select
                            className="p-2 border rounded-lg w-full"
                            value={selectedDiceName}
                            onChange={(e) => setSelectedDiceName(e.target.value)}
                        >
                            <option className="text-black" value="">Select a Config</option>
                            {fetchedDices.map((dice: any, index: number) => (
                                <option className="text-black" key={index} value={dice.name}>
                                    {dice.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={loadDices} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                            Load
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default DiceConfigMenu;
