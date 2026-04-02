-- Enable Supabase Realtime for notifications table
-- Required for live notification updates in the UI
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
