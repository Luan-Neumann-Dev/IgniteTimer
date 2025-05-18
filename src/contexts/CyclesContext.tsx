import { createContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { cyclesReducer, type Cycle } from "../reducers/cycles/reducer";
import { addNewCycleAction, interrupCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

//INTERFACES 
interface CyclesContextType {
    cycles: Cycle[],
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,
    amountSecondsPassed: number,
    setSecondsPassed: (seconds: number) => void,
    markCurrentCycleAsFinished: () => void,
    createNewCycle: (data: CreateCycleData) => void,
    interruptCurrentCycle: () => void
}
interface CreateCycleData {
    task: string,
    minutesAmount: number
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode
}


export function CyclesContextProvider({ 
    children
 }: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null,
    }, (initialState) => {
        const storedStateAsJSON = localStorage.getItem("@ignite-timer:cycles-state-1.0.0");

        if(storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
        }

        return initialState;
    })
    
    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }    
        
        return 0
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }, [cyclesState]);


    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle));

        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        dispatch(interrupCurrentCycleAction());
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                amountSecondsPassed,
                setSecondsPassed,
                markCurrentCycleAsFinished,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}