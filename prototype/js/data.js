/* ==========================================================================
   Mock data. Content objects carry both languages: { mk, en }.
   Read them with L(obj) so screens never branch on language themselves.
   ========================================================================== */

const L = (obj) => (obj && typeof obj === "object" && !Array.isArray(obj) && "mk" in obj)
  ? obj[I18n.lang] : obj;

const Store = {
  user: {
    name: { mk: "Ана", en: "Ana" },
    initials: "А",
    joined: new Date(2026, 1, 14),
    goal: "habit",
    level: "some",
    streak: 6,
    stats: { days: 68, workouts: 41, articles: 23 }
  },

  targets: { energy: 2100, protein: 105, carbs: 235, fat: 68, water: 2500 },

  today: {
    energy: 1310,
    protein: 74,
    carbs: 138,
    fat: 41,
    water: 1500,
    moveMinutes: 34,
    moveGoal: 45,
    meals: [
      { id: "m1", slot: "breakfast", name: { mk: "Овесна каша со банана", en: "Oat porridge with banana" }, kcal: 420, p: 18, c: 62, f: 11, time: "08:10" },
      { id: "m2", slot: "lunch", name: { mk: "Пилешко со леќа и салата", en: "Chicken with lentils and salad" }, kcal: 620, p: 46, c: 54, f: 20, time: "13:25" },
      { id: "m3", slot: "snack", name: { mk: "Јогурт со ореви", en: "Yoghurt with walnuts" }, kcal: 270, p: 10, c: 22, f: 10, time: "16:40" }
    ]
  },

  habits: [
    { id: "h1", name: { mk: "Чаша вода наутро", en: "Water when I wake up" }, icon: "droplet", done: true, streak: 12, week: ["done", "done", "done", "missed", "done", "done", "done"] },
    { id: "h2", name: { mk: "10.000 чекори", en: "10,000 steps" }, icon: "target", done: false, streak: 4, week: ["done", "done", "missed", "done", "done", "rest", "missed"] },
    { id: "h3", name: { mk: "Спиење пред 23:30", en: "Asleep before 23:30" }, icon: "moonStar", done: false, streak: 3, week: ["done", "missed", "done", "done", "done", "missed", "missed"] },
    { id: "h4", name: { mk: "Истегнување 5 мин", en: "5 min stretching" }, icon: "leaf", done: true, streak: 9, week: ["done", "done", "done", "done", "rest", "done", "done"] }
  ],

  weekEnergy: [
    { label: "Пон|Mon", value: 2040 }, { label: "Вто|Tue", value: 1890 },
    { label: "Сре|Wed", value: 2310 }, { label: "Чет|Thu", value: 1750 },
    { label: "Пет|Fri", value: 2260 }, { label: "Саб|Sat", value: null },
    { label: "Нед|Sun", value: 1310 }
  ],

  weightTrend: [
    { label: "1", value: 74.8 }, { label: "5", value: 74.5 }, { label: "9", value: 74.6 },
    { label: "13", value: 74.1 }, { label: "17", value: 73.8 }, { label: "21", value: 73.9 },
    { label: "25", value: 73.4 }, { label: "29", value: 73.1 }
  ],

  volumeTrend: [
    { label: "N1", value: 8200 }, { label: "N2", value: 9100 }, { label: "N3", value: 8800 },
    { label: "N4", value: 10250 }, { label: "N5", value: 10900 }, { label: "N6", value: 11400 }
  ],

  program: {
    name: { mk: "Основна сила — 3 дена", en: "Foundations of strength — 3 days" },
    week: 4, totalWeeks: 8, day: 2,
    next: {
      focus: { mk: "Долен дел на телото", en: "Lower body" },
      minutes: 38,
      exercises: [
        { id: "e1", name: { mk: "Чучањ со шипка", en: "Barbell squat" }, sets: 4, reps: "6–8", weight: 42.5 },
        { id: "e2", name: { mk: "Романско мртво кревање", en: "Romanian deadlift" }, sets: 3, reps: "8–10", weight: 45 },
        { id: "e3", name: { mk: "Искачување на клупа", en: "Step-up" }, sets: 3, reps: "10 / нога", weight: 12 },
        { id: "e4", name: { mk: "Планк", en: "Plank" }, sets: 3, reps: "40 сек", weight: 0 }
      ]
    }
  },

  sessions: [
    { date: new Date(2026, 6, 16), name: { mk: "Горен дел", en: "Upper body" }, min: 41, volume: 7420, sets: 16 },
    { date: new Date(2026, 6, 14), name: { mk: "Долен дел", en: "Lower body" }, min: 44, volume: 9880, sets: 18 },
    { date: new Date(2026, 6, 11), name: { mk: "Цело тело", en: "Full body" }, min: 36, volume: 6310, sets: 14 }
  ],

  recipes: [
    { id: "r1", tag: "breakfast", title: { mk: "Овесна каша со јаболко и цимет", en: "Oat porridge with apple and cinnamon" }, min: 10, servings: 1, kcal: 390, p: 14, c: 61, f: 9, veg: true,
      ingredients: { mk: ["60 г овесни снегулки", "250 мл млеко", "1 јаболко", "цимет", "1 лажица ореви"], en: ["60 g rolled oats", "250 ml milk", "1 apple", "cinnamon", "1 tbsp walnuts"] },
      steps: { mk: ["Загреј го млекото и додај ги снегулките.", "Вари 5 минути на тивок оган.", "Изрендај го јаболкото и промешај.", "Послужи со цимет и ореви."], en: ["Warm the milk and stir in the oats.", "Simmer for 5 minutes on low heat.", "Grate the apple and stir through.", "Serve with cinnamon and walnuts."] } },
    { id: "r2", tag: "lunch", title: { mk: "Тавче со пилешко и зеленчук", en: "Chicken and vegetable tray bake" }, min: 35, servings: 3, kcal: 520, p: 44, c: 38, f: 18, veg: false,
      ingredients: { mk: ["600 г пилешки гради", "2 пиперки", "1 тиквичка", "маслиново масло", "лук и зачини"], en: ["600 g chicken breast", "2 peppers", "1 courgette", "olive oil", "garlic and spices"] },
      steps: { mk: ["Загреј ја рерната на 200°C.", "Исечи го зеленчукот на коцки.", "Измешај сѐ со масло и зачини.", "Печи 25–30 минути."], en: ["Heat the oven to 200°C.", "Cut the vegetables into cubes.", "Toss everything with oil and spices.", "Bake for 25–30 minutes."] } },
    { id: "r3", tag: "dinner", title: { mk: "Крем супа од тиква", en: "Creamy pumpkin soup" }, min: 30, servings: 4, kcal: 240, p: 8, c: 30, f: 9, veg: true,
      ingredients: { mk: ["800 г тиква", "1 кромид", "500 мл супа", "50 мл павлака за готвење"], en: ["800 g pumpkin", "1 onion", "500 ml stock", "50 ml cooking cream"] },
      steps: { mk: ["Динстај го кромидот.", "Додај тиква и супа, вари 20 мин.", "Изблендирај додека не стане мазно.", "Зачини по вкус."], en: ["Soften the onion.", "Add pumpkin and stock, simmer 20 min.", "Blend until smooth.", "Season to taste."] } },
    { id: "r4", tag: "snack", title: { mk: "Протеински пудинг со чиа", en: "Chia protein pudding" }, min: 8, servings: 2, kcal: 210, p: 19, c: 16, f: 8, veg: true,
      ingredients: { mk: ["3 лажици чиа", "300 мл млеко", "1 мерка протеин", "шумско овошје"], en: ["3 tbsp chia seeds", "300 ml milk", "1 scoop protein", "berries"] },
      steps: { mk: ["Измешај сѐ освен овошјето.", "Остави во фрижидер 2 часа.", "Додај овошје пред служење."], en: ["Mix everything except the berries.", "Chill for 2 hours.", "Top with berries before serving."] } },
    { id: "r5", tag: "lunch", title: { mk: "Салата со леблебија и фета", en: "Chickpea and feta salad" }, min: 15, servings: 2, kcal: 430, p: 21, c: 44, f: 17, veg: true,
      ingredients: { mk: ["400 г леблебија", "100 г фета", "краставица", "домат", "лимон"], en: ["400 g chickpeas", "100 g feta", "cucumber", "tomato", "lemon"] },
      steps: { mk: ["Исцеди ја леблебијата.", "Исечи го зеленчукот.", "Измешај со фета, лимон и масло."], en: ["Drain the chickpeas.", "Chop the vegetables.", "Toss with feta, lemon and oil."] } },
    { id: "r6", tag: "dinner", title: { mk: "Печена риба со компир", en: "Baked fish with potatoes" }, min: 40, servings: 2, kcal: 480, p: 38, c: 42, f: 16, veg: false,
      ingredients: { mk: ["2 филети риба", "500 г компир", "лимон", "рузмарин"], en: ["2 fish fillets", "500 g potatoes", "lemon", "rosemary"] },
      steps: { mk: ["Исечи го компирот на кришки.", "Печи 20 мин на 200°C.", "Додај ја рибата и печи уште 15 мин."], en: ["Slice the potatoes.", "Bake 20 min at 200°C.", "Add the fish and bake 15 min more."] } }
  ],

  foods: [
    { id: "f1", name: { mk: "Јајце, варено", en: "Egg, boiled" }, unit: { mk: "1 парче (50 г)", en: "1 piece (50 g)" }, kcal: 78, p: 6.3, c: 0.6, f: 5.3 },
    { id: "f2", name: { mk: "Грчки јогурт 2%", en: "Greek yoghurt 2%" }, unit: { mk: "150 г", en: "150 g" }, kcal: 130, p: 15, c: 6, f: 4 },
    { id: "f3", name: { mk: "Пилешки гради", en: "Chicken breast" }, unit: { mk: "100 г", en: "100 g" }, kcal: 165, p: 31, c: 0, f: 3.6 },
    { id: "f4", name: { mk: "Леб 'ржан", en: "Rye bread" }, unit: { mk: "1 парче (40 г)", en: "1 slice (40 g)" }, kcal: 96, p: 3.2, c: 18, f: 1.1 },
    { id: "f5", name: { mk: "Банана", en: "Banana" }, unit: { mk: "1 средна", en: "1 medium" }, kcal: 105, p: 1.3, c: 27, f: 0.4 },
    { id: "f6", name: { mk: "Бадеми", en: "Almonds" }, unit: { mk: "30 г", en: "30 g" }, kcal: 174, p: 6.4, c: 6.1, f: 15 }
  ],

  exercises: [
    { id: "x1", name: { mk: "Чучањ со шипка", en: "Barbell squat" }, muscle: "legs", equipment: "barbell",
      primary: { mk: "Квадрицепс, глутеус", en: "Quadriceps, glutes" }, secondary: { mk: "Задна ложа, трбушни", en: "Hamstrings, core" },
      technique: { mk: ["Стапалата во ширина на рамената, прсти малку навон.", "Спушти се како да седнуваш назад.", "Колената ја следат линијата на стапалата.", "Држи го грбот неутрален низ целото движење."],
                   en: ["Feet shoulder-width, toes slightly out.", "Sit back as if lowering onto a chair.", "Knees track over the toes.", "Keep a neutral spine throughout."] },
      mistakes: { mk: ["Подигање на петиците.", "Заоблување на долниот дел од грбот.", "Пребрзо спуштање без контрола."], en: ["Heels lifting off the floor.", "Rounding the lower back.", "Dropping too fast without control."] },
      alts: { mk: ["Гоблет чучањ", "Чучањ со сопствена тежина"], en: ["Goblet squat", "Bodyweight squat"] } },
    { id: "x2", name: { mk: "Потисок на клупа", en: "Bench press" }, muscle: "chest", equipment: "barbell",
      primary: { mk: "Граден мускул", en: "Chest" }, secondary: { mk: "Трицепс, преден делтоид", en: "Triceps, front delts" },
      technique: { mk: ["Лопатките собрани и фиксирани.", "Шипката се спушта кон средината на градите.", "Лактите под агол од околу 45°."], en: ["Shoulder blades retracted and set.", "Lower the bar to mid-chest.", "Elbows at roughly 45°."] },
      mistakes: { mk: ["Отскокнување од градите.", "Целосно раширени лакти."], en: ["Bouncing the bar off the chest.", "Flaring the elbows fully."] },
      alts: { mk: ["Потисок со дамбели", "Склекови"], en: ["Dumbbell press", "Push-ups"] } },
    { id: "x3", name: { mk: "Мртво кревање", en: "Deadlift" }, muscle: "back", equipment: "barbell",
      primary: { mk: "Задна ложа, глутеус, грб", en: "Hamstrings, glutes, back" }, secondary: { mk: "Подлактици, трбушни", en: "Forearms, core" },
      technique: { mk: ["Шипката над средината на стапалото.", "Градите горе, грбот рамен.", "Притисни во подот, не влечи со грбот."], en: ["Bar over mid-foot.", "Chest up, flat back.", "Push the floor away rather than pulling with the back."] },
      mistakes: { mk: ["Заоблен грб.", "Шипката оддалечена од телото."], en: ["Rounded back.", "Bar drifting away from the body."] },
      alts: { mk: ["Романско мртво кревање", "Кетлбел свинг"], en: ["Romanian deadlift", "Kettlebell swing"] } },
    { id: "x4", name: { mk: "Згибови", en: "Pull-up" }, muscle: "back", equipment: "bodyweight",
      primary: { mk: "Латисимус", en: "Lats" }, secondary: { mk: "Бицепс, среден грб", en: "Biceps, mid-back" },
      technique: { mk: ["Виси со активни рамења.", "Влечи ги лактите кон ребрата.", "Спуштај контролирано."], en: ["Hang with active shoulders.", "Pull the elbows toward the ribs.", "Lower under control."] },
      mistakes: { mk: ["Замав со телото.", "Половично движење."], en: ["Swinging the body.", "Half range of motion."] },
      alts: { mk: ["Згибови со ластик", "Веслање на машина"], en: ["Band-assisted pull-up", "Lat pulldown"] } },
    { id: "x5", name: { mk: "Планк", en: "Plank" }, muscle: "core", equipment: "bodyweight",
      primary: { mk: "Трансверзален трбушен", en: "Transverse abdominis" }, secondary: { mk: "Рамења, глутеус", en: "Shoulders, glutes" },
      technique: { mk: ["Лактите под рамењата.", "Телото во права линија.", "Стисни ги глутеусите."], en: ["Elbows under the shoulders.", "Body in one straight line.", "Squeeze the glutes."] },
      mistakes: { mk: ["Спуштен колк.", "Задржување на здивот."], en: ["Hips sagging.", "Holding your breath."] },
      alts: { mk: ["Планк на колена", "Мртов бубачка"], en: ["Knee plank", "Dead bug"] } },
    { id: "x6", name: { mk: "Потисок над глава", en: "Overhead press" }, muscle: "shoulders", equipment: "dumbbell",
      primary: { mk: "Делтоиди", en: "Deltoids" }, secondary: { mk: "Трицепс, трбушни", en: "Triceps, core" },
      technique: { mk: ["Стапалата фиксирани, трбушни активни.", "Потисни право нагоре.", "Не го извивај долниот дел на грбот."], en: ["Feet planted, core braced.", "Press straight overhead.", "Don't arch the lower back."] },
      mistakes: { mk: ["Извиткување на грбот.", "Пренасочување на тежината напред."], en: ["Arching the back.", "Letting the weight drift forward."] },
      alts: { mk: ["Потисок седејќи", "Странично подигање"], en: ["Seated press", "Lateral raise"] } }
  ],

  articles: [
    { id: "a1", cat: "nutrition", read: 6, featured: true,
      title: { mk: "Протеинот, објаснет без митови", en: "Protein, explained without the myths" },
      excerpt: { mk: "Колку ти треба навистина, од каде да го земеш и зошто распоредот низ денот е помалку важен отколку што мислиш.", en: "How much you actually need, where to get it, and why timing matters less than you think." },
      body: { mk: ["Протеинот е градбен материјал за мускулите, но и за кожата, косата и ензимите. Кога телото нема доволно, опоравувањето е побавно.",
                   "За повеќето активни луѓе, 1,4–1,8 г протеин на килограм телесна тежина дневно е разумна цел. Ако само почнуваш, не мери сè — само погрижи се секој оброк да има извор на протеин.",
                   "Изворите не мора да се скапи: јајца, млечни производи, леќа, грав, риба и пилешко ја вршат работата подеднакво добро.",
                   "Распоредот низ денот има мал ефект споредено со вкупната дневна количина. Прво реши го вкупниот внес, потоа мисли на деталите."],
             en: ["Protein builds muscle, but also skin, hair and enzymes. When intake is low, recovery slows down.",
                  "For most active people, 1.4–1.8 g per kilogram of bodyweight per day is a sensible target. If you're just starting, don't measure everything — just make sure each meal has a protein source.",
                  "Sources don't have to be expensive: eggs, dairy, lentils, beans, fish and chicken all do the job.",
                  "Timing across the day has a small effect compared with the daily total. Fix the total first, then worry about details."] } },
    { id: "a2", cat: "sleep", read: 5,
      title: { mk: "Зошто сонот е дел од тренингот", en: "Why sleep is part of your training" },
      excerpt: { mk: "Мускулите не растат во салата — растат додека спиеш. Еве што реално помага.", en: "Muscle doesn't grow in the gym — it grows while you sleep. Here's what actually helps." },
      body: { mk: ["За време на длабокиот сон телото ослободува хормони кои учествуваат во обновата на ткивата.",
                   "Недоспаност од само неколку ноќи ја намалува силата, концентрацијата и контролата над апетитот.",
                   "Најголем ефект имаат едноставните работи: исто време на легнување, потемна и поладна соба, помалку светло еден час пред спиење."],
             en: ["During deep sleep the body releases hormones involved in tissue repair.",
                  "Even a few short nights reduce strength, focus and appetite control.",
                  "The simple things help most: a consistent bedtime, a darker and cooler room, less light in the hour before bed."] } },
    { id: "a3", cat: "habits", read: 4,
      title: { mk: "Малите навики победуваат над мотивацијата", en: "Small habits beat motivation" },
      excerpt: { mk: "Мотивацијата доаѓа и си оди. Системот останува. Како да поставиш навика што трае.", en: "Motivation comes and goes. Systems stay. How to build a habit that lasts." },
      body: { mk: ["Навиката се гради кога е доволно мала за да ја направиш и во најлошиот ден.",
                   "Врзи ја новата навика за нешто што веќе го правиш: по кафето, по бањата, пред спиење.",
                   "Пропуштен ден не е неуспех. Два пропуштени дена по ред се почеток на друга навика — затоа врати се веднаш."],
             en: ["A habit sticks when it's small enough to do on your worst day.",
                  "Anchor the new habit to something you already do: after coffee, after a shower, before bed.",
                  "One missed day isn't failure. Two in a row is the start of a different habit — so return immediately."] } },
    { id: "a4", cat: "training", read: 7,
      title: { mk: "Прогресивно оптоварување за почетници", en: "Progressive overload for beginners" },
      excerpt: { mk: "Единственото правило што мора да го разбереш ако сакаш напредок во салата.", en: "The one rule you need to understand if you want progress in the gym." },
      body: { mk: ["Телото се менува кога барањето расте постепено — повеќе повторувања, повеќе тежина или подобра техника.",
                   "Не мора да додаваш тежина секој тренинг. Едно повторување повеќе е исто така напредок.",
                   "Запишувај ги сериите. Без запис, напредокот е чувство наместо податок."],
             en: ["The body adapts when demand rises gradually — more reps, more weight or better technique.",
                  "You don't have to add weight every session. One extra rep is progress too.",
                  "Log your sets. Without a record, progress is a feeling instead of data."] } },
    { id: "a5", cat: "recovery", read: 5,
      title: { mk: "Болка во мускулите: нормално или предупредување?", en: "Muscle soreness: normal or a warning?" },
      excerpt: { mk: "Како да разликуваш нормална болка по тренинг од болка на која треба да ѝ обрнеш внимание.", en: "How to tell normal post-training soreness from pain worth paying attention to." },
      body: { mk: ["Тапа болка 24–48 часа по нов тренинг е вообичаена и обично поминува сама.",
                   "Остра болка во зглоб, болка која се влошува или трае повеќе од една недела заслужува пауза и совет од стручно лице.",
                   "Лесното движење, водата и сонот помагаат повеќе од целосно мирување."],
             en: ["A dull ache 24–48 hours after a new session is common and usually settles on its own.",
                  "Sharp joint pain, pain that worsens, or pain lasting over a week deserves rest and professional advice.",
                  "Light movement, water and sleep help more than complete rest."] } },
    { id: "a6", cat: "anatomy", read: 8,
      title: { mk: "Мускулите на грбот, едноставно објаснети", en: "The muscles of the back, made simple" },
      excerpt: { mk: "Што прави секој слој и зошто вежбите за влечење се повеќе од само 'грб'.", en: "What each layer does, and why pulling exercises are more than just 'back'." },
      body: { mk: ["Грбот не е еден мускул, туку слоеви: латисимус, трапезиус, ромбоиди и подлабоки стабилизатори.",
                   "Латисимусот ја носи главната улога при влечење надолу, трапезиусот и ромбоидите при собирање на лопатките.",
                   "Затоа програмата треба да содржи и вертикално и хоризонтално влечење."],
             en: ["The back isn't one muscle but layers: lats, traps, rhomboids and deeper stabilisers.",
                  "The lats lead in downward pulling; traps and rhomboids retract the shoulder blades.",
                  "That's why a program needs both vertical and horizontal pulling."] } }
  ],

  /* Sets logged per muscle group this training week. The gap map reads this. */
  coverage: [
    { key: "muscle.frontDelt", sets: 11 },
    { key: "muscle.chest", sets: 9 },
    { key: "muscle.triceps", sets: 6 },
    { key: "muscle.quads", sets: 8 },
    { key: "muscle.hamstrings", sets: 3 },
    { key: "muscle.rearDelt", sets: 0 },
    { key: "muscle.serratus", sets: 0 },
    { key: "muscle.core", sets: 5 }
  ],

  notifications: [
    { id: "n1", icon: "flame", unread: true, time: "09:12",
      title: { mk: "6 дена по ред", en: "6 day streak" },
      body: { mk: "Твојата серија продолжува. Само уште една навика денес.", en: "Your streak continues. Just one more habit today." } },
    { id: "n2", icon: "droplet", unread: true, time: "14:30",
      title: { mk: "Потсетник за вода", en: "Water reminder" },
      body: { mk: "Досега 1,5 л од 2,5 л. Земи чаша сега.", en: "1.5 L of 2.5 L so far. Grab a glass now." } },
    { id: "n3", icon: "book", unread: false, time: "Вчера|Yesterday",
      title: { mk: "Нова статија", en: "New article" },
      body: { mk: "Зошто сонот е дел од тренингот.", en: "Why sleep is part of your training." } }
  ],

  /* Session-only prototype state (never persisted). */
  state: {
    bookmarks: new Set(["a2"]),
    savedRecipes: new Set(["r2"]),
    notifRead: false,
    chat: []
  }
};

/** Bar labels are stored "mk|en" — split at render time. */
const splitLabel = (label) => {
  const parts = String(label).split("|");
  return parts.length === 2 ? (I18n.lang === "mk" ? parts[0] : parts[1]) : label;
};
