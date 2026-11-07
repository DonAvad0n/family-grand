const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const b64 = (name) => "data:image/jpeg;base64," + fs.readFileSync(path.join(DIR, name + ".jpg")).toString("base64");
const b64png = (name) => "data:image/png;base64," + fs.readFileSync(path.join(DIR, name + ".png")).toString("base64");

const IMG = {};
// E(name, img, days, timesArr|string, desc, reward)
// timesArr: массив времени (сессий). Если число известно — считается длина.
// cnt: число сессий в день; cntLabel — текст для сводки (непрерывные/окна).
const E = (name, img, days, time, desc, reward, cnt, cntLabel) => {
  IMG[name] = b64(img);
  const times = Array.isArray(time) ? time : null;
  const t = Array.isArray(time) ? time.join(", ") : time;
  const n = times ? times.length : (cnt != null ? cnt : 1);
  const cl = times ? (times.length + " раз") : (cntLabel || (cnt != null ? cnt + " раз" : "в течение дня"));
  return { name, i: img, days, t, times, n, cl, d: desc, r: reward, imgKey: name };
};

const DAILY = [0,1,2,3,4,5,6], WEEK=[0,1,2,3,4], MWS=[0,2,5];
// n: число сессий в день (если чётко определено), иначе note-объяснение
const EVENTS = [
  E("Захват станка для печати денег","event-stanok-deneg",DAILY,"весь день","Найти печатный станок в банке и перенести его на территорию семейного дома. После установки он приносит семье деньги.","$1 000 / мин на семейный счёт",1,"1 раз (установка)"),
  E("Война за Ресурсы","event-vojna-resursy",DAILY,["12:00","14:00","16:00","18:00","20:00","22:00"],"Битва семей за контроль над случайным бизнесом: захватывай и удерживай как можно больше предприятий.","до $20 000 каждый час за подконтрольный бизнес",6,"6 раз"),
  E("Семейный рейд","event-semejnyj-rejd",DAILY,"12:00–23:00 (окно)","Собери группу из 5 человек и атакуй дом другой семьи.","$150 000 на счёт семьи",1,"1 раз (по инициативе)"),
  E("Контроль штата","event-kontrol-shtata",DAILY,"по таймеру","Большое сражение семей за контроль над штатом: захват зон и отражение атак.","бонусы за удержанные территории",1,"по таймеру"),
  E("Захват завода РП тикетов","event-zavod-rp-tiketov",DAILY,["16:30","22:30"],"Захвати завод и получи RP тикеты.","5 RP тикетов единоразово",2,"2 раза"),
  E("Ограбление оружейного завода","event-oruzhejnyj-zavod",DAILY,"4 раза в день","Ограби оружейный завод и вывези вооружение.","Оружейный пак на семейный склад",4,"4 раза"),
  E("Захват аванпостов на Кайо Перико","event-avanposty-kajo",DAILY,"по таймеру","Командный захват и удержание аванпоста на острове до конца таймера.","Билет Cayo Perico и предметы",1,"по таймеру"),
  E("Захват бизнеса","event-zahvat-biznesa",DAILY,["19:00"],"Бизнес получает семья с наибольшим числом очков к концу захвата.","$20 000 прибыль, обновляется каждые 24 ч",1,"1 раз"),
  E("Битва за причал","event-bitva-za-prichal",DAILY,["01:10","03:10","05:10","07:10","13:10","19:10"],"Сражение за порт Лос-Сантоса.","Боеприпасы и экипировка на склад",6,"6 раз"),
  E("Захват виноградников","event-zahvat-vinogradnikov",DAILY,["20:15"],"Борьба семей за виноградник: перетащи фрукты в соковыжималку.","10 соков выносливости и 10 соков езды",1,"1 раз"),
  E("Оставленные компоненты","event-ostavlennye-komponenty2",DAILY,["20:30"],"Определи местоположение оставленных компонентов оружия по фотографии.","Амуниция",1,"1 раз"),
  E("Битва за рейтинг","event-bitva-za-rejting",DAILY,["21:30"],"Семья с наибольшим числом очков к концу захвата получает рейтинг.","30 очков рейтинга",1,"1 раз"),
  E("Ограбление магазина","event-ograblenie-magazina",DAILY,"10:00–23:00 (окно)","Собери 5 человек, удерживай магазин 24/7 в течение 15 минут.","$300 000 на баланс семьи",1,"1 раз (по инициативе)"),
  E("Ограбление магазина оружия","event-ograblenie-magazina-oruzhija",DAILY,"весь день","Держи оборону магазина оружия 15 минут.","Партия амуниции на склад",1,"1 раз (по инициативе)"),
  E("Доставка каравана","event-dostavka-karavana",DAILY,"весь день","Доставь груз, имея хотя бы одного союзника.","25 семейных очков",1,"1-2 раза (по инициативе)"),
  E("Захват литейного завода","event-zahvat-litejnogo-zavoda",DAILY,["14:40"],"Захвати завод — семья-владелец получает всю прибыль завода за сутки.","Прибыль завода за сутки",1,"1 раз"),
  E("Ограбление нарколаборатории","event-narkolaboratorija2",DAILY,"10:00–22:00 (1 раз/день)","Нападение на лабораторию один раз в день, забери всё содержимое за 15 минут.","Содержимое лаборатории",1,"1 раз"),
  E("Ограбление банка","event-ograblenie-banka",MWS,["21:00"],"Ограби центральный банк.","$800 000",1,"1 раз"),
  E("Захват авианосца","event-zahvat-avianosca",WEEK,["21:00"],"Доберись до авианосца и вывези амуницию на семейный склад.","Амуниция на склад",1,"1 раз"),
  E("Нападение на тюрьму","event-napadenie-na-tjurmu",[6],"по расписанию","Прорви защиту тюрьмы и ликвидируй всех сотрудников гос. организаций.","Уникальные маски и амуниция",1,"по расписанию"),
  E("Битва семей","event-bitva-semej",WEEK,"1-я половина месяца","Первые 16 семей рейтинга попадают в сетку Family War.","Фрагмент секретного билета",1,"1 раз в месяц"),
];

