-- Add steps to contest cmiri71xv0001imbktq0h8zyy
INSERT INTO contest_steps (id, type, name, "order", "isActive", "contestId", "createdAt", "updatedAt", "canRollback", "requiredSubmissions")
VALUES 
  (gen_random_uuid(), 'DRAFT', 'Draft', 1, true, 'cmiri71xv0001imbktq0h8zyy', NOW(), NOW(), false, 0),
  (gen_random_uuid(), 'REGISTRATION', 'Registration', 2, false, 'cmiri71xv0001imbktq0h8zyy', NOW(), NOW(), false, 0),
  (gen_random_uuid(), 'PRE_SELECTION', 'Pre-selection', 3, false, 'cmiri71xv0001imbktq0h8zyy', NOW(), NOW(), false, 0),
  (gen_random_uuid(), 'JURY_EVALUATION', 'Jury Evaluation', 4, false, 'cmiri71xv0001imbktq0h8zyy', NOW(), NOW(), false, 0),
  (gen_random_uuid(), 'RESULT', 'Results', 5, false, 'cmiri71xv0001imbktq0h8zyy', NOW(), NOW(), false, 0)
ON CONFLICT DO NOTHING;
