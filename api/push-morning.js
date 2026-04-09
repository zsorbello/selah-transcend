// /api/push-morning.js — Handles morning verse + evening streak nudge
// Morning Cron: 0 15 * * * (15:00 UTC = 8:00 AM MST)
// Streak Cron: 0 2 * * * (02:00 UTC = 7:00 PM MST)

import webpush from "web-push";

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:selah@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const redis = async (cmd) => {
    const r = await fetch(`${UPSTASH_URL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmd),
    });
    return r.json();
  };

  const action = req.query.action || "morning";

  try {
    // Get all subscriber keys
    const { result: keys } = await redis(["SMEMBERS", "push:subscribers"]);
    if (!keys || keys.length === 0) {
      return res.status(200).json({ sent: 0, message: "No subscribers" });
    }

    let payload;

    if (action === "streak") {
      // ── STREAK PROTECTION (7pm MST) ──
      // Check each subscriber's streak data
      // Only notify users with 3+ day streaks who haven't opened today
      const today = new Date().toISOString().split("T")[0];
      let sent = 0;
      let failed = 0;

      for (const key of keys) {
        try {
          const { result: data } = await redis(["GET", key]);
          if (!data) { failed++; continue; }
          const { subscription } = JSON.parse(data);

          // Check if this user was active today
          const { result: activeKeys } = await redis(["SMEMBERS", `analytics:users:${today}`]);
          const subEmail = JSON.parse(data).email || "";

          // If they were active today, skip — they don't need a nudge
          if (activeKeys && activeKeys.includes(subEmail)) continue;

          // Check if they have streak data stored
          const { result: streakData } = await redis(["GET", `selah:streak:${subEmail}`]);
          let streak = 0;
          if (streakData) {
            try { streak = JSON.parse(streakData).days || 0; } catch {}
          }

          // Only nudge if they have a 3+ day streak at risk
          if (streak < 3) continue;

          const streakPayload = JSON.stringify({
            title: "Your streak is on the line",
            body: `${streak} days strong. Don't break the chain — 2 minutes is all it takes.`,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag: "selah-streak",
            data: { url: "/" },
          });

          await webpush.sendNotification(subscription, streakPayload);
          sent++;
        } catch (e) {
          failed++;
          if (e.statusCode === 410 || e.statusCode === 404) {
            await redis(["DEL", key]);
            await redis(["SREM", "push:subscribers", key]);
          }
        }
      }

      return res.status(200).json({ action: "streak", sent, failed, total: keys.length });

    } else {
      // ── MORNING VERSE (8am MST) ──
      const VERSES = [
        "As iron sharpens iron, so one person sharpens another. — Proverbs 27:17",
        "Be still and know that I am God. — Psalm 46:10",
        "The Lord is my shepherd; I shall not want. — Psalm 23:1",
        "Trust in the Lord with all your heart and lean not on your own understanding. — Proverbs 3:5",
        "I can do all things through Christ who strengthens me. — Philippians 4:13",
        "For God has not given us a spirit of fear, but of power and love and self-control. — 2 Timothy 1:7",
        "The steadfast love of the Lord never ceases; his mercies never come to an end. — Lamentations 3:22",
        "He who began a good work in you will carry it on to completion. — Philippians 1:6",
        "Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28",
        "The Lord is close to the brokenhearted and saves those who are crushed in spirit. — Psalm 34:18",
        "Do not be anxious about anything, but in everything by prayer present your requests to God. — Philippians 4:6",
        "When I am afraid, I put my trust in you. — Psalm 56:3",
        "He gives strength to the weary and increases the power of the weak. — Isaiah 40:29",
        "The Lord will fight for you; you need only to be still. — Exodus 14:14",
        "I sought the Lord, and he answered me; he delivered me from all my fears. — Psalm 34:4",
        "Create in me a pure heart, O God, and renew a steadfast spirit within me. — Psalm 51:10",
        "Search me, O God, and know my heart; test me and know my anxious thoughts. — Psalm 139:23",
        "Be strong and courageous. Do not be afraid; for the Lord your God will be with you wherever you go. — Joshua 1:9",
        "Humble yourselves before the Lord, and he will lift you up. — James 4:10",
        "The truth will set you free. — John 8:32",
        "A man's heart plans his way, but the Lord directs his steps. — Proverbs 16:9",
        "Greater is he that is in you than he that is in the world. — 1 John 4:4",
        "Weeping may stay for the night, but rejoicing comes in the morning. — Psalm 30:5",
        "Let us not become weary in doing good, for at the proper time we will reap a harvest. — Galatians 6:9",
        "Guard your heart, for everything you do flows from it. — Proverbs 4:23",
        "The name of the Lord is a strong tower; the righteous run to it and are safe. — Proverbs 18:10",
        "Commit to the Lord whatever you do, and he will establish your plans. — Proverbs 16:3",
        "My grace is sufficient for you, for my power is made perfect in weakness. — 2 Corinthians 12:9",
        "Above all else, guard your heart, for everything you do flows from it. — Proverbs 4:23",
        "Wait for the Lord; be strong and take heart and wait for the Lord. — Psalm 27:14",
      ];

      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const verse = VERSES[dayOfYear % VERSES.length];
      const isSunday = new Date().getDay() === 0;

      // ── HOLIDAY ENGINE ──
      const now2 = new Date();
      const hm = now2.getMonth() + 1, hd = now2.getDate(), hy = now2.getFullYear();
      const easterDate = (yr) => {
        const a=yr%19,b=Math.floor(yr/100),c=yr%100,d2=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d2-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m2=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m2+114)/31),day=((h+l-7*m2+114)%31)+1;
        return {m:month,d:day};
      };
      const easter = easterDate(hy);
      const eMs = new Date(hy,easter.m-1,easter.d).getTime();
      const od = (ms)=>{const dt=new Date(ms);return{m:dt.getMonth()+1,d:dt.getDate()};};
      const FIXED_HOLIDAYS = [
        {m:1,d:1,name:"New Year — Mary, Mother of God",verse:"The Lord bless you and keep you. — Numbers 6:24"},
        {m:1,d:6,name:"Epiphany",verse:"We saw his star when it rose and have come to worship him. — Matthew 2:2"},
        {m:2,d:2,name:"Candlemas",verse:"A light for revelation to the Gentiles. — Luke 2:32"},
        {m:3,d:19,name:"Feast of St. Joseph",verse:"He did what the angel of the Lord had commanded him. — Matthew 1:24"},
        {m:3,d:25,name:"Annunciation",verse:"Be it done unto me according to your word. — Luke 1:38"},
        {m:6,d:24,name:"Nativity of St. John the Baptist",verse:"He must increase, but I must decrease. — John 3:30"},
        {m:6,d:29,name:"Feast of Saints Peter and Paul",verse:"You are Peter, and on this rock I will build my church. — Matthew 16:18"},
        {m:8,d:6,name:"Transfiguration",verse:"His face shone like the sun. — Matthew 17:2"},
        {m:8,d:15,name:"Assumption of Mary",verse:"My soul magnifies the Lord. — Luke 1:46"},
        {m:9,d:14,name:"Exaltation of the Holy Cross",verse:"May I never boast except in the cross. — Galatians 6:14"},
        {m:10,d:4,name:"Feast of St. Francis",verse:"Lord, make me an instrument of your peace."},
        {m:11,d:1,name:"All Saints' Day",verse:"Blessed are the pure in heart, for they will see God. — Matthew 5:8"},
        {m:11,d:2,name:"All Souls' Day",verse:"I am the resurrection and the life. — John 11:25"},
        {m:12,d:8,name:"Immaculate Conception",verse:"Hail, full of grace, the Lord is with you. — Luke 1:28"},
        {m:12,d:12,name:"Our Lady of Guadalupe",verse:"Am I not here, I who am your mother?"},
        {m:12,d:25,name:"Christmas",verse:"The Word became flesh and made his dwelling among us. — John 1:14"},
      ];
      const MOVEABLE_HOLIDAYS = [
        {...od(eMs-46*86400000),name:"Ash Wednesday",verse:"Return to me with all your heart. — Joel 2:12"},
        {...od(eMs-7*86400000),name:"Palm Sunday",verse:"Blessed is he who comes in the name of the Lord! — Matthew 21:9"},
        {...od(eMs-3*86400000),name:"Holy Thursday",verse:"Do this in remembrance of me. — Luke 22:19"},
        {...od(eMs-2*86400000),name:"Good Friday",verse:"It is finished. — John 19:30"},
        {...od(eMs-1*86400000),name:"Holy Saturday",verse:"They rested on the Sabbath. — Luke 23:56"},
        {...easter,name:"Easter Sunday",verse:"He is not here; he has risen! — Matthew 28:6"},
        {...od(eMs+39*86400000),name:"Ascension",verse:"I am with you always, to the very end of the age. — Matthew 28:20"},
        {...od(eMs+49*86400000),name:"Pentecost",verse:"They were all filled with the Holy Spirit. — Acts 2:4"},
      ];
      const todayHoliday = [...FIXED_HOLIDAYS,...MOVEABLE_HOLIDAYS].find(h=>h.m===hm&&h.d===hd);

      // Check Advent
      const christmas = new Date(hy,11,25);
      const adventStart = new Date(hy,11,25-christmas.getDay()-21);
      const todayFull = new Date(hy,hm-1,hd);
      const isAdvent = todayFull >= adventStart && todayFull < christmas;

      const SUNDAY_QUESTIONS = [
        "What's one thing from this week you're still carrying?",
        "Where did you feel most like yourself this week?",
        "What moment this week surprised you?",
        "What did this week ask of you that you didn't expect?",
        "What's one thing you want to leave behind before the new week starts?",
        "Where did you feel God's presence this week — or miss it?",
        "What was the heaviest part of this week? What was the lightest?",
        "What did you learn about yourself this week?",
        "What would you do differently if this week repeated itself?",
        "What are you grateful for that you haven't said out loud yet?",
        "Who showed up for you this week?",
        "What unfinished thing is still sitting in the back of your mind?",
      ];
      const weekNum = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      const sundayQ = SUNDAY_QUESTIONS[weekNum % SUNDAY_QUESTIONS.length];

      // Priority: holiday > sunday question > daily verse
      payload = todayHoliday
        ? JSON.stringify({ title:`${todayHoliday.name} ✦`, body:`"${todayHoliday.verse}"`, icon:"/icon-192.png", badge:"/icon-192.png", tag:"selah-morning", data:{url:"/"} })
        : isAdvent
        ? JSON.stringify({ title:"Advent ✦", body:"Prepare the way of the Lord, make straight paths for him. — Mark 1:3", icon:"/icon-192.png", badge:"/icon-192.png", tag:"selah-morning", data:{url:"/"} })
        : isSunday
        ? JSON.stringify({ title:"Sunday Question ✦", body:sundayQ, icon:"/icon-192.png", badge:"/icon-192.png", tag:"selah-morning", data:{url:"/"} })
        : JSON.stringify({ title:"Good Morning ✦", body:`"${verse}"`, icon:"/icon-192.png", badge:"/icon-192.png", tag:"selah-morning", data:{url:"/"} });

      let sent = 0;
      let failed = 0;

      for (const key of keys) {
        try {
          const { result: data } = await redis(["GET", key]);
          if (!data) { failed++; continue; }
          const { subscription } = JSON.parse(data);
          await webpush.sendNotification(subscription, payload);
          sent++;
        } catch (e) {
          failed++;
          if (e.statusCode === 410 || e.statusCode === 404) {
            await redis(["DEL", key]);
            await redis(["SREM", "push:subscribers", key]);
          }
        }
      }

      return res.status(200).json({ action: "morning", sent, failed, total: keys.length });
    }
  } catch (e) {
    console.error("Push error:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