const BG = b64("gta-bg");
const WALLPAPER = b64png("main-wallpaper");
const IMG_JSON = JSON.stringify(IMG).replace(/</g, "\\u003c");
const DATA_JSON = JSON.stringify(EVENTS).replace(/</g, "\\u003c");

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Семья «Grand» — расписание</title>
<style>
:root{--gold:#f5b942;--orange:#ff8a2a;--ink:#0e1626;--line:rgba(245,185,66,.35);--oline:rgba(255,138,42,.75);--txt:#eef2f7;--muted:#a9b6c8}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:"Segoe UI",Roboto,Arial,sans-serif;color:var(--txt);background:#11151c;position:relative;overflow:hidden}

/* ---------- СТАРТОВЫЙ ЭКРАН ---------- */
#splash{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;transition:opacity .6s}
#splash .wp{position:absolute;inset:0;background-image:url("${WALLPAPER}");background-size:cover;background-position:center;z-index:-1}
#splash .dim{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(10,8,18,.15),rgba(8,6,14,.6));z-index:-1}
.splash-btn{cursor:pointer;font-family:inherit;font-size:20px;font-weight:800;letter-spacing:1px;color:var(--gold);
  background:rgba(12,14,22,.55);border:3px solid var(--gold);border-radius:10px;padding:16px 42px;
  box-shadow:0 0 30px rgba(245,185,66,.35),inset 0 0 20px rgba(245,185,66,.15);
  text-transform:uppercase;transition:.2s;backdrop-filter:blur(2px)}
.splash-btn:hover{background:var(--gold);color:#171300;transform:translateY(-2px);box-shadow:0 0 40px rgba(245,185,66,.6)}
#splash.hide{opacity:0;pointer-events:none}

/* ---------- РАБОЧИЙ СТОЛ ---------- */
#desk{position:fixed;inset:0;display:block;z-index:10}
#desk.off{display:none}
#bg2{position:fixed;inset:0;background-image:url("${BG}");background-size:cover;background-position:center;z-index:-2;filter:brightness(.8)}
#veil{position:fixed;inset:0;background:linear-gradient(90deg,rgba(6,9,16,.86) 0%,rgba(10,13,22,.6) 55%,rgba(6,9,16,.4) 100%);z-index:-1}
.desk-top{position:absolute;top:0;left:0;right:0;padding:14px 22px;display:flex;align-items:center;gap:14px;height:120px}
.desk-left{display:flex;align-items:center;gap:12px;margin-top:26px}
.desk-logo{font-size:20px;font-weight:800;letter-spacing:2px;color:var(--gold);text-shadow:0 0 16px rgba(245,185,66,.5)}
.desk-day{font-size:13px;color:var(--muted)}
.desk-clock{position:absolute;left:50%;top:auto;bottom:14px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;background:rgba(10,14,22,.55);border:1px solid rgba(190,255,40,.6);border-radius:16px;padding:10px 34px;box-shadow:0 0 24px rgba(190,255,40,.35),inset 0 0 18px rgba(190,255,40,.12)}
.desk-clock #clockTime{font-size:50px;font-weight:800;color:#eaffd6;letter-spacing:3px;font-variant-numeric:tabular-nums;line-height:1;text-shadow:0 0 8px #c8ff4d,0 0 18px #b6f92e,0 0 34px #9fe31a}
.desk-clock .clock-zone{font-size:13px;font-weight:700;color:#c8ff4d;letter-spacing:2px;margin-top:5px;text-shadow:0 0 8px #b6f92e}

/* Левая колонка */
.side{position:absolute;left:0;top:70px;bottom:0;width:392px;padding:10px 16px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}
.side-title{font-size:13px;font-weight:800;color:var(--gold);letter-spacing:1px;text-transform:uppercase;opacity:.9}
.side-column{display:flex;flex-direction:column;gap:10px}
.side-card{display:flex;gap:10px;align-items:center;width:100%;cursor:pointer;background:rgba(16,22,34,.78);border:1px solid var(--line);border-radius:8px;padding:8px;color:var(--txt);text-align:left;font:inherit;transition:.12s}
.side-card:hover{background:rgba(40,56,78,.8);transform:translateX(2px)}
.side-card img{width:56px;height:48px;object-fit:cover;flex-shrink:0}
.side-card .s-t{font-weight:700;font-size:12.5px;line-height:1.25;color:#fff}
.side-card .s-tm{color:var(--gold);font-weight:700;font-size:11.5px;margin-top:2px}

/* Ближайшее мероприятие */
.next-card{position:relative;display:flex;gap:12px;align-items:center;width:100%;cursor:pointer;background:linear-gradient(120deg,rgba(245,185,66,.22),rgba(255,138,42,.12));border:2px solid var(--gold);border-radius:12px;padding:12px;color:var(--txt);text-align:left;font:inherit;overflow:hidden}
.next-card:hover{border-color:#ffd98a}
.next-card img{width:74px;height:60px;object-fit:cover;border-radius:6px;flex-shrink:0}
.next-card .nx-lab{font-size:10.5px;font-weight:800;color:var(--gold);letter-spacing:.5px;text-transform:uppercase}
.next-card .nx-t{font-weight:800;font-size:14px;color:#fff;line-height:1.2}
.next-card .nx-tm{font-weight:800;font-size:15px;color:#ffd98a;margin-top:3px}
.next-card .nx-in{font-size:11px;color:var(--muted);margin-top:2px}

/* Кнопка показать все */
.showall{display:block;width:100%;cursor:pointer;background:transparent;border:2px solid var(--gold);color:var(--gold);font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.5px;padding:12px;border-radius:8px;transition:.15s;text-transform:uppercase}
.showall:hover{background:var(--gold);color:#171300}

/* Большая кнопка скрипта внизу */
.script-btn{margin-top:auto;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;text-decoration:none;
  background:linear-gradient(120deg,rgba(255,60,50,.25),rgba(200,30,20,.15));border:2px solid rgba(255,80,60,.7);color:#ffe0dc;
  font-family:inherit;font-size:16px;font-weight:800;letter-spacing:.5px;line-height:1.35;padding:22px 26px;border-radius:12px;
  box-shadow:0 6px 26px rgba(0,0,0,.4),inset 0 0 20px rgba(255,60,50,.12);transition:.18s}
.script-btn:hover{background:linear-gradient(120deg,rgba(255,60,50,.4),rgba(220,40,25,.25));color:#fff;transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,60,50,.35)}

/* Основная область: кнопки сверху слева + placeholder */
.main{position:absolute;right:0;top:70px;bottom:0;left:424px;display:flex;flex-direction:column;padding:14px 20px 20px;gap:14px}
.main-actions{display:flex;flex-direction:column;gap:12px;width:340px;margin-top:90px}
.main-actions .next-card{width:100%}
.main-actions .showall{width:100%}

/* Заглушка остального пространства */
.placeholder{flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:15px;opacity:.6;border:2px dashed rgba(169,182,200,.3);border-radius:16px}
.placeholder span{text-align:center;line-height:1.5;padding:20px;letter-spacing:.5px}

/* Скрытый полный экран расписания (пока): переход k all Показать все — ведёт сюда */
.fullscreen{position:fixed;inset:0;z-index:60;display:none;background:rgba(6,9,16,.97)}
.fullscreen.on{display:block;overflow:auto}
.fs-close{position:fixed;top:16px;right:20px;cursor:pointer;background:rgba(0,0,0,.5);border:1px solid var(--line);color:#fff;border-radius:50%;width:38px;height:38px;font-size:20px;z-index:5}

/* Полноэкранное окно «Показать все» */
.fullscreen{position:fixed;inset:0;z-index:60;display:none;background:rgba(6,9,16,.97);overflow:auto}
.fullscreen.on{display:block}
.fs-close{position:fixed;top:16px;right:20px;cursor:pointer;background:rgba(0,0,0,.5);border:1px solid var(--line);color:#fff;border-radius:50%;width:40px;height:40px;font-size:22px;z-index:5}
.fs-inner{max-width:1200px;margin:0 auto;padding:24px 20px 60px}
.fs-head{text-align:center;margin-bottom:10px}
.fs-title{font-size:28px;font-weight:800;color:#fff;text-shadow:0 0 20px rgba(245,185,66,.35)}
.fs-sub{color:var(--muted);font-size:13px;margin-top:4px}

/* Управление: кнопки дней как в старом макете */
.fs-controls{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:18px 0 4px}
.fs-btn{cursor:pointer;border:1px solid var(--line);background:rgba(24,34,52,.75);color:var(--txt);font-size:14px;font-weight:700;padding:9px 16px;border-radius:8px;transition:.15s;min-width:88px}
.fs-btn:hover{background:rgba(44,62,88,.85)}
.fs-btn.active{background:var(--gold);color:#171300;border-color:var(--gold)}
.fs-btn.all{background:transparent;border:2px solid var(--gold);color:var(--gold)}
.fs-btn.all.active{background:var(--gold);color:#171300}
.fs-body{display:flex;gap:20px;margin-top:14px;align-items:flex-start}
.fs-left{width:330px;flex-shrink:0;background:rgba(16,22,34,.85);border:1px solid var(--line);border-radius:12px;padding:16px}
.fs-day-head{display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:12px}
.fs-day-name{font-size:22px;font-weight:800;color:#fff}
.fs-count-badge{background:var(--gold);color:#171300;border-radius:50%;min-width:70px;height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;line-height:1;box-shadow:0 0 18px rgba(245,185,66,.4)}
.fs-count-badge .n{font-size:24px}
.fs-count-badge .l{font-size:9px;font-weight:700;letter-spacing:.5px}
.fs-list{display:flex;flex-direction:column;gap:9px;max-height:520px;overflow:auto;padding-right:2px}
.fs-liv{display:flex;gap:9px;align-items:center;width:100%;cursor:pointer;background:rgba(24,34,50,.55);border:1px solid var(--line);border-radius:0;padding:6px;color:var(--txt);text-align:left;font:inherit;transition:.12s}
.fs-liv:hover{background:rgba(40,56,78,.7)}
.fs-liv img{width:46px;height:40px;object-fit:cover;flex-shrink:0}
.fs-liv .l-t{font-weight:700;font-size:12px;line-height:1.25;color:#fff}
.fs-liv .l-tm{color:var(--gold);font-weight:700;font-size:11px;margin-top:2px}
.fs-right{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.fs-tile{background:rgba(18,24,36,.55);border:2px solid var(--oline);min-height:150px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:10px;text-align:center;transition:.15s;box-shadow:0 4px 14px rgba(0,0,0,.35)}
.fs-tile:hover{background:rgba(44,56,76,.6);transform:translateY(-2px)}
.fs-tile img{width:100%;height:86px;object-fit:cover;display:block}
.fs-tile .t-name{font-family:"Segoe Script","Comic Sans MS",cursive;color:var(--orange);font-size:15px;font-weight:700;letter-spacing:1px;line-height:1.15;text-transform:uppercase;text-shadow:0 1px 0 #000}
.fs-tile .t-tm{color:var(--muted);font-size:11px}

/* Модалка */
.mod{position:fixed;inset:0;background:rgba(5,8,14,.85);display:none;align-items:center;justify-content:center;z-index:80;padding:16px}
.mod.open{display:flex}
.card{background:linear-gradient(160deg,#162a44,#0e1a2c);border:1px solid var(--line);border-radius:14px;max-width:520px;width:100%;max-height:88vh;overflow:auto;box-shadow:0 18px 50px rgba(0,0,0,.7)}
.card-img{width:100%;height:210px;object-fit:cover;border-bottom:2px solid var(--line)}
.card-body{padding:18px 20px 20px}
.card-title{font-size:22px;font-weight:800;color:#fff;line-height:1.25}
.card-title small{display:block;color:var(--muted);font-size:12px;font-weight:600;margin-top:4px}
.meta{display:flex;flex-direction:column;gap:10px;margin:16px 0}
.meta-row{display:flex;gap:10px;align-items:flex-start}
.meta-dot{color:var(--gold);font-size:16px;line-height:1.3}
.meta-lab{font-weight:700;color:var(--gold);font-size:12px;text-transform:uppercase;letter-spacing:.5px}
.meta-val{color:var(--txt);font-size:14px;line-height:1.5}
.reward{background:rgba(245,185,66,.1);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.reward .meta-lab{color:var(--gold)}
.reward .meta-val{color:#ffe1a1}
.nav{display:flex;justify-content:space-between;gap:12px;margin-top:18px;align-items:center}
.nav .arrow{cursor:pointer;background:rgba(20,32,50,.7);border:1px solid var(--line);color:var(--txt);border-radius:8px;padding:10px 16px;font-size:16px}
.nav .arrow:hover{background:rgba(40,60,88,.8)}
.nav .pos{color:var(--muted);font-size:12px;text-align:center}
.close{position:sticky;float:right;top:6px;background:rgba(0,0,0,.5);border:1px solid var(--line);color:#fff;border-radius:50%;width:34px;height:34px;font-size:18px;cursor:pointer;z-index:2;line-height:1}
@media(max-width:720px){.side{width:96vw}.placeholder{display:none}}
</style>
</head>
<body>

<!-- СТАРТОВЫЙ ЭКРАН -->
<div id="splash">
  <div class="wp"></div>
  <div class="dim"></div>
  <button class="splash-btn" onclick="enterDesk()">Я из Grand</button>
</div>

<!-- РАБОЧИЙ СТОЛ -->
<div id="desk" class="off">
  <div id="bg2"></div><div id="veil"></div>
  <div class="desk-top">
    <div class="desk-left">
      <div class="desk-logo">GRAND</div>
      <div class="desk-day" id="deskDayLabel"></div>
    </div>
    <div class="desk-clock"><span id="clockTime">--:--</span><span class="clock-zone">МСК</span></div>
  </div>
  <div class="side">
    <div class="side-title">Мероприятия на сегодня</div>
    <div class="side-column" id="sideList"></div>
  </div>
  <div class="main">
    <div class="main-actions">
      <button class="next-card" id="nextCard"></button>
      <button class="showall" onclick="showAll()">Показать все</button>
    </div>
    <div class="placeholder"><span>Тут в будущем будут<br>каналы из Дискорда</span></div>
    <a class="script-btn" href="https://script.google.com/macros/s/AKfycbw96Dv8R_lf1uXN8STOWOJcRM7k_PeZr_YAGQHZsAlYr3Sfz-sBk_p9qhsOOsl3KSOR/exec" target="_blank" rel="noopener">Скрипт для отдела редакции, разработанный первым финансовым директором «LifeInvader» James Grand</a>
  </div>
</div>

<!-- ОКНО ПОКАЗАТЬ ВСЕ (неделя) -->
<div class="fullscreen" id="fullscreen">
  <button class="fs-close" onclick="closeAll()">&times;</button>
  <div class="fs-inner">
    <div class="fs-head">
      <div class="fs-title">Расписание мероприятий</div>
      <div class="fs-sub">Нажми на день, чтобы увидеть его мероприятия, или «Показать все» для полного расписания</div>
    </div>
    <div class="fs-controls" id="fsControls"></div>
    <div class="fs-body">
      <div class="fs-left">
        <div class="fs-day-head">
          <div class="fs-day-name" id="fsDayName">Понедельник</div>
          <div class="fs-count-badge"><span class="n" id="fsCountN">0</span><span class="l">СОБЫТИЙ</span></div>
        </div>
        <div class="fs-list" id="fsList"></div>
      </div>
      <div class="fs-right" id="fsGrid"></div>
    </div>
  </div>
</div>

<div class="mod" id="mod">
  <div class="card">
    <button class="close" id="closeBtn" title="Закрыть">&times;</button>
    <img class="card-img" id="mImg" alt="">
    <div class="card-body">
      <div class="card-title" id="mTitle"></div>
      <div class="meta">
        <div class="meta-row"><span class="meta-dot">▸</span><div><div class="meta-lab">Описание</div><div class="meta-val" id="mDesc"></div></div></div>
        <div class="meta-row"><span class="meta-dot">▸</span><div><div class="meta-lab">Когда проходит</div><div class="meta-val" id="mWhen"></div></div></div>
      </div>
      <div class="reward"><div class="meta-lab">Награда</div><div class="meta-val" id="mReward"></div></div>
      <div class="nav">
        <div class="arrow" id="prevBtn" title="Предыдущее">&larr;</div>
        <div class="pos" id="mPos"></div>
        <div class="arrow" id="nextBtn" title="Следующее">&rarr;</div>
      </div>
    </div>
  </div>
</div>

<script>
const IMGS = ${IMG_JSON};
const DAY = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const DAYF = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];
const ALL_DAYS=[0,1,2,3,4,5,6];
const EVENTS = ${DATA_JSON};
EVENTS.forEach(e=>e.img=IMGS[e.imgKey]);

const MSK_WEEKDAY=new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Moscow",weekday:"short"});
const WD_MAP={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
// День недели ПО МСК (МСК = UTC+3), без зависимости от часового пояса устройства
function mskNow(){
  // МСК = UTC+3. getTime() уже в UTC; просто добавляем 3 часа и читаем UTC-компоненты.
  return new Date(new Date().getTime()+3*3600*1000);
}
const today=(new Date(mskNow().toUTCString()).getUTCDay()+6)%7; // 0=Пн..6=Вс, по МСК
let list=[];
let listPos=-1;

// Онлайн-часы (время МСК), тикают каждую секунду
const MSK_FMT=new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
function tickClock(){
  const el=document.getElementById("clockTime");
  if(el) el.textContent=MSK_FMT.format(new Date());
}
tickClock();
setInterval(tickClock,1000);

function eventsOf(day){ return EVENTS.filter(e=>e.days.includes(day)); }
function daysStr(e){ return e.days.map(d=>DAY[d]).join(", "); }
function refTag(i, day){ return JSON.stringify(["day",day,i]).replace(/'/g,"&#39;"); }

// часы:минуты текущего времени ПО МСК (МСК = UTC+3)
function nowHM(){
  const m=mskNow();
  return (m.getUTCHours()*60+m.getUTCMinutes());
}
// ближайший старт события (для сессий-массивов)
function nextStart(e){
  if(!e.times || !e.times.length) return null;
  const now=nowHM();
  let best=null;
  e.times.forEach(tm=>{
    const p=tm.split(":");
    const m=+p[0]*60+(+p[1]||0);
    if(m>=now && (best==null || m<best)) best=m;
  });
  return best;
}

function enterDesk(){
  document.getElementById("splash").classList.add("hide");
  const desk=document.getElementById("desk");
  desk.classList.remove("off");
  renderDesk();
}
let fsMode="all";
let fsInit=false;
function showAll(){
  if(!fsInit){
    fsInit=true;
    const c=document.getElementById("fsControls");
    ["0","1","2","3","4","5","6","all"].forEach(function(k){
      const b=document.createElement("button");
      b.className="fs-btn "+(k==="all"?"all":"");
      b.textContent = k==="all" ? "Показать все" : DAY[k];
      b.dataset.k=k;
      b.onclick=function(){ fsSelect(k); };
      c.appendChild(b);
    });
  }
  renderFs();
  document.getElementById("fullscreen").classList.add("on");
}
function fsSelect(k){
  fsMode=k;
  document.querySelectorAll("#fsControls .fs-btn").forEach(function(b){ b.classList.toggle("active",b.dataset.k===k); });
  renderFs();
}
function renderFs(){
  const listEl=document.getElementById("fsList");
  const grid=document.getElementById("fsGrid");
  const dayName=document.getElementById("fsDayName");
  const countN=document.getElementById("fsCountN");
  let evs;
  if(fsMode==="all"){ evs=EVENTS; dayName.textContent="ВСЕ ДНИ"; }
  else{ evs=eventsOf(Number(fsMode)); dayName.textContent=DAYF[Number(fsMode)].toUpperCase(); }
  countN.textContent=evs.length;

  listEl.innerHTML = evs.length
    ? evs.map(function(e,i){ return '<button class="fs-liv" data-ref="'+refTag(i, fsMode)+'"><img src="'+e.img+'" alt=""><div><div class="l-t">'+e.name+'</div><div class="l-tm">'+e.t+'</div></div></button>'; }).join("")
    : '<div class="none">В этот день мероприятий нет</div>';

  grid.innerHTML = evs.map(function(e,i){ return '<button class="fs-tile" data-ref="'+refTag(i, fsMode)+'"><img src="'+e.img+'" alt=""><span class="t-name">'+e.name+'</span><span class="t-tm">'+e.t+'</span></button>'; }).join("");
}
function closeAll(){
  document.getElementById("fullscreen").classList.remove("on");
}

function renderDesk(){
  document.getElementById("deskDayLabel").textContent=DAYF[today];

  const evs=eventsOf(today);
  const side=document.getElementById("sideList");
  side.innerHTML = evs.length
    ? evs.map(function(e,i){ return '<button class="side-card" data-ref="'+refTag(i,today)+'"><img src="'+e.img+'" alt=""><div><div class="s-t">'+e.name+'</div><div class="s-tm">'+e.t+'</div></div></button>'; }).join("")
    : '<div class="none">Мероприятий сегодня нет</div>';

  // ближайшее
  const next=document.getElementById("nextCard");
  if(evs.length){
    const upcoming=evs.map(function(e,i){ return {e:e,i:i,ns:nextStart(e)}; }).filter(function(x){ return x.ns!=null; })
      .sort((a,b)=>a.ns-b.ns);
    if(upcoming.length){
      const cand=upcoming[0];
      const h=Math.floor(cand.ns/60), m=cand.ns%60;
      const hm=(h<10?'0':'')+h+':'+(m<10?'0':'')+m;
      next.innerHTML='<img src="'+cand.e.img+'" alt=""><div><div class="nx-lab">Ближайшее</div><div class="nx-t">'+cand.e.name+'</div><div class="nx-tm">'+hm+'</div><div class="nx-in">'+cand.e.t+'</div></div>';
      next.dataset.ref=refTag(cand.i, today);
    } else {
      next.innerHTML='<div class="nx-lab">Ближайшее</div><div class="nx-t">Сегодня всё прошло</div>';
      next.removeAttribute("data-ref");
    }
  } else {
    next.innerHTML='<div class="nx-lab">Ближайшее</div><div class="nx-t">Нет событий</div>';
    next.removeAttribute("data-ref");
  }
}

function openRef(r){
  const day=r[1], i=r[2];
  list=day==="all" ? EVENTS : eventsOf(day);
  listPos=r[1]===day ? i : i;
  listPos=i;
  showModal();
}
document.addEventListener("click",(ev)=>{
  const el=ev.target.closest("[data-ref]");
  if(!el) return;
  openRef(JSON.parse(el.getAttribute("data-ref").replace(/&#39;/g,"'")));
});
document.getElementById("nextCard").addEventListener("click",(ev)=>{
  const ref=ev.currentTarget.dataset.ref;
  if(ref) openRef(JSON.parse(ref.replace(/&#39;/g,"'")));
});

function showModal(){
  const e=list[listPos];
  document.getElementById("mImg").src=e.img;
  document.getElementById("mTitle").innerHTML=e.name+' <small>'+daysStr(e)+'</small>';
  document.getElementById("mDesc").textContent=e.d;
  document.getElementById("mWhen").textContent=e.t;
  document.getElementById("mReward").textContent=e.r;
  document.getElementById("mPos").textContent=(listPos+1)+" / "+list.length;
  document.getElementById("mod").classList.add("open");
}
document.getElementById("prevBtn").onclick=()=>{ listPos=(listPos-1+list.length)%list.length; showModal(); };
document.getElementById("nextBtn").onclick=()=>{ listPos=(listPos+1)%list.length; showModal(); };
document.getElementById("closeBtn").onclick=()=>document.getElementById("mod").classList.remove("open");
document.getElementById("mod").onclick=(e)=>{ if(e.target.id==="mod") document.getElementById("mod").classList.remove("open"); };
</script>
</body>
</html>`;

fs.writeFileSync(path.join(DIR, "raspisanie-grand.html"), html, "utf8");
console.log("wrote raspisanie-grand.html, size=" + (html.length/1024).toFixed(0) + " KB");