-- ============================================================================================
-- Mathesis Stoicheion: accounts, the Town Hall (forum), the Pnyx (debates), moderation, and
-- the synced Treasury. Run once in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- Security model
--   * Row Level Security is on for every table. Anyone may read what is public; only signed-in
--     members with a confirmed email may write, and only as themselves.
--   * Columns that members must not set (roles, bans, counters, hidden flags) are not granted to
--     them at all; they change only through the functions below, which check who is asking.
--   * The site's owner is the moderator (profiles.role = 'moderator', set by hand once; see the end).
--   * Rate limits and bans are enforced in the database, so they hold whatever the browser does.
-- ============================================================================================

begin;  -- all or nothing

-- ------------------------------------------------------------------------------ profiles
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null unique check (char_length(display_name) between 2 and 40),
  bio          text not null default '' check (char_length(bio) <= 500),
  role         text not null default 'member' check (role in ('member', 'moderator')),
  banned_until timestamptz,
  ban_reason   text,
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;
create unique index profiles_name_ci on public.profiles (lower(display_name));

-- a profile for every new account: the display name chosen at sign-up, made unique if taken
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  wanted text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'reader'), 32);
  name   text := wanted;
  n      int  := 1;
begin
  if char_length(name) < 2 then name := 'reader'; wanted := name; end if;
  while exists (select 1 from public.profiles where lower(display_name) = lower(name)) loop
    n := n + 1;
    name := wanted || ' ' || n;
  end loop;
  insert into public.profiles (id, display_name) values (new.id, name);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_moderator() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'moderator');
$$;

-- a member who may write: signed in, and not banned
create function public.can_write() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
                 where id = auth.uid() and (banned_until is null or banned_until < now()));
$$;

create policy "profiles are public" on public.profiles for select using (true);
create policy "members edit their own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ------------------------------------------------------------------------------ rate limits
-- At most `per` items of one kind in `minutes` minutes per member; moderators are not limited.
create function public.check_rate(kind text, per int, minutes int) returns void
language plpgsql security definer set search_path = '' as $$
declare recent int;
begin
  if public.is_moderator() then return; end if;
  execute format('select count(*) from public.%I where author_id = $1 and created_at > now() - make_interval(mins => $2)', kind)
    into recent using auth.uid(), minutes;
  if recent >= per then
    raise exception 'Slow down: at most % in % minutes. Please wait a little.', per, minutes
      using errcode = 'P0001';
  end if;
end $$;

-- ------------------------------------------------------------------------------ the Town Hall
create table public.forum_categories (
  id    text primary key,
  title text not null,
  blurb text not null,
  sort  int  not null
);
alter table public.forum_categories enable row level security;
create policy "categories are public" on public.forum_categories for select using (true);

insert into public.forum_categories (id, title, blurb, sort) values
  ('beginners',   'Beginners'' questions',    'No question is too small: letters, accents, where to start.', 1),
  ('grammar',     'Grammar help',             'Forms, endings, syntax: what is this word doing here?', 2),
  ('translation', 'Translation help',         'Working through a passage together.', 3),
  ('texts',       'Texts and authors',        'Who wrote what, and what to read next.', 4),
  ('history',     'History and culture',      'The Greek world, its people and its ideas.', 5),
  ('archaeology', 'Archaeology news',         'Digs, finds and what they change.', 6),
  ('progress',    'Show your progress',       'Your first sentence, your first book, your streak.', 7),
  ('off-topic',   'Off-topic',                'Everything else, kindly.', 8);

create table public.threads (
  id               bigint generated always as identity primary key,
  category_id      text not null references public.forum_categories (id),
  author_id        uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title            text not null check (char_length(title) between 3 and 160),
  body             text not null check (char_length(body) between 1 and 20000),
  tags             text[] not null default '{}' check (cardinality(tags) <= 5),
  quote            jsonb,                      -- a passage quoted from the reader: {work, ref, grc, eng, cite, href}
  created_at       timestamptz not null default now(),
  edited_at        timestamptz,
  last_activity_at timestamptz not null default now(),
  reply_count      int not null default 0,
  score            int not null default 0,
  answered_post_id bigint,
  locked           boolean not null default false,
  hidden           boolean not null default false,
  hidden_reason    text
);
create index threads_category_activity on public.threads (category_id, last_activity_at desc);
create index threads_activity on public.threads (last_activity_at desc);
alter table public.threads enable row level security;

