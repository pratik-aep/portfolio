import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("public/previews", { recursive: true });
const text = (x, y, str, size = 15, color = "#69757a", weight = 400) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" font-family="Arial,sans-serif">${str}</text>`;
const rect = (x, y, w, h, fill = "#fff", radius = 10, stroke = "none") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
const pill = (x, y, label, bg = "#edf5f1", fg = "#38766a") =>
  rect(x, y - 18, label.length * 7 + 24, 27, bg, 6) +
  text(x + 12, y, label, 12, fg, 500);
const window = (name, content, dark = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><defs><linearGradient id="mountain" x2="0" y2="1"><stop stop-color="#cadbe1"/><stop offset="1" stop-color="#7faaa6"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#a8c8c4"/><stop offset="1" stop-color="#265753"/></linearGradient><radialGradient id="planet" cx="35%" cy="25%"><stop stop-color="#d6d1bb"/><stop offset=".32" stop-color="#929ea0"/><stop offset=".63" stop-color="#435461"/><stop offset="1" stop-color="#141e2d"/></radialGradient><radialGradient id="heart" cx="35%" cy="20%"><stop stop-color="#d99898"/><stop offset=".45" stop-color="#a8485a"/><stop offset="1" stop-color="#4b293a"/></radialGradient><linearGradient id="vein"><stop stop-color="#79a8c4"/><stop offset="1" stop-color="#334e78"/></linearGradient><clipPath id="lake-clip"><rect x="218" y="154" width="950" height="300" rx="12"/></clipPath><clipPath id="planet-clip"><circle cx="800" cy="366" r="209"/></clipPath><pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#b8c9d7" stroke-opacity=".35"/></pattern></defs>${rect(0, 0, 1200, 750, dark ? "#101720" : "#f6f8f9", 0)}${rect(0, 0, 1200, 52, dark ? "#151d29" : "#fff", 0)}<path d="M0 52H1200" stroke="${dark ? "#2b3440" : "#e7ebed"}"/>${["#dadfe1", "#dadfe1", "#dadfe1"].map((c, i) => `<circle cx="${23 + i * 17}" cy="26" r="4" fill="${dark ? "#3b4655" : c}"/>`).join("")}${text(510, 31, name + " / workspace", 12, dark ? "#91a0b2" : "#8a959b")}${content}</svg>`;
const sidebar = (name, items, dark = false) =>
  `${rect(0, 53, 190, 697, dark ? "#141c28" : "#fff", 0)}${text(24, 96, name, 23, dark ? "#edf1f6" : "#253b37", 700)}${text(24, 121, "PROJECT WORKSPACE", 8, dark ? "#7d8a9e" : "#919c9d", 500)}${items.map((s, i) => `${i === 0 ? rect(15, 151 + i * 47, 159, 37, dark ? "#253043" : "#eff5f2", 6) : ""}<circle cx="33" cy="${171 + i * 47}" r="4" fill="${i === 0 ? "#5e9e8d" : dark ? "#65748b" : "#aeb9b8"}"/>${text(49, 176 + i * 47, s, 12, i === 0 ? (dark ? "#fff" : "#2e685a") : dark ? "#91a0b2" : "#82908d", i === 0 ? 600 : 400)}`).join("")}${text(24, 691, "ILLUSTRATIVE PREVIEW", 8, dark ? "#6e7c91" : "#98a19f")}${text(24, 715, "forgeD / concept interface", 9, dark ? "#91a0b2" : "#778784")}`;
let lake = sidebar("Lakeside", [
  "Overview",
  "Sensor network",
  "Water quality",
  "Insights",
  "Settings",
]);
lake +=
  text(218, 98, "Lake monitoring", 28, "#1f3731", 600) +
  text(218, 124, "A clearer view of the water around us.", 13) +
  pill(1024, 107, "Live overview");
lake += `<g clip-path="url(#lake-clip)">${rect(218, 154, 950, 300, "#d9e6e8", 0)}<path d="M218 295L330 209 408 267 523 179 595 257 692 207 790 296 891 193 1017 297 1168 233V455H218Z" fill="#aabdc5"/><path d="M218 337L355 256 432 312 575 211 680 337 818 242 940 335 1060 279 1168 327V455H218Z" fill="#7b999d"/><path d="M448 299L575 211 608 251 584 242 565 269 547 253Z" fill="#f2f6f5"/><path d="M722 326L818 242 855 280 821 272 808 302 790 283Z" fill="#f4f6f5"/><path d="M218 390Q530 343 730 376T1168 374V454H218Z" fill="url(#water)"/><path d="M218 428Q515 416 729 440T1168 423" fill="none" stroke="#cedddb" stroke-opacity=".3"/><path d="M218 354L270 334 300 368 280 455H218Z" fill="#294c43"/><path d="M1060 367L1101 298 1131 328 1168 274V455H1052Z" fill="#315e51"/><circle cx="962" cy="224" r="23" fill="#e8efef" opacity=".7"/></g>`;
lake +=
  rect(241, 324, 267, 106, "#ffffffee", 8) +
  text(260, 349, "NORTH SHORE", 9, "#687f75", 600) +
  text(260, 380, "Water in balance.", 24, "#233d33", 600) +
  text(260, 405, "An ecosystem, understood.", 12, "#71877b");
lake += [
  ["Water quality", "Good", "Sample reading"],
  ["Temperature", "18.4°", "Sample reading"],
  ["Dissolved oxygen", "8.2 mg/L", "Sample reading"],
]
  .map(
    (v, i) =>
      rect(218 + i * 324, 476, 302, 105, "#fff", 9, "#e5ebea") +
      text(238 + i * 324, 502, v[0], 12) +
      text(238 + i * 324, 540, v[1], 28, "#294a3e", 600) +
      text(238 + i * 324, 562, v[2], 10, "#98a29f"),
  )
  .join("");
lake +=
  rect(218, 601, 622, 124, "#fff", 9, "#e5ebea") +
  text(238, 629, "Water quality over time", 14, "#294039", 600) +
  text(238, 651, "Illustrative sensor data", 10, "#919c97") +
  `<path d="M243 702L289 689 321 697 357 677 390 684 430 664 468 672 512 654 558 675 605 661 650 670 690 649 731 657 810 642" stroke="#5a9383" stroke-width="3" fill="none"/><path d="M243 715H810" stroke="#e9eeeb"/>` +
  rect(861, 601, 307, 124, "#eff5f1", 9) +
  text(883, 630, "Connected to the bigger picture.", 13, "#456456", 600) +
  text(883, 660, "Explore conditions across", 12, "#6f8879") +
  text(883, 680, "your sensor network.", 12, "#6f8879") +
  text(883, 707, "View monitoring map →", 11, "#397262", 600);
writeFileSync("public/previews/lake.svg", window("Lakeside", lake));
let antarctic = sidebar("Polar", [
  "Route planner",
  "Expeditions",
  "Conditions",
  "Saved routes",
  "Settings",
]);
antarctic +=
  text(217, 97, "Antarctic route planner", 27, "#273e51", 600) +
  text(217, 124, "Explore the conditions. Consider the journey.", 13) +
  pill(1022, 104, "Planning view", "#e9f0f7", "#5e7e9d");
antarctic +=
  rect(217, 153, 664, 573, "#e6edf3", 10) +
  `<rect x="217" y="153" width="664" height="573" fill="url(#map-grid)" rx="10"/><path d="M220 153L390 153 462 234 416 286 482 354 420 445 479 514 359 624 307 726H217Z" fill="#f7f9fb" stroke="#ccd8e1"/><path d="M371 153L462 234 416 286 482 354 420 445 479 514 359 624 307 726" fill="none" stroke="#d8e1e8" stroke-width="19"/><path d="M239 282Q350 161 426 230M232 335Q342 218 432 310M219 408Q337 293 445 386M232 487Q365 379 432 457M226 567Q322 479 426 525M220 658Q342 532 374 588" stroke="#d1dbe2" fill="none" stroke-width="2"/><path d="M658 171Q735 268 647 342T678 552 620 716M729 154Q805 274 731 395T770 638M534 162Q610 281 555 401T573 668" fill="none" stroke="#a5bfce" stroke-opacity=".45" stroke-dasharray="7 9"/><path d="M735 252C693 304 628 303 597 363S635 456 566 533" fill="none" stroke="#6494bb" stroke-width="17" stroke-opacity=".12"/><path d="M735 252C693 304 628 303 597 363S635 456 566 533" fill="none" stroke="#4c83ae" stroke-width="3" stroke-dasharray="8 7"/><circle cx="735" cy="252" r="10" fill="#fff" stroke="#4c83ae" stroke-width="3"/><circle cx="566" cy="533" r="10" fill="#4c83ae" stroke="#fff" stroke-width="3"/>${text(733, 235, "DEPARTURE", 9, "#5f7c93", 600)}${text(584, 554, "RESEARCH STATION", 9, "#5f7c93", 600)}${text(274, 646, "ANTARCTIC PENINSULA", 11, "#8b9eac", 500)}${rect(237, 171, 196, 37, "#ffffffed", 6)}${text(250, 195, "−62.4° S   −58.6° W", 12, "#687e90")}${rect(835, 174, 28, 66, "#fff", 5)}${text(842, 196, "+", 19, "#647d90")}${text(844, 225, "−", 19, "#647d90")}`;
antarctic +=
  rect(900, 153, 268, 573, "#fff", 10, "#e4e9ee") +
  text(921, 185, "Plan your passage", 17, "#2e4254", 600) +
  text(921, 212, "A considered route starts here.", 11) +
  text(921, 253, "FROM", 9, "#8f9eaa", 600) +
  rect(921, 264, 226, 41, "#f6f8fa", 5) +
  text(935, 289, "South Shetland Islands", 11, "#627d91") +
  text(921, 342, "TO", 9, "#8f9eaa", 600) +
  rect(921, 353, 226, 41, "#f6f8fa", 5) +
  text(935, 379, "Research station", 11, "#627d91") +
  text(921, 433, "CONDITION LAYERS", 9, "#8f9eaa", 600) +
  ["Sea ice concentration", "Ocean currents", "Wind conditions"]
    .map(
      (s, i) =>
        text(921, 466 + i * 38, s, 11, "#637b8e") +
        `<circle cx="1136" cy="${462 + i * 38}" r="7" fill="${i === 0 ? "#6495b5" : "#e2e8ed"}"/>`,
    )
    .join("") +
  rect(921, 594, 226, 81, "#edf3f7", 6) +
  text(935, 620, "A path through complexity.", 12, "#5c7b95", 600) +
  text(935, 645, "Illustrative route · not for navigation", 9, "#899cae") +
  rect(921, 689, 226, 23, "#567e9f", 4) +
  text(977, 705, "Review route →", 10, "#fff", 600);
writeFileSync("public/previews/antarctic.svg", window("Polar", antarctic));
let space = sidebar(
  "Aster",
  ["Discover", "Candidates", "Classification", "Dataset", "Settings"],
  true,
);
space +=
  text(219, 100, "Beyond the familiar.", 32, "#eef1f6", 600) +
  text(219, 128, "Exoplanet candidate exploration", 13, "#8596af") +
  pill(1010, 104, "ANALYSIS VIEW", "#263244", "#aab7ca");
space += `<g fill="#dce5ee" opacity=".5">${Array.from({ length: 90 }, (_, i) => `<circle cx="${230 + ((i * 127) % 920)}" cy="${165 + ((i * 83) % 420)}" r="${i % 4 === 0 ? 1.5 : 0.7}"/>`).join("")}</g><ellipse cx="800" cy="369" rx="293" ry="112" transform="rotate(-24 800 369)" fill="none" stroke="#344456"/><circle cx="800" cy="366" r="216" fill="#749094" opacity=".09"/><circle cx="800" cy="366" r="209" fill="url(#planet)"/><g clip-path="url(#planet-clip)" opacity=".5"><path d="M578 241Q691 172 805 244T1018 279M591 284Q759 218 857 301T1052 328M591 336Q726 273 876 370T1018 374M579 401Q717 356 811 429T1022 455M622 455Q755 421 897 489T990 500" fill="none" stroke="#c4c5b4" stroke-width="20"/><path d="M602 304Q786 253 852 323T1030 364M581 434Q740 389 880 468" fill="none" stroke="#dde2d0" stroke-width="5"/></g><ellipse cx="800" cy="369" rx="294" ry="112" transform="rotate(-24 800 369)" fill="none" stroke="#536779" stroke-dasharray="3 11"/>`;
space +=
  text(225, 232, "CANDIDATE SPOTLIGHT", 10, "#8596ad", 600) +
  text(225, 283, "Kepler-452b", 36, "#eff1f4", 600) +
  text(225, 323, "A world of possibilities.", 16, "#a6b4c4") +
  text(225, 365, "Explore planetary signals and", 13, "#7f90a6") +
  text(225, 387, "the patterns hidden within them.", 13, "#7f90a6") +
  pill(225, 438, "Illustrative candidate", "#263a36", "#98b7a4") +
  text(225, 520, "DISCOVER THE DATA →", 11, "#aebdc9", 600);
space += [
  ["Candidate review", "Classification"],
  ["Orbital signature", "Signal analysis"],
  ["Stellar context", "Dataset exploration"],
]
  .map(
    (v, i) =>
      rect(219 + i * 324, 601, 302, 124, "#192231", 9, "#2a3547") +
      text(240 + i * 324, 628, v[0], 11, "#8596ad") +
      text(240 + i * 324, 665, v[1], 22, "#dbe3eb", 500) +
      text(240 + i * 324, 702, "CONCEPT INTERFACE", 8, "#64758d"),
  )
  .join("");
writeFileSync("public/previews/space.svg", window("Aster", space, true));
let medical = sidebar(
  "Forma",
  ["Explore anatomy", "Learning modes", "Layers", "Saved views", "Settings"],
  true,
);
medical +=
  text(219, 100, "A new perspective.", 30, "#e5e9ef", 600) +
  text(
    219,
    129,
    "Anatomical exploration · Cardiovascular system",
    13,
    "#8798ad",
  ) +
  pill(1023, 106, "3D EXPLORER", "#283144", "#9cabc0");
medical += `<ellipse cx="715" cy="483" rx="245" ry="115" fill="none" stroke="#263b4a"/><ellipse cx="715" cy="483" rx="188" ry="73" fill="none" stroke="#263b4a"/><path d="M468 483H962M715 161V649" stroke="#253746" stroke-dasharray="4 9"/><path d="M710 275C737 209 841 235 855 309C885 365 845 426 816 468C788 511 762 543 740 565C723 583 699 569 667 546C611 504 566 447 571 386C577 315 624 265 673 281Z" fill="url(#heart)" stroke="#ce8c98" stroke-width="2"/><path d="M698 303C688 249 676 203 705 180C734 157 771 178 777 213L780 277" fill="none" stroke="#d37e88" stroke-width="32"/><path d="M698 303C688 249 676 203 705 180C734 157 771 178 777 213" fill="none" stroke="#eaa3a9" stroke-width="12"/><path d="M689 310C656 299 622 284 608 257L593 215M706 293L735 245 815 226" fill="none" stroke="url(#vein)" stroke-width="31"/><path d="M738 321C777 365 776 437 740 551M683 331C656 368 649 412 665 474L716 551M738 388L795 414 822 458M659 411L609 432" fill="none" stroke="#e2a3aa" stroke-width="4"/><path d="M745 321C774 371 738 431 721 477L740 551M676 341C690 375 716 389 733 392" fill="none" stroke="#662a3e" stroke-width="6" opacity=".6"/><path d="M602 367Q625 317 659 325" fill="none" stroke="#e5a5ad" stroke-width="4" opacity=".7"/><path d="M805 333L905 292H946M674 459L508 527H459M703 209L603 169H544" fill="none" stroke="#677f94" stroke-width="1"/><circle cx="805" cy="333" r="5" fill="#a2c1d5"/><circle cx="674" cy="459" r="5" fill="#a2c1d5"/>${text(948, 294, "LEFT ATRIUM", 9, "#9fb1c3", 500)}${text(327, 531, "RIGHT VENTRICLE", 9, "#9fb1c3", 500)}${text(493, 163, "AORTA", 9, "#9fb1c3", 500)}`;
medical +=
  rect(1008, 349, 155, 229, "#1a2433", 8, "#303d4e") +
  text(1025, 379, "VISIBLE LAYERS", 9, "#7e92a9", 600) +
  ["Heart", "Arteries", "Veins", "Annotations"]
    .map(
      (s, i) =>
        `<circle cx="1030" cy="${408 + i * 40}" r="5" fill="${i === 0 ? "#b7838a" : "#637e99"}"/>${text(1045, 412 + i * 40, s, 11, "#a5b4c5")}`,
    )
    .join("");
medical +=
  rect(219, 652, 949, 73, "#1a2433", 9, "#2b394a") +
  text(239, 679, "CARDIOVASCULAR SYSTEM", 9, "#879bb1", 600) +
  text(239, 704, "Explore spatial relationships", 14, "#d0dbe6", 500) +
  pill(974, 694, "Reset view", "#2b3a4c", "#adbbcb") +
  text(602, 701, "ILLUSTRATIVE MODEL · NOT CLINICAL", 9, "#657991");
writeFileSync("public/previews/medical.svg", window("Forma", medical, true));
console.log("Created four original illustrative project interfaces.");
