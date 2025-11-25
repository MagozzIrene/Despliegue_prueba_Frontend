import  { useState } from "react";

const MessageForm = ({ onSend }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
        onSend(text);
        setText("");
        }
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Escribí un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        <button className="btn-primary" type="submit">Enviar</button>
        </form>
    );
};

export default MessageForm;
