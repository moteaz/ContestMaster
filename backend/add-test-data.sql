-- Add jury member to contest (replace USER_ID with actual jury user ID)
INSERT INTO jury_members (id, "userId", "contestId", expertise, "isActive", "maxCandidates", "currentLoad", "conflictInstitutions", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'YOUR_JURY_USER_ID', 'cmiri71xv0001imbktq0h8zyy', 'Technology', true, 10, 0, '{}', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add candidate to contest (replace USER_ID with actual candidate user ID)
INSERT INTO candidates (id, "userId", "contestId", status, "registrationDate", "termsAccepted", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'YOUR_CANDIDATE_USER_ID', 'cmiri71xv0001imbktq0h8zyy', 'QUALIFIED', NOW(), true, NOW(), NOW())
ON CONFLICT DO NOTHING;
