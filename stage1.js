const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const fetchAndSortNotifications = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWEwNTU1QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM5MjY5LCJpYXQiOjE3ODA2MzgzNjksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0MDdjZDA2OC1iOGZlLTRlOTgtYjg0Zi00ZTllOTc2ZGFmNjAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJkYXJzaSBtZWdoYW5hIHNyaSIsInN1YiI6ImE0MTZiNzY1LWNjYWItNDkzOS05ZmE3LTZlYTlhYTAzYjQ5YiJ9LCJlbWFpbCI6IjIzYnExYTA1NTVAdnZpdC5uZXQiLCJuYW1lIjoiZGFyc2kgbWVnaGFuYSBzcmkiLCJyb2xsTm8iOiIyM2JxMWEwNTU1IiwiYWNjZXNzQ29kZSI6IlFRZEVZeSIsImNsaWVudElEIjoiYTQxNmI3NjUtY2NhYi00OTM5LTlmYTctNmVhOWFhMDNiNDliIiwiY2xpZW50U2VjcmV0IjoiWUNVWFZia2VyWGFoUVFVViJ9._2XLAw4XJ0kthZ057hyRI6MJTz7tRl9UoMJegYkmNjo`
            }
        });
        const data = await response.json();

        let notifications = Array.isArray(data) ? data : (data.notifications || []);

        const priorityWeights = { "Placement": 3, "Result": 2, "Event": 1 };

        notifications.sort((a, b) => {
            const weightA = priorityWeights[a.Type] || 0;
            const weightB = priorityWeights[b.Type] || 0;
            if (weightA !== weightB) return weightB - weightA; 
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });

        const top10 = notifications.slice(0, 10);
        console.log("--- TOP 10 PRIORITY NOTIFICATIONS ---");
        console.log(JSON.stringify(top10, null, 2));

    } catch (error) {
        console.error("Error fetching notifications:", error.message);
    }
};

fetchAndSortNotifications();