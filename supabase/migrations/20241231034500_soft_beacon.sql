/*
  # Insert sample data

  1. Sample Data
    - Users (developers and regular users)
    - Applications
    - Contents (issues and knowledge)
    - Comments
    - Likes
*/

-- Insert sample users
INSERT INTO users (id, name, email, department, role) VALUES
  ('d7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 'John Developer', 'john@example.com', 'Engineering', 'developer'),
  ('c9f3f4d7-8c7b-4d8a-9e5f-7f2c1d3b4a5e', 'Alice Developer', 'alice@example.com', 'Engineering', 'developer'),
  ('e8d9c6b5-4a3f-2e1d-9c8b-7f6e5d4c3b2a', 'Bob User', 'bob@example.com', 'Sales', 'user'),
  ('f7e6d5c4-3b2a-1c9d-8e7f-6a5b4c3d2e1f', 'Carol User', 'carol@example.com', 'Marketing', 'user');

-- Insert sample applications
INSERT INTO applications (id, name, description, status, developer_id, user_count) VALUES
  ('a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d', 'Sales Dashboard', 'Real-time sales analytics platform', 'released', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 150),
  ('b2c3d4e5-f6a7-5b4c-9d8e-0f1a2b3c4d5e', 'Marketing Hub', 'Campaign management system', 'development', 'c9f3f4d7-8c7b-4d8a-9e5f-7f2c1d3b4a5e', 75),
  ('c3d4e5f6-a7b8-6c5d-0e9f-1a2b3c4d5e6f', 'HR Portal', 'Employee management system', 'released', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 200);

-- Insert sample contents (issues)
INSERT INTO contents (type, title, body, status, priority, author_id, application_id) VALUES
  ('issue', 'Dashboard Loading Speed', 'Dashboard takes too long to load with large datasets', 'open', 'high', 'e8d9c6b5-4a3f-2e1d-9c8b-7f6e5d4c3b2a', 'a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d'),
  ('issue', 'Campaign Creation Error', 'Error when creating new campaigns with special characters', 'in_progress', 'medium', 'f7e6d5c4-3b2a-1c9d-8e7f-6a5b4c3d2e1f', 'b2c3d4e5-f6a7-5b4c-9d8e-0f1a2b3c4d5e'),
  ('issue', 'Employee Data Import Failed', 'Bulk import of employee data failing', 'resolved', 'high', 'e8d9c6b5-4a3f-2e1d-9c8b-7f6e5d4c3b2a', 'c3d4e5f6-a7b8-6c5d-0e9f-1a2b3c4d5e6f');

-- Insert sample contents (knowledge)
INSERT INTO contents (type, title, body, category, author_id, application_id) VALUES
  ('knowledge', 'Sales Dashboard User Guide', 'Complete guide for using the sales dashboard effectively', 'guide', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 'a1b2c3d4-e5f6-4a3b-8c7d-9e0f1a2b3c4d'),
  ('knowledge', 'Marketing Campaign Best Practices', 'Tips and tricks for creating successful marketing campaigns', 'best-practices', 'c9f3f4d7-8c7b-4d8a-9e5f-7f2c1d3b4a5e', 'b2c3d4e5-f6a7-5b4c-9d8e-0f1a2b3c4d5e'),
  ('knowledge', 'HR Portal FAQ', 'Frequently asked questions about the HR portal', 'faq', 'd7b5492f-0d13-4851-9bcd-9c96c9c21b2c', 'c3d4e5f6-a7b8-6c5d-0e9f-1a2b3c4d5e6f');