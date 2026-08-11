import { useEffect, useRef, useState } from "react";

// Render's free-tier backend spins down after inactivity, so the first
// request after a while can take 30-60s+ to wake it up. A static spinner
// makes that feel broken. This hook turns elapsed loading time into a
// staged message + a fake-but-reassuring progress percentage, so the
// user understands "this is normal, just wait" instead of thinking the
// button is stuck.
const STAGES = [
    { after: 0, message: "Signing in...", progress: 15 },
    { after: 2500, message: "Connecting to server...", progress: 30 },
    { after: 8000, message: "Waking up the server...", progress: 55 },
    { after: 18000, message: "Almost there, hang tight...", progress: 80 },
    { after: 35000, message: "Still going, this can take up to a minute...", progress: 92 },
];

export function useLoadingStages(loading, { baseMessage = "Sign In", startMessage } = {}) {
    const [stageIndex, setStageIndex] = useState(0);
    const timeoutsRef = useRef([]);

    useEffect(() => {
        // clear any pending timers first
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        if (!loading) {
            setStageIndex(0);
            return;
        }

        STAGES.forEach((stage, i) => {
            if (i === 0) return; // stage 0 applies immediately
            const id = setTimeout(() => setStageIndex(i), stage.after);
            timeoutsRef.current.push(id);
        });

        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
        };
    }, [loading]);

    const stage = STAGES[stageIndex];
    const message = stageIndex === 0 && startMessage ? startMessage : stage.message;

    return {
        message: loading ? message : baseMessage,
        progress: loading ? stage.progress : 0,
    };
}
