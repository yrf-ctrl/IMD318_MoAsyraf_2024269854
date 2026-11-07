/* ===== Asyraf Razali: About page scripts =====
   1. Age from date of birth
   2. Rotating dot-matrix globe that springs back to Malaysia
   3. Life rules (click for the next one)
   Each part runs on its own, so one problem never stops the others. */

function guard(fn) { try { fn(); } catch (e) { if (window.console) { console.error(e); } } }

/* ---------- 1. Age ---------- */
guard(function () {
  var out = document.getElementById("age");
  if (!out) { return; }
  var born = new Date(2006, 4, 12);            // 12 May 2006
  var now = new Date();
  var age = now.getFullYear() - born.getFullYear();
  var hadBirthday = now.getMonth() > born.getMonth() ||
    (now.getMonth() === born.getMonth() && now.getDate() >= born.getDate());
  if (!hadBirthday) { age--; }
  out.textContent = "(" + age + " years old)";
});

/* ---------- 2. Globe ---------- */
/* Land dots: [latitude x10, [longitude x10, ...], [Malaysia longitude x10, ...]] */
var LAND = [[-557,[-675],[]],[-511,[-716],[]],[-488,[-734,-699],[]],[-465,[-750,-717,-683],[]],[-442,[-723,-691,-659,1688],[]],[-419,[-738,-708,-677,1477,1723],[]],[-396,[-714,-684,-655,-625,1755],[]],[-373,[-720,-691,-662,-634,-605,-576,1411,1440,1469,1498,1757],[]],[-350,[-717,-689,-661,-633,-605,-577,1167,1392,1420,1448,1477,1505],[]],[-327,[-695,-668,-641,-614,-586,-559,-532,205,232,259,1159,1186,1214,1241,1350,1377,1405,1432,1459,1486,1514],[]],[-304,[-693,-667,-640,-613,-587,-560,-533,187,213,240,267,293,1173,1200,1227,1253,1280,1307,1333,1360,1387,1413,1440,1467,1493,1520],[]],[-281,[-691,-665,-639,-613,-587,-561,-535,-509,170,196,222,248,274,300,1161,1187,1213,1239,1265,1291,1317,1343,1370,1396,1422,1448,1474,1500,1526],[]],[-258,[-689,-664,-638,-613,-587,-562,-536,-511,153,179,204,230,255,281,306,1149,1174,1200,1226,1251,1277,1302,1328,1353,1379,1404,1430,1455,1481,1506],[]],[-235,[-687,-662,-637,-612,-587,-562,-537,-512,-487,-462,163,188,213,238,263,288,313,338,438,463,1138,1163,1188,1213,1238,1263,1288,1313,1338,1363,1388,1413,1438,1463,1488],[]],[-212,[-678,-653,-629,-604,-579,-555,-530,-505,-481,-456,-432,160,185,210,234,259,284,308,333,456,481,555,1171,1196,1221,1245,1270,1295,1319,1344,1368,1393,1418,1442,1467,1492],[]],[-189,[-693,-669,-645,-620,-596,-572,-547,-523,-499,-474,-450,-426,-401,134,158,182,207,231,255,280,304,328,353,450,474,1228,1253,1277,1301,1326,1350,1374,1399,1423,1447,1691],[]],[-166,[-708,-684,-660,-636,-612,-588,-564,-540,-516,-492,-468,-444,-420,-396,132,156,180,204,228,252,276,300,324,348,372,468,492,1236,1260,1284,1308,1332,1356,1380,1428,1452],[]],[-143,[-746,-722,-699,-675,-651,-628,-604,-580,-557,-533,-509,-486,-462,-438,-414,-391,130,154,178,201,225,249,272,296,320,343,367,391,486,1267,1314,1338,1433],[]],[-120,[-753,-729,-706,-682,-659,-635,-612,-588,-565,-541,-518,-494,-471,-447,-424,-400,-376,141,165,188,212,235,259,282,306,329,353,376,400,1341,1365],[]],[-97,[-783,-760,-736,-713,-690,-666,-643,-619,-596,-573,-549,-526,-503,-479,-456,-432,-409,-386,-362,152,175,199,222,245,269,292,316,339,362,386,1204,1484,1601],[]],[-74,[-790,-766,-743,-720,-697,-674,-650,-627,-604,-581,-557,-534,-511,-488,-465,-441,-418,-395,-372,-348,139,163,186,209,232,255,279,302,325,348,372,1068,1092,1115,1394,1417,1440,1463],[]],[-51,[-796,-773,-750,-727,-704,-681,-658,-635,-612,-588,-565,-542,-519,-496,-473,-450,-427,-404,-381,-358,127,150,173,196,219,242,265,288,312,335,358,381,1050,1396,1419,1442],[]],[-28,[-796,-773,-750,-727,-704,-681,-658,-635,-612,-588,-565,-542,-519,-496,-473,-450,-427,104,127,150,173,196,219,242,265,288,312,335,358,381,1027,1050,1119,1142,1188,1212,1327,1373,1396,1512],[]],[-5,[-803,-780,-757,-734,-711,-688,-665,-642,-619,-596,-573,-550,-527,-504,115,138,161,183,206,229,252,275,298,321,344,367,390,413,1009,1032,1101,1124,1146,1169,1330],[]],[18,[-773,-750,-727,-704,-681,-658,-635,-612,-588,-565,-542,-519,104,127,150,173,196,219,242,265,288,312,335,358,381,404,427,1004,1165],[1096,1119,1142]],[41,[-773,-750,-727,-704,-681,-658,-635,-612,-588,-565,-542,-519,104,127,150,173,196,219,242,265,288,312,335,358,381,404,427,450,473,981,1165],[1027,1142]],[64,[-773,-750,-727,-704,-681,-658,-635,-612,-588,-104,-81,-58,-35,-12,12,58,81,104,127,150,173,196,219,242,265,288,312,335,358,381,404,427,450,473],[1004,1165]],[87,[-836,-813,-766,-743,-720,-697,-674,-650,-627,-116,-93,-70,-46,-23,0,23,46,70,93,116,139,163,186,209,232,255,279,302,325,348,372,395,418,441,465,488,999,1254],[]],[110,[-853,-736,-690,-643,-129,-105,-82,-58,-35,-12,12,35,58,82,105,129,152,175,199,222,245,269,292,316,339,362,386,409,432,479,503,760,783,994,1040,1064,1227],[]],[133,[-888,-864,-841,-154,-130,-107,-83,-59,-36,-12,12,36,59,83,107,130,154,178,201,225,249,272,296,320,343,367,391,414,438,770,793,1030,1054,1078,1220],[]],[156,[-930,-906,-882,-858,-143,-119,-95,-72,-48,-24,0,24,48,72,95,119,143,167,191,215,238,262,286,310,334,358,381,429,453,477,501,739,763,787,1001,1025,1049,1073],[]],[179,[-1015,-991,-966,-942,-918,-894,-773,-145,-121,-97,-72,-48,-24,0,24,48,72,97,121,145,169,193,217,242,266,290,314,338,362,387,435,459,483,507,532,556,749,773,797,821,966,991,1015,1039,1063,1208],[]],[202,[-1053,-1029,-1004,-980,-882,-759,-147,-122,-98,-73,-49,-24,0,24,49,73,98,122,147,171,196,220,245,269,294,318,343,367,416,441,465,490,514,539,563,735,759,784,808,833,857,931,955,980,1004,1029,1053],[]],[225,[-1043,-1018,-993,-794,-149,-124,-99,-74,-50,-25,0,25,50,74,99,124,149,174,199,223,248,273,298,323,348,397,422,447,472,497,521,546,571,596,720,745,770,794,819,844,869,894,919,943,968,993,1018,1043,1068,1092,1117,1142],[]],[248,[-1077,-1052,-1027,-1001,-976,-139,-114,-89,-63,-38,-13,13,38,63,89,114,139,165,190,215,241,266,292,317,342,393,418,444,469,494,672,697,723,748,773,799,824,849,875,900,925,951,976,1001,1027,1052,1077,1103,1128,1154,1179],[]],[271,[-1140,-1088,-1062,-1036,-1010,-984,-803,-129,-104,-78,-52,-26,0,26,52,78,104,129,155,181,207,233,259,285,311,337,363,388,414,440,466,492,544,570,596,622,647,673,699,725,751,777,803,829,855,881,906,932,958,984,1010,1036,1062,1088,1114,1140,1165,1191],[]],[294,[-1099,-1072,-1046,-1019,-993,-966,-93,-66,-40,-13,13,40,66,93,119,146,172,199,225,251,278,304,331,357,384,410,437,463,516,543,569,596,622,649,675,701,728,754,781,807,834,860,887,913,940,966,993,1019,1046,1072,1099,1125,1151,1178,1204],[]],[317,[-1164,-1137,-1110,-1083,-1056,-1029,-1002,-974,-947,-920,-893,-866,-839,-812,-81,-54,-27,0,27,54,81,108,135,217,244,352,379,406,433,460,487,514,541,568,595,623,650,677,704,731,758,785,812,839,866,893,920,947,974,1002,1029,1056,1083,1110,1137,1164,1191],[]],[340,[-1177,-1149,-1122,-1094,-1066,-1038,-1011,-983,-955,-928,-900,-872,-845,-817,-789,-42,-14,14,42,69,97,374,402,429,457,485,512,540,568,595,623,651,678,706,734,762,789,817,845,872,900,928,955,983,1011,1038,1066,1094,1122,1149,1177,1343],[]],[363,[-1214,-1186,-1157,-1129,-1100,-1071,-1043,-1014,-986,-957,-929,-900,-871,-843,-814,-786,14,43,71,100,300,329,386,414,443,471,500,529,557,586,614,643,671,700,729,757,786,814,843,871,900,929,957,986,1014,1043,1071,1100,1129,1157,1186,1271,1386],[]],[386,[-1225,-1195,-1166,-1136,-1107,-1077,-1048,-1018,-989,-959,-930,-900,-870,-841,-811,-782,-752,-74,-44,-15,162,221,280,310,339,369,398,428,457,487,546,575,605,634,664,693,723,752,782,811,841,870,900,930,959,989,1018,1048,1077,1107,1136,1166,1254,1284,1402],[]],[409,[-1236,-1205,-1175,-1144,-1114,-1083,-1053,-1022,-992,-961,-931,-900,-869,-839,-808,-778,-747,-76,-46,-15,168,198,229,259,320,351,381,412,442,473,564,595,625,656,686,717,747,778,808,839,869,900,931,961,992,1022,1053,1083,1114,1144,1175,1205,1236,1266,1297],[]],[432,[-1216,-1184,-1153,-1121,-1089,-1058,-1026,-995,-963,-932,-900,-868,-837,-805,-774,-742,-711,-79,-47,-16,16,111,174,205,237,268,426,458,521,553,584,616,647,679,711,742,774,805,837,868,900,932,963,995,1026,1058,1089,1121,1153,1184,1216,1247,1279,1311,1342,1405,1437],[]],[455,[-1227,-1195,-1162,-1129,-1096,-1064,-1031,-998,-965,-933,-900,-867,-835,-802,-769,-736,-704,-671,-638,16,49,82,115,147,180,213,245,278,344,376,409,442,475,540,573,605,638,671,704,736,769,802,835,867,900,933,965,998,1031,1064,1096,1129,1162,1195,1227,1260,1293,1325,1358],[]],[478,[-1234,-1200,-1166,-1131,-1097,-1063,-1029,-994,-960,-926,-891,-857,-823,-789,-754,-720,-686,-651,-583,-549,-34,0,34,69,103,137,171,206,240,274,309,343,377,411,446,480,514,549,583,617,651,686,720,754,789,823,857,891,926,960,994,1029,1063,1097,1131,1166,1200,1234,1269,1303,1337,1371],[]],[501,[-1242,-1206,-1170,-1134,-1098,-1062,-1026,-990,-954,-918,-882,-846,-810,-774,-738,-702,-54,18,54,90,126,162,198,234,270,306,342,378,414,450,486,522,558,594,630,666,702,738,774,810,846,882,918,954,990,1026,1062,1098,1134,1170,1206,1242,1278,1314,1350,1386,1422],[]],[524,[-1256,-1219,-1181,-1144,-1106,-1069,-1031,-994,-956,-919,-881,-844,-769,-731,-694,-656,-619,-581,-94,-19,56,94,131,169,206,244,281,319,356,394,431,469,506,544,581,619,656,694,731,769,806,844,881,919,956,994,1031,1069,1106,1144,1181,1219,1256,1294,1331,1369,1406],[]],[547,[-1300,-1260,-1220,-1180,-1140,-1100,-1060,-1020,-980,-940,-900,-860,-780,-740,-700,-660,-620,-580,-60,-20,180,220,260,300,340,380,420,460,500,540,580,620,660,700,740,780,820,860,900,940,980,1020,1060,1100,1140,1180,1220,1260,1300,1340,1580],[]],[570,[-1313,-1271,-1228,-1186,-1144,-1101,-1059,-1016,-974,-932,-762,-720,-678,-635,-42,85,127,254,296,339,381,424,466,508,551,593,635,678,720,762,805,847,889,932,974,1016,1059,1101,1144,1186,1228,1271,1313,1355,1567,1609],[]],[593,[-1597,-1552,-1372,-1327,-1282,-1237,-1192,-1147,-1102,-1057,-1012,-967,-742,-697,-652,68,113,158,248,293,338,383,428,473,518,563,608,653,698,743,788,833,878,923,968,1013,1058,1103,1148,1193,1238,1283,1328,1373,1418,1463],[]],[616,[-1630,-1581,-1532,-1484,-1435,-1386,-1338,-1289,-1241,-1192,-1143,-1095,-1046,-997,-949,-754,-462,73,122,170,219,268,316,365,414,462,511,559,608,657,705,754,803,851,900,949,997,1046,1095,1143,1192,1241,1289,1338,1386,1435,1484,1532,1630,1678,1727],[]],[639,[-1565,-1513,-1461,-1409,-1357,-1304,-1252,-1200,-1148,-1096,-1043,-991,-939,-678,-470,-417,-209,104,157,261,313,365,417,470,522,574,626,678,730,783,835,887,939,991,1043,1096,1148,1200,1252,1304,1357,1409,1461,1513,1565,1617,1670,1722,1774],[]],[662,[-1771,-1714,-1600,-1543,-1486,-1429,-1371,-1314,-1257,-1200,-1143,-1086,-1029,-971,-914,-743,-629,-514,-457,-400,-229,-171,171,229,286,457,514,571,629,686,743,800,857,914,971,1029,1086,1143,1200,1257,1314,1371,1429,1486,1543,1600,1657,1714,1771],[]],[685,[-1642,-1579,-1516,-1453,-1389,-1326,-1263,-1200,-1074,-884,-821,-695,-505,-442,-379,-316,189,253,316,379,442,568,632,695,758,821,884,947,1011,1074,1137,1200,1263,1326,1389,1453,1516,1579,1642,1705,1768],[]],[708,[-1553,-1129,-1059,-847,-776,-494,-424,-353,-282,282,565,706,776,847,918,988,1059,1129,1200,1271,1341,1412,1482,1553],[]],[731,[-1213,-1057,-822,-509,-430,-352,743,822,900,978,1057,1135],[]],[754,[-1108,-923,-831,-554,-462,-369,-277,923,1015,1108,1385,1477],[]],[777,[-873,-655,-545,-436,-327,-218,218],[]],[800,[-933,-800,-533,-400,-267,267],[]],[823,[-857,-686,-343],[]]];

