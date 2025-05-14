FOCUSED FREELANCER UTILITY TOOL.
Manage tasks with time tracking.

Features 
1. Authentication (JWT)
Signup/Login with username + password

2. Task Manager
Create/Edit/Delete tasks (title, description, status, time estimate)
Status: To-Do / In Progress / Done
Track time spent manually (enter hours) or start a timer (bonus)

3. Invoice Generator
Select completed tasks
Generate a basic invoice view (HTML layout)
Download as PDF 
Store invoices in DB with timestamp and amount

4. Dashboard Summary
Total tasks, tasks completed
Total hours worked
Total invoice value


Collections
Users: Auth info
Tasks: Fields: title, description, status, estimatedHours, actualHours, userId
Invoices: Fields: userId, taskIds, totalAmount, createdAt