create table public.posts (
  id         bigint generated always as identity primary key,
  thread_id  bigint not null references public.threads (id) on delete cascade,
  parent_id  bigint references public.posts (id) on delete set null,
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 20000),
  quote      jsonb,
  created_at timestamptz not null default now(),
  edited_at  timestamptz,
  score      int not null default 0,
  hidden     boolean not null default false,
  hidden_reason text
);
create index posts_thread on public.posts (thread_id, created_at);
alter table public.posts enable row level security;
alter table public.threads add constraint threads_answer_fk
  foreign key (answered_post_id) references public.posts (id) on delete set null;

create table public.thread_votes (
  thread_id bigint not null references public.threads (id) on delete cascade,
  user_id   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  primary key (thread_id, user_id)
);
alter table public.thread_votes enable row level security;
create table public.post_votes (
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  primary key (post_id, user_id)
);
alter table public.post_votes enable row level security;

-- what may be seen: everything not hidden; your own hidden items; everything for the moderator
create policy "threads are public unless hidden" on public.threads for select
  using (not hidden or author_id = auth.uid() or public.is_moderator());
create policy "members start threads" on public.threads for insert to authenticated
  with check (author_id = auth.uid() and public.can_write());
create policy "authors edit their threads" on public.threads for update to authenticated
  using (author_id = auth.uid() and not locked and public.can_write()) with check (author_id = auth.uid());
create policy "authors delete their threads" on public.threads for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

create policy "posts are public unless hidden" on public.posts for select
  using ((not hidden or author_id = auth.uid() or public.is_moderator())
         and exists (select 1 from public.threads t where t.id = thread_id));
create policy "members reply" on public.posts for insert to authenticated
  with check (author_id = auth.uid() and public.can_write()
              and exists (select 1 from public.threads t where t.id = thread_id and not t.locked and not t.hidden));
create policy "authors edit their posts" on public.posts for update to authenticated
  using (author_id = auth.uid() and public.can_write()) with check (author_id = auth.uid());
create policy "authors delete their posts" on public.posts for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

create policy "votes are public" on public.thread_votes for select using (true);
create policy "members vote as themselves" on public.thread_votes for insert to authenticated
  with check (user_id = auth.uid() and public.can_write());
create policy "members take back their vote" on public.thread_votes for delete to authenticated using (user_id = auth.uid());
create policy "votes are public" on public.post_votes for select using (true);
create policy "members vote as themselves" on public.post_votes for insert to authenticated
  with check (user_id = auth.uid() and public.can_write());
create policy "members take back their vote" on public.post_votes for delete to authenticated using (user_id = auth.uid());

-- counters, activity and limits (these run as the database, not as the member)
create function public.thread_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.check_rate('threads', 5, 60);
  new.tags := array(select distinct lower(trim(t)) from unnest(new.tags) t where char_length(trim(t)) between 1 and 30);
  return new;
end $$;
create trigger threads_before_insert before insert on public.threads
  for each row execute function public.thread_before_insert();

create function public.post_after_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.threads set reply_count = reply_count + 1, last_activity_at = now() where id = new.thread_id;
  elsif tg_op = 'DELETE' then
    update public.threads set reply_count = greatest(reply_count - 1, 0) where id = old.thread_id;
  end if;
  return null;
end $$;
create function public.post_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.check_rate('posts', 20, 10);
  return new;
end $$;
create trigger posts_before_insert before insert on public.posts
  for each row execute function public.post_before_insert();
