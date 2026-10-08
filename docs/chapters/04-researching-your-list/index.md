---
title: Researching and Narrowing Your College List
description: Using the College Scorecard, Common Data Set, outcome data, visits, fairs, and reviews to research colleges, then narrowing a long list to a final eight to twelve.
generated_by: claude skill chapter-content-generator
date: 2026-10-08 13:24:21
version: 1.10
---

# Researching and Narrowing Your College List

## Summary

This chapter covers using the College Scorecard, Common Data Set, outcome data, visits, fairs, and reviews to research schools, then narrowing a long list to a final eight to twelve. It applies the fit criteria from the previous chapter to real data. Students finish with a researched, balanced final list of eight to twelve schools.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| College Research Tools | 356 |
| College Search Website | 1 |
| Graduation Rate | 3 |
| College Scorecard | 1 |
| Common Data Set | 1 |
| Retention Rate | 1 |
| Virtual Tour | 1 |
| Campus Visit | 36 |
| College Fair | 1 |
| Admissions Information Session | 1 |
| Student Reviews | 1 |
| Long List | 299 |
| Narrowing the List | 298 |
| Final College List | 297 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: The College Landscape and Application Rounds](../01-college-landscape-and-rounds/index.md)
- [Chapter 2: How Colleges Evaluate Applicants](../02-how-colleges-evaluate/index.md)
- [Chapter 3: Finding Your Fit](../03-finding-your-fit/index.md)

---

## From Priorities to Evidence

At the end of Chapter 3, you had a set of personal priorities, a way to judge academic, social, and financial fit, and a definition of a balanced list. What you probably don't have yet is enough real information about specific colleges to apply any of it. You may know a college's name, its mascot, and what a friend said about it. That's not enough to judge fit.

This chapter is about getting that information and using it. You'll learn which research tools answer which questions, starting with federal data and the standardized reports colleges publish about themselves, then moving to the first-hand experience of visits, fairs, and student voices. Then you'll put the research to work. You'll build a long list, narrow it in deliberate passes, and finish with a final list of eight to twelve colleges you can defend school by school.

Throughout the chapter, you'll follow Marcus from earlier chapters. His priorities are a cost ceiling of about $20,500 a year, a strong computer science program, a campus within a day's drive, and a mid-sized school.

## College Research Tools

**College research tools** are the sources you use to learn about specific colleges: data about admissions, cost, and outcomes, and first-hand impressions of what it's like to study and live there. No single tool tells you everything. Each one is good at answering certain questions and weak at others, so effective research means knowing which tool to reach for.

It helps to sort research tools into two groups:

- **Data tools** give you numbers that are reported in a standard way, so you can compare colleges fairly. They include the U.S. Department of Education's College Scorecard, each college's Common Data Set, net price calculators, and college search websites. They're best for questions about admission chances, cost, and outcomes.
- **Experience tools** give you a feel for a place: what students are like, what a weekday looks like, whether you could see yourself there. They include campus visits, virtual tours, information sessions, college fairs, and student reviews. They're best for questions about culture and social fit.

You need both kinds. Data alone can make a college look perfect on paper even though you'd be unhappy there. Experience alone can make you fall for a beautiful campus you can't afford or have little chance of getting into. A good habit is to **use data to decide which colleges to look at, and experience to decide which ones feel right.**

Before you look at the matrix below, keep one more distinction in mind. Some tools come from neutral sources, such as the federal government or standardized reports. Others come from the college itself, such as its website, tours, and information sessions, which are designed to recruit you. Both are useful, but marketing should be read as marketing.

#### Diagram: Research Tool Matrix

<iframe src="../../sims/research-tool-matrix/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>Research Tool Matrix</summary>
Type: infographic
**sim-id:** research-tool-matrix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show students which college research tool best answers which question, so they can choose the right tool instead of relying on one source for everything.

Bloom Level: Analyze (L4)
Bloom Verb: select, differentiate
Learning Objective: Students will select the research tool best suited to a given question about a college and differentiate between data tools and experience tools.

