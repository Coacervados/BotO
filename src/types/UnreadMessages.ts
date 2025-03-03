export type UnreadMessage = {
    id: string;
    content: string;
    from: string;
};

export interface AllUnreadMessages {
    whatsapp: UnreadMessage[];
    instagram: UnreadMessage[];
    telegram: UnreadMessage[];
}