create trigger posts_after_change after insert or delete on public.posts
  for each row execute function public.post_after_change();

create function public.thread_mark_edited() returns trigger
language plpgsql as $$
begin
  if new.body is distinct from old.body or new.title is distinct from old.title then new.edited_at := now(); end if;
  return new;
end $$;
create function public.post_mark_edited() returns trigger
language plpgsql as $$
begin
  if new.body is distinct from old.body then new.edited_at := now(); end if;
  return new;
end $$;
create trigger threads_mark_edited before update on public.threads for each row execute function public.thread_mark_edited();
create trigger posts_mark_edited before update on public.posts for each row execute function public.post_mark_edited();

create function public.vote_after_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name = 'thread_votes' then
    if tg_op = 'INSERT' then update public.threads set score = score + 1 where id = new.thread_id;
    else update public.threads set score = score - 1 where id = old.thread_id; end if;
  else
    if tg_op = 'INSERT' then update public.posts set score = score + 1 where id = new.post_id;
    else update public.posts set score = score - 1 where id = old.post_id; end if;
  end if;
  return null;
end $$;
create trigger thread_votes_count after insert or delete on public.thread_votes
  for each row execute function public.vote_after_change();
create trigger post_votes_count after insert or delete on public.post_votes
  for each row execute function public.vote_after_change();

-- the thread's author (or the moderator) marks a reply as the answer, or clears it
create function public.mark_answered(p_thread bigint, p_post bigint) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.threads where id = p_thread and (author_id = auth.uid() or public.is_moderator())) then
    raise exception 'Only the person who asked can mark the answer.';
  end if;
  if p_post is not null and not exists (select 1 from public.posts where id = p_post and thread_id = p_thread) then
    raise exception 'That reply is not in this thread.';
  end if;
  update public.threads set answered_post_id = p_post where id = p_thread;
end $$;

-- ------------------------------------------------------------------------------ the Pnyx
create table public.debates (
  id           bigint generated always as identity primary key,
  motion       text not null check (char_length(motion) between 10 and 200),
  blurb        text not null default '' check (char_length(blurb) <= 4000),
  created_by   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  status       text not null default 'proposed' check (status in ('proposed', 'open', 'closed', 'declined')),
  from_entry   text,                           -- the Painted Stoa entry it was proposed from, if any
  featured     boolean not null default false,
  opened_at    timestamptz,
  closes_at    timestamptz,
  closed_at    timestamptz,
  created_at   timestamptz not null default now()
);
alter table public.debates enable row level security;

create table public.arguments (
  id           bigint generated always as identity primary key,
  debate_id    bigint not null references public.debates (id) on delete cascade,
  side         text not null check (side in ('for', 'against')),
  parent_id    bigint references public.arguments (id) on delete set null,
  author_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body         text not null check (char_length(body) between 1 and 12000),
  quote        jsonb,
  cites_source boolean not null default false,  -- set by the database: a quoted passage or a link to a source
  created_at   timestamptz not null default now(),
  edited_at    timestamptz,
  score        int not null default 0,
  hidden       boolean not null default false,
  hidden_reason text
);
create index arguments_debate on public.arguments (debate_id, side, created_at);
alter table public.arguments enable row level security;

