---
title: Making Your Final Choice
description: Comparing offers side by side, using admitted-student days and revisits, committing by May 1 with an enrollment deposit, and declining other offers the right way.
generated_by: claude skill chapter-content-generator
date: 2026-10-12 12:35:31
version: 1.10
---

# Making Your Final Choice

## Summary

This chapter covers comparing offers side by side, using admitted-student days and revisits, committing by May 1 with an enrollment deposit, and declining other offers the right way. It brings fit, cost, and outcomes together into one decision. After this chapter, students can compare their offers side by side and commit with confidence by May 1.

## Concepts Covered

This chapter covers the following 10 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Comparing Offers | 34 |
| Side-by-Side Comparison | 33 |
| Admitted Student Day | 34 |
| Campus Revisit | 33 |
| May 1 Decision Deadline | 33 |
| Final College Choice | 32 |
| Accepting an Offer | 31 |
| Declining Offers | 1 |
| Enrollment Deposit | 29 |
| Double Depositing | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: The College Landscape and Application Rounds](../01-college-landscape-and-rounds/index.md)
- [Chapter 3: Finding Your Fit](../03-finding-your-fit/index.md)
- [Chapter 4: Researching and Narrowing Your College List](../04-researching-your-list/index.md)
- [Chapter 16: Comparing Award Letters](../16-comparing-award-letters/index.md)
- [Chapter 18: Handling Decisions](../18-handling-decisions/index.md)

---

## One Choice, Made Deliberately

Every earlier chapter led here. You built a list from your priorities, applied with care, compared aid offers, and responded to every decision. Now you choose one college. That's a big decision, but it's not a mysterious one. You already have most of what you need: your priorities from Chapter 3, your cost comparisons from Chapter 16, and the decisions from Chapter 18. What's left is to bring them together, test them against what you learn from revisiting campuses, and commit.

This chapter is about making that choice deliberately, not by default or under deadline pressure. You'll compare your offers side by side, weighing cost, fit, and outcomes. You'll use admitted student days and campus revisits to test your top options. Then you'll make your final choice, accept your offer with an enrollment deposit by May 1, and decline your other offers the right way, without double depositing.

## Comparing Offers

**Comparing offers** means weighing every college that admitted you across everything that matters, including cost, academics, social fit, and outcomes, rather than letting one factor decide. Chapter 16 compared offers on cost alone. Cost matters enormously, and an offer your family can't afford isn't really an option. But among the offers you *can* afford, the right choice depends on fit too.

Start by narrowing your offers to **finalists**, usually two or three colleges that are affordable and that you'd genuinely be glad to attend. Remove any college that fails a dealbreaker from your self-assessment, or whose net price your family can't manage without unreasonable debt. Then compare the finalists on five dimensions:

- **Cost:** four-year net price, out-of-pocket cost, and total debt at graduation (Chapter 16).
- **Academic fit:** the strength of your intended major or, if you're undecided, the flexibility to explore. Also class sizes, advising, and opportunities like research or internships (Chapter 3).
- **Social and campus fit:** size, setting, culture, and whether you can picture yourself there. Your revisit will test this.
- **Outcomes:** graduation and retention rates (Chapter 4), plus, if available, outcomes in your field, such as job placement, graduate school admission, and typical earnings.
- **Your gut sense:** how you felt when you visited, or when you picture yourself there next fall.

Weigh these by **what matters to you,** using the priorities you ranked in Chapter 3, not by national rankings or what others expect. A college ranked higher nationally isn't automatically the better choice for your goals, budget, and life.

#### Worked Example: Emily Narrows to Finalists

Emily has six acceptances and one waitlist. She narrows them:

- **College C:** net price $46,000 (Chapter 16), far above her family's $25,000. **Out.**
- **The university that admitted her to general studies,** not English, has a strong program, but she'd have to compete to transfer in. **Out,** given that her other options admit her to English directly.
- **Two others:** affordable, but neither passed her "could I picture myself happy here?" test as strongly as her top choices. **Out.**
- **Finalists:** **Hillcrest College** (net price $22,000) and her **state flagship's honors college** (net price about $14,000 after a $3,000 honors scholarship).
- **College A,** where she's waitlisted, stays on her radar but out of the comparison, since it isn't an offer yet.

Two strong, affordable finalists, each a fit in different ways. That's exactly the kind of choice a balanced list is designed to produce.

### Side-by-Side Comparison

