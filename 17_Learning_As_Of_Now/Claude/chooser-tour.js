/* ══════════════════════════════════════════════════════════════════════════
   START HERE — the first screen of When to Use What.

   HAND-MAINTAINED. A beginner meets a real table before any technique. The
   ten rows below are copied unchanged from
       04_ML/35_Project_Employee_Attrition/Data/employee_attrition_raw.csv
   `n` is the row's position in that file (row 1 is the first employee), so
   every problem the page points at can be found there. Numbers are kept as
   the strings pandas shows; null is a blank cell (NaN).

   Every problem names the stage it is fixed in (a SPACES id in
   chooser-data.js) and the decision that fixes it (a job id). The facts
   quoted in `text` were counted from the full file, not from these rows:
   706 rows, 6 copied rows, 168 blank cells, Gender in 8 spellings,
   Attrition 500 No / 206 Yes, median MonthlyIncome 4,896.
   ══════════════════════════════════════════════════════════════════════════ */

const TOUR = {

  who: "Meera",
  target: "Attrition",
  fitAfter: "model",          /* the fit() line is drawn after this stage */

  story: [
    "<strong>Meera works in HR.</strong> She has a spreadsheet of 706 employees, " +
    "and she wants to know who is likely to resign next.",
    "She tried the obvious thing. She handed every column except Attrition " +
    "straight to a model: <code>model.fit(X, y)</code>",
    "<span class='beat'>It crashed on the very first row:</span> " +
    "<code>ValueError: could not convert string to float: 'E0390'</code>. " +
    "A model can only read numbers, and this table is full of name tags, words, " +
    "blanks, typing mistakes and copied rows. Worse, some of those problems never " +
    "crash at all. They just give a score that is quietly wrong.",
    "So the fix is not a cleverer model. It is to go through the table " +
    "<b>in a fixed order</b>. Here are ten real rows from her file."
  ],

  where: [
    { icon: "📋", label: "I have a table, and I don't know where to start", go: "tour" },
    { icon: "🎯", label: "My model is trained. Is it any good?",            go: "step:judge" },
    { icon: "🧪", label: "I have no data yet — I just want to practise",    go: "job:synth" },
    { icon: "🔎", label: "I already know the name of what I need",          go: "all" }
  ],

  cols: ["EmployeeID", "Age", "Gender", "Department", "Education", "PriorCompanies",
         "YearsAtCompany", "MonthlyIncome", "DistanceFromHome", "OverTime",
         "PerformanceRating", "Attrition"],

  rows: [
    { n: 1,   v: ["E0390", "24", "Male",    "Sales",       "Bachelors",   "1",  "1.2",  "8576",  "3.0",   "No",  "Medium", "No"]  },
    { n: 3,   v: ["E0523", "46", "Female ", "Sales",       "Bachelors",   "1",  "4.6",  "1889",  "13.5",  "Yes", "Medium", "Yes"] },
    { n: 4,   v: ["E0310", "49", "Male",    "Sales",       "Masters",     "3+", "1.2",  "19591", "18.8",  "Yes", "Low",    "No"]  },
    { n: 5,   v: ["E0647", "40", "Female",  "Engineering", "PhD",         "0",  "10.1", "14041", null,    "NO",  "Medium", "No"]  },
    { n: 17,  v: ["E0154", "31", "Male",    "Engineering", "Bachelors",   "2",  "3.3",  "49799", "2.6",   "No",  "Medium", "No"]  },
    { n: 129, v: ["E0151", "34", "male",    "Marketing",   "Bachelors",   "2",  "2.4",  "5559",  "137.4", "NO",  "Medium", "No"]  },
    { n: 158, v: ["E0005", "20", "Male",    "Marketing",   "High School", "3+", "0.2",  null,    "6.6",   null,  "Medium", "No"]  },
    { n: 208, v: ["E0058", "47", "Male ",   "Sales",       "Masters",     "0",  "2.7",  "6256",  "2.8",   "No",  "Medium", "No"]  },
    { n: 685, v: ["E0058", "47", "Male ",   "Sales",       "Masters",     "0",  "2.7",  "6256",  "2.8",   "No",  "Medium", "No"]  },
    { n: 587, v: ["E0036", "99", "MALE",    "Engineering", "Bachelors",   "1",  "2.5",  "3778",  "9.5",   "No",  "Low",    "Yes"] }
  ],

  /* a warning shown inside a stage, where the order is easy to get wrong */
  notes: {
    clean: "Only fixes of <b>fact</b> belong here — deleting a copy, correcting a spelling. " +
           "Anything that has to <b>learn a number</b> from the data, like a median or an " +
           "outlier fence, waits until after step 3.",
    split: "From here on, every step learns something from the data. It must learn it from " +
           "the <b>training rows only</b>. Let the test rows in too, and the final score is " +
           "quietly too good — nobody finds out until the model is live."
  },

  /* cells: [row n, column]   rows: [row n, …]   cols: [column, …] */
  problems: [
    { id: "target", stage: "look", cols: ["Attrition"], job: null,
      text: "<b>Attrition</b> is the answer Meera wants to predict — Yes or No. Every other " +
            "column is a clue. Each later step depends on knowing which is which." },
    { id: "overtime", stage: "look", cols: ["OverTime", "Attrition"], job: "test",
      text: "Do people who work overtime leave more often than those who don't? Ask the data " +
            "before you build anything." },
    { id: "salary", stage: "look", cols: ["MonthlyIncome"], job: "describe",
      text: "What does a normal salary look like? Half the staff earn under <b>4,896</b> a " +
            "month, yet one person earns <b>49,799</b>. Describe a column before you trust it." },

    { id: "dup", stage: "clean", rows: [208, 685], job: "clean",
      text: "Employee <b>E0058</b> is in the file twice — rows 208 and 685. Six rows in the " +
            "file are copies." },
    { id: "spell", stage: "clean", job: "clean",
      cells: [[3, "Gender"], [129, "Gender"], [208, "Gender"], [685, "Gender"], [587, "Gender"],
              [5, "OverTime"], [129, "OverTime"]],
      text: "One word, many spellings: <code>Male</code>, <code>male</code>, <code>MALE</code>, " +
            "and <code>Male␣</code> with a hidden space. Gender has 8 spellings of 2 words." },
    { id: "plus", stage: "clean", cells: [[4, "PriorCompanies"], [158, "PriorCompanies"]], job: "clean",
      text: "<code>3+</code> is text, so the whole PriorCompanies column is stored as text. " +
            "It is really a ranking: 0 &lt; 1 &lt; 2 &lt; 3+." },
    { id: "id", stage: "clean", cols: ["EmployeeID"], job: "clean",
      text: "<b>EmployeeID</b> is a name tag, not a clue — and it is what crashed the model. " +
            "Drop it." },
    { id: "extreme", stage: "clean", cells: [[587, "Age"], [129, "DistanceFromHome"]], job: "outliers",
      text: "Age <b>99</b> and still working is almost certainly a typing mistake. " +
            "<b>137 km</b> from home is possible, just rare. One gets deleted, the other is kept." },

    { id: "stratify", stage: "split", cols: ["Attrition"], job: "split",
      text: "Hide about 20% of the rows now. Only 29% of staff left (206 of 706), so split " +
            "with <code>stratify=y</code> to keep that mix the same in both halves." },

    { id: "blank", stage: "prep", job: "missing",
      cells: [[5, "DistanceFromHome"], [158, "MonthlyIncome"], [158, "OverTime"]],
      text: "Blank cells, shown as NaN. The file has 168 of them across 10 columns, and a model " +
            "cannot read a blank." },
    { id: "words", stage: "prep", job: "encode",
      cols: ["Gender", "Department", "Education", "OverTime", "PerformanceRating"],
      text: "Words, not numbers. Gender and Department are just names. Education and " +
            "PerformanceRating have a real order: Low &lt; Medium &lt; High &lt; Excellent." },
    { id: "tail", stage: "prep", cells: [[4, "MonthlyIncome"], [17, "MonthlyIncome"]], job: "shape",
      text: "A long tail. The typical salary is 4,896, but a few are 19,591 and 49,799 — and " +
            "those few would dominate." },
    { id: "scale", stage: "prep", cols: ["Age", "MonthlyIncome"], job: "scale",
      text: "Different scales. Age is around 35, MonthlyIncome around 4,900. Some models would " +
            "hear only the salary." },

    { id: "cols", stage: "feat", job: "select",
      text: "After step 4 the 10 clue columns become 16 number columns — one-hot turns " +
            "Department alone into 5. Do all of them help? Test it, and drop the ones that don't." },

    { id: "label", stage: "model", cols: ["Attrition"], job: "clf",
      text: "The answer is Yes or No — a label, not a number. So this is a “predict a label” " +
            "problem, and Meera starts with the simplest model that fits it." },

    { id: "rare", stage: "judge", cols: ["Attrition"], job: "clfmetric",
      text: "A model that always says “No” is right 71% of the time — and catches nobody who " +
            "leaves. Accuracy alone would fool Meera." },

    { id: "save", stage: "ship", job: "ship",
      text: "Save the cleaning rules, the encoders and the model together as one file, so " +
            "next month's employees are scored exactly the same way." }
  ]
};
