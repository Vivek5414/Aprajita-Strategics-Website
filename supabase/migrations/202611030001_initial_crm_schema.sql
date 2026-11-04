create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE');
create type public.customer_status as enum ('ACTIVE', 'FOLLOW_UP', 'QUALIFIED', 'ARCHIVED');
create type public.enquiry_status as enum (
  'NEW', 'UNASSIGNED', 'ASSIGNED', 'CONTACTED', 'FOLLOW_UP_REQUIRED',
  'UNDER_DISCUSSION', 'PROPOSAL_SENT', 'CONVERTED', 'NOT_INTERESTED', 'CLOSED'
);
create type public.priority_level as enum ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
create type public.lead_stage as enum (
  'NEW_LEAD', 'CONTACTED', 'QUALIFIED', 'DISCUSSION', 'PROPOSAL_SENT',
  'NEGOTIATION', 'WON', 'LOST'
);
create type public.follow_up_status as enum ('UPCOMING', 'DUE_TODAY', 'OVERDUE', 'COMPLETED', 'CANCELLED');
create type public.workflow_status as enum ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
create type public.task_status as enum ('TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'BLOCKED');
create type public.project_status as enum ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
create type public.communication_type as enum ('CALL', 'EMAIL', 'MEETING', 'WHATSAPP', 'GENERAL', 'INTERNAL_NOTE');

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 160),
  role public.app_role not null default 'EMPLOYEE',
  employee_id uuid,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.user_profiles(id) on delete set null,
  employee_code text unique,
  name text not null check (char_length(name) between 1 and 160),
  email text not null unique check (char_length(email) <= 254),
  designation text not null default '' check (char_length(designation) <= 160),
  department text not null default '' check (char_length(department) <= 120),
  account_status text not null default 'ACTIVE' check (account_status in ('ACTIVE', 'ON_LEAVE', 'INACTIVE')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles
  add constraint user_profiles_employee_id_fkey
  foreign key (employee_id) references public.employees(id) on delete set null;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text not null unique default ('CUS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  name text not null check (char_length(name) between 1 and 160),
  company_name text check (company_name is null or char_length(company_name) <= 200),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 32),
  location text check (location is null or char_length(location) <= 200),
  primary_service_id uuid references public.services(id) on delete set null,
  customer_type text not null default 'OTHER' check (customer_type in ('CORPORATE', 'DEVELOPER', 'HOMEOWNER', 'INSTITUTION', 'OTHER')),
  status public.customer_status not null default 'ACTIVE',
  assigned_employee_id uuid references public.employees(id) on delete set null,
  internal_notes text not null default '',
  archived_at timestamptz,
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'ARCHIVED') = (archived_at is not null))
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 1 and 160),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 32),
  company_name text check (company_name is null or char_length(company_name) <= 200),
  service_id uuid references public.services(id) on delete set null,
  service_slug text,
  project_location text check (project_location is null or char_length(project_location) <= 200),
  project_requirements text not null check (char_length(project_requirements) between 1 and 5000),
  source text not null default 'WEBSITE' check (char_length(source) <= 80),
  status public.enquiry_status not null default 'NEW',
  priority public.priority_level not null default 'MEDIUM',
  assigned_employee_id uuid references public.employees(id) on delete set null,
  submitted_at timestamptz not null default now(),
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.assign_enquiry_reference()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.reference_code is null or new.reference_code = '' then
    new.reference_code := 'ENQ-' || to_char(now() at time zone 'UTC', 'YYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  end if;
  return new;
end;
$$;
create trigger enquiries_reference_before_insert
before insert on public.enquiries
for each row execute function public.assign_enquiry_reference();

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid unique references public.enquiries(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  name text not null check (char_length(name) between 1 and 160),
  company_name text check (company_name is null or char_length(company_name) <= 200),
  service_id uuid references public.services(id) on delete set null,
  stage public.lead_stage not null default 'NEW_LEAD',
  assigned_employee_id uuid references public.employees(id) on delete set null,
  opportunity_value numeric(14, 2) check (opportunity_value is null or opportunity_value >= 0),
  currency char(3) not null default 'INR',
  last_interaction_at timestamptz,
  next_follow_up_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  enquiry_id uuid references public.enquiries(id) on delete cascade,
  project_id uuid,
  employee_id uuid references public.employees(id) on delete set null,
  communication_type public.communication_type not null,
  summary text not null check (char_length(summary) between 1 and 5000),
  next_action text check (next_action is null or char_length(next_action) <= 2000),
  occurred_at timestamptz not null default now(),
  follow_up_at timestamptz,
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or enquiry_id is not null)
);

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  enquiry_id uuid references public.enquiries(id) on delete cascade,
  assigned_employee_id uuid references public.employees(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  notes text not null default '',
  reminder_at timestamptz not null,
  status public.follow_up_status not null default 'UPCOMING',
  completed_at timestamptz,
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or enquiry_id is not null),
  check ((status = 'COMPLETED') = (completed_at is not null))
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null check (char_length(name) between 1 and 200),
  description text not null default '',
  customer_id uuid references public.customers(id) on delete set null,
  status public.project_status not null default 'PLANNING',
  priority public.priority_level not null default 'MEDIUM',
  start_date date,
  due_date date,
  progress smallint not null default 0 check (progress between 0 and 100),
  budget numeric(14, 2) check (budget is null or budget >= 0),
  currency char(3) not null default 'INR',
  is_published boolean not null default false,
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (due_date is null or start_date is null or due_date >= start_date)
);

