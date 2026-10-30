---
title: Understanding Financial Aid
description: How college pricing and aid work, from net price and the FAFSA and CSS Profile to demonstrated need, types of aid, need-blind admissions, grants, verification, and priority deadlines.
generated_by: claude skill chapter-content-generator
date: 2026-10-12 12:11:03
version: 1.10
---

# Understanding Financial Aid

## Summary

This chapter covers how college pricing and aid work, from net price and the FAFSA and CSS Profile to demonstrated need, types of aid, need-blind admissions, grants, verification, and priority deadlines. It is the foundation for every money decision in the book. Students finish able to estimate a school's real cost and file the FAFSA and, where required, the CSS Profile on time.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Financial Aid | 1417 |
| Grants | 261 |
| Net Price | 86 |
| Net Price Calculator | 1 |
| Federal Aid | 677 |
| FAFSA | 153 |
| Student Aid Index | 99 |
| Demonstrated Financial Need | 98 |
| FAFSA Opening Date | 3 |
| FSA ID | 1 |
| FAFSA Contributors | 1 |
| Federal School Code | 1 |
| Institutional Aid | 198 |
| CSS Profile | 3 |
| State Aid | 1 |
| Need-Based Aid | 91 |
| Merit Aid | 63 |
| Need-Blind Admissions | 2 |
| Need-Aware Admissions | 1 |
| Unmet Need | 2 |
| Meets Full Need | 1 |
| Pell Grant | 87 |
| Verification | 1 |
| Aid Priority Deadline | 2 |
| First-Come First-Served Aid | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: The College Landscape and Application Rounds](../01-college-landscape-and-rounds/index.md)
- [Chapter 2: How Colleges Evaluate Applicants](../02-how-colleges-evaluate/index.md)
- [Chapter 3: Finding Your Fit](../03-finding-your-fit/index.md)
- [Chapter 5: Getting Organized](../05-getting-organized/index.md)
- [Chapter 12: Filling Out the Common App and Coalition App](../12-common-app-coalition-app/index.md)

---

## The Price Is Rarely the Price

Chapter 3 introduced an idea that changes how you look at every college: the **sticker price** a college publishes is rarely what a family actually pays. Most students receive some financial aid, and the gap between the published price and the real one can be tens of thousands of dollars a year. This chapter explains where that gap comes from.

It's the foundation for every money decision in the rest of the book. You'll start with what financial aid is and where it comes from: the federal government, your state, colleges themselves, and private sources. Then you'll learn the two forms that unlock most aid, the FAFSA and the CSS Profile, and the number they produce, the Student Aid Index, which determines your **demonstrated financial need.** From there you'll look at the two broad kinds of aid, need-based and merit, how colleges' aid policies differ, and the deadlines that decide how much you get.

