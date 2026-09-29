-- Two boards about the site itself: "Bug reports" and "Suggestions". A thread in either carries a
-- status (open, confirmed, planned, fixed, done, declined, duplicate) that only the moderator sets.
-- Members never get the status column: it is set to 'open' when a thread arrives in one of these
-- boards (or is moved into one), cleared when it moves out, and changed only by set_thread_status.
begin;

insert into public.forum_categories (id, title, blurb, sort) values
  ('bugs',  'Bug reports', 'Something on the site not working? Say what happened and where.', 9),
  ('ideas', 'Suggestions', 'Ideas to make the site better for reading and learning.', 10);

alter table public.threads add column status text
  check (status in ('open', 'confirmed', 'planned', 'fixed', 'done', 'declined', 'duplicate'));
update public.threads set status = 'open' where category_id in ('bugs', 'ideas') and status is null;
create index threads_status on public.threads (category_id, status);

create function public.thread_status_default() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.category_id is distinct from old.category_id then
    new.status := case when new.category_id in ('bugs', 'ideas') then 'open' end;
  end if;
  return new;
end $$;
create trigger threads_status_default before insert or update of category_id on public.threads
  for each row execute function public.thread_status_default();

create function public.set_thread_status(p_thread bigint, p_status text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  update public.threads set status = p_status
    where id = p_thread and category_id in ('bugs', 'ideas');
  if not found then raise exception 'Only bug reports and suggestions have a status.'; end if;
end $$;
revoke execute on function public.set_thread_status(bigint, text) from public, anon;
grant execute on function public.set_thread_status(bigint, text) to authenticated;

commit;
