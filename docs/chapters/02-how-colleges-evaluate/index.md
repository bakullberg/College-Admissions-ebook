---
title: How Colleges Evaluate Applicants
description: How admissions offices read applications - transcripts, GPA, course rigor, class rank, holistic and formula-based review, the middle 50% range, institutional priorities, and common admissions myths.
generated_by: claude skill chapter-content-generator
date: 2026-10-08 13:00:50
version: 1.10
---

# How Colleges Evaluate Applicants

## Summary

This chapter covers how admissions offices read applications, from holistic and formula-based review to transcripts, GPA, rigor, class rank, and institutional priorities, plus the myths that distort how students see the process. It turns the admissions office from a black box into a set of understandable criteria. After this chapter, students can describe what their own academic record says to a reader and recognize the common myths about getting in.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| High School Transcript | 6386 |
| Grade Point Average | 2459 |
| Core Academic Courses | 1169 |
| Course Rigor | 1126 |
| Academic Record | 1112 |
| Holistic Review | 796 |
| Formula-Based Admissions | 123 |
| Unweighted GPA | 1 |
| Class Rank | 1 |
| Demonstrated Interest | 20 |
| Institutional Priorities | 131 |
| Legacy Status | 1 |
| First-Generation Student | 129 |
| Middle 50% Range | 1333 |
| Admissions Myths | 5 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: The College Landscape and Application Rounds](../01-college-landscape-and-rounds/index.md)

---

## Opening the Black Box

To most students, the admissions office feels like a black box. You send in an application, months pass, and a decision comes out the other side with no explanation. It's easy to fill that silence with rumors: *they only look at test scores*, *you need a 4.0*, *it's all about who your parents are*.

In fact, admissions offices work from criteria you can learn. Most of those criteria start in one place, your **academic record**: the courses you took, the grades you earned, and how challenging your schedule was compared with what your school offered. Around that record, colleges layer other information and their own goals for the incoming class.

This chapter walks through that evaluation from the inside out. You'll start with the document at the center of every application, the high school transcript, and the numbers drawn from it. Then you'll see the two broad ways colleges turn those numbers into decisions, holistic review and formula-based admission. You'll learn to read a college's middle 50% range, and you'll see the institutional priorities that shape a class in ways no applicant controls. The chapter ends by taking apart the most common myths.

## The High School Transcript

Your **high school transcript** is the official record of your coursework, issued by your high school. It lists every course you've taken for credit, the grade you earned in each, and the credits each course was worth. Most transcripts also show a cumulative grade point average, and some show a class rank. Your school sends it directly to colleges. You can't submit it yourself, which is part of why colleges trust it.

The transcript is the single most important document in nearly every application. A reader learns four things from it in a few minutes:

- **What you studied.** Which subjects, and for how many years.
- **How hard it was.** Whether you took honors, Advanced Placement (AP), International Baccalaureate (IB), or dual-enrollment courses, and how many.
- **How you did.** Your grades in each course and your overall average.
- **How you changed.** Whether your grades rose, held steady, or slipped from freshman year to senior year.

A transcript rarely arrives alone. Your counselor also sends a **school profile**, a one- or two-page summary of your high school. It lists which advanced courses the school offers, how it calculates GPA, whether it ranks students, and what its graduating class typically looks like. The profile is how a reader in another state knows that "Honors Chemistry" at your school is the most advanced chemistry option, or that your school offers only four AP courses in total. Without it, the transcript would be a list of course names with no context.

Transcripts don't share one standard format. Every school uses its own layout, abbreviations, and grading scale. That's why the interactive transcript below is annotated. Hover over each region to see what it is and what a reader takes from it.

#### Diagram: Annotated Transcript Explorer

<iframe src="../../sims/annotated-transcript-explorer/main.html" width="100%" height="560px" scrolling="no"></iframe>

<details markdown="1">
<summary>Annotated Transcript Explorer</summary>
Type: infographic
**sim-id:** annotated-transcript-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show students what a high school transcript contains and what an admissions reader takes from each part, so the document stops looking like an unreadable grid.

Bloom Level: Understand (L2)
Bloom Verb: identify, explain
Learning Objective: Students will identify the main regions of a high school transcript and explain what each one tells an admissions reader.

Visual style: A realistic but fictional transcript for "Priya Raman, Lincoln High School," drawn as a white page with a header block and four year-by-year course tables (grades 9-12; grade 12 shows "In Progress"). Each region has a faint colored outline that brightens on hover.

Regions and infobox text (tooltip on hover, full infobox on click):
1. Header (name, birthdate, school, CEEB code) — "Identifies you and your school. The CEEB code is the six-digit code colleges use to match the transcript to your school profile."
2. Course names — "What you studied. Labels like H (honors), AP, IB, or DE (dual enrollment) mark advanced courses."
3. Grades column — "How you did in each course, term by term or year by year depending on the school."
4. Credits column — "How much each course counts. A full-year course is often 1.0 credit; a semester course 0.5."
5. Year-by-year layout — "Lets the reader see your grade trend. An upward trend is a strong signal."
6. Cumulative GPA box (shows both "Unweighted 3.71" and "Weighted 4.12") — "Your average. Schools differ in how they calculate it, so many colleges recalculate it themselves."
7. Class rank line ("Rank: Not ranked") — "Many high schools no longer rank students. When they don't, colleges rely on the school profile instead."
8. Senior courses "In Progress" — "Colleges see what you're taking this year and will ask for your final grades."
9. Counselor signature and seal — "Marks the document as official. It must come from the school, not from you."

Interaction:
- Hover a region: outline turns gold and a one-line tooltip appears.
- Click a region: open the full infobox in a panel to the right (below on narrow screens).
- A "Read it like an officer" button steps through the regions in the order a reader typically scans them (header, senior courses, course names, grades, trend, GPA), opening each infobox in turn with "Next" and "Back" buttons.

Color scheme: page white with dark gray text; region outlines in pale blue; active region in gold.

