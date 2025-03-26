'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { formSchema, FormValues } from '@/lib/schema';
import { sendSlackMessage, delay, convertToMs, cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

export default function SlackSchedulerForm() {
    const [status, setStatus] = useState<'idle' | 'pending' | 'delaying' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            delay: 5,
            delayUnit: 'seconds',
            message: '',
            webhookUrl: '',
        },
        mode: 'onChange',
    });

    const delayValue = form.watch('delay') || 0;
    const delayUnit = form.watch('delayUnit') || 'seconds';
    const message = form.watch('message');
    const webhookUrl = form.watch('webhookUrl');

    useEffect(() => {
        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [progressInterval]);

    useEffect(() => {
        const isDelayValid = delayValue > 0;
        const isDelayUnitValid = Boolean(delayUnit);
        const isMessageValid = typeof message === 'string' && message.trim() !== '';
        const isWebhookUrlValid =
            typeof webhookUrl === 'string' && webhookUrl.trim() !== '' && webhookUrl.includes('hooks.slack.com');

        const hasRequiredFields = isDelayValid && isDelayUnitValid && isMessageValid && isWebhookUrlValid;

        setIsFormValid(hasRequiredFields);
    }, [delayValue, delayUnit, message, webhookUrl]);

    const getButtonText = () => {
        if (status === 'delaying')
            return `Sending in ${Math.ceil(((100 - progress) * delayValue) / 100)} ${delayUnit}...`;
        if (status === 'sending') return 'Sending to Slack...';
        if (status === 'pending') return 'Preparing...';

        if (!delayValue) return 'Send';
        const unitText = delayValue === 1 ? delayUnit.slice(0, -1) : delayUnit;
        return `Send in ${delayValue} ${unitText}`;
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setStatus('pending');
            setErrorMessage(null);
            setProgress(0);

            const delayMs = convertToMs(values.delay, values.delayUnit);

            setStatus('delaying');

            const intervalTime = 50;
            const steps = delayMs / intervalTime;
            const increment = 100 / steps;

            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + increment;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return newProgress;
                });
            }, intervalTime);

            if (progressInterval) {
                clearInterval(progressInterval);
            }
            setProgressInterval(interval);

            await delay(delayMs);

            if (progressInterval) {
                clearInterval(progressInterval);
                setProgressInterval(null);
            }

            setProgress(100);
            setStatus('sending');

            try {
                await sendSlackMessage(values.webhookUrl, values.message);

                setStatus('success');
                form.reset({
                    delay: 5,
                    delayUnit: 'seconds',
                    message: '',
                    webhookUrl: '',
                });

                setTimeout(() => {
                    setStatus('idle');
                }, 3000);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.error || 'Failed to send message to Slack');
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');

            if (progressInterval) {
                clearInterval(progressInterval);
                setProgressInterval(null);
            }
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="delay"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Delay</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter delay"
                                                {...field}
                                                onChange={e => {
                                                    const value = e.target.valueAsNumber;
                                                    field.onChange(isNaN(value) ? 0 : value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="delayUnit"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Unit</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="seconds">Seconds</SelectItem>
                                                <SelectItem value="minutes">Minutes</SelectItem>
                                                <SelectItem value="hours">Hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slack Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter your message" className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slack Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://hooks.slack.com/services/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            {(status === 'delaying' || status === 'sending') && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full relative"
                                disabled={['pending', 'delaying', 'sending'].includes(status) || !isFormValid}
                            >
                                {['pending', 'delaying', 'sending'].includes(status) && (
                                    <span className="absolute left-4">
                                        <Spinner size="sm" />
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        'transition-all duration-200',
                                        ['pending', 'delaying', 'sending'].includes(status) ? 'ml-4' : ''
                                    )}
                                >
                                    {getButtonText()}
                                </span>
                            </Button>

                            {status === 'success' && (
                                <p className="text-center text-green-600 text-sm animate-fade-in">
                                    Message sent successfully!
                                </p>
                            )}

                            {status === 'error' && (
                                <p className="text-center text-red-600 text-sm animate-fade-in">
                                    {errorMessage || 'Failed to send message'}
                                </p>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
