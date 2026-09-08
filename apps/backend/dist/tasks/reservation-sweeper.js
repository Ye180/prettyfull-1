import { expireStaleReservations } from "../modules/inventory/service.js";
/**
 * Libération des réservations de stock expirées (§2.3).
 *
 * Sans cette tâche, un paiement abandonné immobiliserait son stock
 * indéfiniment : le rayon paraîtrait épuisé alors que les articles sont
 * disponibles. Le balayage tourne dans le processus API — suffisant pour une
 * instance unique ; si l'API venait à être répliquée, il faudrait le déplacer
 * dans un travailleur dédié pour éviter que chaque instance ne balaie en
 * parallèle.
 */
const SWEEP_INTERVAL_MS = 60_000;
let timer = null;
const sweep = async () => {
    try {
        const released = await expireStaleReservations();
        if (released > 0) {
            console.log(`[stock] ${released} réservation(s) expirée(s) libérée(s)`);
        }
    }
    catch (error) {
        // Une passe en échec ne doit pas arrêter la boucle : la suivante
        // rattrapera les réservations restées actives.
        console.error("[stock] balayage des réservations en échec", error);
    }
};
export const startReservationSweeper = () => {
    if (timer)
        return;
    // `unref` : la tâche n'empêche pas le processus de s'arrêter proprement.
    timer = setInterval(() => void sweep(), SWEEP_INTERVAL_MS);
    timer.unref();
    void sweep();
};
export const stopReservationSweeper = () => {
    if (!timer)
        return;
    clearInterval(timer);
    timer = null;
};
//# sourceMappingURL=reservation-sweeper.js.map