Visual style: A grid. Rows are nine research tools in two labeled groups: Data tools (College Scorecard, Common Data Set, Net price calculator, College search website) and Experience tools (Campus visit, Virtual tour, Information session, College fair, Student reviews). Columns are six questions students ask: "Can I get in?", "What will it cost me?", "Do students graduate?", "Is my major strong?", "What's the culture like?", "Could I see myself there?" Each cell shows a filled circle (strong source), half circle (partial), or empty circle (weak), plus a small tag "Neutral" or "From the college" on each row.

Ratings (illustrative):
- College Scorecard: cost strong, graduation strong, can I get in partial, major partial (field-of-study earnings), culture weak, see myself weak. Neutral.
- Common Data Set: can I get in strong, graduation strong, cost partial, major weak, culture weak, see myself weak. Reported by the college in a standard format.
- Net price calculator: cost strong, others weak. From the college.
- College search website: can I get in partial, cost partial, graduation partial, major partial, culture partial, see myself weak. Third party.
- Campus visit: culture strong, see myself strong, major partial, others weak. From the college.
- Virtual tour: culture partial, see myself partial, others weak. From the college.
- Information session: can I get in partial, cost partial, major partial, culture partial. From the college.
- College fair: can I get in partial, major partial, culture weak, see myself weak. From the college.
- Student reviews: culture strong, see myself partial, major partial, others weak. Third party, unverified.

Interaction:
- Click a cell: open an infobox explaining why the tool is strong, partial, or weak for that question, with one tip (for example, Common Data Set × "Can I get in?": "Section C has admit counts and middle 50% ranges in the same format at every college.").
- Click a column header: highlight the best tools for that question in gold.
- A createSelect "I want to know..." with the six questions does the same as clicking a column header.
- A "Quiz me" button shows a random question and asks the student to click the best tool; correct picks turn green with an explanation, wrong picks show a hint.

Color scheme: data-tool rows tinted pale blue, experience-tool rows tinted pale green; strong circles dark, partial half-filled, weak outlined.

Responsive behavior: Call updateCanvasSize() first in setup(); on narrow screens the grid collapses to one tool card at a time with a "Next tool" button.

Implementation: p5.js with createSelect and createButton; canvas parented to the main element.
</details>

#### Worked Example: Matching Questions to Tools

Marcus has four questions about a public university four hours from home. He matches each to a tool:

1. **"Can I afford it?"** → The university's **net price calculator**, using his family's income. His estimate comes to $21,000, just above his ceiling.
2. **"Is the CS program strong, and can I get into it?"** → The **university's CS department website** for program rules, and its **Common Data Set** for overall admission numbers. He learns that CS is open to any admitted student, with no separate application.
3. **"Do students actually finish?"** → The **College Scorecard**, which shows the university's graduation rate and the typical earnings of its CS graduates.
4. **"Would I like living there?"** → A **campus visit** during a school break, plus **student reviews** and a conversation with a current CS student.

Without the matching step, Marcus might have tried to answer all four questions from the university's glossy website, and he would have learned mostly what the university wanted him to know. With it, each question goes to the source most likely to answer it honestly.

## Data Tools

### College Search Websites

A **college search website** is a third-party site that lets you search and filter many colleges at once by traits like size, location, majors, cost, and selectivity. Examples include the College Board's BigFuture, Niche, and Cappex. These sites are good for **casting a wide net**. You can find colleges you've never heard of that match your priorities, which is exactly what a long list needs.

Use them with two cautions. First, their numbers usually come from federal data or the Common Data Set, sometimes a year or two old, so check important figures against the source. Second, treat any "match score," "grade," or ranking as a starting point, not a verdict. Those scores reflect someone else's choices about what matters, not your priorities.

### The College Scorecard