Responsive behavior: Canvas width follows the container; call updateCanvasSize() first in setup() and reflow on window resize. On narrow screens the infobox panel moves below the transcript.

Implementation: p5.js with createButton controls; canvas parented to the main element.
</details>

#### Worked Example: What Priya's Transcript Says

Priya, the senior from Chapter 1, attends a mid-sized public high school whose profile lists twelve AP courses. Her transcript shows:

- Four years of English, math, science, and social studies, plus three years of Spanish.
- Honors English and Honors Biology as a sophomore, and three APs as a junior (U.S. History, Chemistry, and English Language). She's taking four APs as a senior.
- Mostly A's, with B's in Honors Geometry, Precalculus, and AP Chemistry.
- Steady grades across all three years, holding up even as junior year got harder.

A reader would summarize this in a sentence or two: *strong, consistent record with increasing challenge; took a solid share of the school's AP offerings, leaning humanities; B's in math and AP Chem are the soft spots.* Notice that the reader never needed Priya to explain anything. The transcript and profile told the story on their own. That's why the transcript is the foundation of the application. Most other numbers in this chapter are calculated from it.

## Core Academic Courses

**Core academic courses** are the courses in the five main academic subjects: English, mathematics, laboratory science, social studies (history, government, economics), and world language. Colleges care about these more than any others because they are the subjects college coursework builds on. Electives such as art, music, computer science, journalism, or business can strengthen an application, but they don't replace the core.

Most four-year colleges publish a minimum number of years required in each core subject. Selective colleges usually also publish a *recommended* number, which is higher. When a college says "recommended," treat it as the real expectation. Applicants who meet only the minimum at a selective school stand out, and not in a good way.

The table below summarizes typical requirements. It shows a common pattern, not any single college's rules, so always check the specific schools on your list.

| Subject | Typical minimum (years) | Typical recommendation at selective colleges (years) |
|---------|------------------------|-----------------------------------------------------|
| English | 4 | 4 |
| Mathematics | 3 (through Algebra II) | 4 (often through precalculus or calculus) |
| Laboratory science | 2–3 | 3–4 (biology, chemistry, physics) |
| Social studies | 2–3 | 3–4 |
| World language | 2 (same language) | 3–4 (same language) |

Two details trip students up. First, *years of the same language* is what usually counts. Two years of Spanish and one of French is often treated as two years, not three. Second, many colleges ignore electives when they recalculate your GPA, which you'll see in the next section. A strong grade in a non-core course still matters to your record, but it may not count in the number a college compares.

Core courses also feed directly into some admissions formulas. At the University of Iowa, the number of core courses you complete is one of three inputs to the index that drives first-pass admission, as you'll see later in this chapter. Each additional year of core coursework raises the score.

#### Worked Example: Counting Core Years

Marcus is a junior planning his senior schedule. So far he has:

- English: 3 years (9th–11th)
- Math: 3 years (Algebra I, Geometry, Algebra II)
- Science: 2 years (Biology, Chemistry)
- Social studies: 3 years
- Spanish: 2 years
- Electives: Graphic design, Intro to Computer Science, PE

His target colleges recommend 4 years of math and 3 of lab science. If Marcus picks up two senior electives, he graduates with 4 years of English but stays at 3 years of math and 2 of science, short in two subjects. If instead he takes Precalculus and Physics, he meets the recommendation in every subject except world language. He could add Spanish III as well, but it would replace his favorite elective. The decision is his. The point is that he can make it on purpose now, rather than discovering a gap in the fall of senior year when it's too late to fix.

## Grade Point Average

Your **grade point average (GPA)** is a single number that summarizes all your grades. Each letter grade is converted to points, each course's points are multiplied by the credits it's worth, and the total is divided by the total number of credits. In symbols:

\[
\text{GPA} = \frac{\sum (\text{grade points} \times \text{credits})}{\sum \text{credits}}
\]

The \(\sum\) symbol means "add up over every course." So you add up grade points times credits for every course, then divide by the total credits. A full-year course usually counts for 1.0 credit and a semester course for 0.5, which means a semester class has half the effect on your GPA of a year-long one.

GPA matters because it's compact. A reader can compare thousands of applicants on one number in a way they can't compare thousands of transcripts. But because it's compact, it also hides a lot. Two students with a 3.7 can have very different transcripts, one full of advanced courses and one with none. That's why GPA is always read alongside the courses that produced it.

GPA is also less standard than it looks. High schools differ in:

- **Scale.** Most use a 4.0 scale, but some use 5.0, 6.0, or a 100-point scale.
- **Pluses and minuses.** Some count an A- as 3.7; others treat every A as 4.0.
- **Which courses count.** Some include PE and electives; others don't.
- **Extra points for harder courses.** Some add points for honors and AP classes, which produces a *weighted* GPA. [Chapter 7](../07-senior-year-course-load/index.md) covers weighting in detail.

Because of all this variation, many colleges **recalculate** your GPA using their own rules. A common approach is to keep only core academic courses from grades 10 and 11 (sometimes 9 through 11) and to put every school's grades on the same scale. The GPA a college uses may not match the one printed on your transcript, and that's normal.

#### Worked Example: Calculating a GPA

Here are Priya's junior-year grades. Grade points use a plain 4.0 scale: A = 4, B = 3, C = 2, D = 1, F = 0.

| Course | Grade | Points | Credits | Points × Credits |
|--------|-------|--------|---------|------------------|
| AP English Language | A | 4 | 1.0 | 4.0 |
| Precalculus | B | 3 | 1.0 | 3.0 |
| AP Chemistry | B | 3 | 1.0 | 3.0 |
| AP U.S. History | A | 4 | 1.0 | 4.0 |
| Spanish III | A | 4 | 1.0 | 4.0 |
| Health (semester) | A | 4 | 0.5 | 2.0 |
| **Total** | | | **5.5** | **20.0** |

Her junior-year GPA is:

\[
\text{GPA} = \frac{20.0}{5.5} \approx 3.64
\]

