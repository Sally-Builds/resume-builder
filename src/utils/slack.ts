import axios from "axios"
import config from '../../config/default.js'

export async function sendSlackMessage(jsonData: any) {
    try {
        // Format the JSON data for better readability in Slack
        const formattedJson = JSON.stringify(jsonData, null, 2);

        // Create a code block format for Slack
        const message = {
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "New JSON Data Received:"
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "```" + formattedJson + "```"
                    }
                }
            ]
        };

        // Send the message to Slack
        const response = await axios.post(config['slackWebhookUrl'], message);

        if (response.status === 200) {
            console.log('Message sent successfully to Slack');
            return true;
        } else {
            console.error('Failed to send message to Slack');
            return false;
        }
    } catch (error: any) {
        console.error('Error sending message to Slack:', error.message);
        throw error;
    }
}

// Example usage
const webhookUrl = '';
const sampleData = {
    userId: 123,
    action: "https://www.npmjs.com/package/winston-slack-webhook-transport",
    timestamp: new Date().toISOString(),
    details: {
        productId: "xyz789",
        amount: 99.99
    }
};


interface slackData {
    client_email: string,
    employee_email: string,
    company_name: string,
    job_title: string,
    resume_url: string,
    cover_letter_url: string
}

// Send the message
export const sendToSlack = async (data: slackData) => {
    await sendSlackMessage(data)
    // .then(() => console.log('Message handling completed'))
    // .catch(err => console.error('Error in message handling:', err));
}