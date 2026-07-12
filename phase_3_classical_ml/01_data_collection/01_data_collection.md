# Phase 3, Topic 1 — Data Collection

## The Story

Arjun is a loan officer at **Riverstone Bank**. His task: assemble a dataset
of the bank's last 8 loan applicants so the bank can start predicting who's
likely to default, before another case like last year's happens again.

Arjun doesn't have one clean spreadsheet waiting for him. He has to pull
data from four separate systems, each with its own behavior:

1. **Loan application form** (customer-entered) → name, age, requested loan
   amount, employment type
2. **Core banking system** (internal DB) → existing monthly income, existing
   loans
3. **Credit bureau API** (external, third-party) → credit score
4. **Loan history records** (internal, historical) → whether the customer
   defaulted

By Friday, Arjun has this raw table:

| ID | Name | Age | Monthly Income (₹) | Loan Requested (₹) | Existing Loan | Credit Score | Employment | Defaulted |
|----|------|-----|----|----|----|----|----|----|
| 1 | Ravi | 29 | 45,000 | 200,000 | No | 720 | Salaried | No |
| 2 | Sunita | 34 | 62,000 | 350,000 | Yes | 680 | Salaried | No |
| 3 | Farhan | 41 | 38,000 | 150,000 | No | 610 | Self-employed | Yes |
| 4 | Meena | 26 | 30,000 | 100,000 | No | 590 | Salaried | Yes |
| 5 | Deepak | 50 | 85,000 | 500,000 | Yes | *(missing)* | Self-employed | No |
| 6 | Kavya | 31 | 55,000 | 250,000 | No | 700 | Salaried | No |
| 7 | Imran | 45 | 40,000 | 180,000 | Yes | 615 | Self-employed | Yes |
| 8 | Priya | 27 | 12,00,000 | 300,000 | No | 750 | Salaried | No |

Two problems show up immediately, before any analysis begins:

- **Deepak's credit score is missing** — the credit bureau **API call timed
  out**. This is an external-system failure, unrelated to Deepak's own
  attributes (e.g., not related to his employment type — it's simply that
  the API didn't respond).
- **Priya's monthly income (₹12,00,000)** looks like a **data-entry typo**
  on the application form — most likely ₹1,20,000 mistyped, since a
  customer types this value in directly.

This isn't a constructed edge case — this is what real data collection
looks like by default, because it's stitched together from independent
systems that don't validate against each other.

## The Core Lesson

Different **source types** fail in different, characteristic ways:

| Source type | Example in this story | Typical failure mode |
|---|---|---|
| Human-entered (form) | Loan application form | Wrong/mistyped values (outliers, typos) |
| External system (API) | Credit bureau | Missing values (timeouts, failures, rate limits) |
| Internal DB | Core banking system | Stale or inconsistent values |
| Historical records | Loan history table | Usually most reliable — already validated over time |

The takeaway is **not** "one source is the riskiest overall." It's that
**each source type carries its own predictable failure mode**, and a good
data collection process anticipates the *specific* way each pipeline is
likely to break — rather than treating "bad data" as one generic risk.

This distinction matters directly for the next topic (Data Cleaning):
knowing *why* a value is missing or wrong changes how you should fix it.
A missing value from an API timeout might just need a retry or a
default/flag. A likely-typo outlier needs a different kind of correction
(e.g., validation range checks) than a genuinely-missing field does.

## Three Levels of Understanding

**Child level:**
Imagine making a fruit salad, but the fruits aren't in your kitchen yet —
some are in the fridge, some are at the store, some your friend is bringing
over. Data collection is just going and getting all the fruit first, from
wherever it lives, before you can start cutting anything.

**Software engineer level:**
Arjun's process is an ETL job. He pulls from four systems of record — a
form submission (like a POST body), an internal DB query, a third-party
REST API (credit bureau), and a historical records table — and merges them
into one row per customer, keyed by customer ID. Each source has its own
reliability profile, exactly like integrating multiple systems in a Spring
Boot service: an API call can time out (→ missing value), user-entered form
data can have typos (→ outlier), and different systems can disagree on the
same fact. Data collection is the **ingestion layer** — before cleaning,
before feature engineering, before any model.

**Interview-ready level:**
> Data collection is the process of gathering raw data from all relevant
> sources — internal systems, external APIs, forms, logs, or historical
> records — into a single dataset used for analysis or model training. It's
> the first stage of the ML pipeline, and its quality directly caps the
> quality of everything downstream: missing values, outliers, and
> inconsistent formats introduced at this stage propagate forward unless
> explicitly handled during cleaning. Different source types tend to fail
> in different, predictable ways — human-entered data skews toward
> incorrect values, external APIs skew toward missing values, internal DBs
> skew toward staleness.

## GenAI / RAG Bridge

Data collection is the same first step in a RAG pipeline. Before chunking
documents and generating embeddings, you first **collect** the raw
documents — pulling PDFs from SharePoint, scraping a knowledge base,
hitting a Confluence API, exporting tickets from a helpdesk system. Just
like Arjun's dataset:

- A failed scrape or API timeout → a **missing document** (same failure
  mode as Deepak's credit score).
- Garbled OCR text or a corrupted export → a **bad/outlier document**
  (same failure mode as Priya's income).

If document collection is sloppy, no amount of clever retrieval or
prompting downstream fixes it. Garbage in, garbage out applies identically
to ML training data and RAG source documents.

## Verification (confirmed understanding)

**Question asked:** Which of the four data sources is most likely to
introduce quality problems, and why?

**Answer reached:** Not one single source is "the riskiest" — different
source types introduce different *kinds* of problems. Human-entered data
(forms) tends to produce wrong values; external APIs tend to produce
missing values; internal DBs tend to produce stale/inconsistent values.
Good data collection means anticipating the specific failure mode of each
source, not defending against "bad data" as one generic category.

## Status

✅ Topic 1 understood and confirmed. Ready to proceed to Topic 2: Data
Cleaning, Missing Values, Outliers — which will directly resolve Deepak's
missing credit score and Priya's income outlier.