Now recalculate the way many colleges do, using only core courses. Health is dropped, leaving 18.0 points over 5.0 credits:

\[
\text{GPA}_{\text{core}} = \frac{18.0}{5.0} = 3.60
\]

The core-only number is a little lower, because the easy A in Health no longer pulls the average up. That's exactly why colleges recalculate. The core GPA tracks how a student does in the courses college work builds on.

### Unweighted GPA

An **unweighted GPA** is a GPA calculated on a plain scale where every course counts the same way, no matter how difficult it is. An A is worth 4 points whether it comes from AP Physics or a study-skills elective. That means an unweighted GPA tops out at 4.0. The calculation above is unweighted.

Colleges like the unweighted GPA because it's the closest thing to a common language across high schools. Weighting systems differ from school to school, but an A is an A nearly everywhere. Report it accurately on your applications, using the number from your transcript, and leave course difficulty to show up where colleges look for it: in the courses themselves.

The GPA calculator below lets you enter your own courses, switch between "all courses" and "core only," and see how much a single grade or a semester course moves the result.

#### Diagram: GPA Calculator

<iframe src="../../sims/gpa-calculator/main.html" width="100%" height="520px" scrolling="no"></iframe>

<details markdown="1">
<summary>GPA Calculator</summary>
Type: microsim
**sim-id:** gpa-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let students calculate an unweighted GPA from their own courses and see how credits, individual grades, and core-only recalculation change the result.

Bloom Level: Apply (L3)
Bloom Verb: calculate, demonstrate
Learning Objective: Students will calculate an unweighted GPA from a list of courses and demonstrate how a college's core-only recalculation can produce a different number.

Canvas layout:
- Top: a table of up to 8 course rows. Each row has a text input for the course name, a select for grade (A, B, C, D, F), a select for credits (0.5 or 1.0), and a checkbox "Core course."
- Bottom: two large readouts, "Unweighted GPA (all courses)" and "Core-only GPA," each shown to two decimals, with a horizontal bar from 0.0 to 4.0 under each.
- Right side (below on narrow screens): a "What moved it?" panel that names the course whose change most recently shifted the GPA and by how much (for example "Health A (0.5 credit): +0.04").

Default data: Priya's junior year from the chapter worked example (AP English Language A 1.0 core; Precalculus B 1.0 core; AP Chemistry B 1.0 core; AP U.S. History A 1.0 core; Spanish III A 1.0 core; Health A 0.5 not core). Default readouts: 3.64 and 3.60.

Controls (all created in setup() before positioning):
- createInput, createSelect, and createCheckbox for each row.
- createButton "Add course" (up to 8 rows) and "Remove last."
- createButton "Load Priya's year" to restore defaults.
- createButton "Show the math" toggles a line showing the sum of points × credits over the sum of credits for each readout.

Behavior: Readouts update immediately on any change. Rows with no grade are ignored. The core-only readout shows "—" if no core course is checked.

Color scheme: readout bars in blue; the "What moved it?" value in green for increases and orange for decreases.

Responsive behavior: Call updateCanvasSize() first in setup(); reposition rows and readouts on window resize; rows stack inputs vertically on narrow screens.

Implementation: p5.js built-in controls; canvas parented to the main element.
</details>

## Class Rank

**Class rank** is your position in your graduating class when students are ordered by GPA. It's reported either as a number ("27 of 412") or as a percentile ("top 7%"). Rank compares you only with classmates, so it says nothing about how hard your school is overall.

Many high schools have stopped ranking, often to reduce competition between students for tenths of a GPA point. If your school doesn't rank, your transcript will say so or simply leave rank off, and colleges won't hold that against you. They'll use your school profile instead, which often shows how GPAs are distributed across the class.

Rank still matters in a few places. Texas law, for example, guarantees admission to its public universities for students near the top of their class, with the flagship in Austin setting a smaller cutoff (the top 5% for students entering in 2026) than the 10% used elsewhere. If your school ranks and you're applying in a state with a rule like that, rank is worth checking. Otherwise, treat it as one more view of your GPA rather than a separate thing to manage.

## Course Rigor

**Course rigor** is how challenging your schedule is compared with what your high school offers. It's measured by the level of your courses, not by how hard they felt to you. Honors, AP, IB, and dual-enrollment courses all signal rigor, and so does taking a subject further than required, such as a fourth year of math or a third year of lab science.

The key words in that definition are *what your high school offers*. Readers judge rigor in context, using the school profile. A student at a school with four AP courses who takes all four has shown maximum rigor. A student at a school with twenty-five APs who takes four has shown a moderate amount. The same schedule can mean very different things depending on where it was built.

Colleges get help with this judgment from your counselor. On the Common App's school report, your counselor is asked to rate the rigor of your course selection compared with other students at your school, on a five-step scale that runs from "most demanding" down to "less than demanding." Selective colleges pay close attention to that checkbox, because the counselor knows what was actually available to you.

Rigor and grades work together, and the trade-off between them is the most common question students ask: *Is it better to get an A in a regular class or a B in an AP?* At selective colleges, the honest answer is that they'd prefer the A in the AP. Between your two options, a solid B in a challenging course you chose deliberately usually reads better than an A in a course that didn't stretch you, especially in subjects tied to your interests. But rigor has limits. A schedule so heavy that your grades drop across the board, or that leaves no time for anything else, works against you. [Chapter 7](../07-senior-year-course-load/index.md) covers how to strike that balance in senior year.

#### Worked Example: Same Schedule, Different Schools

Two students take identical junior schedules: three AP courses, two honors courses, and one regular course.

- **Elena** attends a small rural high school whose profile lists three AP courses in total. She took all three, plus the only honors courses offered in her grade. Her counselor checks "most demanding."
- **Jordan** attends a large suburban high school whose profile lists twenty-two AP courses. Many of Jordan's classmates aiming at selective colleges take five or six APs as juniors. Jordan's counselor checks "demanding."

