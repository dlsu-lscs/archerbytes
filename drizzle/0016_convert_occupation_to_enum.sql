DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'occupation_enum') THEN
    CREATE TYPE occupation_enum AS ENUM ('Alumni', 'Student', 'Faculty');
  END IF;
END$$;

UPDATE "user"
SET occupation = NULL
WHERE occupation IS NOT NULL
  AND occupation NOT IN ('Alumni', 'Student', 'Faculty');

ALTER TABLE "user"
  ALTER COLUMN occupation TYPE occupation_enum USING occupation::occupation_enum;

