ALTER TABLE public.habit_records ALTER COLUMN date_completed TYPE date USING date_completed::date;
