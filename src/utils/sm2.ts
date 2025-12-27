export interface SM2Result {
    nextReviewDate: Date;
    interval: number;
    easeFactor: number;
    repetitions: number;
}

export const calculateSM2 = (
    userRating: number, // 1 (Ușor) - 5 (Greu)
    prevInterval: number = 0,
    prevEaseFactor: number = 2.5,
    prevRepetitions: number = 0
): SM2Result => {
    let interval: number;
    let easeFactor: number;
    let repetitions: number;

    // Mapăm rating-ul tău inversat la calitatea standard SM2 (0-5)
    // 1->5 (Easy), 2->4 (Good), 3->3 (Hard), 4->2 (Fail), 5->1 (Fail)
    const quality = 6 - userRating;

    if (quality >= 3) {
        // Succes: Rating 1, 2 sau 3
        if (prevRepetitions === 0) {
            interval = 1;
        } else if (prevRepetitions === 1) {
            interval = 4; // Pas realist de 4 zile
        } else {
            interval = Math.round(prevInterval * prevEaseFactor);
        }
        repetitions = prevRepetitions + 1;
    } else {
        // Eșec: Rating 4 sau 5
        repetitions = 0;
        interval = 1; // Revedem cardul mâine pentru consolidare
    }

    // Calculăm noul Ease Factor
    easeFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Safety caps pentru Ease Factor
    if (easeFactor < 1.3) easeFactor = 1.3;
    if (easeFactor > 2.8) easeFactor = 2.8;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    nextReviewDate.setHours(6, 0, 0, 0);

    return {
        nextReviewDate,
        interval,
        easeFactor,
        repetitions
    };
};