create table public.debate_votes (
  debate_id  bigint not null references public.debates (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  side       text not null check (side in ('for', 'against')),
  first_side text not null check (first_side in ('for', 'against')),
  updated_at timestamptz not null default now(),
  primary key (debate_id, user_id)
);
alter table public.debate_votes enable row level security;

create policy "debates are public once open" on public.debates for select
  using (status in ('open', 'closed') or created_by = auth.uid() or public.is_moderator());
create policy "members propose debates" on public.debates for insert to authenticated
  with check (created_by = auth.uid() and status = 'proposed' and not featured and public.can_write());

create policy "arguments are public unless hidden" on public.arguments for select
  using ((not hidden or author_id = auth.uid() or public.is_moderator())
         and exists (select 1 from public.debates d where d.id = debate_id));
create policy "members argue while the debate is open" on public.arguments for insert to authenticated
  with check (author_id = auth.uid() and public.can_write()
              and exists (select 1 from public.debates d where d.id = debate_id and d.status = 'open'));
create policy "authors edit their arguments" on public.arguments for update to authenticated
  using (author_id = auth.uid() and public.can_write()) with check (author_id = auth.uid());
create policy "authors delete their arguments" on public.arguments for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

-- a vote is private: each member sees only their own; the totals come from debate_tally()
create policy "members see their own vote" on public.debate_votes for select to authenticated using (user_id = auth.uid());

create function public.argument_before_write() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform public.check_rate('arguments', 10, 10);
  end if;
  new.cites_source := new.quote is not null or new.body ~ '\]\((cts|wiki|https?):';
  if tg_op = 'UPDATE' and new.body is distinct from old.body then new.edited_at := now(); end if;
  return new;
end $$;
create trigger arguments_before_write before insert or update on public.arguments
  for each row execute function public.argument_before_write();

create function public.debate_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.check_rate_debates();
  return new;
end $$;
create function public.check_rate_debates() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.is_moderator() then return; end if;
  if (select count(*) from public.debates where created_by = auth.uid() and created_at > now() - interval '1 day') >= 3 then
    raise exception 'Slow down: at most 3 proposed debates a day.' using errcode = 'P0001';
  end if;
end $$;
create trigger debates_before_insert before insert on public.debates
  for each row execute function public.debate_before_insert();

-- cast or change a vote with a pebble; the first side is remembered, so "changed my mind" is honest
create function public.cast_pebble(p_debate bigint, p_side text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_write() then raise exception 'Sign in to vote.'; end if;
  if p_side not in ('for', 'against') then raise exception 'A vote is for or against.'; end if;
  if not exists (select 1 from public.debates where id = p_debate and status = 'open'
                 and (closes_at is null or closes_at > now())) then
    raise exception 'Voting on this motion is closed.';
  end if;
  insert into public.debate_votes (debate_id, user_id, side, first_side)
    values (p_debate, auth.uid(), p_side, p_side)
    on conflict (debate_id, user_id) do update set side = excluded.side, updated_at = now();
end $$;

-- the count: shown to everyone once the debate has closed, and always to the moderator
create function public.debate_tally(p_debate bigint)
returns table (votes_for bigint, votes_against bigint, changed_mind bigint)
language sql stable security definer set search_path = '' as $$
  select count(*) filter (where v.side = 'for'),
         count(*) filter (where v.side = 'against'),
         count(*) filter (where v.side <> v.first_side)
  from public.debate_votes v
  join public.debates d on d.id = v.debate_id
  where v.debate_id = p_debate
    and (d.status = 'closed' or (d.closes_at is not null and d.closes_at <= now()) or public.is_moderator());
$$;

-- ------------------------------------------------------------------------------ moderation
create table public.reports (
  id          bigint generated always as identity primary key,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind        text not null check (kind in ('thread', 'post', 'argument', 'debate', 'profile')),
  target_id   text not null,
  reason      text not null check (char_length(reason) between 3 and 1000),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id),
  outcome     text
);
alter table public.reports enable row level security;
create policy "members report" on public.reports for insert to authenticated
  with check (reporter_id = auth.uid() and public.can_write());
create policy "the moderator reads reports" on public.reports for select to authenticated
  using (public.is_moderator() or reporter_id = auth.uid());

create function public.report_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() and
     (select count(*) from public.reports where reporter_id = auth.uid() and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Slow down: at most 10 reports an hour.' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger reports_before_insert before insert on public.reports
  for each row execute function public.report_before_insert();

create function public.moderate(p_kind text, p_id bigint, p_hidden boolean, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  if p_kind = 'thread' then update public.threads set hidden = p_hidden, hidden_reason = p_reason where id = p_id;
  elsif p_kind = 'post' then update public.posts set hidden = p_hidden, hidden_reason = p_reason where id = p_id;
  elsif p_kind = 'argument' then update public.arguments set hidden = p_hidden, hidden_reason = p_reason where id = p_id;
  else raise exception 'Unknown kind %', p_kind; end if;
end $$;

create function public.lock_thread(p_thread bigint, p_locked boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  update public.threads set locked = p_locked where id = p_thread;
end $$;

create function public.ban(p_user uuid, p_until timestamptz, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  if p_user = auth.uid() then raise exception 'The moderator cannot ban themselves.'; end if;
  update public.profiles set banned_until = p_until, ban_reason = p_reason where id = p_user;
end $$;

create function public.resolve_report(p_report bigint, p_outcome text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  update public.reports set resolved_at = now(), resolved_by = auth.uid(), outcome = p_outcome where id = p_report;
end $$;

-- open, close, decline or feature a debate
create function public.set_debate(p_debate bigint, p_status text, p_closes_at timestamptz, p_featured boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  if p_featured then update public.debates set featured = false where featured; end if;
  update public.debates set
    status = p_status,
    closes_at = p_closes_at,
    featured = p_featured,
    opened_at = case when p_status = 'open' and opened_at is null then now() else opened_at end,
    closed_at = case when p_status = 'closed' then now() else null end
  where id = p_debate;
end $$;

-- ------------------------------------------------------------------------------ the synced Treasury
-- One copy per member of the same data "Download my Treasury" writes; merged in the browser.
create table public.treasuries (
  user_id    uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  data       jsonb not null check (pg_column_size(data) <= 5000000),
  updated_at timestamptz not null default now()
);
alter table public.treasuries enable row level security;
create policy "members see their own treasury" on public.treasuries for select to authenticated using (user_id = auth.uid());
create policy "members save their own treasury" on public.treasuries for insert to authenticated with check (user_id = auth.uid());
create policy "members update their own treasury" on public.treasuries for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "members delete their own treasury" on public.treasuries for delete to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------------------------------ what the API may touch
-- New tables are not exposed automatically (project setting), so every grant is written here.
grant usage on schema public to anon, authenticated;

grant select on public.profiles, public.forum_categories, public.threads, public.posts,
                public.thread_votes, public.post_votes, public.debates, public.arguments to anon, authenticated;
grant update (display_name, bio) on public.profiles to authenticated;

grant insert (category_id, title, body, tags, quote) on public.threads to authenticated;
grant update (title, body, tags, quote, category_id) on public.threads to authenticated;
grant delete on public.threads to authenticated;
grant insert (thread_id, parent_id, body, quote) on public.posts to authenticated;
grant update (body, quote) on public.posts to authenticated;
grant delete on public.posts to authenticated;
grant insert, delete on public.thread_votes, public.post_votes to authenticated;

grant insert (motion, blurb, from_entry) on public.debates to authenticated;
grant insert (debate_id, side, parent_id, body, quote) on public.arguments to authenticated;
grant update (body, quote) on public.arguments to authenticated;
grant delete on public.arguments to authenticated;
grant select on public.debate_votes to authenticated;

grant insert (kind, target_id, reason) on public.reports to authenticated;
grant select on public.reports to authenticated;

grant select, insert, update, delete on public.treasuries to authenticated;

grant usage on all sequences in schema public to authenticated;

revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.mark_answered(bigint, bigint), public.cast_pebble(bigint, text),
                          public.moderate(text, bigint, boolean, text), public.lock_thread(bigint, boolean),
                          public.ban(uuid, timestamptz, text), public.resolve_report(bigint, text),
                          public.set_debate(bigint, text, timestamptz, boolean) to authenticated;
grant execute on function public.debate_tally(bigint), public.is_moderator(), public.can_write() to anon, authenticated;

commit;

-- ------------------------------------------------------------------------------ the moderator
-- After the owner has signed up on the site, run once (with the owner's display name):
--   update public.profiles set role = 'moderator' where display_name = '<owner''s display name>';
