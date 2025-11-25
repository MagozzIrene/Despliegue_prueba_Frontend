const fallbackAvatar = (seed = "user") =>
    `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const getId = (v) =>
    (typeof v === "object" && v !== null ? v._id || v.id : v) ?? null;

export default function useMessageSenderData(
    msg,
    index,
    messages,
    members,
    myId,
    activeUser
) {

    const senderObj = msg.sender || {};
    const senderId = String(getId(senderObj) || "");

    const currentUserId = String(myId || activeUser?._id || "");
    const isOwnMessage = senderId === currentUserId;

    const prev = messages[index - 1];
    const prevSenderId = prev ? String(getId(prev.sender)) : null;
    const senderChanged = !prev || prevSenderId !== senderId;

    const byId = {};
    const colors = ["#8bc34a", "#03a9f4", "#e91e63", "#ff9800", "#9c27b0", "#ffc107"];

    const hash = (str) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = str.charCodeAt(i) + ((h << 5) - h);
        }
        return Math.abs(h);
    };

    for (const m of members) {
        const uid = getId(m.user_id || m.user || m);
        if (!uid) continue;

        const name =
            m?.name ||
            m?.user_id?.name ||
            m?.user?.name ||
            "Miembro";

        const avatar =
            m?.avatar ||
            m?.user_id?.avatar ||
            m?.user?.avatar ||
            null;

        const color = colors[hash(String(uid)) % colors.length];

        byId[String(uid)] = { name, avatar, color };
    }

    const member = byId[senderId] || {};
    const senderName =
        member.name ||
        senderObj.name ||
        "Miembro";

    const senderAvatar =
        member.avatar ||
        senderObj.avatar ||
        fallbackAvatar(senderName);

    const senderColor = member.color;

    return {
        senderId,
        isOwnMessage,
        senderChanged,
        senderName,
        senderAvatar,
        senderColor,
    };
}
