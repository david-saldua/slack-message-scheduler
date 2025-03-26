
# Slack Message Scheduler

A web application that allows users to schedule Slack messages to be sent after a specified delay.

## Features

- **Delay Configuration**: Set a custom delay with units (seconds, minutes, hours)
- **Message Composition**: Write your Slack message with a simple text editor
- **Webhook Integration**: Connect to any Slack channel using webhook URLs
- **Dynamic Button**: Button text updates based on the selected delay
- **Visual Feedback**: Progress bar and animations during the delay and sending process
- **Error Handling**: Proper error messages for failed requests

## Demo

The application is deployed at: [https://slack-message-scheduler.vercel.app](https://slack-message-scheduler.vercel.app)

## How It Works

1. Enter a delay amount and select a unit (seconds, minutes, hours)
2. Compose your message
3. Paste your Slack webhook URL
4. Click the "Send" button
5. The application will wait for the specified delay
6. After the delay, the message will be sent to the Slack channel

All messages are prefixed with "From David's Slack Bot:" for identification.

## Technologies Used

- **Next.js**: React framework for the frontend and API routes
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling
- **shadcn/ui**: For UI components
- **React Hook Form**: For form handling and validation
- **Zod**: For schema validation
- **Axios**: For HTTP requests

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/david-saldua/slack-message-scheduler.git
   cd slack-message-scheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Creating a Slack Webhook

To use this application, you need a Slack webhook URL:

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" and choose "From scratch"
3. Name your app and select your workspace
4. Click on "Incoming Webhooks" in the sidebar
5. Toggle "Activate Incoming Webhooks" to On
6. Click "Add New Webhook to Workspace"
7. Choose a channel and click "Allow"
8. Copy the webhook URL and use it in the application

## Deployment

The application is deployed on Vercel. To deploy your own version:

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Deploy with default settings

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Slack API](https://api.slack.com)