On paper, their schedules are identical. To a reader, Elena has taken the hardest schedule available to her, and Jordan has taken a moderate one. Neither student is being penalized for their school. Each is being measured against the options they actually had. The interactive below lets you test this idea with your own combinations.

#### Diagram: Rigor in Context

<iframe src="../../sims/rigor-in-context/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Rigor in Context</summary>
Type: microsim
**sim-id:** rigor-in-context<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show that course rigor is judged relative to what a high school offers, not as an absolute count of advanced courses.

Bloom Level: Analyze (L4)
Bloom Verb: compare, differentiate
Learning Objective: Students will compare course schedules across high schools with different offerings and differentiate between the number of advanced courses a student took and the rigor that number represents.

Canvas layout:
- Left panel: "The high school." A slider "Advanced courses offered" (0 to 30, default 12) and a row of small course tiles representing the offerings, shaded gray.
- Middle panel: "The student's schedule." A slider "Advanced courses taken" (0 to the number offered, default 4). Tiles the student took turn blue.
- Right panel: "How a reader sees it." A share bar showing taken ÷ offered as a percentage, and a counselor-rating gauge with five bands: Less than demanding, Average, Demanding, Very demanding, Most demanding.

Rating rule (illustrative, stated on screen): the gauge uses the share of available advanced courses taken, adjusted for very small offerings. If offered is 0, the gauge reads "No advanced courses offered — readers look at core-course completion and grades instead." Otherwise, share ≥ 80% → Most demanding; 55–79% → Very demanding; 30–54% → Demanding; 10–29% → Average; under 10% → Less than demanding. A note under the gauge says: "Real counselors also consider which subjects and grade levels the courses fall in; this model uses the share alone."

Preset buttons:
- "Elena" (offered 3, taken 3 → Most demanding)
- "Jordan" (offered 22, taken 3 → Average, with note that taking honors courses as well would raise it)
- "Priya" (offered 12, taken 7 across junior and senior years → Very demanding)

Controls (all created in setup() before positioning): two createSlider controls and three createButton presets.

Interaction: Moving either slider updates tiles, share bar, and gauge immediately. Hovering a gauge band shows a one-line description of what that rating suggests to a reader.

Color scheme: offered tiles gray, taken tiles blue, gauge bands from light gray (less than demanding) to deep green (most demanding), active band outlined in gold.

Responsive behavior: Call updateCanvasSize() first in setup(); panels stack vertically on narrow screens and controls reposition on resize.

Implementation: p5.js with createSlider and createButton; canvas parented to the main element.
</details>

## The Academic Record

Your **academic record** is the full picture of your high school academics as a reader sees it. It combines everything so far: the transcript, the core courses on it, your GPA, and the rigor of your schedule. It adds one more thing none of those show on their own, which is the **trend** of your grades over time. Most colleges, from the most selective to the most open, name the academic record as the most important part of the application.

The reason is simple. The academic record is the best evidence a college has about how you'll do in college classes. It covers four years instead of one test morning, it reflects hundreds of assignments, and it was graded by many different teachers. No essay or activity can match that amount of evidence.

Readers look at the record as a whole, asking a handful of questions about it. The table below summarizes those questions and the parts of the record that answer them. Each one draws on an idea from earlier in this chapter.

| Reader's question | Where the answer comes from |
|-------------------|------------------------------|
| Did you take the courses college requires? | Core academic courses on the transcript |
| Did you challenge yourself? | Course rigor, read against the school profile |
| How well did you do? | GPA, often recalculated on core courses |
| How do you compare with classmates? | Class rank, or the GPA distribution on the profile |
| Are you getting stronger or weaker? | Year-by-year grade trend |
| Are you still working hard this year? | Senior courses in progress, and later your mid-year and final grades |

That last row matters more than students expect. Colleges see your senior schedule when you apply, and most ask for mid-year grades in winter. An admission offer is also conditional on finishing senior year in good standing. Colleges can, and occasionally do, withdraw offers when senior grades collapse.

#### Worked Example: Two Records, One GPA

Sam and Riley each finish junior year with a cumulative unweighted GPA of 3.5.

- **Sam's** grades rose each year: 3.1 as a freshman, 3.5 as a sophomore, 3.9 as a junior, with more honors and AP courses each year.
- **Riley's** grades fell each year: 3.9 as a freshman, 3.5 as a sophomore, 3.1 as a junior, while the schedule stayed about the same.

The averages match, but the records don't. Sam's record says *this student is getting stronger and taking on more*, which is the story colleges hope to see. Riley's says *something changed*, and a reader will wonder what. If Riley's decline had a cause, such as an illness, a family crisis, or a move, the application's additional-information section is the place to explain it briefly. A reader can't give context they don't know about.

## Holistic Review

**Holistic review** is an admissions approach in which readers evaluate the whole application, including academics, activities, essays, recommendations, and personal circumstances, and judge each applicant in context rather than by a formula. Most private colleges and many selective public universities use it.

The word *context* is what makes holistic review different. Readers aren't asking "Is this the best possible applicant?" They're asking "What did this student do with the opportunities they had?" A student who worked twenty hours a week to support their family isn't compared with a student who spent summers at expensive programs as though both had the same free time. You already saw this with course rigor. Holistic review applies the same thinking to the entire file.

The academic record still comes first. Most holistic colleges describe it as the most important factor. What holistic review adds is everything else, roughly in this order of weight at most selective schools:

1. **Academic record:** rigor and grades, the heaviest factor almost everywhere.
2. **Test scores:** where submitted or required. [Chapter 6](../06-sat-act-question/index.md) covers testing.
3. **Essays:** your voice and reflection, and what you reveal that the rest of the file can't.
4. **Activities:** depth, initiative, and impact, rather than a long list of light commitments.
5. **Recommendations:** outside confirmation of who you are in a classroom or activity.
6. **Fit factors:** demonstrated interest, interviews, and how you match the college's priorities that year.

