export interface SM2Result {
    nextReviewDate: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
}

export const calculateSM2 = (
    userRating: number,
    prevInterval: number = 0,
    prevEaseFactor: number = 2.5,
    prevRepetitions: number = 0
): SM2Result => {
    let interval: number;
    let easeFactor: number;
    let repetitions: number;
    const quality = 6 - userRating;

    if (quality >= 3) {
        if (prevRepetitions === 0) {
            interval = 1;
        } else if (prevRepetitions === 1) {
            interval = 4;
        } else {
            interval = Math.round(prevInterval * prevEaseFactor);
        }
        repetitions = prevRepetitions + 1;
    } else {
        repetitions = 0;
        interval = 1;
    }

    easeFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
    if (easeFactor > 2.8) easeFactor = 2.8;

    const nextReviewDate = new Date();
    // Cap interval to 100 years (36500 days) to prevent database/parsing overflow
    let safeInterval = interval < 1 ? 1 : interval;
    if (safeInterval > 36500) safeInterval = 36500;

    nextReviewDate.setDate(nextReviewDate.getDate() + safeInterval);
    nextReviewDate.setHours(6, 0, 0, 0);

    return {
        nextReviewDate,
        interval: safeInterval,
        easeFactor,
        repetitions
    };
};