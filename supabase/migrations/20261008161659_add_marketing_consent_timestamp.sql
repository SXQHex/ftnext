alter table public.leads
  add column if not exists marketing_consent_at timestamptz null;

alter table public.registrations
  add column if not exists marketing_consent_at timestamptz null;

create or replace function public.set_marketing_consent_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.marketing_consent then
    new.marketing_consent_at := timezone('utc', now());
  else
    new.marketing_consent_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists leads_set_marketing_consent_at on public.leads;
create trigger leads_set_marketing_consent_at
before insert or update of marketing_consent on public.leads
for each row
execute function public.set_marketing_consent_at();

drop trigger if exists registrations_set_marketing_consent_at on public.registrations;
create trigger registrations_set_marketing_consent_at
before insert or update of marketing_consent on public.registrations
for each row
execute function public.set_marketing_consent_at();
