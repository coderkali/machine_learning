# Project — Employee Attrition Data Pipeline

## Why This Dataset Is New

`20_Project.ipynb` reused `loans.csv`, which happened to have zero
duplicate rows and no inconsistent text casing — two real techniques
from this course (`17`, and sub-skill #6 from `04_Data_Cleaning.MD`,
"Dealing with Inconsistent Data") never got a real, messy example to
run on.

`employee_attrition_raw.csv` is a new, synthetic dataset (`706` rows,
random seed `42`, so it's reproducible), built on purpose so **every**
technique from `04`–`19` has something real to fix — including
duplicate rows and mixed-case text, which `loans.csv` never had.

---

## Pipeline Architecture

```mermaid
flowchart TD
    A["Raw CSV\nemployee_attrition_raw.csv\n706 rows x 12 cols"]

    A --> B["1. Missing Values (06, 07, 08)\nnumeric cols only, median fill"]
    B --> C["2. Duplicate Rows (17)\ndrop exact repeats"]
    C --> D["3. Inconsistent Data (04, sub-skill 6)\nstandardize text casing"]
    D --> E["4. Missing Values, part 2 (07)\ncategorical cols, mode fill\n(now safe to run)"]
    E --> F["5. Fix Values &amp; Dtype (18)\n'3+' to 3, cast to int64"]
    F --> G["6. Outlier Detection (12, 13, 14)\nIQR + Z-score cross-check, remove"]
    G --> H["7. Fix Skewed Shape (19)\nFunctionTransformer + log1p"]
    H --> I["8. Feature Scaling (15, 16)\nStandardScaler + MinMaxScaler"]
    I --> J["9. Encoding (09, 10, 11)\nOneHot + Ordinal + Label"]
    J --> K["Final Model-Ready Table\nall numeric, no gaps, no dupes"]

    style A fill:#8a8f98,stroke:#5f6368,color:#fff
    style B fill:#2a78d6,stroke:#1a4d8f,color:#fff
    style C fill:#2a78d6,stroke:#1a4d8f,color:#fff
    style D fill:#2a78d6,stroke:#1a4d8f,color:#fff
    style E fill:#2a78d6,stroke:#1a4d8f,color:#fff
    style F fill:#2a78d6,stroke:#1a4d8f,color:#fff
    style G fill:#b3781f,stroke:#7a5013,color:#fff
    style H fill:#b3781f,stroke:#7a5013,color:#fff
    style I fill:#2f9e6f,stroke:#1e6b4b,color:#fff
    style J fill:#2f9e6f,stroke:#1e6b4b,color:#fff
    style K fill:#d4a72c,stroke:#8f6e14,color:#fff
```

**Color key:** grey = raw input, blue = cleaning steps (fix what's
wrong with the data itself), amber = statistical steps (fix the shape
of the numbers), green = ML-prep steps (get numbers into the range/form
a model expects), gold = the finished output.

**Why step 4 (categorical missing-value fill) comes *after* step 3
(inconsistent data), not before:** `Gender` has values like `"Male"`,
`"male"`, `"MALE"`, `"Male "` — four different strings, one real
category. Filling gaps with `.mode()` *before* cleaning that up asks
pandas "what's the most common exact string?", and a real category can
get split across several casing variants, undercounted, and shorted at
fill time. Clean the text first, so the mode-fill (and everything
downstream) is counting the right thing.

---

## Data Dictionary — What's Wrong With Each Column, On Purpose

| Column | Type | Issue injected | Fixed by | Notebook |
|---|---|---|---|---|
| `EmployeeID` | text | none — it's an identifier, not a feature | dropped in the final table | — |
| `Age` | number | some missing, a few fake ages (`88`–`99`) | median fill, IQR outlier removal | `07`, `13` |
| `Gender` | text | missing values **and** mixed casing (`Male`/`male`/`MALE`/`Male `) | strip + standardize casing, then mode fill, then one-hot | `04` (#6), `07`, `09` |
| `Department` | text | some missing; 5 real categories, no order | mode fill, one-hot | `07`, `09` |
| `Education` | text | some missing; real order (`High School < Bachelors < Masters < PhD`) | mode fill, ordinal encode | `07`, `11` |
| `PriorCompanies` | text-that-should-be-a-number | `"3+"` bucket, like `loans.csv`'s `Dependents` | `.replace()` + `.astype()` | `18` |
| `YearsAtCompany` | number | some missing, right-skewed (many juniors, few veterans) | median fill, Min-Max scaled | `07`, `16` |
| `MonthlyIncome` | number | some missing, strongly right-skewed, a handful of real high-earner outliers | median fill, IQR removal, `log1p`, standardized | `07`, `13`, `19`, `15` |
| `DistanceFromHome` | number | some missing, right-skewed, a few extreme commuters | median fill, IQR removal, `log1p`, standardized | `07`, `13`, `19`, `15` |
| `OverTime` | text | missing values **and** mixed casing (`Yes`/`yes`/`YES`) | strip + standardize casing, then mode fill, then one-hot | `04` (#6), `07`, `09` |
| `PerformanceRating` | text | some missing; real order (`Low < Medium < High < Excellent`) | mode fill, ordinal encode | `07`, `11` |
| `Attrition` | text | the target column — `Yes`/`No`, no missing values on purpose | label encode | `10` |

Plus: **`6` exact duplicate rows** were appended on purpose (same
trick `17_Handling_Duploicate_Data.ipynb` used on `loans.csv`, except
this time they're real from the start, not simulated afterward).

---

## What The Code Notebook Does

`Employee_Attrition_Pipeline.ipynb` in this same folder follows the 9
stages above in order, with a visualization at every stage that has
something visual to show (missing-value bar chart, before/after box
plots for outliers, before/after distribution plots for the skew fix,
a correlation heatmap at the end). Every number quoted in its markdown
comes from actually running the cell above it — same rule as every
notebook before this one.