A **side-by-side comparison** is a single table or tool that puts your finalists next to each other on the same factors, with each factor weighted by how much it matters to you. It turns a decision that feels like a tangle of impressions into something you can see. Build it as an extension of your tracker. Each finalist gets a column, and each factor gets a row with a weight from your priorities. Score each college on each factor from 1 (weak) to 5 (excellent), multiply by the weight, and add up the totals.

The total isn't a verdict, and you shouldn't let a spreadsheet choose your college. Its real value is that it **makes your reasoning visible.** If the total points one way and your gut points the other, look at which factor is causing the difference. Either you've weighted something wrong, or your gut is telling you something the table doesn't capture. The interactive below builds a comparison like this.

#### Diagram: Final Choice Comparison Matrix

<iframe src="../../sims/final-choice-matrix/main.html" width="100%" height="732px" scrolling="no"></iframe>

<details markdown="1">
<summary>Final Choice Comparison Matrix</summary>
Type: microsim
**sim-id:** final-choice-matrix<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Help students compare two to four finalist colleges with a weighted decision matrix that combines cost, fit, and outcomes, and see which factors drive the result.

Bloom Level: Evaluate (L5)
Bloom Verb: weigh, justify
Learning Objective: Students will weigh their finalist colleges on cost, academic fit, social fit, outcomes, and personal sense using weights that reflect their own priorities, and justify a final choice by identifying the factors that most influence it.

Canvas layout:
- Top: a row of finalist name inputs (createInput, up to 4 columns).
- Left column: factor rows with a weight slider each (createSlider 0–5): Cost (four-year net price), Academic fit, Social and campus fit, Outcomes, Distance from home, Gut sense. A createButton "Add factor" adds a custom row with createInput for its name.
- Grid: for each factor × college, a createSelect score 1–5. For the Cost row, an optional createInput "Four-year net price" per college auto-scores cost (lowest price = 5, others scaled down proportionally, minimum 1), with a checkbox to override.
- Bottom: a horizontal bar per college showing its weighted total, with each bar segmented by factor so students see which factors contribute most. The leading college's bar is outlined in gold.
- Right panel: "What's driving this?" lists the two factors with the largest weighted difference between the top two colleges, e.g., "Cost: Flagship +12; Academic fit: Hillcrest +8."

Presets (createButton): "Emily: Hillcrest vs. Flagship honors" (weights: Academic 5, Social 4, Cost 4, Outcomes 3, Distance 2, Gut 4; scores reflecting the chapter worked example) and "Marcus: Lakeshore vs. Brookfield vs. Regional."

Note on screen: "The total is a tool for thinking, not a verdict. If your gut disagrees with the total, look at what's driving the difference."

Controls (all created in setup() before positioning): createInput, createSlider, createSelect, createCheckbox, and createButton as described.

Interaction: Any change recomputes totals and the "driving" panel immediately. Hovering a bar segment shows weight × score for that factor.

Responsive behavior: Call updateCanvasSize() first in setup(); on narrow screens each college becomes a card with its own factor scores, and totals appear as a ranked list.

Implementation: p5.js with createInput, createSlider, createSelect, createCheckbox, and createButton; canvas parented to the main element.
</details>

#### Worked Example: Emily's Matrix

Emily weights her factors using her Chapter 3 priorities and scores her two finalists:

| Factor | Weight | Hillcrest score | Weighted | Flagship honors score | Weighted |
|--------|--------|-----------------|----------|-----------------------|----------|
| Academic fit (English) | 5 | 5 | 25 | 4 | 20 |
| Social and campus fit | 4 | 5 | 20 | 3 | 12 |
| Cost (four-year net price) | 4 | 3 | 12 | 5 | 20 |
| Outcomes | 3 | 4 | 12 | 4 | 12 |
| Distance from home | 2 | 3 | 6 | 5 | 10 |
| Gut sense | 4 | 5 | 20 | 3 | 12 |
| **Total** | | | **95** | | **86** |

Hillcrest leads, driven by academic fit, social fit, and her gut sense. The flagship leads on cost and distance. The four-year cost difference is about $32,000 ($8,000 a year), which is real money. Emily's family can afford Hillcrest within their $25,000-a-year budget, and she'd borrow only the federal loans in her package. She decides the table matches what she felt, but she wants to visit both one more time before committing.

## Testing Your Finalists

### Admitted Student Days

