/* Structured editorial content kept separate from routing and screen chrome. */
const ARTICLE_RECORDS = {
  a1: {
    takeawayTitle: { en: "What to remember", mk: "Што да запомниш" },
    takeaways: {
      en: ["Daily protein matters more than perfect timing.", "Most active adults can use 1.4–1.8 g per kilogram as a practical range.", "A familiar protein source at each meal is usually enough to begin."],
      mk: ["Дневната количина е поважна од совршениот распоред.", "За повеќето активни луѓе, 1,4–1,8 г на килограм е практичен опсег.", "Познат извор на протеин во секој оброк е добар почеток."]
    },
    sections: {
      en: [
        { title: "What protein actually does", paragraphs: ["Protein supplies amino acids used to repair muscle after training, but it also supports enzymes, hormones, skin and immune function. It is useful food, not a specialist supplement.", "Training creates the reason to adapt; food and recovery provide the materials and time. More protein cannot compensate for a poorly structured programme or consistently short sleep."] },
        { title: "Choose a realistic daily target", paragraphs: ["For a healthy active adult, 1.4–1.8 grams per kilogram of bodyweight is a practical range. Someone weighing 70 kg would aim for roughly 100–125 g per day."], items: ["Use the lower end when activity is moderate.", "Use the upper end during demanding strength training or a calorie deficit.", "Treat the number as a range, not a pass-or-fail score."] },
        { title: "Build meals before chasing timing", paragraphs: ["Divide the daily target across three or four meals because that is easier to eat and remember. Each meal can contain one clear source such as eggs, yoghurt, beans, lentils, tofu, fish or poultry.", "The hour after training is not a narrow emergency window. A normal meal within a few hours is suitable for most people."] }
      ],
      mk: [
        { title: "Што навистина прави протеинот", paragraphs: ["Протеинот обезбедува аминокиселини за обновување на мускулите, но ги поддржува и ензимите, хормоните, кожата и имунитетот.", "Тренингот дава причина за адаптација, а храната и одморот ги даваат материјалите и времето."] },
        { title: "Избери реална дневна цел", paragraphs: ["За здраво активно возрасно лице, 1,4–1,8 грама на килограм телесна тежина е практичен опсег."], items: ["Користи го долниот дел при умерена активност.", "Користи го горниот дел при тежок тренинг или калориски дефицит.", "Гледај го бројот како опсег, не како тест."] },
        { title: "Прво изгради оброци", paragraphs: ["Распредели ја целта во три или четири оброци со јасен извор како јајца, јогурт, грав, леќа, тофу, риба или пилешко.", "Нормален оброк во неколку часа по тренинг е доволен за повеќето луѓе."] }
      ]
    },
    example: { title: { en: "A simple 110 g day", mk: "Едноставен ден со 110 г" }, body: { en: "Greek yoghurt and oats at breakfast, lentils and cheese at lunch, chicken or tofu at dinner, and milk or soy milk as a snack can reach the target without a complicated meal plan.", mk: "Јогурт и овес за појадок, леќа и сирење за ручек, пилешко или тофу за вечера и млеко како ужина можат да ја постигнат целта без сложен план." } },
    summary: { title: { en: "The useful rule", mk: "Корисното правило" }, body: { en: "Set a sensible range, include protein in ordinary meals, and judge the pattern across the week rather than one imperfect day.", mk: "Постави разумен опсег, вклучи протеин во обичните оброци и процени ја целата недела, не еден несовршен ден." } }
  },
  a2: {
    takeawayTitle: { en: "What to remember", mk: "Што да запомниш" },
    takeaways: {
      en: ["Sleep is part of the training plan, not time away from it.", "A consistent schedule is usually more useful than a perfect evening routine.", "A few short nights can reduce strength, focus and appetite control."],
      mk: ["Сонот е дел од планот за тренинг.", "Постојан распоред е покорисен од совршена вечерна рутина.", "Неколку кратки ноќи можат да ги намалат силата и концентрацијата."]
    },
    sections: {
      en: [
        { title: "Recovery happens between sessions", paragraphs: ["Training temporarily disrupts muscle tissue and drains energy. During sleep, the nervous system consolidates skill, tissue repair continues and the body regulates hormones involved in recovery.", "That does not mean every poor night ruins progress. It means repeated short sleep makes the same programme feel harder and less productive."] },
        { title: "Start with regular timing", paragraphs: ["Choose a wake time you can keep on most days, then work backwards to create enough time in bed. Regularity helps the body anticipate sleep better than an elaborate routine used occasionally."], items: ["Dim bright light during the final hour.", "Keep the room comfortably cool and dark.", "Move caffeine earlier if falling asleep is difficult."] },
        { title: "Adjust training after a poor night", paragraphs: ["If one night is short, keep the habit of showing up but lower the demand. Use controlled technique, stop sets earlier and avoid testing maximum strength.", "Persistent insomnia, loud snoring with daytime sleepiness, or exhaustion that does not improve deserves professional assessment."] }
      ],
      mk: [
        { title: "Опоравувањето се случува меѓу тренинзите", paragraphs: ["Тренингот привремено го оптоварува ткивото и енергијата. За време на сон продолжуваат обновувањето и учењето на движењата.", "Една лоша ноќ не го уништува напредокот, но повторен недостаток на сон го прави истиот план потежок."] },
        { title: "Почни со редовно време", paragraphs: ["Избери време за будење што можеш да го одржуваш и остави доволно време во кревет."], items: ["Намали силна светлина во последниот час.", "Одржувај ја собата темна и пријатно ладна.", "Премести го кофеинот порано ако тешко заспиваш."] },
        { title: "Прилагоди го тренингот по лоша ноќ", paragraphs: ["По една кратка ноќ, појави се, но намали го интензитетот и заврши ги сериите порано.", "Постојана несоница или силна дневна поспаност заслужуваат стручна проценка."] }
      ]
    },
    example: { title: { en: "A better minimum routine", mk: "Подобра минимална рутина" }, body: { en: "Instead of chasing ten sleep rules, keep the same wake time, prepare the room, and put the phone away 30 minutes before bed for two weeks. Review what actually changed.", mk: "Наместо десет правила, задржи исто време на будење, подготви ја собата и тргни го телефонот 30 минути пред спиење две недели." } },
    summary: { title: { en: "The useful rule", mk: "Корисното правило" }, body: { en: "Protect enough time for sleep and make the schedule repeatable. Recovery improves through consistency, not one perfect night.", mk: "Остави доволно време за сон и направи го распоредот повторлив. Опоравувањето се подобрува со постојаност." } }
  },
  a3: {
    takeawayTitle: { en: "What to remember", mk: "Што да запомниш" },
    takeaways: {
      en: ["Make the starting action smaller than your motivation requires.", "Attach the new action to a stable cue in your day.", "Track returning to the habit, not a perfect streak."],
      mk: ["Направи го почетниот чекор многу мал.", "Поврзи го со стабилен знак во денот.", "Следи го враќањето, не совршена низа."]
    },
    sections: {
      en: [
        { title: "Motivation is a visitor", paragraphs: ["Motivation changes with stress, sleep, work and mood. A system reduces how many decisions are needed when enthusiasm is low.", "The goal is not to remove effort. It is to make the first useful action obvious and easy enough to begin."] },
        { title: "Design the cue and the minimum", paragraphs: ["Choose an event that already happens, then define the smallest version of the habit."], items: ["After morning coffee, fill the water bottle.", "After work, put on training shoes and walk for five minutes.", "After dinner, prepare breakfast ingredients."] },
        { title: "Recover quickly from interruption", paragraphs: ["Missing once is normal. The important skill is restarting at the next available cue without punishment or an oversized make-up session.", "If the habit repeatedly fails, shrink it or change its cue. Treat the system as something to improve, not evidence about your character."] }
      ],
      mk: [
        { title: "Мотивацијата е посетител", paragraphs: ["Мотивацијата се менува со стресот, сонот, работата и расположението. Системот го намалува бројот на одлуки.", "Целта е првиот корисен чекор да биде очигледен и доволно лесен."] },
        { title: "Дизајнирај знак и минимум", paragraphs: ["Избери настан што веќе се случува, па дефинирај ја најмалата верзија."], items: ["По утринското кафе, наполни го шишето.", "По работа, облечи патики и пешачи пет минути.", "По вечера, подготви го појадокот."] },
        { title: "Врати се брзо", paragraphs: ["Еден пропуст е нормален. Врати се на следниот знак без казна или преголем надомест.", "Ако навиката често не успева, намали ја или промени го знакот."] }
      ]
    },
    example: { title: { en: "From 'train more' to a usable plan", mk: "Од „тренирај повеќе“ до употреблив план" }, body: { en: "Place two workouts on specific days. The minimum is arriving and completing the warm-up. Most days you will continue, but the minimum protects the routine when life is busy.", mk: "Постави два тренинга во конкретни денови. Минимумот е да пристигнеш и да го завршиш загревањето." } },
    summary: { title: { en: "The useful rule", mk: "Корисното правило" }, body: { en: "Build for ordinary difficult days. A small action repeated reliably creates more progress than an ambitious plan repeated occasionally.", mk: "Гради за обичните тешки денови. Мал чекор што се повторува е покорисен од амбициозен план што ретко се прави." } }
  },
  a4: {
    takeawayTitle: { en: "What to remember", mk: "Што да запомниш" },
    takeaways: {
      en: ["Progress one variable at a time: reps, load, range, control or total work.", "Earn progression with repeatable technique and recovery.", "Your training log should guide the next small change."],
      mk: ["Напредувај една променлива: повторувања, тежина, опсег, контрола или обем.", "Заслужи напредок со повторлива техника и опоравување.", "Дневникот нека ја води следната мала промена."]
    },
    sections: {
      en: [
        { title: "Overload means a gradually stronger signal", paragraphs: ["The body adapts when training asks slightly more than it can already do. That increase should be small enough to preserve the movement and large enough to be measurable over time.", "Adding weight is only one option. A cleaner repetition, a deeper controlled range, another repetition, or the same work with less unnecessary fatigue can all show progress."] },
        { title: "Choose one variable", paragraphs: ["Changing load, repetitions and exercise difficulty together makes it hard to know what worked. Keep the exercise and target range stable, then progress the simplest variable."], items: ["Add one repetition while technique stays consistent.", "When every set reaches the top of the range, add the smallest available load.", "Return to the lower end of the repetition range and build again."] },
        { title: "Know when not to progress", paragraphs: ["Do not add demand because the calendar says so. Repeat the current session when technique changes, the target muscle is no longer doing the work, soreness is unusually high, or sleep and recovery are poor.", "A plateau across one or two sessions is normal. Look for a trend across several exposures before changing the whole programme."] },
        { title: "Use a next-session checklist", paragraphs: ["Before the next workout, review the previous load, repetitions and notes."], items: ["Can you repeat every set with the same range and control?", "Did you finish with one to three good repetitions still possible?", "Has recovery returned to normal?", "If yes, progress the smallest useful variable. If no, repeat or reduce demand."] }
      ],
      mk: [
        { title: "Оптоварувањето е постепено посилен сигнал", paragraphs: ["Телото се адаптира кога тренингот бара малку повеќе од тоа што веќе може. Зголемувањето треба да ја зачува техниката и да биде мерливо.", "Повеќе тежина е само една опција. Подобра контрола, поголем опсег или уште едно повторување исто така се напредок."] },
        { title: "Избери една променлива", paragraphs: ["Ако истовремено ги менуваш тежината, повторувањата и вежбата, тешко е да знаеш што помогнало."], items: ["Додај едно повторување со иста техника.", "Кога сите серии стигнуваат до врвот на опсегот, додај најмала тежина.", "Врати се на долниот број повторувања и гради повторно."] },
        { title: "Кога да не напредуваш", paragraphs: ["Не додавај товар само затоа што поминала една недела. Повтори ако техниката се менува или опоравувањето е слабо.", "Еден или два исти тренинга не се вистинско плато. Следи тренд низ повеќе сесии."] },
        { title: "Проверка за следната сесија", paragraphs: ["Прегледај ги претходната тежина, повторувањата и белешките."], items: ["Можеш ли да го повториш истиот опсег и контрола?", "Останаа ли едно до три добри повторувања?", "Дали опоравувањето е нормално?", "Ако да, зголеми ја најмалата корисна променлива."] }
      ]
    },
    example: { title: { en: "Beginner example: goblet squat", mk: "Почетнички пример: goblet squat" }, body: { en: "Start with 3 sets of 8–10 reps at 12 kg. When you can perform 10, 10 and 10 with stable depth and two good reps in reserve, move to 14 kg and return to 8 reps. That is progressive overload without forcing a personal record every session.", mk: "Почни со 3 серии од 8–10 повторувања со 12 кг. Кога можеш 10, 10 и 10 со стабилна длабочина, премини на 14 кг и врати се на 8 повторувања." } },
    summary: { title: { en: "The useful rule", mk: "Корисното правило" }, body: { en: "Progress is a series of small, earned changes. Record the work, repeat good technique, and increase only what recovery can support.", mk: "Напредокот е низа мали заслужени промени. Запиши ја работата, повтори добра техника и зголеми само колку што поддржува опоравувањето." } }
  },
  a5: {
    takeawayTitle: { en: "What to remember", mk: "Што да запомниш" },
    takeaways: {
      en: ["Dull muscle tenderness after unfamiliar work is common.", "Sharp, worsening or joint-focused pain is not a training target.", "Soreness is not required for a productive workout."],
      mk: ["Тапа мускулна чувствителност по нов тренинг е честа.", "Остра или влошена болка во зглоб не е цел.", "Болката не е потребна за добар тренинг."]
    },
    sections: {
      en: [
        { title: "What normal soreness feels like", paragraphs: ["Delayed-onset muscle soreness usually appears 12–24 hours after unfamiliar work, feels broad and tender in the trained muscle, and improves over several days.", "It is more likely after a new exercise, a large jump in volume, or a strong lengthening phase. It does not measure how much muscle was built."] },
        { title: "Warning signs deserve a pause", paragraphs: ["Pain is more concerning when it is sudden, sharp, located in a joint, changes normal movement, keeps worsening, or includes swelling, weakness or numbness."], items: ["Stop the movement that triggers sharp pain.", "Do not stretch aggressively into pain.", "Seek professional advice for severe symptoms or pain that does not settle."] },
        { title: "Recover without becoming inactive", paragraphs: ["Gentle movement, adequate food, hydration and sleep usually help more than complete bed rest. Train another area or reduce load if normal movement is comfortable.", "Next time, increase volume gradually instead of trying to compensate for missed sessions."] }
      ],
      mk: [
        { title: "Како изгледа нормална болка", paragraphs: ["Одложената мускулна болка обично се јавува 12–24 часа по непозната работа и се намалува за неколку дена.", "Почеста е по нова вежба или голем скок во обем и не мери колку мускул е изграден."] },
        { title: "Предупредувачки знаци", paragraphs: ["Позагрижувачка е нагла, остра болка во зглоб што го менува движењето или се влошува."], items: ["Запри го движењето што предизвикува остра болка.", "Не истегнувај агресивно во болка.", "Побарај стручен совет за силни или трајни симптоми."] },
        { title: "Опорави се без целосна неактивност", paragraphs: ["Лесно движење, доволно храна, вода и сон обично помагаат повеќе од целосно мирување.", "Следниот пат зголеми го обемот постепено."] }
      ]
    },
    example: { title: { en: "Soreness or warning?", mk: "Болка или предупредување?" }, body: { en: "Both thighs feeling tender the day after a first squat session is typical. A sharp pain inside one knee during every squat is a reason to stop, adjust and assess—not to push through.", mk: "Чувствителност во двата бута по прв тренинг со чучнување е честа. Остра болка во едно колено при секое повторување е причина да запреш." } },
    summary: { title: { en: "The useful rule", mk: "Корисното правило" }, body: { en: "Normal soreness is broad, delayed and improving. Pain that is sharp, localised or worsening deserves caution and, when needed, professional assessment.", mk: "Нормалната болка е широка, одложена и се подобрува. Остра, локална или влошена болка бара претпазливост." } }
  },
  a6: {
    takeawayTitle: { en: "What to remember", mk: "Што да запомниш" },
    takeaways: {
      en: ["The back is a coordinated group, not one muscle.", "Vertical and horizontal pulls train different emphases.", "Shoulder-blade motion is as important as moving the hands."],
      mk: ["Грбот е координирана група, не еден мускул.", "Вертикалните и хоризонталните влечења имаат различен акцент.", "Движењето на лопатките е исто важно како движењето на рацете."]
    },
    sections: {
      en: [
        { title: "The large movement muscles", paragraphs: ["The latissimus dorsi helps bring the upper arm down and back. The trapezius spans the neck to the middle back and contributes differently through its upper, middle and lower fibres.", "Rear deltoids assist horizontal pulling while the spinal erectors help the trunk resist unwanted rounding."] },
        { title: "The shoulder-blade team", paragraphs: ["Rhomboids and the middle trapezius draw the shoulder blades toward each other. Lower trapezius and serratus anterior help control upward rotation and stable overhead movement.", "A useful programme trains the shoulder blades to retract, rotate and remain controlled rather than simply squeezing them back in every exercise."] },
        { title: "Cover the main pulling patterns", paragraphs: ["Use a small selection of repeatable movements instead of a separate exercise for every anatomical name."], items: ["A pulldown or assisted pull-up for vertical pulling.", "A chest-supported or cable row for horizontal pulling.", "A hinge or back extension for trunk endurance.", "A controlled overhead or wall-slide pattern for shoulder-blade rotation."] }
      ],
      mk: [
        { title: "Големите мускули за движење", paragraphs: ["Латисимусот ја носи надлактицата надолу и назад. Трапезиусот се протега од вратот до средината на грбот.", "Задните делтоиди помагаат при хоризонтално влечење, а исправувачите го стабилизираат трупот."] },
        { title: "Тимот на лопатките", paragraphs: ["Ромбоидите и средниот трапезиус ги приближуваат лопатките. Долниот трапезиус и сератусот ја контролираат ротацијата нагоре.", "Добра програма тренира повлекување, ротација и стабилна контрола."] },
        { title: "Покриј ги главните влечења", paragraphs: ["Користи мал избор повторливи движења наместо посебна вежба за секое име."], items: ["Pulldown или помогнато влечење за вертикално влечење.", "Веслање со потпора или сајла за хоризонтално влечење.", "Hinge или back extension за издржливост на трупот.", "Контролирано движење над глава за ротација на лопатката."] }
      ]
    },
    example: { title: { en: "A balanced two-exercise start", mk: "Балансиран почеток со две вежби" }, body: { en: "Pair a neutral-grip pulldown with a chest-supported row. Progress their repetitions separately and keep the neck relaxed. Add more only when a clear programme need appears.", mk: "Комбинирај neutral-grip pulldown со веслање со потпора. Напредувај ги повторувањата одделно и држи го вратот опуштен." } },
    summary: { title: { en: "The useful rule", mk: "Корисното правило" }, body: { en: "Train the back through complementary patterns, allow the shoulder blades to move naturally, and use the anatomy names to understand—not complicate—the programme.", mk: "Тренирај го грбот со дополнителни обрасци, дозволи природно движење на лопатките и користи ја анатомијата за разбирање, не за комплицирање." } }
  }
};

const ArticleContent = {
  records: ARTICLE_RECORDS,

  get(id) {
    return this.records[id] || this.records.a1;
  },

  render(article) {
    const content = this.get(article.id);
    const takeaways = L(content.takeaways);
    const sections = L(content.sections);
    const takeawayId = `article-takeaways-${article.id}`;

    return `
      <p class="article-standfirst">${esc(L(article.excerpt))}</p>
      <aside class="article-takeaways" aria-labelledby="${takeawayId}">
        <h2 id="${takeawayId}">${esc(L(content.takeawayTitle))}</h2>
        <ul>${takeaways.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </aside>
      ${sections.map((section) => `
        <section class="article-section">
          <h2>${esc(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
          ${section.items ? `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
        </section>`).join("")}
      <aside class="article-example">
        <h2>${esc(L(content.example.title))}</h2>
        <p>${esc(L(content.example.body))}</p>
      </aside>
      <section class="article-summary">
        <h2>${esc(L(content.summary.title))}</h2>
        <p>${esc(L(content.summary.body))}</p>
      </section>`;
  }
};