guard(function () {
  var canvas = document.getElementById("globe");
  if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HOME_LON = 107, HOME_LAT = 4;            // the point the globe always returns to
  var KL = [3.139, 101.687];                   // Kuala Lumpur
  var RAD = Math.PI / 180;

  var lam = HOME_LON - 130, phi = HOME_LAT + 20;   // starts turned away, then swings home
  var vl = 0, vp = 0;                              // spin speeds
  var dragging = false, lastX = 0, lastY = 0, visible = false, last = 0, t0 = performance.now();
  var size = 480, dpr = 1, rgb = [241, 240, 236];
  var settled = false, lastReadout = "";          // true once the globe is locked on Malaysia
  var elLat = document.getElementById("cLat"), elLon = document.getElementById("cLon"), elState = document.getElementById("cState");

  /* Spring settings: softer damping gives a little wobble before it settles */
  var K = 0.012, DAMP = reduce ? 0.72 : 0.9;

  function readColour() {
    var c = getComputedStyle(document.documentElement).getPropertyValue("--on-deep").trim();
    var m = /^#([0-9a-f]{6})$/i.exec(c);
    if (m) { rgb = [parseInt(m[1].substr(0, 2), 16), parseInt(m[1].substr(2, 2), 16), parseInt(m[1].substr(4, 2), 16)]; }
  }
  function col(a) { return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")"; }

  function resize() {
    size = canvas.clientWidth || 480;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* Orthographic projection around the current centre (phi, lam) */
  function project(latDeg, lonDeg) {
    var R = size * 0.44, c = size / 2;
    var p = latDeg * RAD, l = lonDeg * RAD, p0 = phi * RAD, l0 = lam * RAD;
    var dl = l - l0;
    return {
      x: c + R * Math.cos(p) * Math.sin(dl),
      y: c - R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(dl)),
      z: Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(dl)
    };
  }

  function line(points) {
    ctx.beginPath();
    var pen = false;
    points.forEach(function (q) {
      if (q.z > 0) { if (pen) { ctx.lineTo(q.x, q.y); } else { ctx.moveTo(q.x, q.y); pen = true; } }
      else { pen = false; }
    });
    ctx.stroke();
  }

  function draw(now) {
    var R = size * 0.44, c = size / 2, i, j, lat, lon, q;
    ctx.clearRect(0, 0, size, size);

    /* sphere body */
    var g = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
    g.addColorStop(0, col(0.12)); g.addColorStop(1, col(0.02));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col(0.35); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.stroke();

    /* graticule: thin lines every 30 degrees */
    ctx.strokeStyle = col(0.1);
    for (lon = -180; lon < 180; lon += 30) {
      var m = []; for (lat = -90; lat <= 90; lat += 5) { m.push(project(lat, lon)); } line(m);
    }
    for (lat = -60; lat <= 60; lat += 30) {
      var pl = []; for (lon = -180; lon <= 180; lon += 5) { pl.push(project(lat, lon)); } line(pl);
    }

    /* land dots (far side shown very faintly, near side bright) */
    var s = size / 520;
    for (i = 0; i < LAND.length; i++) {
      lat = LAND[i][0] / 10;
      for (j = 0; j < LAND[i][1].length; j++) {
        q = project(lat, LAND[i][1][j] / 10);
        if (q.z > 0) {
          ctx.fillStyle = col(0.3 + 0.6 * q.z);
          ctx.beginPath(); ctx.arc(q.x, q.y, (0.8 + 1.1 * q.z) * s * 1.15, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = col(0.06);
          ctx.beginPath(); ctx.arc(q.x, q.y, 0.9 * s, 0, Math.PI * 2); ctx.fill();
        }
      }
      for (j = 0; j < LAND[i][2].length; j++) {
        q = project(lat, LAND[i][2][j] / 10);
        if (q.z > 0) {
          ctx.fillStyle = col(1);
          ctx.beginPath(); ctx.arc(q.x, q.y, (1.6 + 1.2 * q.z) * s * 1.15, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    /* Kuala Lumpur marker with a slow pulse */
    q = project(KL[0], KL[1]);
    if (q.z > 0.05) {
      var pulse = reduce ? 0.4 : ((now - t0) / 1800) % 1;
      ctx.strokeStyle = col(0.8 * (1 - pulse)); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(q.x, q.y, (5 + pulse * 20) * s * 1.15, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = col(1);
      ctx.beginPath(); ctx.arc(q.x, q.y, 3.2 * s * 1.15, 0, Math.PI * 2); ctx.fill();
      if (q.z > 0.4) {
        ctx.strokeStyle = col(0.6); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(q.x + 6, q.y - 6); ctx.lineTo(q.x + 34, q.y - 34); ctx.lineTo(q.x + 70, q.y - 34); ctx.stroke();
        ctx.fillStyle = col(1);
        ctx.font = "500 " + Math.round(11 * Math.max(s, 0.85)) + "px 'IBM Plex Mono', monospace";
        ctx.fillText("MALAYSIA", q.x + 38, q.y - 40);
      }
    }
  }

  /* Live coordinates and status shown around the globe (home page) */
  function readout() {
    if (!elLat && !elLon && !elState) { return; }
    var la = Math.abs(phi).toFixed(1) + "\u00B0 " + (phi >= 0 ? "N" : "S");
    var lo = Math.abs(lam).toFixed(1) + "\u00B0 " + (lam >= 0 ? "E" : "W");
    var st = dragging ? "Free spin" : (settled ? "Locked on Malaysia" : "Returning home");
    var key = la + lo + st;
    if (key === lastReadout) { return; }
    lastReadout = key;
    if (elLat) { elLat.textContent = la; }
    if (elLon) { elLon.textContent = lo; }
    if (elState) { elState.textContent = st; }
  }

  function wrap(d) { return ((d + 540) % 360) - 180; }

  function step(now) {
    if (!visible) { return; }
    var dt = Math.min((now - (last || now)) / 16.67, 3); last = now;
    if (!dragging) {
      /* gravity: pull towards Malaysia */
      vl += wrap(HOME_LON - lam) * K * dt;
      vp += (HOME_LAT - phi) * K * dt;
      var f = Math.pow(DAMP, dt);
      vl *= f; vp *= f;
      lam = wrap(lam + vl * dt);
      phi += vp * dt;
      if (phi > 85) { phi = 85; vp = 0; }
      if (phi < -85) { phi = -85; vp = 0; }
      if (Math.abs(wrap(HOME_LON - lam)) < 0.02 && Math.abs(HOME_LAT - phi) < 0.02 && Math.abs(vl) < 0.01 && Math.abs(vp) < 0.01) {
        lam = HOME_LON; phi = HOME_LAT; vl = 0; vp = 0;
        settled = true;
      } else { settled = false; }
    } else { settled = false; }
    draw(now);
    readout();
    requestAnimationFrame(step);
  }

  /* Drag to turn */
  canvas.addEventListener("pointerdown", function (e) {
    dragging = true; lastX = e.clientX; lastY = e.clientY; vl = 0; vp = 0;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) { return; }
    var k = 0.35 * (480 / size);
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    lam = wrap(lam - dx * k);
    phi = Math.max(-85, Math.min(85, phi + dy * k));
    vl = -dx * k * 0.6; vp = dy * k * 0.6;
  });
  function release() { dragging = false; }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  /* Keyboard: arrow keys give it a push, then gravity brings it home */
  canvas.addEventListener("keydown", function (e) {
    var pushes = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, 3], ArrowDown: [0, -3] };
    var push = pushes[e.key];
    if (push) { e.preventDefault(); vl += push[0]; vp += push[1]; }
  });

  /* Run only while the globe is on screen */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var was = visible; visible = entries[0].isIntersecting;
      if (visible && !was) { last = 0; requestAnimationFrame(step); }
    }, { threshold: 0.1 }).observe(canvas);
  } else { visible = true; requestAnimationFrame(step); }

  /* Re-read colours when the season changes */
  new MutationObserver(readColour).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", resize);
  readColour(); resize();
  if (reduce) { lam = HOME_LON; phi = HOME_LAT; settled = true; }
  draw(performance.now());
  readout();
});

