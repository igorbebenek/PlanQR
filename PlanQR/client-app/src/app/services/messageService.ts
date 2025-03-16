const siteUrl = import.meta.env.VITE_SITE_URL;
const API_URL = siteUrl + ":5000/api/messages";

export const fetchMessages = async (lessonId: number) => {
    try {
        const response = await fetch(`${API_URL}/${lessonId}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        return await response.json();
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

export const createMessage = async (message: any) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });
        if (!response.ok) throw new Error("Failed to send message");
        return await response.json();
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

export const deleteMessage = async (id: number) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete message');
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};