In practice, many colleges turn this into a set of **reader ratings**. A first reader assigns separate scores, often on a scale such as 1 (exceptional) to 5 (weak), for categories like academics, activities, and personal qualities. Then the reader writes a short summary. Chapter 1 showed one of those summaries for a fictional applicant, Dana. The ratings help a committee compare files quickly, but they don't add up to a single score. A file with an outstanding rating in one area can be admitted over a file with good ratings across the board.

One consequence surprises students. At the most selective colleges, nearly every applicant is academically qualified, so the academic record stops separating applicants from one another. Essays, activities, and recommendations end up doing much of the work of choosing among them. That's not because grades don't matter there. It's because almost everyone in the pool has strong grades.

#### Worked Example: Same Numbers, Different Files

Two applicants to the same selective private college have a 3.9 unweighted GPA, similar rigor, and similar test scores.

- **Applicant A** lists ten clubs, each for a year or less, with no leadership. Their essay recounts a service trip in general terms. Their teacher letters are positive but brief.
- **Applicant B** lists four activities: three years building and repairing bikes for a community shop, which they now help run, plus a part-time job. Their essay describes teaching a younger kid to true a wheel, and what that taught them about patience. A teacher's letter describes them as the student who stays after class to help classmates who are stuck.

A reader would likely give both the same academic rating. Applicant B would probably earn stronger activity and personal ratings, because the file shows depth, responsibility, and a specific person. Holistic review is designed to see that difference. The explorer below lets you change one part of a file at a time and watch how the ratings respond.

#### Diagram: Holistic Review Rating Explorer

<iframe src="../../sims/holistic-review-explorer/main.html" width="100%" height="540px" scrolling="no"></iframe>

<details markdown="1">
<summary>Holistic Review Rating Explorer</summary>
Type: microsim
**sim-id:** holistic-review-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show how holistic review produces separate ratings for different parts of an application, and how context changes those ratings, so students see why identical numbers can lead to different outcomes.

Bloom Level: Analyze (L4)
Bloom Verb: compare, attribute
Learning Objective: Students will compare applicant files with similar academic numbers and attribute differences in reader ratings to specific parts of each file.

Canvas layout:
- Left: an "application folder" with five tabs: Academics, Activities, Essay, Recommendations, Context. Clicking a tab shows a short description of that part of the current applicant's file.
- Right: a "Reader's rating sheet" with three ratings (Academic, Activities, Personal), each shown as five boxes from 1 (exceptional) to 5 (weak), with the current rating filled. Below it, a one-sentence generated reader summary built from the current ratings.

Applicant presets (buttons): "Applicant A" and "Applicant B" from the chapter worked example, and "Dana" from Chapter 1 (small rural school, all three APs taken, works at family store).

Controls (all created in setup() before positioning):
- createButton for each preset.
- createSelect "Activities depth": "Many short-term clubs," "A few long-term commitments," "Long-term commitment with leadership or a job."
- createSelect "Essay specificity": "General," "Specific," "Specific and reflective."
- createSelect "Recommendation detail": "Brief and generic," "Detailed with examples."
- createCheckbox "Reader has the school profile" (default checked). Unchecking it removes context, and the Academic rating for small-school applicants such as Dana moves one step weaker, with a note explaining why context matters.

Rating rules (illustrative, stated on screen as a simplified model): Academic rating comes from the preset's GPA and rigor; Activities rating from the activities-depth select (5/3/2, adjusted by preset); Personal rating from the average of essay specificity and recommendation detail. Ratings never combine into a single total; the summary sentence names the strongest rating.

Interaction: Any change updates the rating sheet and summary immediately. Hovering a rating box shows what that level typically means ("2 — strong, stands out at most schools").

Color scheme: folder tabs in muted colors; filled rating boxes in blue; the most recently changed rating flashes gold.

Responsive behavior: Call updateCanvasSize() first in setup(); the folder and rating sheet stack vertically on narrow screens; reposition controls on resize.

Implementation: p5.js with createButton, createSelect, and createCheckbox; canvas parented to the main element.
</details>

## Formula-Based Admissions

**Formula-based admissions** is an approach in which a college admits applicants mainly by combining a few numbers, usually GPA, course counts, and sometimes test scores, into a score or a set of cutoffs. Applicants who meet the cutoff are typically admitted, and applicants who don't are either reviewed individually or denied. Large public universities use formulas most often, because they receive tens of thousands of applications and are expected to treat state residents in a clear, predictable way.

Formula-based admission isn't a lesser kind of admissions. It has real advantages for students:

- **It's transparent.** You can often calculate your own score before applying.
- **It's predictable.** If you clear the threshold, you can be reasonably confident of the result.
- **It's fast.** Many formula-based schools release decisions within weeks.

The trade-off is that essays, activities, and recommendations matter much less, and sometimes not at all, for basic admission. Many formula-based schools still use those materials for honors programs, competitive majors, and scholarships, so they're rarely wasted.

The clearest real example is the University of Iowa, the running example in this book. Iowa's three public universities share a formula called the **Regent Admission Index (RAI)**:

\[
\text{RAI} = (3 \times \text{ACT composite}) + (30 \times \text{GPA}) + (5 \times \text{years of core courses})
\]

The formula multiplies each of three numbers by a weight and adds the results. The weights explain how much each input matters. A full point of GPA is worth 30 RAI points, while a single ACT point is worth 3. SAT scores are converted to ACT equivalents. For Iowa's College of Liberal Arts and Sciences, the minimum RAI has been 245 for Iowa residents and 255 for nonresidents, and other colleges within the university, such as Engineering, can set higher thresholds. Iowa is test-optional. Applicants without a test score can still be admitted, but because the formula needs all three inputs, their applications are reviewed individually rather than scored automatically. These figures reflect recent application cycles, so confirm the current formula and thresholds at [admissions.uiowa.edu](https://admissions.uiowa.edu) before relying on them.

#### Worked Example: Running the RAI

Casey has a 3.40 GPA, a 24 ACT composite, and will finish 17 years of core courses (counting each full-year core course as one year, summed across subjects).

