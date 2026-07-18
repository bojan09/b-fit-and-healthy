/* Stable anatomy records shared by the SVG prototype and any future renderer. */
(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.AnatomyData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const pair = (en, mk) => ({ en, mk });
  const exercises = {
    "push-up": { name: pair("Push-up", "Склек"), href: "#/exercise?id=x1" },
    "overhead-press": { name: pair("Overhead press", "Потисок над глава"), href: "#/exercise?id=x2" },
    "curl": { name: pair("Biceps curl", "Бицепс прегиб"), href: "#/exercise?id=x3" },
    "row": { name: pair("Supported row", "Веслање со потпора"), href: "#/exercise?id=x4" },
    "pulldown": { name: pair("Lat pulldown", "Повлекување на лат машина"), href: "#/exercise?id=x5" },
    "push-up-plus": { name: pair("Push-up plus", "Склек плус"), href: "#/exercise?id=x6" },
    "plank": { name: pair("Front plank", "Преден планк"), href: "#/exercise?id=x7" },
    "side-plank": { name: pair("Side plank", "Страничен планк"), href: "#/exercise?id=x8" },
    "deadlift": { name: pair("Romanian deadlift", "Романско мртво кревање"), href: "#/exercise?id=x9" },
    "hip-thrust": { name: pair("Hip thrust", "Подигнување на колкови"), href: "#/exercise?id=x10" },
    "squat": { name: pair("Goblet squat", "Гоблет чучнување"), href: "#/exercise?id=x11" },
    "split-squat": { name: pair("Split squat", "Раздвоено чучнување"), href: "#/exercise?id=x12" },
    "calf-raise": { name: pair("Standing calf raise", "Стоечко подигнување на прсти"), href: "#/exercise?id=x13" },
    "tib-raise": { name: pair("Tibialis raise", "Подигнување на предниот дел од стапалото"), href: "#/exercise?id=x14" },
    "farmer-carry": { name: pair("Farmer carry", "Фармерско носење"), href: "#/exercise?id=x15" },
    "triceps-extension": { name: pair("Triceps extension", "Трицепс екстензија"), href: "#/exercise?id=x16" }
  };

  const make = (entry) => ({
    ...entry,
    overview: pair(
      `The ${entry.name.en.toLowerCase()} are a key ${entry.bodyGroup} muscle group that supports controlled, confident movement.`,
      `${entry.name.mk} се важна мускулна група која поддржува контролирано и сигурно движење.`
    ),
    function: pair(entry.functionEn, entry.functionMk),
    benefits: pair(
      `Training this area can improve joint control, everyday strength and balanced movement when progressed gradually.`,
      `Тренингот на оваа област може да ја подобри контролата на зглобовите, секојдневната сила и рамнотежата.`
    ),
    training: pair(entry.trainingEn, entry.trainingMk),
    commonMistake: pair(
      `A common mistake is adding load before the movement is controlled through a comfortable range.`,
      `Честа грешка е додавање тежина пред движењето да биде контролирано во удобен опсег.`
    ),
    relatedMuscleIds: entry.relatedMuscleIds || []
  });

  const muscles = [
    make({ id: "pectorals", views: ["front"], bodyGroup: "upper", name: pair("Pectorals", "Градни мускули"), anatomicalName: "Pectoralis major", functionEn: "Brings the upper arm across the body and assists pressing movements.", functionMk: "Ја носи надлактицата кон телото и помага при потиснување.", trainingEn: "Use push-ups and presses with stable shoulder blades and a controlled lowering phase.", trainingMk: "Користи склекови и потисоци со стабилни лопатки и контролирано спуштање.", exerciseIds: ["push-up"] }),
    make({ id: "deltoids", views: ["front", "back"], bodyGroup: "upper", name: pair("Deltoids", "Делтоидни мускули"), anatomicalName: "Deltoideus", functionEn: "Raises and rotates the arm while helping center the shoulder joint.", functionMk: "Ја подигнува и ротира раката и помага во стабилизација на рамото.", trainingEn: "Combine overhead pressing with controlled lateral and rear-delt raises.", trainingMk: "Комбинирај потисок над глава со контролирани странични и задни подигнувања.", exerciseIds: ["overhead-press"] }),
    make({ id: "biceps", views: ["front"], bodyGroup: "upper", name: pair("Biceps", "Бицепс"), anatomicalName: "Biceps brachii", functionEn: "Bends the elbow and turns the palm upward during pulling and carrying.", functionMk: "Го свиткува лактот и ја врти дланката нагоре при влечење и носење.", trainingEn: "Train with rows and curls while keeping the upper arm quiet and the wrist neutral.", trainingMk: "Тренирај со веслање и прегиби, со мирна надлактица и неутрален зглоб.", exerciseIds: ["curl", "row"] }),
    make({ id: "triceps", views: ["back"], bodyGroup: "upper", name: pair("Triceps", "Трицепс"), anatomicalName: "Triceps brachii", functionEn: "Straightens the elbow and supports pressing and overhead arm control.", functionMk: "Го исправува лактот и помага при потисоци и контрола над глава.", trainingEn: "Use presses and extensions through a pain-free range without flaring the elbows excessively.", trainingMk: "Користи потисоци и екстензии без прекумерно ширење на лактите.", exerciseIds: ["triceps-extension", "push-up"] }),
    make({ id: "forearms", views: ["front", "back"], bodyGroup: "upper", name: pair("Forearms", "Подлактици"), anatomicalName: "Antebrachial flexors and extensors", functionEn: "Controls the wrist and fingers and transfers force through the grip.", functionMk: "Ги контролира зглобот и прстите и ја пренесува силата преку фатот.", trainingEn: "Use loaded carries, rows and varied grips while keeping the wrist aligned.", trainingMk: "Користи носења, веслања и различни фатови со порамнет зглоб.", exerciseIds: ["farmer-carry"] }),
    make({ id: "trapezius", views: ["back"], bodyGroup: "upper", name: pair("Trapezius", "Трапез"), anatomicalName: "Trapezius", functionEn: "Moves and stabilizes the shoulder blades during reaching, pulling and carrying.", functionMk: "Ги движи и стабилизира лопатките при посегнување, влечење и носење.", trainingEn: "Rows, carries and overhead work train its different fibers when the neck stays relaxed.", trainingMk: "Веслање, носење и работа над глава ги тренираат влакната со опуштен врат.", exerciseIds: ["row", "farmer-carry"] }),
    make({ id: "latissimus", views: ["back"], bodyGroup: "upper", name: pair("Latissimus dorsi", "Широк грбен мускул"), anatomicalName: "Latissimus dorsi", functionEn: "Pulls the upper arm down and back and contributes to torso stability.", functionMk: "Ја влече надлактицата надолу и назад и помага во стабилноста на трупот.", trainingEn: "Use pulldowns and rows while moving the shoulder blade naturally instead of yanking with the arms.", trainingMk: "Користи повлекувања и веслања со природно движење на лопатките.", exerciseIds: ["pulldown", "row"] }),
    make({ id: "serratus", views: ["front"], bodyGroup: "upper", name: pair("Serratus anterior", "Преден назабен мускул"), anatomicalName: "Serratus anterior", functionEn: "Rotates the shoulder blade upward and holds it close to the ribcage during reaching.", functionMk: "Ја ротира лопатката нагоре и ја држи до ребрата при посегнување.", trainingEn: "Practice push-up plus, wall slides and carries with a smooth reach at the finish.", trainingMk: "Вежбај склек плус, лизгање по ѕид и носења со мазно посегнување.", exerciseIds: ["push-up-plus", "farmer-carry"] }),
    make({ id: "abdominals", views: ["front"], bodyGroup: "core", name: pair("Abdominals", "Стомачни мускули"), anatomicalName: "Rectus abdominis", functionEn: "Resists excessive trunk extension and helps flex the spine under control.", functionMk: "Се спротивставува на прекумерно истегнување и го свиткува 'рбетот контролирано.", trainingEn: "Use planks and controlled curl patterns while breathing and keeping the ribs stacked over the pelvis.", trainingMk: "Користи планк и контролирани свиткувања со дишење и порамнети ребра и карлица.", exerciseIds: ["plank"] }),
    make({ id: "obliques", views: ["front"], bodyGroup: "core", name: pair("Obliques", "Коси стомачни мускули"), anatomicalName: "Obliquus externus and internus", functionEn: "Rotates and side-bends the torso while resisting unwanted twisting.", functionMk: "Го ротира и странично свиткува трупот и се спротивставува на несакано вртење.", trainingEn: "Use side planks and carries before progressing to controlled rotation exercises.", trainingMk: "Користи страничен планк и носења пред контролирани ротациски вежби.", exerciseIds: ["side-plank", "farmer-carry"] }),
    make({ id: "spinal-erectors", views: ["back"], bodyGroup: "core", name: pair("Spinal erectors", "Исправувачи на 'рбетот"), anatomicalName: "Erector spinae", functionEn: "Extends and stabilizes the spine while resisting forward bending under load.", functionMk: "Го исправува и стабилизира 'рбетот и се спротивставува на наведнување под товар.", trainingEn: "Use hip hinges and carries with a braced, naturally aligned spine.", trainingMk: "Користи движења од колк и носења со стабилен, природно порамнет 'рбет.", exerciseIds: ["deadlift", "farmer-carry"] }),
    make({ id: "glutes", views: ["back"], bodyGroup: "hips", name: pair("Gluteals", "Глутеални мускули"), anatomicalName: "Gluteus maximus and medius", functionEn: "Extends and stabilizes the hip during standing, walking, running and lifting.", functionMk: "Го исправува и стабилизира колкот при стоење, одење, трчање и кревање.", trainingEn: "Combine hip thrusts, squats and split squats with full-foot pressure and pelvic control.", trainingMk: "Комбинирај подигнување колкови, чучнување и исчекор со стабилно стапало.", exerciseIds: ["hip-thrust", "squat"] }),
    make({ id: "quadriceps", views: ["front"], bodyGroup: "legs", name: pair("Quadriceps", "Квадрицепс"), anatomicalName: "Quadriceps femoris", functionEn: "Straightens the knee and helps control landing, stairs and rising from a chair.", functionMk: "Го исправува коленото и контролира слетување, скали и станување.", trainingEn: "Use squats and split squats through a comfortable depth with the knee tracking over the foot.", trainingMk: "Користи чучнување и исчекор до удобна длабочина со коленото над стапалото.", exerciseIds: ["squat", "split-squat"] }),
    make({ id: "hamstrings", views: ["back"], bodyGroup: "legs", name: pair("Hamstrings", "Задна ложа"), anatomicalName: "Biceps femoris, semitendinosus and semimembranosus", functionEn: "Bends the knee and extends the hip while helping decelerate the leg.", functionMk: "Го свиткува коленото, го исправува колкот и го забавува движењето на ногата.", trainingEn: "Use Romanian deadlifts and leg-curl patterns with a controlled stretch and stable pelvis.", trainingMk: "Користи романско мртво кревање и прегиби со контролирано истегнување.", exerciseIds: ["deadlift"] }),
    make({ id: "adductors", views: ["front"], bodyGroup: "hips", name: pair("Adductors", "Адуктори"), anatomicalName: "Adductor group", functionEn: "Draws the thigh inward and supports hip and pelvis control in single-leg movement.", functionMk: "Го носи бутот навнатре и ја контролира карлицата при движење на една нога.", trainingEn: "Use squats, lateral lunges and adductor planks with gradual range and load.", trainingMk: "Користи чучнување, страничен исчекор и адуктор планк со постепен товар.", exerciseIds: ["squat", "split-squat"] }),
    make({ id: "calves", views: ["back"], bodyGroup: "legs", name: pair("Calves", "Листови"), anatomicalName: "Gastrocnemius and soleus", functionEn: "Points the foot downward and helps propel and steady the body during walking and running.", functionMk: "Го насочува стапалото надолу и го придвижува и стабилизира телото при одење.", trainingEn: "Use straight- and bent-knee calf raises with a pause at the top and controlled lowering.", trainingMk: "Користи подигнување на прсти со исправено и свиткано колено и контролирано спуштање.", exerciseIds: ["calf-raise"] }),
    make({ id: "tibialis", views: ["front"], bodyGroup: "legs", name: pair("Tibialis anterior", "Преден потколеничен мускул"), anatomicalName: "Tibialis anterior", functionEn: "Lifts the front of the foot and controls how it meets the ground while walking.", functionMk: "Го подигнува предниот дел од стапалото и го контролира допирот со подлогата.", trainingEn: "Use tibialis raises and controlled heel walks with the toes lifting smoothly.", trainingMk: "Користи подигнување на предниот дел од стапалото и контролирано одење на пети.", exerciseIds: ["tib-raise"] })
  ];

  return { muscles, exercises };
});