An **admitted student day** is an event a college holds in spring for students it has admitted, typically including information sessions, class visits, student panels, campus tours, meals, and sometimes overnight stays. Unlike a fall tour, it's designed to help you decide, and colleges are recruiting *you* now. That gives you a chance to ask direct questions. Ask about advising, housing, how hard it is to get the classes you need, what first-year students struggle with, and how aid changes in later years.

Many colleges also offer **virtual admitted student events** for students who can't travel, and some offer travel grants for admitted students with financial need. Ask the admissions office. Admitted student days are usually scheduled in April, so check dates as soon as you're admitted and plan around them.

Go in with a short list of questions you still need answered, tied to the factors in your comparison. Afterward, write down your impressions the same day, as you did after your first visits (Chapter 4). Notice the people you met, not just the program. The students you'd live and learn with are the clearest preview of your next four years.

#### Worked Example: Marcus at Two Admitted Student Days

Marcus attends admitted student days at Lakeshore and Brookfield, a week apart. At each, he asks the same three questions:

1. *"How big are intro CS classes, and how do students get help?"*
2. *"What percentage of CS majors do an internship before senior year?"*
3. *"Does my grant usually stay the same if my family's finances don't change?"*

Lakeshore's answers match what he saw on his fall visit: large intro classes, strong peer mentoring, and most CS majors doing internships. Its financial aid officer confirms that his need-based grant is recalculated each year. Brookfield's intro classes are small, but only about a third of its CS students do internships, and the CS department is small, with six faculty members. Asking the same questions at both turns two good feelings into a real comparison.

### Campus Revisits

A **campus revisit** is a second visit to a college after you're admitted, either at an admitted student day or on your own, to test whether your impression still holds now that the choice is real. It's worth the time and expense when you're deciding between two or three finalists and haven't visited recently, or at all. Go beyond the organized program. Eat a meal in the dining hall, sit in on a class in your intended major, walk outside the tour route, and spend a few unstructured hours simply being there. Notice how you feel. If you can't revisit, attend a virtual event and ask the admissions office to connect you with a current student in your intended major for an honest conversation.

## Committing

### The May 1 Decision Deadline

The **May 1 decision deadline**, sometimes called National College Decision Day, is the date by which most colleges require admitted students to accept their offer and submit an enrollment deposit. Missing it can mean losing your place entirely. Treat it as a hard deadline. Some colleges set slightly different dates. Iowa's, for example, is **May 3**. And colleges that admit through rolling admission or Early Decision may set earlier ones, so check each acceptance letter. If you're still waiting on a financial aid appeal or important information as May 1 approaches, ask the college for a short extension. Many will grant a week or so, but get it confirmed in writing.

### Final College Choice

Your **final college choice** is the one college you decide to attend, the result of comparing your offers, testing them through revisits, and weighing them against your priorities. By the time you make it, you should be able to say in a sentence or two *why* this college, in terms of the factors that matter to you: *"Hillcrest, because its English program and seminar culture are exactly what I want, and my family can afford it."* If you can't explain your choice that simply, return to your comparison and look for what's unresolved.

It's normal to feel some doubt, even after a careful decision. Every choice involves giving something up. Choosing Hillcrest means giving up the flagship's lower cost and being closer to home. A little "what if" is normal and fades quickly once you're on campus. What matters is that you made the decision deliberately, with good information, based on what matters to you. That's the best any decision-maker can do.

#### Worked Example: Four Final Choices

After revisits and comparisons, the students in this book choose:

- **Emily:** **Hillcrest College.** Her revisit confirmed the seminar culture she'd loved in the fall, and the cost fits her family's budget. She stays on College A's waitlist, but she's not counting on it.
- **Marcus:** **Lakeshore University.** After his appeal, Lakeshore's net price fell to $20,000, within $1,000 of Brookfield, and its CS program and internship record won out.
- **Ana:** **Northfield University,** her first choice, which her appeal (Chapter 18) made affordable.
- **Casey:** **the University of Iowa.** It was a true safety for Casey from the start (Chapter 3), and its affordable in-state cost and writing programs made it Casey's first choice by spring.

Each choice is different, and each can be explained in a sentence. That's what a deliberate decision looks like.

### Accepting an Offer

**Accepting an offer** is the formal step of telling a college you'll enroll. You do this through its applicant portal, usually by completing an intent-to-enroll form and paying the enrollment deposit. Read everything on the acceptance page before you submit, since it often includes the next steps: housing applications, orientation registration, health forms, and placement tests. At the same time, **accept your financial aid** through the college's aid portal. You can accept grants and decline or reduce loans you don't need (Chapter 16). Save the confirmation email and a screenshot in your filing system, and update your tracker. Then tell your counselor where you've committed. Your school will send your final transcript there in summer (Chapter 7).