alter table public.communications
  add constraint communications_project_id_fkey
  foreign key (project_id) references public.projects(id) on delete cascade;

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  assigned_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (project_id, employee_id)
);

create table public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '',
  due_date date,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  description text not null default '',
  customer_id uuid references public.customers(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  assigned_employee_id uuid references public.employees(id) on delete set null,
  status public.workflow_status not null default 'DRAFT',
  stage text not null default 'Discovery' check (char_length(stage) <= 100),
  priority public.priority_level not null default 'MEDIUM',
  start_date date,
  due_date date,
  progress smallint not null default 0 check (progress between 0 and 100),
  internal_notes text not null default '',
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or project_id is not null),
  check (due_date is null or start_date is null or due_date >= start_date)
);

create table public.workflow_tasks (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references public.workflows(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  enquiry_id uuid references public.enquiries(id) on delete set null,
  title text not null check (char_length(title) between 1 and 240),
  description text not null default '',
  assigned_employee_id uuid references public.employees(id) on delete set null,
  status public.task_status not null default 'TO_DO',
  priority public.priority_level not null default 'MEDIUM',
  start_date date,
  due_date date,
  completed_at timestamptz,
  is_demo boolean not null default false,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (workflow_id is not null or project_id is not null or customer_id is not null or enquiry_id is not null),
  check (due_date is null or start_date is null or due_date >= start_date),
  check ((status = 'COMPLETED') = (completed_at is not null))
);

create table public.workflow_task_dependencies (
  task_id uuid not null references public.workflow_tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.workflow_tasks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, depends_on_task_id),
  check (task_id <> depends_on_task_id)
);

create or replace function public.validate_task_dependency()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target public.workflow_tasks%rowtype;
  prerequisite public.workflow_tasks%rowtype;
  creates_cycle boolean;
begin
  select * into target from public.workflow_tasks where id = new.task_id;
  select * into prerequisite from public.workflow_tasks where id = new.depends_on_task_id;
  if target.id is null or prerequisite.id is null then
    raise exception 'Both tasks must exist';
  end if;
  if target.workflow_id is distinct from prerequisite.workflow_id
     and target.project_id is distinct from prerequisite.project_id then
    raise exception 'Tasks must share a workflow or project';
  end if;

  with recursive dependency_chain(task_id) as (
    select new.depends_on_task_id
    union
    select dependencies.depends_on_task_id
    from public.workflow_task_dependencies dependencies
    join dependency_chain chain on dependencies.task_id = chain.task_id
  )
  select exists (select 1 from dependency_chain where task_id = new.task_id)
  into creates_cycle;
  if creates_cycle then
    raise exception 'Task dependency would create a cycle';
  end if;
  return new;
