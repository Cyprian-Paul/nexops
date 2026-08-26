# NexOps Admin Guide

This guide covers the features only available to admin accounts.

## Admin dashboard

Logging in as an admin shows the full navigation, Tickets, Assets, Network, Reports,
and Users, along with summary cards for open tickets, assets tracked, and network status.

## Managing tickets

1. Go to Tickets to see every ticket in the system, not just your own
2. Click a ticket to open its detail view
3. From there, you can:
   - Change its status, open, in progress, resolved, or closed
   - Change its priority, low, medium, high, or urgent
   - Assign it to a staff member from the dropdown
   - Edit its category if the AI suggestion needs correcting
4. Click Save Changes to apply your updates

## Managing assets

1. Go to Assets to see every tracked device
2. Use the form at the top to add a new asset, giving it a name, type, and
   an optional assignment to a user
3. In the asset table, use the Assigned To dropdown in any row to reassign
   that device without opening a separate page

## Network monitoring

1. Go to Network to see every monitored device and its last known status
2. Use the form to add a new device by name, IP address, and type
3. Click Check Now to run a live check against every device, this updates
   each device's status immediately based on whether it responds

Note: some hosting environments restrict ping traffic. If devices always show
offline after deployment, this is the first thing to check.

## Reports and analytics

The Reports page shows:

- Tickets grouped by status
- Tickets grouped by priority
- Top 10 ticket categories
- Average resolution time, in hours, calculated from resolved and closed tickets
- Ticket volume for the last 7 days

Use this page to spot patterns, for example a spike in a specific category might
mean a recurring issue worth investigating at its root cause.

## Managing users

User accounts, roles, departments, and ranks are set at registration. Currently,
changing another user's role or rank requires a direct database update. A dedicated
admin interface for this can be added as a future improvement.

## Security notes

- Every admin only backend endpoint checks the logged in user's role before returning
  any data, so even a direct request to an admin endpoint fails for a regular user
- Passwords are never stored in plain text, they are hashed before being saved
- Password reset links expire after 1 hour and can only be used once