The **College Scorecard** is a free website from the U.S. Department of Education, at [collegescorecard.ed.gov](https://collegescorecard.ed.gov), that reports standardized data for nearly every college that accepts federal financial aid. Because the federal government collects the data the same way from every college, it's one of the fairest ways to compare schools side by side.

The Scorecard is strongest on cost and outcomes. For each college it shows the average annual net price, including how that price varies by family income. It also shows the graduation rate, the typical student debt at graduation, and the typical earnings of former students several years after they leave. Many of those figures are also broken down by field of study, so Marcus can compare earnings for computer science graduates specifically, not just graduates overall. Its admissions data is thinner, so pair it with the Common Data Set for questions about getting in.

### The Common Data Set

The **Common Data Set (CDS)** is a standardized report that many colleges publish each year, answering the same questions in the same format. To find one, search for the college's name plus "Common Data Set." It's usually posted on the college's institutional research page. Because every college uses the same sections, you can compare colleges question by question. Chapter 2 used it for middle 50% ranges and demonstrated interest.

The sections you'll use most are:

| Section | What it covers | Questions it answers |
|---------|----------------|----------------------|
| B | Enrollment and persistence | How large is it? What are its graduation and retention rates? |
| C | First-year admission | How many apply and get in? Middle 50% ranges (C9)? How much does each factor matter, including demonstrated interest (C7)? |
| G | Annual expenses | What are tuition, fees, and room and board? |
| H | Financial aid | How much need-based and merit aid does the college give, and to how many students? |
| I | Faculty and class size | How many classes are small, and how many are large? |

Two cautions apply. Not every college publishes a CDS, and the most recent one may describe the class that entered a year or two ago. Still, it's the best single source for a college's admissions numbers. It's also where you'll find the class-size data Chapter 3 recommended checking.

### Graduation Rate

A college's **graduation rate** is the percentage of students who start there as first-time, full-time students and finish a bachelor's degree within a set time. The standard federal measure uses **six years**, which is 150% of the normal four. Many colleges also report a four-year rate, which is usually lower.

Graduation rate matters because a college you start but don't finish costs time and money without giving you the degree. A high rate suggests that students are well supported, can get the classes they need, and can afford to stay. A low rate isn't automatically a dealbreaker, since colleges that serve many working or part-time students often have lower rates for reasons beyond the college's control. But it's a reason to ask questions. When you compare, look at the **four-year rate** too. A college where most students take five or six years to finish costs you an extra year or two of tuition and living expenses.

### Retention Rate

A college's **retention rate** is the percentage of first-time, full-time first-year students who return for their second year. It's an early warning signal. Students who leave after one year usually do so because of cost, academic difficulty, or poor social fit. A high retention rate suggests most first-years found what they needed. Retention is reported in the Common Data Set (Section B) and on many college search websites.

Retention and graduation rates usually move together, but retention reacts faster. If you see a college with a decent graduation rate and a retention rate noticeably lower than similar colleges, ask what happens to students in their first year.

#### Worked Example: Comparing Outcomes

Marcus compares three colleges on his list using the Scorecard and each college's CDS. The colleges are fictional, but the comparison is the kind real data supports.

| College | Retention rate | 4-year graduation rate | 6-year graduation rate |
|---------|----------------|------------------------|------------------------|
| Midland State | 88% | 52% | 74% |
| Lakeshore University | 94% | 71% | 86% |
| Ridgeview Polytechnic | 81% | 30% | 61% |

Lakeshore stands out: students stay, and most finish in four years. Midland's six-year rate is solid, but only about half its students finish in four, which means an extra year of costs is common. Ridgeview's lower retention, 81% compared with 88% and 94%, and its 30% four-year rate are red flags. Marcus doesn't cut Ridgeview yet, but he adds a question to ask on his visit: *why do students leave after their first year, and why do so many take longer than four years?* The chart below lets you compare up to four colleges this way.

#### Diagram: College Outcomes Comparison

<iframe src="../../sims/college-outcomes-comparison/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>College Outcomes Comparison</summary>
Type: chart
**sim-id:** college-outcomes-comparison<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Let students compare retention, four-year graduation, and six-year graduation rates across colleges and interpret the gaps between them.

Bloom Level: Evaluate (L5)
Bloom Verb: compare, assess
Learning Objective: Students will compare retention and graduation rates across colleges and assess which differences signal a reason to investigate further.

Chart type: Grouped vertical bar chart. Each college is a group of three bars: Retention rate, 4-year graduation rate, 6-year graduation rate. Y-axis 0–100%.

Default data: the chapter worked example (Midland State 88/52/74; Lakeshore University 94/71/86; Ridgeview Polytechnic 81/30/61), labeled "Fictional colleges for illustration."

Controls (HTML inputs above the chart):
- Up to four rows, each with a text input for college name and three number inputs (retention, 4-year rate, 6-year rate). An "Add college" button adds a row (max 4) and "Remove" buttons delete rows.
- A checkbox "Show the four-to-six-year gap," which overlays a bracket between each college's 4-year and 6-year bars labeled with the difference in percentage points.
- A "Reset to example" button.

Data visibility: Below the chart, an automatic notes panel flags, for each college, any of these patterns: retention below 85% ("Many first-years leave — ask why"); a 4-to-6-year gap above 20 points ("Finishing in four years is less common — budget for extra time"); and 6-year rate above 85% ("Strong completion").

Interaction: Hovering a bar shows a tooltip with the exact value and a one-line definition of the measure (for example "Retention rate: share of first-year students who return for a second year").

Responsive behavior: Chart.js responsive: true with maintainAspectRatio false; inputs wrap on narrow screens.

Implementation: Chart.js grouped bar chart with a custom plugin for the gap brackets.
</details>

## Experience Tools

### Campus Visits

A **campus visit** is a trip to a college to see it in person, usually including a guided tour and often an admissions information session. It's the single best way to judge campus culture and social fit, because it shows you things no website can: how students talk to each other, how the place feels on an ordinary day, and whether you can picture yourself there.

A visit is worth more when you plan it. A few habits make the difference:

- **Visit while classes are in session** if you can, so you see the campus on a normal day rather than an empty one.
- **Go beyond the tour.** Tour guides are trained, enthusiastic volunteers. Also eat in a dining hall, sit in on a class if the college allows it, walk through the neighborhood, and read the student newspaper or bulletin boards.
- **Talk to students who weren't assigned to talk to you.** Ask a student in the library or the student center what they like least about the college. Their answer often tells you more than the tour.
- **Take notes right away.** After three visits, campuses blur together. Write down what you liked, what bothered you, and any questions within an hour of leaving.
- **Register with the admissions office.** At colleges that track demonstrated interest, signing in for a tour counts.

Visits cost time and money, and many students can't visit every college on their list. That's fine. Prioritize visits to colleges you're seriously considering, especially ones that are close, ones where you're unsure about fit, and your likely safeties. For the rest, use virtual tours and information sessions, which the next sections cover. Many colleges also offer travel grants or fly-in programs for low-income and first-generation students. Search the admissions website for "fly-in" or "diversity visit program."

#### Worked Example: Getting More From One Visit

Marcus visits Lakeshore University on a Friday in October. He signs in at admissions, attends the information session, and takes the tour. Then he does three more things:

- He eats lunch in a dining hall and asks two students at his table what they'd change about Lakeshore. Both mention that the CS department's intro courses are huge, but the clubs make it feel smaller.
- He sits in on the last half hour of an intro CS lecture and notices that teaching assistants are walking the aisles helping students.
- He walks ten minutes off campus and finds a main street with cheap food and a bus stop to the nearest city.

In his notes he writes: *Big intro CS but good support. Friendly, collaborative. Town is small but enough. Can picture myself here: yes.* Those three extra hours told him more than the tour, and they confirmed that Lakeshore belongs on his final list.

### Admissions Information Sessions

An **admissions information session** is a presentation by a college's admissions staff, usually about an hour long, that explains the college's academics, student life, admissions process, and financial aid. Sessions are held on campus, often before tours, and many colleges also run them online or in high schools and hotels as part of regional travel.

Sessions are useful because they give you the college's own description of what it looks for and how its process works, sometimes including details you won't find online, such as how it reads applications by region or which majors are hardest to enter. They're also a chance to ask questions. Come with one or two specific ones, and remember that the session is a recruiting event, so pair what you hear with neutral data.

### Virtual Tours

A **virtual tour** is an online version of a campus visit: a guided video, a 360-degree photo walk-through, or a live online tour led by a current student. Nearly every college offers one on its admissions website, and some search platforms collect many in one place. Virtual tours cost nothing and take minutes, so they're ideal for early screening and for colleges you can't afford to visit. They can't show you how a campus feels or let you talk freely with students, so for colleges high on your list, pair them with a live online session or a conversation with a current student.

### College Fairs

A **college fair** is an event where representatives from many colleges set up tables in one place, usually a school gym, convention center, or online platform, to meet prospective students. The National Association for College Admission Counseling (NACAC) runs large national fairs, and many high schools and regions hold their own. Fairs are an efficient way to learn about colleges you hadn't considered and to meet the admissions officer who may read your application. Bring a short list of questions, have a few colleges in mind, and fill out the inquiry card at colleges you're serious about. At colleges that track interest, that card counts too.

### Student Reviews

**Student reviews** are first-hand descriptions of a college written by current or former students, posted on review sites such as Niche or Unigo, on social media, or in online forums. They can reveal things marketing materials don't, such as how hard it is to get into popular classes, what dorms are really like, or how students feel about campus life.

Read them carefully, though. Reviews are unverified and self-selected. Students with very good or very bad experiences post far more often than everyone in between. Look for **patterns across many reviews**, not single dramatic posts, and give more weight to specific details ("advising helped me switch majors in a semester") than to general feelings ("this place is the worst"). Where you can, confirm what you read with a real conversation.

## The Long List

A **long list** is your first, broad list of colleges worth researching, usually fifteen to twenty-five schools. It's built from your priorities and filled out through research, so it includes colleges you already know and colleges you discovered by looking. At this stage, you're still gathering options, not deciding.

A good long list has three traits:

- **It comes from your priorities.** Every school on it meets your dealbreakers, as far as you know. A college that obviously fails one shouldn't be on it.
- **It's wider than your comfort zone.** Use college search websites to find colleges you've never heard of that match your profile. Students who build lists only from familiar names miss many good fits, often less-known colleges that offer generous aid.
- **It spans every category.** Include likely reaches, targets, and safeties from the start, so you aren't scrambling to find a safety in October.

Use a simple tracking sheet from the beginning. For each college, record the information you'll need to narrow the list: admission rate, middle 50% range, your category guess, estimated net price, graduation rate, and a few notes on fit. [Chapter 5](../05-getting-organized/index.md) shows how to turn that sheet into a full application tracker.

#### Worked Example: Marcus Builds a Long List

Marcus starts with the three colleges he already knew: his in-state public university, the regional public university nearby, and Lakeshore. Then he opens a college search website and filters for: computer science major, 5,000–20,000 undergraduates, within 400 miles of home, and a published average net price under $25,000 for families in his income range. The search returns more than forty colleges. He skims each one and keeps those with a CS program that looks strong and a campus that seems like a plausible fit.

After an evening of research, Marcus has eighteen colleges. Five were new to him, including two private colleges with strong aid that he'd never have found by name. His long list is more than double the size of his final list will be, which is exactly right.

## Narrowing the List

**Narrowing the list** is the process of cutting a long list down to a final list by applying your priorities and the three kinds of fit, college by college, in deliberate passes. It's the step where research turns into decisions. It works best as a sequence of passes, each with one clear question, rather than one long, agonizing review.

**Pass 1: Cut on dealbreakers and fit.** For each college, ask: *Does it clearly fail one of my priorities?* Use your research. If the net price calculator shows a college is out of reach, if the CS program turns out to be weak, or if a virtual tour shows a campus that doesn't match what you want, cut it, no matter how famous it is.

**Pass 2: Classify and balance.** Sort what remains into reach, target, and safety using the Common Data Set numbers and the criteria from Chapter 3. Then compare the counts with a balanced list. You may need to cut from a crowded category, usually reaches, or add to a thin one, usually safeties.

**Pass 3: Test each school.** For every college still on the list, ask one question: *Could I picture myself happy here, and could I say why in a sentence?* If you can't, the college is on your list for its name, not its fit. Cut it, or research it more until you can answer.

The order matters. Cutting on fit first means you never waste time classifying colleges that wouldn't work anyway. Balancing second means you trim and fill by category, not by gut feeling. Testing last catches the colleges that survived the first two passes on numbers alone. The simulation below runs a long list through all three passes.

#### Diagram: List Narrowing Funnel

<iframe src="../../sims/list-narrowing-funnel/main.html" width="100%" height="560px" scrolling="no"></iframe>

<details markdown="1">
<summary>List Narrowing Funnel</summary>
Type: microsim
**sim-id:** list-narrowing-funnel<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let students run a long college list through the three narrowing passes and see how each pass removes colleges for a specific reason, ending with a balanced final list.

Bloom Level: Evaluate (L5)
Bloom Verb: judge, justify
Learning Objective: Students will judge which colleges to cut from a long list at each narrowing pass and justify each cut using fit criteria and list balance.

Canvas layout:
- Left: a vertical funnel with three labeled bands: "Pass 1: Fit," "Pass 2: Balance," "Pass 3: Picture yourself." Above the funnel, a pool of college cards; below it, a "Final list" tray.
- Each college card shows a name and four small icons: category (R/T/S), financial fit (green/yellow/red dot), major strength (star filled or empty), and campus match (check or X).
- Right: a "Cut log" panel listing each cut and its reason.

Default data: Marcus's 18-college long list (fictional names) with attributes chosen so that Pass 1 cuts 5 (two out of reach financially, one weak CS program, one too far, one too large), Pass 2 cuts 2 reaches from a crowded reach category and flags that one more safety would help, and Pass 3 cuts 1 college Marcus "can't say why" he wants. Final list: 10 (3 reach, 5 target, 2 safety).

Controls (all created in setup() before positioning):
- createButton "Run Pass 1," "Run Pass 2," "Run Pass 3" (each enabled after the previous one), and "Reset."
- createCheckbox "Let me decide," which switches from automatic cuts to manual mode: the student clicks cards to cut them during each pass and must choose a reason from a createSelect (Out of reach financially / Weak in my major / Fails campus priority / Too many in this category / Can't say why I want it). The log records the student's reasons.
- After Pass 3, a summary shows counts by category and runs the balance checks from Chapter 3 (8–12 total, 2–3 reach, 4–6 target, 2–3 safety, at least one affordable safety).

Interaction: Cut cards slide out of the funnel into a "Cut" pile with their reason; kept cards drop to the next band. Hovering a card shows its full attributes. In manual mode, if a student cuts a college that meets all their criteria, a gentle prompt asks "Are you sure? This one fits every priority."

Color scheme: funnel bands in three shades of blue; cut cards grayed; final-list tray in green.

Responsive behavior: Call updateCanvasSize() first in setup(); on narrow screens the cut log moves below the funnel and cards shrink to name plus icons.

Implementation: p5.js with createButton, createCheckbox, and createSelect; canvas parented to the main element.
</details>

#### Worked Example: Marcus Narrows Eighteen to Ten

**Pass 1 (fit):** Marcus runs net price calculators for all eighteen and cuts two private colleges whose estimates came in above $35,000. He cuts one university when he discovers its CS major is new and small, and another that turns out to be a ten-hour drive. He cuts one more, a 35,000-student university, after a virtual tour confirms it's bigger than he wants. *Thirteen left.*

**Pass 2 (balance):** He classifies the thirteen: five reaches, six targets, two safeties. Five reaches is too many for a list he wants to keep to ten, so he cuts the two reaches where his CS admission chances are lowest. *Eleven left: 3 reaches, 6 targets, 2 safeties.*

**Pass 3 (picture yourself):** For each college, Marcus writes one sentence on why he'd be happy there. For ten, the sentence comes easily. For one target, all he can write is "my friend is applying." He cuts it. *Ten left.*

## The Final College List

Your **final college list** is the set of colleges you'll actually apply to, usually eight to twelve, each researched, balanced across reach, target, and safety, and chosen because it fits you. It's the end product of everything in this chapter and the last, and it becomes the starting point for everything that follows: the deadlines you track in [Chapter 5](../05-getting-organized/index.md), the testing choices in Chapter 6, and the applications and essays in later chapters.

A strong final list passes a short checklist:

- Every college fits your dealbreakers and has a clear reason to be there.
- The list is balanced, usually 2–3 reaches, 4–6 targets, and 2–3 safeties.
- At least one safety is affordable and a place you'd be glad to attend.
- You've run a net price calculator for every college.
- You've seen every college in some form: a visit, a virtual tour, or a conversation with a student.

"Final" doesn't mean frozen. You can still add a college in the fall, for example a late-discovered school with a strong program or rolling admission. You can also drop one if new information changes your view. But aim to settle your list by early fall of senior year, before early deadlines arrive. A list that keeps changing in November usually means an application is being rushed.

#### Worked Example: Marcus's Final List

Here is Marcus's final list, with a one-line reason for each school.

| Category | College | Why it's on the list |
|----------|---------|----------------------|
| Reach | Two highly selective universities with strong CS and full-need aid | Long shots, but affordable if admitted |
| Reach | Public university with direct-admit CS | Excellent CS and affordable; the CS major's low admit rate makes it a reach |
| Target | Lakeshore University | Strong CS support, collaborative culture, affordable estimate; visited and loved it |
| Target | Private college with strong aid | Net price $19,000; small classes in CS |
| Target | Public university 4 hours away (reciprocity) | Strong CS; a stretch on cost, so he's applying for outside scholarships |
| Target | Two mid-sized regional universities | Good CS programs, both affordable, both within a day's drive |
| Safety | In-state public university | Clears the admission thresholds; affordable; strong CS open to all admitted students |
| Safety | Regional public university nearby | Very likely admit; lowest net price on the list; could live at home if needed |

Every college has a reason that ties back to his priorities. The list is balanced at 3 reaches, 5 targets, and 2 safeties, and both safeties are affordable. If every reach says no, Marcus still has several good options he'd be glad to choose from.

## Key Takeaways

- **College research tools** come in two kinds: **data tools** for admission chances, cost, and outcomes, and **experience tools** for culture and social fit. Use data to decide which colleges to look at and experience to decide which feel right.
- **College search websites** are good for casting a wide net. Treat their match scores as starting points.
- The **College Scorecard** gives neutral federal data on net price, **graduation rates**, debt, and earnings. The **Common Data Set** gives each college's admissions numbers, costs, aid, and class sizes in a standard format.
- **Retention rate** is an early warning signal. A gap between four- and six-year graduation rates means extra years of cost are common.
- **Campus visits** are the best test of culture. Go beyond the tour. **Information sessions**, **virtual tours**, **college fairs**, and **student reviews** fill in where you can't visit. Read reviews for patterns, not single posts.
- A **long list** of fifteen to twenty-five colleges is built from your priorities and stretched by research.
- **Narrowing the list** works in three passes: cut on fit, then balance categories, then test each school with "Could I picture myself happy here, and say why?"
- Your **final college list** of eight to twelve colleges is balanced, fully researched, and includes at least one affordable safety you'd be glad to attend.

## Check Your Understanding

??? question "Which tool would you use to find a college's middle 50% SAT range, and which section would you look in?"
    The college's **Common Data Set**, **Section C** (first-year admission), which reports middle 50% test ranges in item C9.

??? question "A college's six-year graduation rate is 80%, but its four-year rate is 45%. What does that suggest, and why does it matter for cost?"
    Many students take five or six years to finish. Each extra year adds a year of tuition and living costs, so budget for the possibility, and ask the college why students take longer.

??? question "You read six reviews of a college. One says the dorms are 'disgusting.' Five mention that it's hard to get into required courses in your major. Which deserves more weight?"
    The **pattern across five reviews** about required courses. Single dramatic posts are less reliable than specific details that many students repeat.

??? question "Why does narrowing the list cut on fit before balancing categories?"
    Cutting on fit first means you never spend time classifying colleges that wouldn't work for you. Balancing then trims and fills categories using only colleges that genuinely fit.

??? question "A student's final list has ten colleges, but they can't say why they'd be happy at three of them. What should they do?"
    Apply the **picture-yourself test**: research those three until they can name a specific reason, or cut them and, if needed, replace them with colleges that clearly fit.
