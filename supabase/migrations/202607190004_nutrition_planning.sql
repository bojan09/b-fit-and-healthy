begin;

create table public.foods (
  id uuid primary key default gen_random_uuid(), owner_id uuid references auth.users(id) on delete cascade,
  source text not null default 'custom' check (source in ('local','usda','custom')), external_id text,
  name text not null check (char_length(name) between 2 and 160), brand text check (brand is null or char_length(brand) <= 120),
  serving_grams numeric(8,2) not null default 100 check (serving_grams > 0 and serving_grams <= 5000),
  energy_kcal numeric(9,2) not null default 0 check (energy_kcal >= 0), protein_g numeric(9,2) not null default 0 check (protein_g >= 0),
  carbohydrate_g numeric(9,2) not null default 0 check (carbohydrate_g >= 0), fat_g numeric(9,2) not null default 0 check (fat_g >= 0),
  fibre_g numeric(9,2) not null default 0 check (fibre_g >= 0), is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()),
  unique(source, external_id)
);
create index foods_owner_name_idx on public.foods(owner_id, name); create index foods_public_name_idx on public.foods(is_public, name);

create table public.food_favourites (
  user_id uuid not null references auth.users(id) on delete cascade, food_id uuid not null references public.foods(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()), primary key(user_id, food_id)
);

create table public.meal_entries (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null default current_date, meal_slot text not null check (meal_slot in ('breakfast','lunch','dinner','snack')),
  food_id uuid references public.foods(id) on delete set null, food_name text not null check (char_length(food_name) between 2 and 160),
  amount_grams numeric(8,2) not null check (amount_grams > 0 and amount_grams <= 5000), energy_kcal numeric(9,2) not null check (energy_kcal >= 0),
  protein_g numeric(9,2) not null default 0 check (protein_g >= 0), carbohydrate_g numeric(9,2) not null default 0 check (carbohydrate_g >= 0),
  fat_g numeric(9,2) not null default 0 check (fat_g >= 0), fibre_g numeric(9,2) not null default 0 check (fibre_g >= 0),
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create index meal_entries_user_day_idx on public.meal_entries(user_id, logged_on, meal_slot);

create table public.recipes (
  id uuid primary key default gen_random_uuid(), owner_id uuid references auth.users(id) on delete cascade, slug text not null unique,
  title_en text not null, title_mk text not null, summary_en text not null, summary_mk text not null,
  prep_minutes integer not null default 0 check (prep_minutes between 0 and 1440), cook_minutes integer not null default 0 check (cook_minutes between 0 and 1440),
  servings numeric(6,2) not null default 1 check (servings > 0), energy_kcal numeric(9,2) not null default 0 check (energy_kcal >= 0),
  protein_g numeric(9,2) not null default 0 check (protein_g >= 0), carbohydrate_g numeric(9,2) not null default 0 check (carbohydrate_g >= 0),
  fat_g numeric(9,2) not null default 0 check (fat_g >= 0), fibre_g numeric(9,2) not null default 0 check (fibre_g >= 0),
  tags text[] not null default '{}', is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(), recipe_id uuid not null references public.recipes(id) on delete cascade,
  position integer not null default 0, name_en text not null, name_mk text not null, quantity numeric(8,2) not null check (quantity > 0), unit text not null
);
create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(), recipe_id uuid not null references public.recipes(id) on delete cascade,
  position integer not null, instruction_en text not null, instruction_mk text not null, unique(recipe_id, position)
);
create table public.saved_recipes (
  user_id uuid not null references auth.users(id) on delete cascade, recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()), primary key(user_id, recipe_id)
);

create table public.meal_plan_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  planned_on date not null, meal_slot text not null check (meal_slot in ('breakfast','lunch','dinner','snack')),
  recipe_id uuid references public.recipes(id) on delete set null, label text not null check (char_length(label) between 2 and 160),
  servings numeric(6,2) not null default 1 check (servings > 0 and servings <= 50),
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create index meal_plan_user_day_idx on public.meal_plan_items(user_id, planned_on, meal_slot);

create table public.grocery_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160), quantity numeric(9,2) check (quantity is null or quantity > 0),
  unit text check (unit is null or char_length(unit) <= 30), category text not null default 'Other' check (char_length(category) between 1 and 60),
  is_checked boolean not null default false, source text not null default 'manual' check (source in ('manual','meal_plan')),
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create index grocery_items_user_checked_idx on public.grocery_items(user_id, is_checked, category);

create trigger foods_set_updated_at before update on public.foods for each row execute procedure public.set_updated_at();
create trigger meal_entries_set_updated_at before update on public.meal_entries for each row execute procedure public.set_updated_at();
create trigger recipes_set_updated_at before update on public.recipes for each row execute procedure public.set_updated_at();
create trigger meal_plan_items_set_updated_at before update on public.meal_plan_items for each row execute procedure public.set_updated_at();
create trigger grocery_items_set_updated_at before update on public.grocery_items for each row execute procedure public.set_updated_at();

