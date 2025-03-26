import { z } from 'zod';

export const formSchema = z.object({
    delay: z.coerce
        .number()
        .min(1, { message: 'Delay must be at least 1' })
        .max(1000, { message: 'Delay must be less than 1000' }),
    delayUnit: z.enum(['seconds', 'minutes', 'hours'], {
        required_error: 'Please select a delay unit',
    }),
    message: z
        .string()
        .min(1, { message: 'Message is required' })
        .max(2000, { message: 'Message must be less than 2000 characters' }),
    webhookUrl: z
        .string()
        .url({ message: 'Please enter a valid URL' })
        .includes('hooks.slack.com', { message: 'Please enter a valid Slack webhook URL' }),
});

export type FormValues = z.infer<typeof formSchema>;
