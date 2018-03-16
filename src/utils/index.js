export const TIMELINE_HEIGHT = 60;

export function getTemporalPadding(trigger) {
  return trigger.duration * .5;
}

export function getTriggerOffset(trigger) {
    return 100 * trigger.timestamp;
}

export function getTriggerZoneWidth(trigger) {
    return 100 * trigger.duration;
}

export function formatFloat(f) {
    if (!f) {
      return "0.00";
    }
    return f.toFixed(2);
}

export function checkForNullValues(obj) {
    for (var key in obj) {

        if (obj[key] === null) {
            return true;
        }

        if (typeof obj[key] === "object") {
            checkForNullValues(obj[key]);
        }
    }

    return false;
}
