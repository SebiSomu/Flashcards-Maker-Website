
export interface SM2Result {
    nextReviewDate: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
}

export const calculateSM2 = (
    quality: number, // 0-5
    prevInterval: number = 0,
    prevEaseFactor: number = 2.5,
    prevRepetitions: number = 0
): SM2Result => {
    let interval: number;
    let easeFactor: number;
    let repetitions: number;

    if (quality >= 3) {
        if (prevRepetitions === 0) {
            interval = 1;
        } else if (prevRepetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(prevInterval * prevEaseFactor);
        }
        repetitions = prevRepetitions + 1;
    } else {
        repetitions = 0;
        interval = 1;
    }

    easeFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) {
        easeFactor = 1.3;
    }

    const nextReviewDate = new Date();
    // nextReviewDate.setDate(nextReviewDate.getDate() + interval); // Original (days)
    nextReviewDate.setSeconds(nextReviewDate.getSeconds() + interval * 40); // Testing (5 second steps)

    return {
        nextReviewDate,
        interval,
        easeFactor,
        repetitions
    };
};