/* ---------- 3. Life rules ---------- */
var RULES = [
  "Clarity before speed.",
  "Finish what you start, or close it properly.",
  "Write it down. Memory is a poor filing cabinet.",
  "Being early is the cheapest form of respect.",
  "Say less and mean more.",
  "Rest is part of the work.",
  "Ask the question that feels too simple.",
  "Be kind in the first sentence and clear in the second.",
  "A system beats a mood.",
  "Read the whole message before you reply.",
  "Know the history before you give the opinion.",
  "Listen until you can repeat their argument fairly.",
  "Keep your promises small enough to keep.",
  "Thank people specifically.",
  "Never confuse being busy with being useful.",
  "Do the unglamorous task first.",
  "Disagree without making it personal.",
  "A good question is worth ten confident answers.",
  "Make the next step obvious for the next person.",
  "Name things plainly.",
  "Every record you keep is a favour to your future self.",
  "Check the facts, then check the source of the facts.",
  "Stay curious about people who see it differently.",
  "Patience is a skill, not a personality trait.",
  "Speak as if the other side will read it.",
  "Do not wait to feel ready.",
  "Learn one language beyond the one you think in.",
  "Travel changes what you notice, not only where you are.",
  "Start with what is true, not what is convenient.",
  "Praise in public. Correct in private.",
  "If it matters, put a date on it.",
  "A tidy folder is a quiet kind of kindness.",
  "Sleep is the most underrated study technique.",
  "Be the same person in every room.",
  "You do not have to win every conversation.",
  "Choose the long game when the short game is loud.",
  "Small habits outlast big resolutions.",
  "Understand the system before you try to change it.",
  "Everyone is dealing with something you cannot see.",
  "Be generous with credit and honest with blame.",
  "A calm voice carries further than a loud one.",
  "Slow down at the details, speed up at the decisions.",
  "What you repeat is what you become.",
  "Do not borrow trouble from tomorrow.",
  "Ask for help early, not late.",
  "Keep a list of things you are grateful for and read it on bad days.",
  "The best plan is the one that survives a bad week.",
  "Make room for silence.",
  "Read widely, then write plainly.",
  "Respect the people nobody thanks.",
  "Be hard on problems and soft on people.",
  "Mistakes admitted quickly cost less.",
  "Treat every deadline as a promise to someone.",
  "Walk before you decide anything important.",
  "Share what you know. It does not run out.",
  "Look for the second-order effect.",
  "Never mistake popular for correct.",
  "Curiosity is a form of respect.",
  "Talk to the quiet person in the room.",
  "Keep your word, even when no one is checking.",
  "Let your work speak first, then speak for your work.",
  "A good summary is an act of care.",
  "Prepare more than you present.",
  "Be early to listen and late to judge.",
  "Spend time with people who make you think.",
  "Do not outsource your own opinions.",
  "Money is a tool, not a scoreboard.",
  "Save before you spend, and learn before you invest.",
  "Risk is what remains when you do not understand something.",
  "History does not repeat, but it does rhyme.",
  "Hold strong views loosely.",
  "Boring consistency beats occasional brilliance.",
  "Learn to say no politely and yes sincerely.",
  "Move your body so your mind has room.",
  "Read the room, then read the rules, then use both.",
  "Protect your attention like it is your savings.",
  "If you cannot explain it simply, study it more.",
  "Leave every place tidier than you found it.",
  "Honest feedback is a gift, even when it stings.",
  "Do not take the credit and do not dodge the blame.",
  "Learn the names of the people who help you.",
  "Plan like a pessimist, work like an optimist.",
  "Reflect weekly. Adjust quietly.",
  "Think in decades, act in days.",
  "Make peace with unfinished things.",
  "Be a bridge, not a wall.",
  "Courtesy is never a weakness.",
  "Stay humble, because there is always more to learn.",
  "Choose understanding over winning.",
  "Good institutions are built by ordinary people doing small things well.",
  "Seek the facts, then the context, then the opinion.",
  "There is dignity in doing small work well.",
  "Be someone others can rely on.",
  "Look after your friends before they ask.",
  "Leave room in the plan for people.",
  "Doing nothing, once in a while, is doing something.",
  "Aim to be clear, not impressive.",
  "The world is bigger than your habits. Go and look at it.",
  "Stay close to home and keep the door open to the world.",
  "Keep learning, even when nobody is grading."
];