Financial aid rules change often. Federal rules changed substantially in 2024 and again in 2026. The details here are current for the 2026–27 and 2027–28 aid years. Always confirm forms, amounts, and deadlines at [studentaid.gov](https://studentaid.gov) and on each college's financial aid website.

## Financial Aid

**Financial aid** is money that helps students pay for college, from any source: the federal government, state governments, colleges, and private organizations. It comes in four main forms:

- **Grants:** money you don't repay, usually based on financial need.
- **Scholarships:** money you don't repay, usually based on merit or specific criteria. [Chapter 15](../15-scholarships/index.md) covers them.
- **Loans:** money you borrow and must repay, usually with interest.
- **Work-study:** a part-time job, usually on campus, whose earnings help pay expenses.

The first two are sometimes called **gift aid** because you don't pay them back. The last two are **self-help aid**, because you either repay them or earn them. That distinction matters enormously when you compare offers. A $20,000 aid package made entirely of grants is worth far more than a $20,000 package that's half loans. [Chapter 16](../16-comparing-award-letters/index.md) shows how to tell them apart on an award letter.

Aid also comes from four sources, each with its own rules:

1. **Federal aid** from the U.S. government, the largest source.
2. **State aid** from your state government.
3. **Institutional aid** from the colleges themselves.
4. **Private aid** from employers, foundations, community groups, and other organizations.

Before the diagram below, here are two more terms you'll need. **Need-based aid** is awarded according to how much your family can afford, and **merit aid** is awarded for achievement, regardless of need. Both are covered in detail later in this chapter. The map shows how sources, forms, and the need-versus-merit distinction fit together.

#### Diagram: Financial Aid Map

<iframe src="../../sims/financial-aid-map/main.html" width="100%" height="622px" scrolling="no"></iframe>

<details markdown="1">
<summary>Financial Aid Map</summary>
Type: infographic
**sim-id:** financial-aid-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Give students a single, explorable picture of where financial aid comes from, what forms it takes, and which kinds depend on need versus merit.

Bloom Level: Understand (L2)
Bloom Verb: classify, explain
Learning Objective: Students will classify types of financial aid by source (federal, state, institutional, private), form (grant, scholarship, loan, work-study), and basis (need or merit), and explain which kinds must be repaid.

Visual style: A grid with four source columns (Federal, State, Institutional, Private) and four form rows (Grants, Scholarships, Loans, Work-study). Each cell contains small labeled chips for real examples, colored by basis: need-based chips in blue, merit-based chips in gold, chips that can be either in striped blue and gold, and non-need loans in gray. A legend at the bottom explains colors; a bracket on the left marks Grants and Scholarships as "Gift aid — don't repay" and Loans and Work-study as "Self-help aid."

Example chips (each clickable):
- Federal × Grants: Pell Grant (need), Federal Supplemental Educational Opportunity Grant (need).
- Federal × Loans: Direct Subsidized Loan (need), Direct Unsubsidized Loan (not need-based), Parent PLUS Loan (not need-based).
- Federal × Work-study: Federal Work-Study (need).
- State × Grants: State need-based grant (need).
- State × Scholarships: State merit scholarship (merit).
- Institutional × Grants: College need-based grant (need).
- Institutional × Scholarships: Automatic merit scholarship (merit), e.g., based on GPA and test scores.
- Private × Scholarships: Local community scholarship (either), Employer scholarship (either).
- Private × Loans: Private bank loan (not need-based; a last resort).

Infobox content on click: a two- or three-sentence explanation of the chip, which form unlocks it (FAFSA, CSS Profile, college application, separate application), and whether it must be repaid.

Interaction:
- Click a chip: open its infobox below the grid.
- Filter buttons (createButton): "Show only gift aid," "Show only need-based," "Show only what the FAFSA unlocks," "Show all."
- Hovering a column header shows a one-line description of the source.

Color scheme: blue for need-based, gold for merit, gray for loans not based on need, white background.

Responsive behavior: Call updateCanvasSize() first in setup(); on narrow screens the grid becomes four stacked source cards.

Implementation: p5.js with createButton; canvas parented to the main element.
</details>

#### Worked Example: Reading an Aid Package by Source

Priya receives this aid estimate from Hillcrest College, whose cost of attendance is $82,000:

- Hillcrest Grant: $54,000 (institutional, need-based)
- Hillcrest Merit Scholarship: $6,000 (institutional, merit)
- Federal Work-Study: $2,500 (federal, need-based)
- Federal Direct Subsidized Loan: $3,500 (federal, need-based)

Sorting by form, her gift aid is $60,000 and her self-help aid is $6,000. The price her family actually pays, before loans and work-study, is $82,000 − $60,000 = **$22,000**, the estimate her net price calculator gave her in Chapter 3. The loan and work-study help her cover that $22,000, but they're not discounts. She'll repay one and earn the other.

## Grants

**Grants** are financial aid that you don't have to repay, usually awarded based on financial need. They're the most valuable kind of aid, because every grant dollar directly lowers what your family pays. Grants come from all four sources: the federal government (such as the Pell Grant), states, colleges, and private organizations.

Most grants follow a few patterns:

- **They're usually need-based.** The amount depends on your family's financial situation, as calculated from the FAFSA and sometimes the CSS Profile.
- **They usually renew,** as long as you file aid forms each year, stay enrolled, make satisfactory academic progress, and your family's finances stay similar. If your family's income rises substantially, your grant may shrink.
- **They're applied directly to your bill.** You never receive the money as cash, except for any amount left over after tuition, fees, and on-campus housing are covered.

Grants differ from scholarships mainly in their basis. Grants usually depend on need, and scholarships usually depend on merit or specific criteria. In practice, the terms overlap, and colleges sometimes call a need-based award a "scholarship." What matters most is whether you repay it. If you don't, it's gift aid, whatever it's called.

#### Worked Example: Why Grants Matter Most

Marcus compares two aid offers from colleges with the same $36,000 cost of attendance:

- **College 1:** $18,000 in grants and $5,500 in federal loans. Total aid: $23,500.
- **College 2:** $10,000 in grants, $5,500 in federal loans, and $8,000 in other loans. Total aid: $23,500.

The totals are identical. But Marcus's family pays $36,000 − $18,000 = $18,000 at College 1, and $36,000 − $10,000 = $26,000 at College 2. College 2 simply lends him more of the difference. Over four years, College 1 costs $32,000 less in money he'll never get back. Looking at the grants, not the total, is what reveals the difference.

### The Pell Grant

The **Pell Grant** is the federal government's main need-based grant for undergraduates, awarded to students with the most financial need. You apply for it simply by filing the FAFSA. There's no separate application. For the 2026–27 aid year, the maximum Pell Grant is **$7,395** per year for a full-time student, and the minimum award is $740.

The Pell Grant amount depends on your **Student Aid Index** (covered later), the cost of attendance, and whether you attend full-time. Students with the lowest Student Aid Index receive the maximum, and the award shrinks as the index rises. Since July 2026, students whose Student Aid Index is at least twice the maximum Pell Grant (about $14,790 for 2026–27) aren't eligible. Students whose grants and scholarships from other sources already cover the full cost of attendance also aren't eligible. Pell Grants are **portable**, meaning they follow you to any eligible college, and they're limited to about six years of full-time study over a lifetime.

Pell Grant eligibility often unlocks other aid too. Many states, colleges, and scholarship programs use it as a signal of need. If you might qualify, filing the FAFSA is essential.

#### Worked Example: Ana and the Pell Grant

Ana's family income is modest. Her mother works part-time, her father works evenings, and they have three children. When Ana files the FAFSA, her Student Aid Index comes out to **0**. That qualifies her for the maximum Pell Grant, $7,395 a year for a full-time student.

Over four years, that's about $29,580 in federal grant money she'll never repay, and it goes to whichever college she chooses. Her Pell eligibility also qualifies her for her state's need-based grant and for fee waivers on her applications, and two of her colleges flag it for their first-generation scholarship programs. One form unlocked all of it.

## Net Price

**Net price** is what a specific family actually pays for one year at a college: the cost of attendance minus all grants and scholarships. It's the number that matters most when you compare colleges, because it reflects the real cost to *your* family, not the published price.

\[
\text{Net price} = \text{Cost of attendance} - \text{Grants and scholarships}
\]

Loans and work-study are **not** subtracted, because they're not discounts. Loans must be repaid, and work-study must be earned. They help you *pay* the net price, but they don't reduce it.

Net price varies enormously by family. Two students at the same college can face very different net prices, because need-based grants depend on each family's finances and merit scholarships depend on each student's record. That's why a college's average net price, as reported by the College Scorecard in Chapter 4, is a useful starting point but not your number.

#### Worked Example: One College, Three Net Prices

Midland State, the fictional public university from Chapter 3, has an in-state cost of attendance of $28,700. Three in-state students receive different aid:

| Student | Grants and scholarships | Net price | Loans offered |
|---------|-------------------------|-----------|---------------|
| Ana (Pell-eligible) | $7,395 Pell + $4,000 state grant + $9,000 Midland grant = $20,395 | **$8,305** | $5,500 |
| Marcus (moderate income) | $3,000 state grant + $9,700 Midland grant = $12,700 | **$16,000** | $5,500 |
| A higher-income student | $3,000 merit scholarship | **$25,700** | $5,500 |

All three see the same sticker price. Their net prices range from about $8,300 to $25,700. All three are offered the same federal loan, which shows why loans aren't part of the net price. They're available regardless, and they don't make the college any cheaper.

### The Net Price Calculator

A **net price calculator** is a tool on every college's website, required by federal law for colleges that offer federal aid, that estimates your net price at that college from your family's financial information. Chapter 3 urged you to use one for every college early in your search, before you get attached to a college you can't afford. Calculators vary in quality. Some ask only a few questions, while others ask nearly as much as the aid forms. Use the most detailed one available, with real numbers from your family's tax return, and treat the result as an estimate rather than a promise. The real number arrives in your award letter in spring.

## Federal Aid

**Federal aid** is financial aid from the U.S. Department of Education. It's the largest source of aid in the country and comes in three forms:

- **Grants:** mainly the Pell Grant, plus the smaller Federal Supplemental Educational Opportunity Grant (FSEOG) for students with exceptional need, which colleges award from limited funds.
- **Loans:** Direct Subsidized Loans (for students with need, where the government pays the interest while you're in school), Direct Unsubsidized Loans (available regardless of need), and Parent PLUS Loans (borrowed by parents). Chapter 16 covers loans.
- **Work-study:** Federal Work-Study, a part-time job program for students with need.

Federal aid has one gateway: **the FAFSA.** Every federal grant, loan, and work-study award requires it. Federal aid also has basic eligibility rules. You must generally be a U.S. citizen or eligible noncitizen, have a high school diploma or the equivalent, be enrolled in an eligible program, and make satisfactory academic progress once you're in college.

A common mistake is assuming federal aid is only for low-income families. Federal **loans** are available to nearly every student who files the FAFSA, regardless of income. Many colleges also require the FAFSA before they'll award their own aid, including some merit scholarships. And many state grants require it too. So the advice is simple: **every student should file the FAFSA**, even families who expect to qualify for nothing.

#### Worked Example: Why a Higher-Income Family Should File

Casey's parents earn enough that they assume Casey won't qualify for aid, and they plan to skip the FAFSA. Casey's counselor points out three things:

1. Without the FAFSA, Casey can't borrow even the basic federal student loan, which has lower interest rates and better repayment terms than private loans.
2. Two of Casey's colleges require the FAFSA before awarding any institutional aid, including merit scholarships.
3. If the family's situation changes, such as a job loss or a medical crisis, having a FAFSA on file lets the college reassess quickly.

The FAFSA is free and takes most families under an hour. Casey's parents file it in October.

## The FAFSA

The **FAFSA**, the Free Application for Federal Student Aid, is the form that determines your eligibility for federal aid, and it's used by most states and many colleges to award their own aid too. It's free. If any website charges you to file it, you're in the wrong place. The official site is [studentaid.gov](https://studentaid.gov).

The FAFSA asks about your family's finances: income from tax returns, current savings and investments, and some assets. It uses **prior-prior year** tax information, meaning a student applying for aid in fall 2027 uses the family's 2025 tax return. That's why families can file in the fall, long before the year starts. The form draws tax information directly from the IRS once each contributor gives **consent**, which makes filing faster and more accurate.

Filing follows a clear sequence:

1. **Create StudentAid.gov accounts** (FSA IDs) for the student and each contributor.
2. **Start the FAFSA** for the correct aid year. Seniors applying for fall 2027 file the **2027–28** FAFSA.
3. **Invite contributors**, such as parents, to complete their sections.
4. **Each contributor gives consent** for IRS data to be transferred and completes their section.
5. **List your colleges** using their federal school codes. You can list up to 20.
6. **Sign and submit.** You'll receive a **FAFSA Submission Summary** showing your Student Aid Index.
7. **Watch for follow-up.** Colleges may request more information or select you for verification.

You file a new FAFSA every year you're in college. The process gets faster after the first time.

#### Worked Example: Ana's Family Files

Ana and her mother sit down together on a Saturday in October. Ana creates her StudentAid.gov account and starts the 2027–28 FAFSA, then invites her mother as a contributor. Her parents file taxes jointly, so only one parent account is needed. Her mother creates her own account, gives consent for the IRS data transfer, and completes the parent section. Most of the tax information fills in automatically.

Ana lists her eight colleges using their federal school codes from her tracker, signs, and submits. Two days later, her FAFSA Submission Summary arrives with a Student Aid Index of 0. The whole process took about ninety minutes, mostly creating accounts and answering household questions, and the free financial aid workshop her mother attended (Chapter 5) made the parent section easy.

### The FAFSA Opening Date

The **FAFSA opening date** is the day each year's FAFSA becomes available. By law, it must open by **October 1** for the following academic year. In recent years, it has opened in late September. The 2027–28 FAFSA opened on September 23, 2026. File as soon as you reasonably can after it opens, because some state and college aid is limited and awarded in order of filing. Opening dates shifted significantly during the FAFSA overhaul of 2024, so always check the current year's date on studentaid.gov.

### The FSA ID

The **FSA ID** is the username and password for your StudentAid.gov account, which you use to sign the FAFSA electronically and to access your federal aid records. The student and each contributor need their own, created with their own email address and phone number. Create them a few weeks before you plan to file, since verifying a new account can take a day or more. Record yours in your login credentials record from Chapter 5. You'll keep using it through college and beyond, including to manage any federal student loans.

### FAFSA Contributors

**FAFSA contributors** are the people whose information is required on your FAFSA: you, and, for most students, one or two parents. If your parents are married to each other, both are contributors. If your parents are divorced, separated, or never married and don't live together, the contributor is the parent who **provided more financial support** in the last 12 months, plus that parent's spouse if they've remarried. Each contributor creates their own StudentAid.gov account, completes their section, and gives **consent** for their tax information to be retrieved from the IRS. Without consent, you won't receive a Student Aid Index or federal aid. Students in unusual situations, such as those who can't contact their parents or are experiencing homelessness, may qualify to file without parent information. Talk to a college financial aid office for guidance.

### The Federal School Code

The **federal school code** is the six-character code that identifies a college on the FAFSA, so your information is sent to the right college. Chapter 12's institution codes table listed Iowa's: **001892.** Search for each college on the FAFSA itself, or find its code on its financial aid website, and add every college you've applied to or are still considering, up to 20. Adding a college to your FAFSA doesn't commit you to anything. It simply lets that college see your information and build an aid offer.

## The Student Aid Index

The **Student Aid Index (SAI)** is the number the FAFSA calculates from your family's financial information to measure your ability to pay for college. It replaced the older Expected Family Contribution starting with the 2024–25 aid year. The SAI ranges from **−1,500** to very high numbers. A lower SAI means greater need, and an SAI of 0 or below indicates the highest need.

The most important thing to understand about the SAI is what it *isn't*. **It isn't the amount your family will pay,** and it isn't the amount of aid you'll receive. It's an index that colleges use to calculate your eligibility. Colleges and states use it in different ways. Some use it directly to calculate need. Others, especially colleges that use the CSS Profile, run their own formulas and may arrive at a different picture of your family's ability to pay.

The SAI depends mainly on your parents' income and assets, your own income and assets, and your family size. A few rules surprise families. The SAI no longer gives a break for having several children in college at once. And retirement accounts and the family's primary home aren't counted. You'll see your SAI on your FAFSA Submission Summary a few days after filing.

#### Worked Example: Reading the Number

Marcus's FAFSA Submission Summary shows an SAI of **9,500.** His mother reads it as "we'll have to pay $9,500." That's not quite right. The SAI is an index, and what the family actually pays depends on each college's cost and how much aid it chooses to offer.

What the SAI does tell Marcus:

- He's not eligible for a Pell Grant at most colleges, since his SAI is too high for meaningful Pell support even though it's below the new cutoff of about $14,790.
- He'll likely show **demonstrated need** at colleges whose cost is well above 9,500, as the next section explains.
- Colleges with generous institutional aid may offer grants that bring his net price close to what his family can afford, and colleges with limited aid may leave a gap.

## Demonstrated Financial Need

**Demonstrated financial need** is the difference between a college's cost of attendance and your Student Aid Index. It's the amount of help a college considers you to need:

\[
\text{Demonstrated need} = \text{Cost of attendance} - \text{Student Aid Index}
\]

Because the cost of attendance varies by college while your SAI stays the same, your demonstrated need differs at every college. It's highest at the most expensive colleges. A family with an SAI of 9,500 has very little need at a college costing $12,000, but substantial need at one costing $80,000.

Demonstrated need is the starting point for need-based aid. Colleges try to fill it with a mix of grants, work-study, and loans. How much of it they fill, and with what mix, is where colleges differ most. Some fill all of it, mostly with grants. Others fill part of it and leave a gap. The interactive below lets you see how cost, SAI, and aid combine.

#### Worked Example: Need at Three Colleges

Marcus's SAI is 9,500. His demonstrated need at three colleges:

| College | Cost of attendance | − SAI | = Demonstrated need |
|---------|-------------------|-------|---------------------|
| Regional public university | $24,000 | 9,500 | **$14,500** |
| Midland State (in-state) | $28,700 | 9,500 | **$19,200** |
| Private college with strong aid | $79,000 | 9,500 | **$69,500** |

The private college's need figure is the largest by far. Whether that turns into the *lowest* net price depends entirely on how much of the $69,500 the college actually meets with grants. In Chapter 3, its net price calculator estimated $19,000, which means it planned to meet nearly all of his need, mostly with grants.

#### Diagram: Need and Aid Calculator

<iframe src="../../sims/need-and-aid-calculator/main.html" width="100%" height="562px" scrolling="no"></iframe>

<details markdown="1">
<summary>Need and Aid Calculator</summary>
Type: microsim
**sim-id:** need-and-aid-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Show how cost of attendance, Student Aid Index, and a college's aid package combine to produce demonstrated need, net price, and unmet need, and how "meets full need" policies change the outcome.

Bloom Level: Apply (L3)
Bloom Verb: calculate, compare
Learning Objective: Students will calculate demonstrated need, net price, and unmet need from a cost of attendance, Student Aid Index, and aid package, and compare outcomes at colleges with different aid policies.

Canvas layout:
- Top: a horizontal bar representing the cost of attendance, split into two segments: "Student Aid Index" (gray, left) and "Demonstrated need" (blue, right). If SAI ≥ cost, the whole bar is gray and need reads $0.
- Middle: a second bar of the same total length showing how the college fills the need: grants (green), work-study (teal), loans (orange), and unmet need (red, striped). The SAI portion appears in gray at the left.
- Bottom readouts: "Demonstrated need," "Gift aid," "Self-help aid," "Unmet need," and "Net price (cost − gift aid)."

Controls (all created in setup() before positioning):
- createSlider "Cost of attendance" ($10,000–$95,000, step $500).
- createSlider "Student Aid Index" (−1,500 to 60,000, step 500).
- createSlider "Grants," "Work-study," and "Loans" (each $0–$80,000), clamped so total aid never exceeds cost minus SAI unless a checkbox "Allow aid above need (merit)" is checked.
- createCheckbox "This college meets full need": when checked, unmet need is forced to $0 by increasing grants first, and a note shows "Meets-full-need college: gap filled."
- createButton presets: "Marcus at the regional public," "Marcus at the private college with strong aid" (cost $79,000, SAI 9,500, grants $60,000, work-study $2,500, loans $5,500 → net price $19,000), "Gapping college" (cost $60,000, SAI 9,500, grants $25,000, loans $5,500 → unmet need $20,000).

Interaction: Bars and readouts update as sliders move. Hovering any segment shows its dollar amount and a one-line definition.

Color scheme: SAI gray, need blue, grants green, work-study teal, loans orange, unmet need red stripes.

Responsive behavior: Call updateCanvasSize() first in setup(); sliders stack under the bars on narrow screens.

Implementation: p5.js with createSlider, createCheckbox, and createButton; canvas parented to the main element.
</details>

### Unmet Need

**Unmet need** is the part of your demonstrated need that a college's aid package doesn't cover. Colleges that don't fill all of your need are said to **gap** you. For example, if your need is $40,000 and the college offers $25,000 in aid, your unmet need is $15,000. Your family has to cover that on top of the SAI, from savings, income, outside scholarships, or extra loans such as Parent PLUS loans. Unmet need is one of the most important numbers on an award letter, and one of the least visible, since letters rarely state it. Chapter 16 shows how to calculate it.

### Meets Full Need

A college that **meets full need** commits to covering 100% of every admitted student's demonstrated need, as the college calculates it, with a combination of grants, work-study, and sometimes loans. At these colleges, unmet need should be zero. Fewer than a hundred colleges make this promise, mostly highly selective private colleges and a few public universities for in-state students. Two cautions apply. First, "need" is defined by the college's own formula, often using the CSS Profile, which may expect more from your family than you'd expect. Second, colleges differ in how they meet it. Some use only grants, and others include loans. A college's Common Data Set, Section H, reports what share of need it actually met on average.

## The CSS Profile

The **CSS Profile** is a detailed financial aid application run by the College Board that about 250 colleges, mostly private, require in addition to the FAFSA to award their own institutional aid. It asks for more information than the FAFSA, such as your family's home equity and, at many colleges, a noncustodial parent's finances, so colleges can award their own grants more precisely. The CSS Profile opens October 1 each year. It costs **$25 for the first college and $16 for each additional college,** and fee waivers are automatically granted to many lower- and middle-income families. Each college sets its own CSS Profile deadline, often earlier than you'd expect, especially for Early Decision and Early Action applicants. Hillcrest, for example, sets February 15 in Priya's tracker. Check every college on your list. Many, including Iowa, require only the FAFSA.

## State Aid

**State aid** is financial aid from your state government, usually in the form of need-based grants and merit scholarships for state residents attending college within the state. Most states use the FAFSA to award it, and some have their own additional application. State aid can be substantial, and it often has **early or first-come, first-served deadlines** that are easy to miss. Some states' deadlines fall months before others'. Look up your state's higher education agency, or ask your counselor, for your state's programs and deadlines, and add them to your tracker. State aid usually applies only at colleges in your state, which is part of why in-state public universities, and some in-state private colleges, are often the most affordable options.

## Institutional Aid

**Institutional aid** is financial aid that colleges award from their own funds, including need-based grants, merit scholarships, and sometimes their own loans. For many students, it's the largest source of aid, especially at private colleges with large endowments. It's also the most variable. Two colleges with similar sticker prices can offer completely different amounts of institutional aid to the same student.

Colleges decide institutional aid using their own rules, which is why the same family can receive very different offers:

- **The data they use.** Some use only the FAFSA. Others require the CSS Profile or their own forms.
- **Their need formula.** Colleges using the CSS Profile may calculate a family's ability to pay differently than the SAI does.
- **Their budget and policy.** Some meet full need, while others gap students. Some offer large merit awards, and others offer none.
- **Their goals.** Institutional aid is also a tool for shaping the class (Chapter 2). A college may offer more to attract students it especially wants.

The best way to estimate a college's institutional aid before applying is its net price calculator. The second best is its Common Data Set, Section H, which reports the average need-based grant, the share of need met, and how many students receive merit aid without need.

#### Worked Example: Two Colleges, Same Family

Priya's family has an SAI of 31,000. Two private colleges, both with costs of attendance around $82,000, make offers:

- **Hillcrest College** meets full need using the CSS Profile. Its formula sets her family's ability to pay at about $16,000, and it meets the remaining $66,000 of need with $54,000 in grants, a $6,000 merit scholarship, and $6,000 in work-study and loans. **Net price: $22,000,** of which work-study and a loan can cover $6,000.
- **College B** doesn't meet full need. It offers a $28,000 grant. **Net price: $54,000,** with a large unmet need.

Both colleges saw the same family. The difference comes entirely from each college's institutional aid policy, which is why Priya ran both colleges' net price calculators before applying, and why she'll compare actual award letters in the spring.

## Need-Based and Merit Aid

### Need-Based Aid

**Need-based aid** is financial aid awarded according to your family's demonstrated financial need, as calculated from the FAFSA and, where required, the CSS Profile. It includes federal and state grants, institutional grants, federal work-study, and subsidized federal loans. The more need you demonstrate, the more need-based aid you're eligible for, though how much you actually receive depends on each college's policy and budget.

Need-based aid has two features worth planning around. First, **it's recalculated every year.** You file the FAFSA (and CSS Profile, if required) annually, and your aid can rise or fall as your family's finances change. Second, **it responds to circumstances.** If your family's situation changes significantly, such as a job loss, a death, divorce, or major medical expenses, you can ask the college to reconsider through a **professional judgment** review. Chapter 16 covers how. Many families who assume they won't qualify for need-based aid are surprised, especially at expensive colleges, where even middle- and upper-middle-income families can show need.

#### Worked Example: Need-Based Aid Changes Over Time

Suppose Marcus enrolls at Lakeshore University. In his first year, his family's SAI is 9,500, and he receives an $18,000 need-based grant. In his second year, his father's restaurant has an unusually good year, and the family's SAI rises to 14,000. His grant falls to $14,000 for the year. In his third year, a slow economy lowers the restaurant's income, and his SAI drops to 7,000. His grant rises to $20,000.

Nothing about Marcus changed, but his need-based aid did, because it follows his family's finances. That's why he files his FAFSA every October, as soon as it opens.

### Merit Aid

**Merit aid** is financial aid awarded for achievement, such as grades, test scores, talents, or leadership, rather than financial need. Most merit aid comes from colleges themselves as institutional scholarships. Some is **automatic,** awarded at admission based on GPA and test scores, like Iowa's merit scholarships in the case study. Some requires a **separate application** or an invitation to compete. Some states also offer merit scholarships for residents.

Merit aid is most common at colleges trying to attract strong students. That means you're most likely to receive large merit awards at colleges where your record is near the top of the admitted class, often your target and safety schools (Chapter 3). The most selective colleges usually offer no merit aid at all. Every admitted student is strong, so they award aid only by need.

Two questions matter for every merit award: **Is it renewable?** And **what do I need to keep it?** Many merit scholarships require a minimum college GPA, often 3.0 or higher, and full-time enrollment. Losing one after your first year can raise your cost sharply.

#### Worked Example: Merit Aid at a Safety

Casey's 3.40 GPA and 24 ACT place Casey near the top of the admitted class at a regional public university, which offers automatic merit scholarships by GPA and test score. Casey's admission letter includes a **$4,000-per-year** scholarship, renewable for four years with a 3.0 college GPA.

At Iowa, Casey's 24 ACT falls short of the score cutoff for its larger merit awards, as Chapter 6 noted (about 26 ACT or 1230 SAT). That's one reason Casey considered a retest. A two-point gain could have meant several thousand dollars a year at Iowa, while the regional university's award was already in hand. Merit aid rewarded Casey's record most at the college where Casey stood out most.

## How Colleges Use Financial Information in Admission

### Need-Blind Admissions

**Need-blind admissions** is a policy in which a college decides whether to admit you without considering whether you'll need financial aid. Your ability to pay plays no role in the admission decision. Most public universities and many private colleges are need-blind, at least for U.S. applicants. A smaller group of highly selective colleges are both need-blind *and* meet full need, which is the most generous combination available. Need-blind admission doesn't, by itself, mean a college will meet your need. A need-blind college can admit you and still leave you with unmet need. Check both policies separately.

### Need-Aware Admissions

**Need-aware admissions**, sometimes called need-sensitive admissions, is a policy in which a college may consider an applicant's ability to pay when making some admission decisions, usually for the last portion of the class, when its aid budget is nearly spent. Many private colleges with limited aid budgets are need-aware. Applying for aid at a need-aware college can slightly lower your chances at the margin. But not applying for aid when you need it is far worse, because you'd be admitted without aid you can't do without. Colleges publish their policies. Search the financial aid website for "need-blind" or "need-aware." In most cases, apply for aid if you need it.

## Deadlines That Decide How Much You Get

### Verification

**Verification** is the process of confirming the information on your FAFSA. Your college's financial aid office asks you to submit documents such as tax transcripts, W-2 forms, or a verification worksheet. About a third of FAFSAs are selected each year, some at random and some because information seems inconsistent or estimated. Being selected doesn't mean anyone suspects you of anything. It's routine. But your aid isn't final until verification is complete, so respond quickly to any request, check your applicant portal and email often, and keep copies of what you send in your filing system's financial aid folder (Chapter 5). Delays in verification can delay your aid offer and, at colleges with limited funds, reduce it.

### The Aid Priority Deadline

An **aid priority deadline** is the date by which you must file the FAFSA, and the CSS Profile if required, to receive full consideration for a college's or state's aid. Chapter 5 introduced priority deadlines in general. Aid priority deadlines are among the most important, and many fall **before** your application deadline. Iowa's priority deadline for the 2027–28 FAFSA, for example, is **December 1, 2026**, two months before its regular application deadline. Missing an aid priority deadline doesn't usually make you ineligible, but it can mean you're considered only for whatever aid remains. Record every college's and your state's aid deadlines in your tracker, and file the FAFSA as early as you can after it opens.

### First-Come, First-Served Aid

**First-come, first-served aid** is financial aid that a college or state awards in the order applications arrive, until its funds run out. Many state grant programs and some colleges' own grants work this way. Iowa's financial aid office describes much of its aid as first-come, first-served from a limited pool. At these places, filing in October rather than February can mean thousands of dollars in grants that a later filer, with the same need, never sees. If any college or state on your list awards aid this way, filing early is one of the simplest ways to lower your cost.

#### Worked Example: Two Filers, Same Need

Two students with identical finances apply to the same public university, whose state grant program is first-come, first-served:

- **Student 1** files the FAFSA on October 3. She's awarded a $4,000 state grant and a $6,000 university grant.
- **Student 2** files on March 10, after the university's December 1 priority deadline. By then, the state grant fund has run out, and the university's remaining grant funds are small. She's offered a $1,500 university grant and larger loans.

Same need, same college, a difference of $8,500 a year in free money, determined entirely by when each student filed.

## Key Takeaways

- **Financial aid** comes from federal, state, institutional, and private sources, as grants, scholarships, loans, and work-study. **Grants** and scholarships don't need to be repaid. Loans and work-study do, or must be earned.
- **Net price** is cost of attendance minus grants and scholarships, not loans. Estimate it with each college's **net price calculator**.
- **Federal aid** requires the **FAFSA**, which every student should file. It opens by October 1, and recently in late September. Each **FAFSA contributor** needs an **FSA ID** and must give consent. Add each college with its **federal school code**.
- The FAFSA produces your **Student Aid Index**, which isn't what you'll pay. **Demonstrated financial need** equals cost of attendance minus the SAI. **Unmet need** is the part a college doesn't cover. Colleges that **meet full need** cover it all.
- The **Pell Grant** is the main federal need-based grant, up to $7,395 for 2026–27. **State aid** and **institutional aid** add more, and some colleges require the **CSS Profile** for their own aid.
- **Need-based aid** follows your family's finances each year. **Merit aid** rewards achievement and is largest where you stand out. Check renewal rules.
- **Need-blind admissions** ignores ability to pay. **Need-aware admissions** may consider it at the margin. Apply for aid if you need it.
- Respond quickly to **verification**. File before every **aid priority deadline**, and file early anywhere aid is **first-come, first-served**.

## Check Your Understanding

??? question "A college's cost of attendance is $40,000. You receive $15,000 in grants, $3,000 in scholarships, $5,500 in loans, and $2,500 in work-study. What's your net price?"
    Net price = cost − grants and scholarships = $40,000 − ($15,000 + $3,000) = **$22,000**. Loans and work-study help you pay it but don't reduce it.

??? question "Your Student Aid Index is 12,000. What's your demonstrated need at a college costing $65,000? At one costing $11,000?"
    $65,000 − 12,000 = **$53,000** at the first. At the second, cost is below your SAI, so demonstrated need is **$0**.

??? question "Your family's income is high, and you expect no need-based aid. Should you still file the FAFSA? Why?"
    **Yes.** It's required for federal student loans, many colleges require it for their own aid and some merit scholarships, and it lets a college respond quickly if your family's circumstances change.

??? question "What's the difference between a college that is need-blind and one that meets full need?"
    A **need-blind** college doesn't consider ability to pay when deciding admission. A college that **meets full need** covers 100% of your demonstrated need once admitted. A college can be one without the other.

??? question "Your state's grant program is first-come, first-served, and your top college's aid priority deadline is December 1. When should you file the FAFSA?"
    **As soon as possible after it opens** in the fall, well before December 1. Filing early gives you the best chance at limited state and college funds.

[See Annotated References](./references.md)
