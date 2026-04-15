/**
 * Seasonal Journeys — starter set (3 paths) with 14 authored steps each.
 * Users can choose either a 7-day or 14-day run when starting a journey.
 */

function S(title, quote, prompt, action) {
  return { title, quote, prompt, action: action || null };
}

export const SEASONAL_JOURNEYS = [
  {
    id: "anxiety_peace",
    title: "Anxiety & Peace",
    subtitle: "Honest fear, gentle grounding",
    steps: [
      S("Name the storm", '"Why are you so afraid?" — Matthew 8:26', "What is your body trying to tell you before your mind explains it?", "Write the fear in one sentence — no editing."),
      S("Small is not weak", '"Do not worry about tomorrow." — Matthew 6:34', "What tomorrow-thought is stealing today’s oxygen?", "Shrink your horizon to the next right hour."),
      S("Ground under foot", '"He will not let your foot slip." — Psalm 121:3', "Where can you feel something solid — chair, breath, floor?", "Do a 2-minute body scan."),
      S("The loop", '"Search me, O God, and know my anxious thoughts." — Psalm 139:23 (adapted)', "What story does anxiety replay — and is it the whole truth?", "Challenge one catastrophic sentence with one fact."),
      S("Breath as gift", '"The breath of the Almighty gives me life." — Job 33:4', "When did you last breathe on purpose?", "Four slow breaths before you touch your phone again."),
      S("Peace is a person", '"Peace I leave with you." — John 14:27', "What would it feel like if peace were presence — not absence of problems?", "Ask for peace as relationship, not mood."),
      S("Kindness to the afraid part", '"Cast all your anxiety on him." — 1 Peter 5:7', "What part of you needs compassion — not pep talks?", "Speak to yourself as you would to a scared friend."),
      S("Limits are human", '"My grace is sufficient for you." — 2 Corinthians 12:9', "Where are you demanding superhuman calm from yourself?", "Lower one expectation today."),
      S("One next step", '"Your word is a lamp to my feet." — Psalm 119:105', "You don’t need the whole map — what is the next step?", "Write one doable action for the next 24 hours."),
      S("Community as anchor", '"Bear one another’s burdens." — Galatians 6:2', "Who knows your anxiety — really?", "Reach out with one honest text."),
      S("Night anxiety", '"On my bed I remember you." — Psalm 63:6', "What visits you at 2 a.m. — and what helps?", "Prepare a short night prayer or phrase to repeat."),
      S("Letting go of control", '"The Lord watches over you." — Psalm 121:8', "What are you gripping that was never yours to hold?", "Release it in prayer — hands open."),
      S("Peace and vigilance", '"Be alert, but not anxious." — 1 Peter 5:8 (paraphrase)', "How can you stay awake without panicking?", "Name one boundary that protects your peace."),
      S("The quiet after", '"Be still, and know that I am God." — Psalm 46:10', "What quiet sentence do you want to carry forward?", "Choose a verse or phrase to carry this week."),
    ],
  },
  {
    id: "grief_loss",
    title: "Grief & Loss",
    subtitle: "Honoring what was — and what remains",
    steps: [
      S("The weight is real", '"Jesus wept." — John 11:35', "What loss are you carrying that others might have moved past?", "Name the loss without explaining why you should be over it."),
      S("Tears have room", '"Put my tears in your bottle." — Psalm 56:8', "What tears have you held back?", "Give yourself permission to cry or write without fixing."),
      S("Anger at the gap", '"How long, O Lord?" — Psalm 13:1', "Is there anger in your grief — toward God, life, or someone?", "Write one honest question — no neat ending."),
      S("The empty chair", '"I am like a broken vessel." — Psalm 31:12', "What absence is most present today?", "Light a candle, pause, or speak their name."),
      S("Guilt’s whisper", '"There is now no condemnation." — Romans 8:1', "What guilt attaches itself to grief?", "Separate regret from responsibility — gently."),
      S("Memories that hurt and heal", '"I remember the days of old." — Psalm 143:5', "Which memory do you visit — and which do you avoid?", "Tell one story to God or paper."),
      S("Others’ comfort", '"Mourn with those who mourn." — Romans 12:15', "What help has helped — and what hasn’t?", "Forgive one clumsy word someone said."),
      S("Your body keeps score", '"My soul clings to the dust." — Psalm 119:25', "How is grief showing up in sleep, appetite, or tension?", "One gentle care for your body today."),
      S("Time bends", '"For everything there is a season." — Ecclesiastes 3:1', "What season is this — even if you hate it?", "Don’t rush the calendar. Name where you are."),
      S("Hope without erasing", '"Weeping may stay for the night, but joy comes in the morning." — Psalm 30:5', "Can hope and grief sit in the same room?", "Write one hope that doesn’t dishonor your loss."),
      S("Rituals of remembrance", '"Do this in remembrance." — 1 Corinthians 11:24', "What ritual would honor what you miss?", "Create a small ritual — repeatable, yours."),
      S("Loneliness in the crowd", '"My friends scorn me." — Job 19:19', "Where do you feel alone in grief?", "Connect with one person who can sit with silence."),
      S("Carrying and releasing", '"Cast your cares on the Lord." — Psalm 55:22', "What part of the grief are you ready to hold differently?", "Place one burden in prayer — hands open."),
      S("Living with the scar", '"I will restore you to health." — Jeremiah 30:17', "How might life look with the loss still true?", "One sentence of commitment to the living."),
    ],
  },
  {
    id: "identity_purpose",
    title: "Identity & Purpose",
    subtitle: "Who you are beneath the roles",
    steps: [
      S("Before the labels", '"Before I formed you in the womb I knew you." — Jeremiah 1:5', "What labels do you wear — and which fit?", "List three roles; circle one that feels most fragile."),
      S("Beloved, not branded", '"You are my beloved." — Mark 1:11', "When did you last feel chosen — not useful?", "Sit with “beloved” as a name, not a reward."),
      S("The gap between roles", '"We are God’s handiwork." — Ephesians 2:10', "Where do you perform identity instead of inhabit it?", "Name one place you can show up without proving."),
      S("Gifts and limits", '"Each of you should use whatever gift you have received." — 1 Peter 4:10', "What gift do you downplay — or overuse?", "One way to steward a gift without burning out."),
      S("Purpose vs pressure", '"For it is God who works in you." — Philippians 2:13', "What pressure masquerades as calling?", "Separate “should” from “deep yes” in one area."),
      S("The fear of ordinary", '"Whoever can be trusted with very little…" — Luke 16:10', "What if your purpose includes small faithfulness?", "Honor one small task today."),
      S("Comparison’s thief", '"Each one should test their own actions." — Galatians 6:4', "Whose path are you measuring yours against?", "Unfollow, mute, or bless — one comparison loop."),
      S("Calling in pain", '"We rejoice in our sufferings, knowing…" — Romans 5:3', "Has suffering shaped your purpose — how?", "Write one sentence of hard-won wisdom."),
      S("Community mirror", '"As iron sharpens iron." — Proverbs 27:17', "Who reflects your truest self back to you?", "Thank one person — specifically."),
      S("Seasons change", '"There is a time for everything." — Ecclesiastes 3:1', "What season of purpose are you in — building, waiting, healing?", "Release one outdated expectation of yourself."),
      S("The quiet yes", '"Let your yes be yes." — Matthew 5:37', "What are you quietly saying no to that matters?", "One clear yes or no this week."),
      S("Legacy vs love", '"These three remain: faith, hope, love." — 1 Corinthians 13:13', "What do you want to be true of you — not just what you produce?", "Rewrite your definition of success in one line."),
      S("Walking your path", '"Enlarge the place of your tent." — Isaiah 54:2', "Where is life asking you to expand — or simplify?", "One step toward alignment."),
      S("Held by the larger story", '"For I know the plans I have for you." — Jeremiah 29:11', "How does your story connect to something bigger than achievement?", "Close with one sentence of trust in your name and calling."),
    ],
  },
];

export function defaultJourneyProgress() {
  return { activeId: null, byJourney: {}, completed: [], customJourneys: [] };
}
