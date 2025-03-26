import SlackSchedulerForm from '@/components/slack-scheduler-form';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-center">Slack Message Scheduler</h1>
                <SlackSchedulerForm />
            </div>
        </main>
    );
}
