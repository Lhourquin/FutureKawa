// Intervalle de rafraîchissement des données temps réel (en ms).
// L'ESP32 publie toutes les 10 s → mettre une valeur proche pour un rendu quasi-temps réel.
export const REALTIME_INTERVAL_MS = 10_000;

// Alertes : moins urgentes, on peut espacer davantage
export const ALERTS_INTERVAL_MS = REALTIME_INTERVAL_MS * 3;