\[
\text{RAI} = (3 \times 24) + (30 \times 3.40) + (5 \times 17) = 72 + 102 + 85 = 259
\]

At 259, Casey clears both the resident threshold (245) and the nonresident threshold (255).

Now suppose Casey's ACT were 22 instead. The test term drops to 66 and the RAI becomes 253. That still clears the resident threshold, but it falls just short of the nonresident one. So the same student is a clear admit as an Iowa resident and a borderline case as an out-of-state applicant. This is the residency effect from Chapter 1, made precise. Casey could also raise the score by adding one more year of core coursework, which adds 5 points and brings 253 to 258.

The calculator below runs this formula for any combination of inputs and shows which threshold you clear.

#### Diagram: Regent Admission Index Calculator

<iframe src="../../sims/rai-calculator/main.html" width="100%" height="480px" scrolling="no"></iframe>

<details markdown="1">
<summary>Regent Admission Index Calculator</summary>
Type: microsim
**sim-id:** rai-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let students run a real formula-based admissions index and see how each input, and residency, affects whether they clear the threshold.

Bloom Level: Apply (L3)
Bloom Verb: calculate, use
Learning Objective: Students will use the Regent Admission Index formula to calculate a score from GPA, ACT, and core-course years and determine whether it meets the resident and nonresident thresholds.

Canvas layout:
- Top: three sliders with live numeric labels: "Cumulative GPA" (2.00 to 4.00, step 0.01, default 3.40), "ACT composite" (12 to 36, step 1, default 24), "Years of core courses" (10 to 22, step 0.5, default 17).
- Middle: a horizontal stacked bar showing the RAI broken into three colored segments (ACT × 3, GPA × 30, Core × 5), with each segment's value labeled, and the total RAI in large type.
- Two vertical threshold lines on the bar's scale: "Resident 245" and "Nonresident 255."
- Bottom: a status line for each threshold: "Clears resident minimum by 14" or "Below nonresident minimum by 2."

Controls (all created in setup() before positioning):
- Three createSlider controls.
- createSelect "Residency": Iowa resident / Nonresident (highlights the relevant threshold line).
- createButton presets "Casey (ACT 24)" and "Casey (ACT 22)" from the worked example.
- createButton "Show formula" toggles the full arithmetic line, e.g. "(3 × 24) + (30 × 3.40) + (5 × 17) = 259."

Notes shown on screen: "Thresholds shown are for the College of Liberal Arts and Sciences in recent cycles and can change. Some colleges within the university set higher minimums. Applicants without a test score are reviewed individually instead of by formula. Confirm at admissions.uiowa.edu."

Interaction: The bar and status lines update as sliders move. Hovering a bar segment shows how many RAI points one more unit of that input would add (ACT +3, GPA +0.1 → +3, Core +1 year → +5), so students can see which input is most movable.

Color scheme: ACT segment purple, GPA segment blue, core segment teal; threshold lines dark gray, with the selected residency's line in gold.

Responsive behavior: Call updateCanvasSize() first in setup(); sliders stack vertically and bar width follows the container on resize.

Implementation: p5.js with createSlider, createSelect, and createButton; canvas parented to the main element.
</details>

Many colleges sit somewhere between the two approaches. A large public university might admit clear cases by formula and send borderline files to holistic review, or it might admit to the university by formula and then review holistically for competitive majors like nursing or engineering. When you research a college, the useful question isn't "holistic or formula?" but "which parts of my application decide which outcomes here?"

## The Middle 50% Range

The **middle 50% range** is the span between the 25th and 75th percentile of a college's students on some measure, usually GPA or test scores. A **percentile** tells you what share of a group falls at or below a value. If a college's 25th percentile ACT is 26, a quarter of its students scored 26 or lower. If its 75th percentile is 31, three-quarters scored 31 or lower. The middle 50% range, 26–31, holds the middle half of the class.

Colleges publish these ranges because they're more honest than an average. An average ACT of 28 could come from a class where nearly everyone scored 28, or from one where scores ran from 20 to 36. The range shows the spread. It also shows something students often miss: **a quarter of the class falls below the bottom of the range.** The 25th percentile isn't a minimum. Plenty of admitted students sit beneath it, usually because something else in their file was strong.

Here's how to read where you fall:

- **Above the 75th percentile:** your numbers are a strength at this college.
- **Inside the range:** your numbers are typical. Other parts of the file will decide the outcome.
- **Below the 25th percentile:** your numbers are a hurdle. Admission is possible but less likely, and the rest of the file has to carry more weight.

Ranges are most often published in a college's **Common Data Set**, a standard report many colleges post each year, usually by searching the college's name plus "Common Data Set." Section C covers first-year admission and includes test-score ranges and GPA distributions. Two cautions apply. First, Common Data Set ranges usually describe *enrolled* students, not all *admitted* students, and the two groups can differ. Second, at test-optional colleges the test ranges include only students who chose to submit, and those students tend to be the ones with higher scores. That pushes the published range up. [Chapter 3](../03-finding-your-fit/index.md) uses these ranges to sort your list into reach, target, and safety schools.

#### Worked Example: Reading a Range

A fictional college, Westbrook University, reports these middle 50% ranges for enrolled first-year students:

| Measure | 25th percentile | 75th percentile |
|---------|-----------------|-----------------|
| Unweighted GPA | 3.60 | 3.95 |
| ACT composite | 26 | 31 |

Priya has a 3.71 unweighted GPA and an SAT score of 1280, which is about a 27 on the ACT scale.

- **GPA:** 3.71 is inside the range, in its lower half.
- **ACT:** 27 is inside the range, just above the 25th percentile.

Both numbers are typical for Westbrook, but on the lower side of typical. Her numbers won't hold her back, but they won't carry her either, so her essays and activities will matter. If Westbrook is test-optional, she should also remember that the published ACT range is inflated by self-selection, so a 27 is closer to the middle of all admitted students than this table suggests. The chart below lets you drop your own numbers onto any college's range.