### The Enrollment Deposit

An **enrollment deposit** is the payment a college requires to hold your place once you accept its offer. It's typically a few hundred dollars and sometimes more, and it's usually due by May 1. It's often credited toward your first bill, and sometimes split between an enrollment deposit and a housing deposit. It's usually **nonrefundable** after the deadline, though some colleges refund it if you withdraw before then. Iowa's $325 acceptance fee, for example, is refundable until May 3. If the deposit is a hardship, ask the college about a **deposit waiver or deferral.** Many colleges waive or defer deposits for students with fee waivers or financial need. Iowa, for instance, defers the acceptance fee to the first bill for students who used an application fee waiver.

#### Worked Example: Casey Commits to Iowa

On April 20, Casey logs in to MyUI, Iowa's student portal, accepts the offer of admission, and pays the $325 acceptance fee, well before Iowa's May 3 deadline. That unlocks orientation registration, so Casey also reserves a June orientation date that afternoon. Paying the fee early matters at Iowa, since housing and orientation choices open in order. Casey saves the confirmation, updates the tracker, and emails the counselor: *"I've committed to the University of Iowa!"*

### Declining Offers

**Declining offers** means formally telling every other college that admitted you that you won't attend. Do it promptly once you've committed, through each college's portal, which usually has a "decline admission" button, or by a short email to admissions. It's a courtesy to the college, and it frees your place, and sometimes your financial aid, for another student, possibly one waiting on that college's waitlist. If you're staying on a waitlist elsewhere, decline everything except your enrolled college and that waitlist. A brief thank-you is a gracious touch, especially to colleges where an admissions officer or interviewer was helpful.

### Double Depositing

**Double depositing** is paying enrollment deposits at more than one college to hold several places while you decide. It's considered dishonest. The Common App asks you to affirm that you'll deposit at only one college, it holds places other students could use, and colleges can withdraw offers when they find out (Chapter 18). The one accepted exception is a waitlist. If a college admits you from its waitlist after you've deposited elsewhere, you may accept that offer, but you must immediately withdraw from the first college, usually forfeiting that deposit. If you're torn between two colleges near May 1, ask for a short extension rather than depositing at both.

## Key Takeaways

- **Comparing offers** means weighing cost, academic fit, social fit, outcomes, and your gut sense among the affordable colleges that admitted you. Narrow to two or three finalists first.
- A **side-by-side comparison** with weighted factors makes your reasoning visible. It's a thinking tool, not a verdict.
- **Admitted student days** and **campus revisits** test your finalists now that the choice is real. Ask the same questions at each.
- Treat the **May 1 decision deadline** as firm, check each college's exact date, and ask for extensions in writing if you need one.
- Make a **final college choice** you can explain in a sentence. Some doubt is normal.
- **Accepting an offer** includes the intent-to-enroll form, accepting financial aid, and paying the **enrollment deposit**. Ask about waivers if it's a hardship.
- **Decline other offers** promptly. Never **double deposit**, except to accept a waitlist offer, and only after withdrawing from your first college.

## Check Your Understanding

??? question "In a weighted matrix, College X totals 92 and College Y totals 88, but you strongly prefer College Y. What should you do?"
    Look at **which factors drive the difference.** You may have weighted something wrong, or your preference reflects something the table doesn't capture. The matrix is a thinking tool, not a verdict.

??? question "Name three questions worth asking at an admitted student day."
    Examples: How large are intro classes in my major, and how do students get help? How hard is it to get required classes? How does my aid change in later years? What do first-year students struggle with? Ask the same questions at each finalist.

??? question "Your top college's deposit deadline is May 1, but you're still waiting on a financial aid appeal. What can you do?"
    Ask the college for a **short extension**, confirmed in writing. Many colleges will grant one, especially while an aid review is pending.

??? question "Why should you decline other offers promptly after committing?"
    It's a courtesy, and it **frees your place, and sometimes aid, for another student**, possibly one on a waitlist.

??? question "You're admitted from College A's waitlist in June after depositing at Hillcrest. Can you accept? What must you do?"
    **Yes.** Accepting a waitlist offer is the one accepted exception. Accept College A's offer, then **immediately withdraw from Hillcrest**, usually forfeiting that deposit.

[See Annotated References](./references.md)
