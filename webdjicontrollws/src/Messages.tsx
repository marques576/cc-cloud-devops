import React, { FC } from "react";

type MessagesProps = {
    messages: string[];
    listRef: React.RefObject<HTMLUListElement>;
};

const messages: FC<MessagesProps> = ({ messages, listRef }) => {
    return (
        <div>
            <ul className="border" style={{ height: '90vh', overflowY: 'scroll' }} ref={listRef}>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
};

export default messages;