#### Diagram: Middle 50% Range Plotter

<iframe src="../../sims/middle-50-range-plotter/main.html" width="100%" height="460px" scrolling="no"></iframe>

<details markdown="1">
<summary>Middle 50% Range Plotter</summary>
Type: chart
**sim-id:** middle-50-range-plotter<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Purpose: Help students interpret a college's middle 50% range and locate their own GPA and test score relative to it.

Bloom Level: Analyze (L4)
Bloom Verb: interpret, classify
Learning Objective: Students will interpret a college's middle 50% range for GPA and test scores and classify their own numbers as above, inside, or below the range.

Chart type: Horizontal floating-bar chart (Chart.js bar chart with indexAxis 'y' and [low, high] data), one bar per measure. Two rows: "Unweighted GPA" (scale 2.0–4.0) and "ACT composite" (scale 12–36). Because the two measures use different scales, draw them as two stacked chart panels sharing one layout.

Elements on each panel:
- The middle 50% shown as a solid blue bar from the 25th to the 75th percentile.
- Light gray zones to the left ("Below range: 25% of students") and right ("Above range: 25% of students").
- A gold diamond marker for the student's value.
- A label next to the marker: "Above range," "Inside range — upper half," "Inside range — lower half," or "Below range."

Controls (HTML inputs above the chart):
- Number inputs for "Your GPA" and "Your ACT."
- Number inputs for the college's 25th and 75th percentiles for each measure.
- A select of example colleges, all fictional and labeled as illustrative: "Westbrook University (GPA 3.60–3.95, ACT 26–31)," "Lakeside State (GPA 3.30–3.85, ACT 21–27)," "Harrow College (GPA 3.85–4.00, ACT 32–35)." Selecting one fills the percentile inputs.
- A checkbox "Test-optional college," which adds a note under the ACT panel: "This range includes only students who submitted scores, so it likely overstates the typical admitted student's score."

Default: Westbrook University with Priya's GPA 3.71 and ACT-equivalent 27 (SAT 1280).

Interaction: Hovering any bar region shows a tooltip explaining what share of students fall there. Changing an input redraws immediately.

Responsive behavior: Chart.js responsive: true with maintainAspectRatio false; the container resizes with the window and inputs wrap on narrow screens.

Implementation: Chart.js floating bars with a custom plugin to draw the marker diamond.
</details>

## Institutional Priorities

**Institutional priorities** are the goals a college sets for each incoming class beyond admitting strong individual students. An admissions office isn't just picking the best applicants one at a time. It's building a class that has to fill dorms, programs, teams, and budgets, and that reflects the college's mission. Priorities are set by the college's leadership, not by individual readers, and they can shift from year to year.

Common institutional priorities include:

- **Academic balance:** enough students for every major, including smaller departments such as classics or music, not just the most popular ones.
- **Geographic reach:** students from many states and countries, or, for a public university, a required share of state residents.
- **Access and opportunity:** students from low-income families, rural areas, or families new to college.
- **Talents the college needs:** recruited athletes, musicians for the orchestra, or students for a new program.
- **Finances:** enough students who can pay most of the cost to fund aid for those who can't.
- **Relationships:** children of alumni, faculty, or staff.

You can't control most of these, and you shouldn't try to game them. But knowing they exist explains outcomes that otherwise look random. If a college needed oboists this year and you play the oboe, that's a real advantage you didn't earn through your application alone. If a college received a flood of applicants for its business school, competition for that major gets harder. A rejection from a selective college often says more about the shape of that year's class than about the applicant.

#### Worked Example: Shaping a Class

A small college has 500 seats and 1,200 academically qualified applicants after first reads. Its priorities for the year include an orchestra that needs string players, a new environmental science major that's under-enrolled, and a goal of keeping the share of first-generation students at about 20%.

Two applicants have very similar ratings. One plans to major in psychology, the college's most popular major, and the other plans to major in environmental science and plays the cello. In the final committee round, when the remaining seats are being filled, the second applicant fits two of the college's stated needs and the first fits none. That's not a judgment of who's the better person. It's the class being shaped. Applicants can't predict these needs, which is the best argument for applying to a balanced list of colleges rather than placing every hope on one.

### First-Generation Students

A **first-generation student** is a student whose parents or guardians did not complete a four-year college degree. Definitions vary slightly. Some colleges count you as first-generation if a parent attended college but didn't finish, and some count a degree earned outside the U.S. differently. The Common App asks about your parents' education, and many colleges then apply their own definition.

Many colleges list first-generation status as an institutional priority, for two reasons. The first is mission. Colleges want to open the door to students whose families haven't had access to higher education. The second is fairness in context. First-generation students usually build their applications without anyone at home who knows the process. That's exactly what holistic review is designed to account for. A reader who knows you're first-generation reads your choices, your list of activities, and even your essay topic with that in mind.

Being first-generation affects more than admission:

| Where it matters | What it can mean for you |
|------------------|--------------------------|
| Admission | Considered as context, and often as a stated priority, at many holistic colleges |
| Financial aid | Often overlaps with need-based aid eligibility; some scholarships are specifically for first-generation students |
| Support programs | Many colleges run first-generation summer bridge programs, mentoring, and student organizations |
| Application fees | Fee waivers are often available, and some colleges extend them to first-generation applicants |

#### Worked Example: Answering the Family Question

Ana's mother finished two years at a community college and earned an associate degree. Her father completed high school. On the Common App, Ana reports each parent's highest level of education accurately. She doesn't need to decide whether she "counts." Each college applies its own definition to her answers. Under the most common definition (no parent with a bachelor's degree), Ana is first-generation. She then searches each college's website for "first-generation" and finds that two of her schools offer a pre-orientation program and a mentoring network. She adds those to her research notes, since they'll matter when she compares offers in the spring.

### Legacy Status

