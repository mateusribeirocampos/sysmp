-- First restore the previous ping workflow. This removes only the monitoring table.
BEGIN;
DO $rollback$
BEGIN
  IF to_regclass('public.service_health') IS NOT NULL THEN
    IF obj_description('public.service_health'::regclass, 'pg_class') IS DISTINCT FROM
      'supabase-monitoring-v1: public sentinel; no personal data' THEN
      RAISE EXCEPTION 'Refusing to remove an unrelated table';
    END IF;
    DROP TABLE public.service_health;
  END IF;
END
$rollback$;
NOTIFY pgrst, 'reload schema';
COMMIT;
