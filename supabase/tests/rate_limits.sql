begin;
select plan(6);

select has_table('public', 'rate_limits', 'rate limits table exists');
select is((select relrowsecurity from pg_class where oid = 'public.rate_limits'::regclass), true, 'rate limits RLS enabled');
select policies_are('public', 'rate_limits', array[]::text[], 'rate limits has no direct policies; access goes through the function');
select has_function('public', 'consume_rate_limit', array['text', 'integer', 'integer'], 'consume_rate_limit exists');
select is(has_function_privilege('anon', 'public.consume_rate_limit(text, integer, integer)', 'execute'), false, 'anon cannot spend a budget');
select is(has_function_privilege('authenticated', 'public.consume_rate_limit(text, integer, integer)', 'execute'), true, 'signed-in users can spend their own budget');

select * from finish();
rollback;