**Legacy status** is a preference some colleges give to applicants whose parent, or sometimes grandparent or sibling, attended the college. It's an institutional priority tied to alumni relationships and fundraising. Where it exists, it usually acts as a tiebreaker among qualified applicants rather than a pass for unqualified ones, and it tends to matter most in Early Decision rounds.

Legacy preferences are shrinking. A number of selective colleges, including Johns Hopkins and Amherst, have ended them, and several states have banned them at some or all of their colleges. Most public universities don't consider legacy at all. The Common App asks where your family members went to college, so you'll report it either way. Then check each college's own policy, which is often stated on its admissions website or in its Common Data Set. If you aren't a legacy anywhere, you aren't at a disadvantage at the many colleges that don't consider it.

## Demonstrated Interest

**Demonstrated interest** is the evidence an applicant gives that they would actually enroll if admitted. It includes visiting campus, attending a virtual information session, talking with an admissions officer at a college fair, interviewing, opening the college's emails, and writing a specific "Why us?" essay. Colleges track it because they need to predict how many admitted students will enroll. A college that admits too many students who go elsewhere misses its class size and has to dig into its waitlist.

Demonstrated interest varies a lot from college to college. Some track it closely. Others say plainly that they don't consider it at all, especially large public universities and the most selective private colleges, which have no trouble filling seats. The way to find out is the college's Common Data Set. Section C7 rates "level of applicant's interest" as very important, important, considered, or not considered. Check it for each school rather than guessing.

#### Worked Example: Where to Spend Limited Time

Marcus has time for about three interest-building steps this fall, and he can't afford to visit every campus. He checks Section C7 for his four target schools:

- **Two colleges rate interest "important."** He signs up for their virtual sessions, schedules an optional interview at one, and writes their "Why us?" essays around specific classes and programs he found.
- **One college rates it "considered."** He opens its emails and attends its regional college-fair table, which takes no extra travel.
- **One large public university rates it "not considered."** He skips extra outreach and puts that time into his essays.

The result is that Marcus's limited time goes where it can actually change an outcome. Opening emails won't overcome a weak record anywhere, but at a college that tracks interest, two genuine contacts and a specific essay can tip a close decision. [Chapter 10](../10-supplemental-essays/index.md) covers the "Why us?" essay.

## Admissions Myths

**Admissions myths** are widely repeated beliefs about how colleges choose students that don't match how admissions offices actually work. They spread because the process is hidden and the stakes feel high. They do harm because students make real decisions based on them. With this chapter's vocabulary, you can test four common ones against the facts:

- **"You need a perfect GPA."** Most colleges admit a wide range of GPAs. Even at selective schools, a quarter of enrolled students fall below the middle 50% range, and rigor and trend matter alongside the number.
- **"Holistic means grades don't really matter."** The academic record is the most important factor at nearly every holistic college. Holistic review adds context to it. It doesn't replace it.
- **"Formula schools are easy to get into."** Formulas are predictable, not lenient, and competitive majors at formula schools can be as hard to enter as many selective colleges.
- **"Legacy and donor students take most of the seats."** At colleges that consider legacy, it's one priority among many, and many colleges don't consider it at all.

Three other myths, about finding one "right" school, test-optional policies, and being well-rounded, get their own treatment in [Chapter 3](../03-finding-your-fit/index.md), [Chapter 6](../06-sat-act-question/index.md), and [Chapter 8](../08-activities-and-resume/index.md).

## Key Takeaways

- The **high school transcript** is the foundation of the application. It's sent by your school with a **school profile** that gives readers context.
- **Core academic courses** are English, math, lab science, social studies, and world language. Selective colleges' *recommended* years are the real expectation.
- **GPA** is credit-weighted average grade points. An **unweighted GPA** counts every course on the same 4.0 scale, and many colleges recalculate GPA using only core courses.
- **Class rank** compares you with classmates. Many schools no longer rank, and colleges don't penalize that.
- **Course rigor** is measured against what your school offers. Your counselor rates it on the school report.
- The **academic record** combines all of these, plus the trend of your grades. It's the most important factor almost everywhere.
- **Holistic review** reads the whole file in context and produces separate ratings. **Formula-based admissions**, like Iowa's Regent Admission Index, combines a few numbers into a score with cutoffs.
- The **middle 50% range** is the 25th to 75th percentile. A quarter of students fall below it, and test-optional ranges run high.
- **Institutional priorities**, including **first-generation students**, **legacy status**, and **demonstrated interest**, shape each class in ways applicants mostly can't control.
- Common **admissions myths** fall apart once you know what readers actually look at.

## Check Your Understanding

??? question "A student earned an A in a 1.0-credit course, a B in a 1.0-credit course, and an A in a 0.5-credit course. What is their unweighted GPA?"
    Points × credits: 4.0 + 3.0 + 2.0 = 9.0. Total credits: 2.5. GPA = 9.0 ÷ 2.5 = **3.60**.

??? question "Elena took all three AP courses her school offers. Jordan took three of the twenty-two Jordan's school offers. Who showed more course rigor, and why?"
    **Elena.** Rigor is measured against what a school offers. Elena took 100% of her school's advanced options, while Jordan took a small share of theirs.

??? question "Using the Regent Admission Index, what is the RAI for a student with a 3.20 GPA, a 25 ACT, and 16 years of core courses? Does it clear the resident minimum of 245?"
    (3 × 25) + (30 × 3.20) + (5 × 16) = 75 + 96 + 80 = **251**. Yes, it clears the resident minimum of 245, though it falls short of the nonresident minimum of 255.

??? question "A college's middle 50% ACT range is 28–33. Your score is 27. Does that mean you can't be admitted?"
    **No.** The 25th percentile isn't a minimum. A quarter of the college's students scored at or below 28, so a 27 is below the range but not disqualifying. The rest of your application has to carry more weight.

??? question "How can you find out whether a particular college considers demonstrated interest?"
    Look up the college's **Common Data Set**, Section C7, which rates "level of applicant's interest" as very important, important, considered, or not considered.
