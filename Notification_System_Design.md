# Stage 1: Notification System Design

## Sorting Approach
To determine the Priority Inbox, the notifications are sorted using a two-factor approach:
1. **Weight-based Sorting:** Each notification type is assigned a numerical weight (`Placement` = 3, `Result` = 2, `Event` = 1). The algorithm first compares these weights to push higher-priority categories to the top.
2. **Recency-based Tiebreaker:** If two notifications share the same category, the algorithm parses their `Timestamp` strings into Date objects and sorts them in descending order (newest first).

## Maintaining the Top 10 Efficiently
Currently, a standard array sort is used (`O(N log N)`). As new notifications stream in constantly, repeatedly sorting the entire database is inefficient. 

**Optimized Approach for Production:**
To maintain the top 10 efficiently, we should implement a **Min-Heap (Priority Queue)** of size `K` (where `K=10`). 
* As new notifications arrive, we compare the incoming notification's priority score against the root of the Min-Heap (the lowest priority item currently in the top 10).
* If the new notification is strictly greater than the root, we extract the root and insert the new notification.
* **Complexity:** This reduces the time complexity of processing a new notification to `O(log K)`. Since `K` is a constant (10), insertion becomes effectively `O(1)`, making it highly scalable for massive real-time data streams.