end;
$$;
create trigger workflow_task_dependencies_validate
before insert or update on public.workflow_task_dependencies
for each row execute function public.validate_task_dependency();

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.workflow_tasks(id) on delete cascade,
  author_id uuid not null references public.user_profiles(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique,
  summary text not null default '',
  image_path text,
  category text,
  location text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  name text not null check (char_length(name) between 1 and 160),
  role text not null default '',
  organization text not null default '',
  quote text not null check (char_length(quote) between 1 and 5000),
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 1 and 240),
  summary text not null default '',
  body jsonb not null default '[]'::jsonb,
  author_id uuid references public.user_profiles(id) on delete set null,
  cover_image_path text,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'PUBLISHED') = (published_at is not null))
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.user_profiles(id) on delete cascade,
  kind text not null check (char_length(kind) between 1 and 80),
  title text not null check (char_length(title) between 1 and 200),
  body text not null default '',
  entity_type text,
  entity_id uuid,
  dedupe_key text unique,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.user_profiles(id) on delete set null,
  action text not null check (char_length(action) between 1 and 100),
  entity_type text not null check (char_length(entity_type) between 1 and 100),
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create table public.media_files (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null,
  object_path text not null,
  original_name text not null check (char_length(original_name) <= 255),
  content_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 20971520),
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  customer_id uuid references public.customers(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

create table public.public_submission_limits (
  fingerprint text primary key,
  window_started_at timestamptz not null,
  submission_count smallint not null default 1 check (submission_count between 1 and 100)
);

create or replace function public.submit_public_enquiry(
  p_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_service_slug text,
  p_project_location text,
  p_requirements text,
  p_source text default 'WEBSITE'
)
returns table(reference_code text, was_duplicate boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing public.enquiries%rowtype;
  created public.enquiries%rowtype;
  recipient record;
begin
  if length(trim(p_name)) not between 1 and 160
     or length(trim(p_requirements)) not between 1 and 5000
     or (nullif(trim(p_email), '') is null and nullif(trim(p_phone), '') is null) then
    raise exception 'Invalid enquiry fields';
  end if;

  perform pg_advisory_xact_lock(hashtext(lower(coalesce(nullif(trim(p_email), ''), trim(p_phone)))));
  select * into existing
  from public.enquiries e
  where e.submitted_at >= now() - interval '2 minutes'
    and (
      (nullif(trim(p_email), '') is not null and lower(e.email) = lower(trim(p_email)))
      or (nullif(trim(p_phone), '') is not null and e.phone = trim(p_phone))
    )
  order by e.submitted_at desc
  limit 1;

  if found then
    return query select existing.reference_code, true;
    return;
  end if;

  insert into public.enquiries (
    reference_code, customer_name, email, phone, company_name, service_slug,
    project_location, project_requirements, source, status, priority, submitted_at
  )
  values (
    '', trim(p_name), nullif(lower(trim(p_email)), ''), nullif(trim(p_phone), ''),
    nullif(trim(p_company), ''), nullif(trim(p_service_slug), ''),
    nullif(trim(p_project_location), ''), trim(p_requirements),
    coalesce(nullif(trim(p_source), ''), 'WEBSITE'), 'NEW', 'MEDIUM', now()
  )
  returning * into created;

  for recipient in
    select id from public.user_profiles where role in ('SUPER_ADMIN', 'ADMIN')
  loop
    insert into public.notifications (recipient_id, kind, title, body, entity_type, entity_id)
    values (
      recipient.id, 'NEW_ENQUIRY', 'New website enquiry',
      'A new enquiry was submitted. Reference: ' || created.reference_code,
      'enquiry', created.id
    );
  end loop;

  return query select created.reference_code, false;
end;
$$;

create or replace function public.register_public_submission(p_fingerprint text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_window public.public_submission_limits%rowtype;
begin
  if length(p_fingerprint) <> 64 then
    raise exception 'Invalid submission fingerprint';
  end if;

  insert into public.public_submission_limits (fingerprint, window_started_at, submission_count)
  values (p_fingerprint, now(), 1)
  on conflict (fingerprint) do nothing;

  select * into current_window
  from public.public_submission_limits
  where fingerprint = p_fingerprint
  for update;

  if current_window.window_started_at < now() - interval '15 minutes' then
    update public.public_submission_limits
    set window_started_at = now(), submission_count = 1
    where fingerprint = p_fingerprint;
    return true;
  end if;

  if current_window.submission_count >= 5 then
    return false;
  end if;

  update public.public_submission_limits
  set submission_count = submission_count + 1
  where fingerprint = p_fingerprint;
  return true;
end;
$$;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.user_profiles where id = (select auth.uid())
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    public.current_app_role() in ('SUPER_ADMIN', 'ADMIN')
    and (public.current_employee_id() is not null or not exists (
      select 1 from public.user_profiles p
      where p.id = (select auth.uid()) and p.employee_id is not null
    )),
    false
  )
$$;

create or replace function public.is_manager_or_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_app_role() in ('SUPER_ADMIN', 'ADMIN'), false)
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    public.current_app_role() = 'MANAGER'
    and public.current_employee_id() is not null,
    false
  )
$$;

create or replace function public.current_employee_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.employee_id
  from public.user_profiles p
  left join public.employees e on e.id = p.employee_id
  where p.id = (select auth.uid())
    and (p.employee_id is null or e.account_status <> 'INACTIVE')
$$