guard(function () {
  var card = document.getElementById("ruleCard");
  if (!card) { return; }
  var text = document.getElementById("ruleText");
  var num = document.getElementById("ruleNo");
  var i = Math.floor(Math.random() * RULES.length);   // a different rule each visit
  var busy = false;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function paint() {
    text.textContent = RULES[i];
    num.textContent = "Rule " + pad(i + 1) + " of " + RULES.length;
  }
  function go(n) {
    if (busy) { return; }
    busy = true;
    i = (n + RULES.length) % RULES.length;
    card.classList.add("swap");
    setTimeout(function () { paint(); card.classList.remove("swap"); busy = false; }, 320);
  }
  card.addEventListener("click", function () { go(i + 1); });
  card.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(i + 1); }
    if (e.key === "ArrowLeft") { go(i - 1); }
  });
  var nb = document.getElementById("ruleNext"), pb = document.getElementById("rulePrev");
  if (nb) { nb.addEventListener("click", function () { go(i + 1); }); }
  if (pb) { pb.addEventListener("click", function () { go(i - 1); }); }
  paint();
});
/* ---------- 4. Dolce far niente slideshow ---------- */
guard(function () {
  var show = document.getElementById("dfnShow");
  if (!show) { return; }
  var slides = show.querySelectorAll(".dfn-slide");
  var count = document.getElementById("dfnCount");
  var prev = document.getElementById("dfnPrev");
  var next = document.getElementById("dfnNext");
  var i = 0;

  function go(n) {
    slides[i].classList.remove("on");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("on");
    if (count) { count.textContent = (i + 1) + " / " + slides.length; }
  }

  if (prev) { prev.addEventListener("click", function () { go(i - 1); }); }
  if (next) { next.addEventListener("click", function () { go(i + 1); }); }
});