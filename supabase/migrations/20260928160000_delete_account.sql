-- A member can delete their own account. Everything else they own (profile, threads, replies,
-- arguments, votes, reports, stored Treasury) goes with it through "on delete cascade".
begin;

create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Not signed in.'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- a resolved report keeps its record if the moderator's own account is ever deleted
alter table public.reports drop constraint reports_resolved_by_fkey;
alter table public.reports add constraint reports_resolved_by_fkey
  foreign key (resolved_by) references public.profiles (id) on delete set null;

commit;
