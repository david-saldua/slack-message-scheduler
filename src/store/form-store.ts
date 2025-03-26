import { create } from 'zustand';

export type DelayUnit = 'seconds' | 'minutes' | 'hours';

interface FormState {
    delay: number;
    delayUnit: DelayUnit;
    message: string;
    webhookUrl: string;
    isSubmitting: boolean;
    isSuccess: boolean;
    error: string | null;

    // Actions
    setDelay: (delay: number) => void;
    setDelayUnit: (unit: DelayUnit) => void;
    setMessage: (message: string) => void;
    setWebhookUrl: (url: string) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setIsSuccess: (isSuccess: boolean) => void;
    setError: (error: string | null) => void;
    resetForm: () => void;
}

export const useFormStore = create<FormState>(set => ({
    delay: 0,
    delayUnit: 'seconds',
    message: '',
    webhookUrl: '',
    isSubmitting: false,
    isSuccess: false,
    error: null,

    // Actions
    setDelay: delay => set({ delay }),
    setDelayUnit: delayUnit => set({ delayUnit }),
    setMessage: message => set({ message }),
    setWebhookUrl: webhookUrl => set({ webhookUrl }),
    setIsSubmitting: isSubmitting => set({ isSubmitting }),
    setIsSuccess: isSuccess => set({ isSuccess }),
    setError: error => set({ error }),
    resetForm: () =>
        set({
            delay: 0,
            delayUnit: 'seconds',
            message: '',
            webhookUrl: '',
            isSubmitting: false,
            isSuccess: false,
            error: null,
        }),
}));
