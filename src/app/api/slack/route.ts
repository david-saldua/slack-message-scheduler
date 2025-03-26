import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * API route handler for sending messages to Slack
 *
 * This endpoint accepts POST requests with a webhook URL and message,
 * formats the message with the sender's name prefix, and forwards it
 * to the Slack API using the provided webhook URL.
 *
 * @param request - The incoming HTTP request
 * @returns A JSON response indicating success or failure
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { webhookUrl, message } = body;

        if (!webhookUrl || !message) {
            console.error('Missing required fields');
            return NextResponse.json(
                {
                    error: 'Webhook URL and message are required',
                },
                { status: 400 }
            );
        }

        const formattedMessage = `From David's Slack Bot: ${message}`;

        try {
            await axios.post(
                webhookUrl,
                {
                    text: formattedMessage,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            return NextResponse.json({
                success: true,
                message: 'Message sent successfully to Slack',
            });
        } catch (error) {
            console.error('Error from Slack API:', error);

            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });

                return NextResponse.json(
                    {
                        error: `Slack API error: ${error.response?.data || error.message}`,
                        details: error.response?.data,
                    },
                    { status: error.response?.status || 500 }
                );
            } else {
                console.error('Non-Axios error:', error);
                throw error;
            }
        }
    } catch (error) {
        console.error('Unhandled error in API route:', error);

        return NextResponse.json(
            {
                error: 'Failed to send message to Slack',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