create or replace function public.admin_set_user_role(p_user_id uuid, p_role public.app_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.current_app_role() is distinct from 'SUPER_ADMIN' or not public.is_admin() then
    raise exception 'Only a super admin can change application roles';
  end if;
  update public.user_profiles set role = p_role where id = p_user_id;
  if not found then
    raise exception 'User profile not found';
  end if;
end;
$$;

create or replace function public.can_access_customer(p_customer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_manager_or_admin()
    or exists (
      select 1 from public.customers c
      where c.id = p_customer_id and c.assigned_employee_id = public.current_employee_id()
    )
    or exists (
      select 1 from public.enquiries e
      where e.customer_id = p_customer_id and e.assigned_employee_id = public.current_employee_id()
    )
    or exists (
      select 1 from public.project_members pm
      join public.projects p on p.id = pm.project_id
      where p.customer_id = p_customer_id and pm.employee_id = public.current_employee_id()
    )
$$;

create or replace function public.can_access_enquiry(p_enquiry_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_manager_or_admin()
    or exists (
      select 1 from public.enquiries e
      where e.id = p_enquiry_id
        and (e.assigned_employee_id = public.current_employee_id()
          or (e.customer_id is not null and public.can_access_customer(e.customer_id)))
    )
$$;

create or replace function public.can_access_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_manager_or_admin()
    or exists (
      select 1 from public.project_members pm
      where pm.project_id = p_project_id and pm.employee_id = public.current_employee_id()
    )
$$;

create or replace function public.convert_enquiry_to_customer(p_enquiry_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  enquiry_record public.enquiries%rowtype;
  customer_record public.customers%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into enquiry_record
  from public.enquiries
  where id = p_enquiry_id
  for update;
  if not found then
    raise exception 'Enquiry not found';
  end if;

  if not public.is_admin()
     and (
       public.current_employee_id() is null
       or enquiry_record.assigned_employee_id is distinct from public.current_employee_id()
     ) then
    raise exception 'Not authorized to convert this enquiry';
  end if;

  if enquiry_record.customer_id is not null then
    return enquiry_record.customer_id;
  end if;

  if enquiry_record.email is not null or enquiry_record.phone is not null then
    select * into customer_record
    from public.customers
    where (enquiry_record.email is not null and lower(email) = lower(enquiry_record.email))
      or (enquiry_record.phone is not null and phone = enquiry_record.phone)
    order by created_at
    limit 1
    for update;
  end if;

  if customer_record.id is null then
    insert into public.customers (
      name, company_name, email, phone, primary_service_id, customer_type, status,
      assigned_employee_id, created_by, is_demo
    )
    values (
      enquiry_record.customer_name, enquiry_record.company_name,
      enquiry_record.email, enquiry_record.phone, enquiry_record.service_id, 'OTHER', 'QUALIFIED',
      enquiry_record.assigned_employee_id, auth.uid(), enquiry_record.is_demo
    )
    returning * into customer_record;
  end if;

  update public.enquiries
  set customer_id = customer_record.id, status = 'CONVERTED'
  where id = enquiry_record.id;

  return customer_record.id;
end;
$$;

create or replace function public.write_activity_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  entity text := tg_table_name;
  record_id uuid;
begin
  if tg_op = 'DELETE' then
    record_id := old.id;
    insert into public.activity_logs (actor_id, action, entity_type, entity_id, before_data)
    values ((select auth.uid()), tg_op, entity, record_id, to_jsonb(old));
    return old;
  end if;

  record_id := new.id;
  insert into public.activity_logs (actor_id, action, entity_type, entity_id, before_data, after_data)
  values (
    (select auth.uid()),
    tg_op,
    entity,
    record_id,
    case when tg_op = 'UPDATE' then to_jsonb(old) else null end,
    to_jsonb(new)
  );
  return new;
end;
$$;

create or replace function public.notify_work_assignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  record_data jsonb := to_jsonb(new);
  previous_data jsonb;
  employee_uuid uuid;
  recipient_uuid uuid;
  entity_uuid uuid;
  notification_kind text;
  notification_title text;
begin
  if tg_op = 'UPDATE' then
    previous_data := to_jsonb(old);
  end if;

  if tg_table_name = 'projects' then
    entity_uuid := (record_data ->> 'id')::uuid;
    if tg_op = 'UPDATE'
      and (to_jsonb(old) - 'updated_at') is not distinct from (to_jsonb(new) - 'updated_at') then
      return new;
    end if;
    insert into public.notifications (
      recipient_id, kind, title, body, entity_type, entity_id, dedupe_key
    )
    select recipients.profile_id, 'PROJECT_UPDATED', 'Project updated',
      'A project update is available for ' || new.name,
      'project', entity_uuid, 'PROJECT_UPDATED:' || entity_uuid::text || ':' || new.updated_at::text || ':' || recipients.profile_id::text
    from (
      select e.profile_id
      from public.project_members pm
      join public.employees e on e.id = pm.employee_id
      where pm.project_id = entity_uuid and e.profile_id is not null
      union
      select id as profile_id from public.user_profiles where role in ('SUPER_ADMIN', 'ADMIN')
    ) recipients
    on conflict (dedupe_key) do nothing;
    return new;
  end if;

  if tg_table_name = 'enquiries' then
    employee_uuid := nullif(record_data ->> 'assigned_employee_id', '')::uuid;
    notification_kind := 'ENQUIRY_ASSIGNED';
    notification_title := 'Enquiry assigned';
  elsif tg_table_name = 'workflow_tasks' then
    employee_uuid := nullif(record_data ->> 'assigned_employee_id', '')::uuid;
    notification_kind := 'TASK_ASSIGNED';
    notification_title := 'Task assigned';
  elsif tg_table_name = 'follow_ups' then
    employee_uuid := nullif(record_data ->> 'assigned_employee_id', '')::uuid;
    notification_kind := 'FOLLOW_UP_ASSIGNED';
    notification_title := 'Follow-up assigned';
  elsif tg_table_name = 'workflows' then
    employee_uuid := nullif(record_data ->> 'assigned_employee_id', '')::uuid;
    notification_kind := 'WORKFLOW_UPDATED';
    notification_title := 'Workflow updated';
  else
    return new;
  end if;

  if employee_uuid is null then
    return new;
  end if;
  if tg_op = 'UPDATE'
    and previous_data ->> 'assigned_employee_id' is not distinct from record_data ->> 'assigned_employee_id'
    and (
      tg_table_name <> 'workflows'
      or (
        previous_data ->> 'status' is not distinct from record_data ->> 'status'
        and previous_data ->> 'stage' is not distinct from record_data ->> 'stage'
        and previous_data ->> 'progress' is not distinct from record_data ->> 'progress'
      )
    ) then
    return new;
  end if;

  select profile_id into recipient_uuid from public.employees where id = employee_uuid;
  if recipient_uuid is null then
    return new;
  end if;
  entity_uuid := (record_data ->> 'id')::uuid;
  insert into public.notifications (
    recipient_id, kind, title, body, entity_type, entity_id, dedupe_key
  )
  values (
    recipient_uuid, notification_kind, notification_title,
    'You have an assigned ' || replace(tg_table_name, '_', ' ') || ' to review.',
    replace(tg_table_name, '_', ''), entity_uuid,
    notification_kind || ':' || entity_uuid::text || ':' || new.updated_at::text
  )
  on conflict (dedupe_key) do nothing;
  return new;
end;
$$;

create or replace function public.emit_due_work_notifications()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_count integer;
  task_count integer;
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  insert into public.notifications (
    recipient_id, kind, title, body, entity_type, entity_id, dedupe_key
  )
  select e.profile_id, 'TASK_DUE', 'Task due soon',
    'An assigned task is due on ' || t.due_date::text,
    'workflow_task', t.id, 'TASK_DUE:' || t.id::text || ':' || t.due_date::text
  from public.workflow_tasks t
  join public.employees e on e.id = t.assigned_employee_id
  where e.profile_id is not null
    and t.due_date between current_date and current_date + 1
    and t.status not in ('COMPLETED', 'BLOCKED')
  on conflict (dedupe_key) do nothing;

  get diagnostics task_count = row_count;

  insert into public.notifications (
    recipient_id, kind, title, body, entity_type, entity_id, dedupe_key
  )
  select e.profile_id, 'FOLLOW_UP_DUE', 'Follow-up due soon',
    'A customer follow-up is due at ' || f.reminder_at::text,
    'follow_up', f.id, 'FOLLOW_UP_DUE:' || f.id::text || ':' || f.reminder_at::date::text
  from public.follow_ups f
  join public.employees e on e.id = f.assigned_employee_id
  where e.profile_id is not null
    and f.reminder_at >= now()
    and f.reminder_at < now() + interval '24 hours'
    and f.status not in ('COMPLETED', 'CANCELLED')
  on conflict (dedupe_key) do nothing;

  get diagnostics inserted_count = row_count;
  return task_count + inserted_count;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'user_profiles', 'employees', 'services', 'customers', 'enquiries', 'leads',
    'communications', 'follow_ups', 'projects', 'project_milestones', 'workflows',
    'workflow_tasks', 'task_comments', 'portfolio', 'testimonials', 'blog_posts'
  ]
  loop
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
    execute format('create trigger %I_zz_activity after insert or update or delete on public.%I for each row execute function public.write_activity_log()', table_name, table_name);
  end loop;
end $$;

create trigger enquiries_zz_assignment_notification
after insert or update on public.enquiries
for each row execute function public.notify_work_assignment();
create trigger workflow_tasks_zz_assignment_notification
after insert or update on public.workflow_tasks
for each row execute function public.notify_work_assignment();
create trigger follow_ups_zz_assignment_notification
after insert or update on public.follow_ups
for each row execute function public.notify_work_assignment();
create trigger workflows_zz_assignment_notification
after insert or update on public.workflows
for each row execute function public.notify_work_assignment();
create trigger projects_update_notification
after update on public.projects
for each row execute function public.notify_work_assignment();

create index user_profiles_role_idx on public.user_profiles(role);
create index employees_profile_id_idx on public.employees(profile_id);
create index customers_assigned_employee_idx on public.customers(assigned_employee_id) where archived_at is null;
create index customers_email_idx on public.customers(lower(email)) where email is not null;
create index customers_company_idx on public.customers using gin (to_tsvector('simple', coalesce(company_name, '') || ' ' || name));
create index enquiries_status_submitted_idx on public.enquiries(status, submitted_at desc);
create index enquiries_assigned_submitted_idx on public.enquiries(assigned_employee_id, submitted_at desc);
create index enquiries_customer_idx on public.enquiries(customer_id);
create index enquiries_service_idx on public.enquiries(service_id);
create index enquiries_email_submitted_idx on public.enquiries(lower(email), submitted_at desc);
create index leads_stage_followup_idx on public.leads(stage, next_follow_up_at);
create index leads_assigned_stage_idx on public.leads(assigned_employee_id, stage);
create index communications_customer_time_idx on public.communications(customer_id, occurred_at desc);
create index communications_enquiry_time_idx on public.communications(enquiry_id, occurred_at desc);
create index follow_ups_due_idx on public.follow_ups(status, reminder_at);
create index follow_ups_employee_due_idx on public.follow_ups(assigned_employee_id, reminder_at);
create index projects_customer_status_idx on public.projects(customer_id, status);
create index project_members_employee_idx on public.project_members(employee_id, project_id);
create index project_milestones_project_due_idx on public.project_milestones(project_id, due_date);
create index workflows_assignee_status_idx on public.workflows(assigned_employee_id, status, due_date);
create index workflow_tasks_assignee_status_due_idx on public.workflow_tasks(assigned_employee_id, status, due_date);
create index workflow_tasks_workflow_idx on public.workflow_tasks(workflow_id);
create index task_comments_task_created_idx on public.task_comments(task_id, created_at);
create index notifications_recipient_unread_idx on public.notifications(recipient_id, created_at desc) where read_at is null;
create index activity_logs_entity_time_idx on public.activity_logs(entity_type, entity_id, created_at desc);
create index media_files_customer_idx on public.media_files(customer_id);
create index media_files_project_idx on public.media_files(project_id);

alter table public.user_profiles enable row level security;
alter table public.employees enable row level security;
alter table public.services enable row level security;
alter table public.customers enable row level security;
alter table public.enquiries enable row level security;
alter table public.leads enable row level security;
alter table public.communications enable row level security;
alter table public.follow_ups enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_milestones enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_tasks enable row level security;
alter table public.workflow_task_dependencies enable row level security;
alter table public.task_comments enable row level security;
alter table public.portfolio enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.media_files enable row level security;
alter table public.public_submission_limits enable row level security;

revoke all on function public.register_public_submission(text) from public, anon, authenticated;
grant execute on function public.register_public_submission(text) to service_role;
revoke all on function public.submit_public_enquiry(text, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_public_enquiry(text, text, text, text, text, text, text, text)
  to service_role;
revoke all on function public.admin_set_user_role(uuid, public.app_role)
  from public, anon;
grant execute on function public.admin_set_user_role(uuid, public.app_role)
  to authenticated;
revoke all on function public.convert_enquiry_to_customer(uuid)
  from public, anon;
grant execute on function public.convert_enquiry_to_customer(uuid)
  to authenticated;
revoke all on function public.emit_due_work_notifications()
  from public, anon, authenticated;
grant execute on function public.emit_due_work_notifications()
  to service_role;

grant usage on schema public to anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.projects, public.portfolio, public.testimonials, public.blog_posts to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on public.public_submission_limits from anon, authenticated;

create policy "Profiles are visible to self or admins" on public.user_profiles
for select to authenticated using (id = (select auth.uid()) or public.is_admin() or public.is_manager_or_admin());
create policy "Profiles can update safe fields" on public.user_profiles
for update to authenticated using (id = (select auth.uid()) or public.is_admin())
with check (id = (select auth.uid()) or public.is_admin());
revoke update on public.user_profiles from authenticated;
grant update (display_name, avatar_path, updated_at) on public.user_profiles to authenticated;
create policy "Super admins manage profile roles" on public.user_profiles
for all to authenticated using (public.current_app_role() = 'SUPER_ADMIN')
with check (public.current_app_role() = 'SUPER_ADMIN');

create policy "Employees visible to authorized team" on public.employees
for select to authenticated using (
  profile_id = (select auth.uid()) or public.is_manager_or_admin() or public.is_manager()
  or id = public.current_employee_id()
);
create policy "Admins manage employees" on public.employees
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Managers manage employee records" on public.employees
for all to authenticated using (public.is_manager()) with check (public.is_manager());

create policy "Published services are public" on public.services
for select to anon, authenticated using (is_published);
create policy "Admins manage services" on public.services
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Customers scoped by role and assignment" on public.customers
for select to authenticated using (public.can_access_customer(id));
create policy "Admins and managers manage customers" on public.customers
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers create assigned customers" on public.customers
for insert to authenticated with check (
  public.is_manager() and assigned_employee_id = public.current_employee_id()
);
create policy "Assigned employees update their customers" on public.customers
for update to authenticated using (assigned_employee_id = public.current_employee_id())
with check (assigned_employee_id = public.current_employee_id());

create policy "Enquiries scoped by role and assignment" on public.enquiries
for select to authenticated using (public.can_access_enquiry(id));
create policy "Admins and managers manage enquiries" on public.enquiries
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers create assigned enquiries" on public.enquiries
for insert to authenticated with check (
  public.is_manager() and assigned_employee_id = public.current_employee_id()
);
create policy "Assigned employees update enquiries" on public.enquiries
for update to authenticated using (assigned_employee_id = public.current_employee_id())
with check (assigned_employee_id = public.current_employee_id());

create policy "Leads scoped by role and assignment" on public.leads
for select to authenticated using (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
  or (customer_id is not null and public.can_access_customer(customer_id))
);
create policy "Admins and managers manage leads" on public.leads
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Assigned employees update leads" on public.leads
for update to authenticated using (assigned_employee_id = public.current_employee_id())
with check (assigned_employee_id = public.current_employee_id());

create policy "Communications scoped by linked records" on public.communications
for select to authenticated using (
  public.is_manager_or_admin()
  or (customer_id is not null and public.can_access_customer(customer_id))
  or (enquiry_id is not null and public.can_access_enquiry(enquiry_id))
  or (project_id is not null and public.can_access_project(project_id))
);
create policy "Authorized users create communications" on public.communications
for insert to authenticated with check (
  public.is_manager_or_admin()
  or (customer_id is not null and public.can_access_customer(customer_id))
  or (enquiry_id is not null and public.can_access_enquiry(enquiry_id))
  or (project_id is not null and public.can_access_project(project_id))
);
create policy "Admins manage communications" on public.communications
for update using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Admins delete communications" on public.communications
for delete using (public.is_admin());

create policy "Follow-ups scoped by assignment" on public.follow_ups
for select to authenticated using (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
  or (customer_id is not null and public.can_access_customer(customer_id))
  or (enquiry_id is not null and public.can_access_enquiry(enquiry_id))
);
create policy "Authorized users create follow-ups" on public.follow_ups
for insert to authenticated with check (
  public.is_manager_or_admin()
  or assigned_employee_id = public.current_employee_id()
  or (customer_id is not null and public.can_access_customer(customer_id))
  or (enquiry_id is not null and public.can_access_enquiry(enquiry_id))
);
create policy "Follow-ups editable by assignee or managers" on public.follow_ups
for update to authenticated using (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
) with check (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
);
create policy "Admins delete follow-ups" on public.follow_ups
for delete using (public.is_admin());

create policy "Published projects are public" on public.projects
for select to anon, authenticated using (is_published);
create policy "Project access by team membership" on public.projects
for select to authenticated using (public.can_access_project(id) or public.is_admin());
create policy "Admins and managers manage projects" on public.projects
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers manage assigned projects" on public.projects
for update to authenticated using (public.is_manager() and public.can_access_project(id))
with check (public.is_manager() and public.can_access_project(id));
create policy "Managers create projects for assigned customers" on public.projects
for insert to authenticated with check (
  public.is_manager() and customer_id is not null and public.can_access_customer(customer_id)
);
create policy "Project members are visible to team" on public.project_members
for select to authenticated using (public.can_access_project(project_id) or public.is_admin());
create policy "Admins manage project members" on public.project_members
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers manage members of assigned projects" on public.project_members
for all to authenticated using (public.is_manager() and public.can_access_project(project_id))
with check (public.is_manager() and public.can_access_project(project_id));
create policy "Milestones visible to project team" on public.project_milestones
for select to authenticated using (public.can_access_project(project_id));
create policy "Managers manage project milestones" on public.project_milestones
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers update assigned project milestones" on public.project_milestones
for all to authenticated using (public.is_manager() and public.can_access_project(project_id))
with check (public.is_manager() and public.can_access_project(project_id));

create policy "Workflows scoped to assignee or managers" on public.workflows
for select to authenticated using (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
  or (project_id is not null and public.can_access_project(project_id))
  or (customer_id is not null and public.can_access_customer(customer_id))
);
create policy "Managers manage workflows" on public.workflows
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers manage assigned workflows" on public.workflows
for all to authenticated using (
  public.is_manager() and (
    assigned_employee_id = public.current_employee_id()
    or (project_id is not null and public.can_access_project(project_id))
    or (customer_id is not null and public.can_access_customer(customer_id))
  )
) with check (
  public.is_manager() and (
    assigned_employee_id = public.current_employee_id()
    or (project_id is not null and public.can_access_project(project_id))
    or (customer_id is not null and public.can_access_customer(customer_id))
  )
);
create policy "Tasks scoped to assignee or related access" on public.workflow_tasks
for select to authenticated using (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
  or (project_id is not null and public.can_access_project(project_id))
  or (customer_id is not null and public.can_access_customer(customer_id))
  or (enquiry_id is not null and public.can_access_enquiry(enquiry_id))
);
create policy "Managers create tasks" on public.workflow_tasks
for insert to authenticated with check (public.is_manager_or_admin());
create policy "Managers create assigned tasks" on public.workflow_tasks
for insert to authenticated with check (
  public.is_manager() and (
    assigned_employee_id = public.current_employee_id()
    or (project_id is not null and public.can_access_project(project_id))
    or (customer_id is not null and public.can_access_customer(customer_id))
    or (enquiry_id is not null and public.can_access_enquiry(enquiry_id))
  )
);
create policy "Assignees update task progress" on public.workflow_tasks
for update to authenticated using (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
) with check (
  public.is_manager_or_admin() or assigned_employee_id = public.current_employee_id()
);
create policy "Admins delete tasks" on public.workflow_tasks
for delete using (public.is_admin());
create policy "Task dependencies visible to task members" on public.workflow_task_dependencies
for select to authenticated using (
  exists (select 1 from public.workflow_tasks t where t.id = task_id and (
    public.is_manager_or_admin() or t.assigned_employee_id = public.current_employee_id()
  ))
);
create policy "Managers manage task dependencies" on public.workflow_task_dependencies
for all to authenticated using (public.is_manager_or_admin()) with check (public.is_manager_or_admin());
create policy "Managers manage dependencies for assigned tasks" on public.workflow_task_dependencies
for all to authenticated using (
  public.is_manager() and exists (
    select 1 from public.workflow_tasks t
    where t.id = task_id and (
      t.assigned_employee_id = public.current_employee_id()
      or (t.project_id is not null and public.can_access_project(t.project_id))
    )
  )
) with check (
  public.is_manager() and exists (
    select 1 from public.workflow_tasks t
    where t.id = task_id and (
      t.assigned_employee_id = public.current_employee_id()
      or (t.project_id is not null and public.can_access_project(t.project_id))
    )
  )
);
create policy "Comments visible to task members" on public.task_comments
for select to authenticated using (
  exists (select 1 from public.workflow_tasks t where t.id = task_id and (
    public.is_manager_or_admin() or t.assigned_employee_id = public.current_employee_id()
  ))
);
create policy "Authorized task members comment" on public.task_comments
for insert to authenticated with check (
  author_id = (select auth.uid()) and exists (
    select 1 from public.workflow_tasks t where t.id = task_id and (
      public.is_manager_or_admin() or t.assigned_employee_id = public.current_employee_id()
    )
  )
);
create policy "Authors and managers edit comments" on public.task_comments
for update to authenticated using (author_id = (select auth.uid()) or public.is_manager_or_admin())
with check (author_id = (select auth.uid()) or public.is_manager_or_admin());
create policy "Authors and admins delete comments" on public.task_comments
for delete to authenticated using (author_id = (select auth.uid()) or public.is_admin());

create policy "Published portfolio is public" on public.portfolio
for select to anon, authenticated using (is_published);
create policy "Admins manage portfolio" on public.portfolio
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Published testimonials are public" on public.testimonials
for select to anon, authenticated using (is_published);
create policy "Admins manage testimonials" on public.testimonials
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Published blogs are public" on public.blog_posts
for select to anon, authenticated using (status = 'PUBLISHED');
create policy "Admins manage blog posts" on public.blog_posts
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Users read own notifications" on public.notifications
for select to authenticated using (recipient_id = (select auth.uid()) or public.is_admin());
create policy "Users mark own notifications read" on public.notifications
for update to authenticated using (recipient_id = (select auth.uid()))
with check (recipient_id = (select auth.uid()));
create policy "Admins manage notifications" on public.notifications
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins read audit activity" on public.activity_logs
for select to authenticated using (public.is_admin());
create policy "Media visible by associated records or publication" on public.media_files
for select to authenticated using (
  public.is_admin() or (is_public and bucket_id in ('project-media', 'portfolio-media', 'blog-media'))
  or (customer_id is not null and public.can_access_customer(customer_id))
  or (project_id is not null and public.can_access_project(project_id))
);
create policy "Admins upload media" on public.media_files
for insert to authenticated with check (public.is_admin() or uploaded_by = (select auth.uid()));
create policy "Admins manage media metadata" on public.media_files
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete media metadata" on public.media_files
for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-media', 'project-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio-media', 'portfolio-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('blog-media', 'blog-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('customer-documents', 'customer-documents', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Public read published website media" on storage.objects
for select to anon, authenticated using (bucket_id in ('project-media', 'portfolio-media', 'blog-media'));
create policy "Authorized team uploads public media" on storage.objects
for insert to authenticated with check (
  bucket_id in ('project-media', 'portfolio-media', 'blog-media')
  and (public.is_manager_or_admin() or public.is_manager())
);
create policy "Authorized team updates public media" on storage.objects
for update to authenticated using (
  bucket_id in ('project-media', 'portfolio-media', 'blog-media')
  and (public.is_manager_or_admin() or public.is_manager())
) with check (
  bucket_id in ('project-media', 'portfolio-media', 'blog-media')
  and (public.is_manager_or_admin() or public.is_manager())
);
create policy "Authorized team deletes public media" on storage.objects
for delete to authenticated using (
  bucket_id in ('project-media', 'portfolio-media', 'blog-media')
  and (public.is_manager_or_admin() or public.is_manager())
);
create policy "Customer documents scoped by associated record" on storage.objects
for select to authenticated using (
  bucket_id = 'customer-documents'
  and exists (
    select 1 from public.media_files mf
    where mf.bucket_id = storage.objects.bucket_id
      and mf.object_path = storage.objects.name
      and (public.is_admin()
        or (mf.customer_id is not null and public.can_access_customer(mf.customer_id))
        or (mf.project_id is not null and public.can_access_project(mf.project_id)))
  )
);
create policy "Team uploads customer documents" on storage.objects
for insert to authenticated with check (
  bucket_id = 'customer-documents' and (public.is_manager_or_admin() or public.is_manager())
);
create policy "Admins update customer documents" on storage.objects
for update to authenticated using (bucket_id = 'customer-documents' and public.is_admin())
with check (bucket_id = 'customer-documents' and public.is_admin());
create policy "Admins delete customer documents" on storage.objects
for delete to authenticated using (bucket_id = 'customer-documents' and public.is_admin());

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    'EMPLOYEE'
  );
  return new;
end;
$$;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
