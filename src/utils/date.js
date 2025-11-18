const DIA = 24 * 60 * 60 * 1000;
const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function hhmm(d) {
    return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function formatLastSeenCompact(ts) {
    if (!ts) return "últ. vez —";
    const d = new Date(ts);
    const now = new Date();

    const dm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const nm = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((nm - dm) / DIA);

    if (diffDays === 0) return `últ. vez hoy ${hhmm(d)}`;
    if (diffDays === 1) return `últ. vez ayer ${hhmm(d)}`;
    if (diffDays < 7) return `últ. vez ${dias[d.getDay()]} ${hhmm(d)}`;

    if (d.getFullYear() === now.getFullYear()) {
        return `últ. vez ${d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}`;
    }
    return `últ. vez ${d.toLocaleDateString("es-AR")}`;
}