alter table public.foods enable row level security; alter table public.food_favourites enable row level security;
alter table public.meal_entries enable row level security; alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security; alter table public.recipe_steps enable row level security;
alter table public.saved_recipes enable row level security; alter table public.meal_plan_items enable row level security;
alter table public.grocery_items enable row level security;

create policy "foods_select_visible" on public.foods for select to authenticated using (is_public or auth.uid() = owner_id);
create policy "foods_own" on public.foods for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id and not is_public);
create policy "food_favourites_own" on public.food_favourites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meal_entries_own" on public.meal_entries for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recipes_select_visible" on public.recipes for select to authenticated using (is_public or auth.uid() = owner_id);
create policy "recipes_own" on public.recipes for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id and not is_public);
create policy "recipe_ingredients_visible" on public.recipe_ingredients for select to authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and (r.is_public or r.owner_id = auth.uid())));
create policy "recipe_steps_visible" on public.recipe_steps for select to authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and (r.is_public or r.owner_id = auth.uid())));
create policy "saved_recipes_own" on public.saved_recipes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meal_plan_items_own" on public.meal_plan_items for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "grocery_items_own" on public.grocery_items for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.foods, public.food_favourites, public.meal_entries, public.recipes, public.recipe_ingredients, public.recipe_steps, public.saved_recipes, public.meal_plan_items, public.grocery_items from anon;
grant select, insert, update, delete on public.foods, public.food_favourites, public.meal_entries, public.recipes, public.saved_recipes, public.meal_plan_items, public.grocery_items to authenticated;
grant select on public.recipe_ingredients, public.recipe_steps to authenticated;

insert into public.recipes (id, slug, title_en, title_mk, summary_en, summary_mk, prep_minutes, cook_minutes, servings, energy_kcal, protein_g, carbohydrate_g, fat_g, fibre_g, tags, is_public) values
('11111111-1111-4111-8111-111111111111','oat-banana-breakfast','Warm oat and banana bowl','Топла овесна каша со банана','A steady breakfast with oats, fruit and yoghurt.','Стабилен појадок со овес, овошје и јогурт.',8,5,1,438,18,69,11,9,array['Breakfast','Quick'],true),
('22222222-2222-4222-8222-222222222222','lentil-chicken-salad','Lentil and chicken salad','Салата со леќа и пилешко','A filling lunch built around legumes, vegetables and lean protein.','Заситен ручек со мешунки, зеленчук и немасен протеин.',15,20,2,512,43,48,17,13,array['Lunch','Protein'],true),
('33333333-3333-4333-8333-333333333333','herby-bean-tray','Herby bean and vegetable tray','Тава со грав, зеленчук и билки','A flexible weeknight tray with beans and seasonal vegetables.','Флексибилна вечера со грав и сезонски зеленчук.',12,28,4,386,17,57,11,15,array['Dinner','Plant-forward'],true);

insert into public.recipe_ingredients (recipe_id, position, name_en, name_mk, quantity, unit) values
('11111111-1111-4111-8111-111111111111',1,'Rolled oats','Овесни снегулки',60,'g'),
('11111111-1111-4111-8111-111111111111',2,'Banana','Банана',1,'piece'),
('11111111-1111-4111-8111-111111111111',3,'Plain yoghurt','Обичен јогурт',150,'g'),
('22222222-2222-4222-8222-222222222222',1,'Cooked lentils','Варена леќа',240,'g'),
('22222222-2222-4222-8222-222222222222',2,'Chicken breast','Пилешки гради',220,'g'),
('22222222-2222-4222-8222-222222222222',3,'Mixed vegetables','Мешан зеленчук',300,'g'),
('22222222-2222-4222-8222-222222222222',4,'Olive oil','Маслиново масло',2,'tbsp'),
('33333333-3333-4333-8333-333333333333',1,'Cooked white beans','Варен бел грав',600,'g'),
('33333333-3333-4333-8333-333333333333',2,'Seasonal vegetables','Сезонски зеленчук',800,'g'),
('33333333-3333-4333-8333-333333333333',3,'Olive oil','Маслиново масло',3,'tbsp');

insert into public.recipe_steps (recipe_id, position, instruction_en, instruction_mk) values
('11111111-1111-4111-8111-111111111111',1,'Cook the oats with water until creamy.','Сварете го овесот со вода додека не стане кремаст.'),
('11111111-1111-4111-8111-111111111111',2,'Slice the banana and serve with yoghurt.','Исечете ја бананата и послужете со јогурт.'),
('22222222-2222-4222-8222-222222222222',1,'Cook and rest the chicken, then slice it.','Испечете го пилешкото, оставете го да одмори и исечете го.'),
('22222222-2222-4222-8222-222222222222',2,'Combine all ingredients and season to taste.','Соединете ги состојките и зачинете по вкус.'),
('33333333-3333-4333-8333-333333333333',1,'Heat the oven to 210°C.','Загрејте ја рерната на 210°C.'),
('33333333-3333-4333-8333-333333333333',2,'Toss everything on a tray and roast until browned.','Измешајте сè во тава и печете додека не зарумени.');

commit;
