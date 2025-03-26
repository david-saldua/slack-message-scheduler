/**
 * Sends a message to a Slack webhook URL
 * @param webhookUrl The Slack webhook URL
 * @param message The message to send
 * @returns A promise that resolves when the message is sent
 */
export async function sendSlackMessage(webhookUrl: string, message: string): Promise<Response> {
    const formattedMessage = `From David's Slack Bot: ${message}`;

    return fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: formattedMessage,
        }),
    });
}

/**
 * Delays execution for a specified amount of time
 * @param ms The delay in milliseconds
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Converts a delay to milliseconds based on the unit
 * @param value The delay value
 * @param unit The delay unit (seconds, minutes, hours)
 * @returns The delay in milliseconds
 */
export function convertToMs(value: number, unit: 'seconds' | 'minutes' | 'hours'): number {
    switch (unit) {
        case 'seconds':
            return value * 1000;
        case 'minutes':
            return value * 60 * 1000;
        case 'hours':
            return value * 60 * 60 * 1000;
        default:
            return value * 1000;
    }
}
