# AI/ML Glossary

Short definitions are added as the terms become relevant in real lessons.

## A

### Agent

An application that uses a model to decide what to do, choose tools, and take
actions toward a goal. The model is only one component of the full agent.

### Artificial intelligence (AI)

The broad field of building computer systems that perform tasks associated
with human intelligence, such as understanding language or making decisions.

## B

### Bias-variance tradeoff

The balance between a model that is too simple to learn useful patterns and a
model that learns the training data so closely that it performs poorly on new
data. `Ridge`'s `alpha` is a dial you can turn along this axis: raising it makes the
model stiffer. The Ridge notebook shows the stiff end — a large `alpha` on clean data
flattens the line until it only predicts the average.

### Breakdown point

The fraction of the rows that has to be wrong before a fitting method can be
pushed anywhere at all. `LinearRegression` has a breakdown point of **0%** — one
row, moved far enough, moves the line without limit. `TheilSenRegressor` is
about 29% and `RANSACRegressor` up to about 50%. Past 50% nothing helps, because
the broken rows are then the majority. See **Robust regression**.

### Broadcasting

The rule that lets an operation combine arrays of different shapes by stretching
size-1 dimensions instead of copying data. It is what makes "subtract the mean
from every row" a single expression.

## C

### Chunk

A smaller section of a document prepared for embedding or retrieval. Chunk
size and overlap affect how much context a RAG system can find.

### Class imbalance

A classification dataset where one label is much rarer than another, such as one
fraud case in a thousand transactions. Accuracy stops being useful, because always
predicting the common class already scores 99.9%.

### Classification

A supervised learning task that predicts a category, such as fraud or not
fraud.

### Coefficient

The number a linear model multiplies one input column by. It answers a narrow
question: if this column goes up by 1 and every other column stays fixed, how
much does the prediction move? Stored as `model.coef_`, one entry per input
column, in the order those columns were passed to `fit`. Because it is a
*partial* effect, the same column can get a different coefficient in a
different model.

## D

### Data leakage

Information from validation, test, or future data accidentally influences
training. It makes evaluation look better than real-world performance.

### DataFrame

A table of labelled columns held in memory, from the Pandas library. Each column
is a Series with its own data type, and every row carries an index label. It is
close to a database result set you can keep and re-query.

### Deep learning

A part of machine learning that uses neural networks with multiple layers to
learn complex patterns.

### Dot product

Multiply two vectors position by position and add the results, giving one
number. It is the weighted sum behind a linear model's prediction, one neuron in
a neural network, and cosine similarity in search and RAG.

## E

### Embedding

A numerical representation of information that lets a computer compare
meaning or similarity.

### Epoch

One complete pass through the training dataset.

### Estimator

Any scikit-learn object that learns from data. Every estimator uses the same three
methods: `fit` learns and stores what it found, `transform` applies that to reshape
the data, and `predict` applies it to answer a question. Preprocessors have `fit` and
`transform`; models have `fit` and `predict`. Anything learned during `fit` is stored
on the object with a trailing underscore, such as `mean_` or `coef_`.

## F

### Feature

An input value used by a model to make a prediction. In a customer model,
examples include account age or number of support requests.

### Feature scaling

Putting every numeric column on a comparable range so that no column dominates only
because its numbers are larger. Standardization centres a column on mean 0 with
standard deviation 1; normalization squeezes it into a fixed range such as 0 to 1.
It matters most for distance-based and gradient-based algorithms.

### Fine-tuning

Continuing the training of a pre-trained model on a targeted dataset so its
behavior better fits a task or domain.

## H

### Hyperparameter

A setting you choose before training, as opposed to a value the model learns from
the data. `alpha` in `Ridge` is one. scikit-learn makes the difference visible: a
learned value carries a **trailing underscore** (`coef_`, `intercept_`), a
hyperparameter does not. Hyperparameters are chosen by cross-validation on the
training rows — never by whichever value scored best on the test set.

## I

### Inference

Using a trained model to produce a prediction or generated output.

### Intercept

The value a linear model predicts when every input is 0, stored as
`model.intercept_`. It sets the height of the line or plane. It is an anchor for
the fit, not usually a meaningful prediction — a row where every column is 0
often does not exist in the data.

## L

### L1 and L2 penalties

The two usual ways to punish large coefficients. **L2** adds `α·Σw²` and is what
`Ridge` uses: it shrinks every coefficient smoothly towards 0 but never reaches 0.
**L1** adds `α·Σ|w|` and is what `Lasso` uses: it can set coefficients to exactly 0,
which makes it a feature-selection tool as well. `ElasticNet` mixes the two.

### Linear Discriminant Analysis (LDA)

A supervised way to cut many columns down to a few. It looks for the direction
that pushes the **class centres** as far apart as possible while keeping each
class **tight** around its own centre, then projects every point onto it:
`w = S_w⁻¹(μ₂ − μ₁)` and `z = wᵀx`, where `S_w` is the within-class scatter.
With `C` classes it can return at most `C − 1` directions, so a two-class
problem always collapses to a single number. Unlike **PCA** it uses the labels,
which is why PCA can hand back a blurred pile where LDA separates cleanly.
It also works as a classifier, and assumes each class is a roughly Gaussian
blob with the same spread.

### Logistic regression

A **classifier**, in spite of the name. It computes the same weighted sum a
linear regression does — `z = w·x + b`, which can be any number — and then bends
it through the **sigmoid**, `1 / (1 + e⁻ᶻ)`, so the output is always between 0
and 1 and can be read as a probability. The decision boundary is still straight;
only the output is curved. `predict()` is just `predict_proba() > 0.5`, so the
threshold is a decision you own and can change without refitting. It is fitted
against **log loss**, which punishes confident mistakes and barely notices a
correct answer that was only just correct — the reason obvious rows stop
dragging the boundary the way they do under least squares.

### Large language model (LLM)

A neural network trained on large amounts of text and other data to understand
and generate language-like output.

### Least squares

The rule linear regression uses to choose its numbers: pick the line or plane
that makes the total of the **squared** vertical gaps between the real points
and the model as small as possible. Squaring removes the sign and punishes big
misses harder than small ones. scikit-learn solves it directly with linear
algebra, with no loop and no learning rate.

## M

### Machine learning (ML)

A way to build software in which a model learns patterns from examples instead
of relying only on rules written by a developer.

### Model

The learned artifact that turns input features into a prediction or generated
output. It is similar to the decision logic behind an API, but its behavior is
learned from data.

### Multicollinearity

When two or more input columns move together, so the model cannot tell which
one deserves the credit. The predictions can still be fine; the individual
coefficients become unstable and hard to explain. Seen in `age2.csv`, where
`Age` and `Degrees` correlate at `0.78` and `Age`'s coefficient changes from
`−61` to `−20.4` depending on whether `Degrees` is in the model.

### Multiple linear regression

Linear regression with more than one input column:
`y = b0 + w1*x1 + w2*x2 + ...`. One input draws a line, two inputs draw a
plane, more inputs draw a shape that cannot be pictured. The class is still
`LinearRegression`; only the width of `X` — and the length of `coef_` — changes.

### Mutual information

A score for how much knowing one column tells you about the answer: `0` means
nothing, higher means more. It judges one column at a time and sees curved
links as well as straight ones. On the breast-cancer data, `worst perimeter`
scored about `0.47` and `texture error` close to `0`. The call is
`mutual_info_classif(X, y)`.

## O

### One-hot encoding

Turning a category column into one true/false column per distinct value, so a
model can use it without being told the categories have an order. The ordered
case is called ordinal encoding.

### Overfitting

When a model learns the training rows so closely that it stops generalising. The
signature is a **gap**: a high train score beside a much lower test score. Measured
The opposite failure is **underfitting**, where the model is too stiff to follow the
data and both scores are low together; a large `alpha` in the Ridge notebook produces
it on purpose.

## P

### Pickle, joblib, and model persistence

**Persistence** is saving a fitted model to a file so the *same* model — not a
retrained one — answers later. `fit()` only fills in an object's learned
attributes (`coef_`, `theta_`), so saving means serialising those numbers.
**`pickle`** is Python's standard serialiser; **`joblib`** writes a pickle too,
adding `compress=` and `mmap_mode=` for large NumPy arrays. Three things to
remember: save the whole **`Pipeline`**, because a scaler left behind fails
silently; the file stores an *import path*, not scikit-learn's code, so versions
must match; and **loading a pickle runs code**, so never load one you did not
create.

### Principal Component Analysis (PCA)

An unsupervised way to cut many columns down to a few. It finds the direction
along which the rows are most spread out, then the direction of largest
*remaining* spread at right angles to it, and so on, and uses those directions
as the new axes. Each component is a weighted blend of **every** original
column, so nothing is deleted — the overlap between columns is folded together.
`explained_variance_ratio_` says how much of the total spread each one caught;
`PCA(0.90)` keeps enough components to reach 90% of it, `PCA(n_components=6)`
keeps exactly six. Two consequences worth remembering: it never looks at `y`, so
the spread it maximises is not necessarily the spread that separates your
classes (that is **LDA**'s job), and because a component mixes every column, it
narrows what the model reads and never what you have to measure. **Scale first** —
variance has units, so without scaling the column with the biggest unit becomes
component 1 on its own.

### Prompt

The instructions and context sent to a generative model.

## R

### R-squared (R²)

The default `.score()` of a regression model: how much of the movement in the
target the model explains. `1.0` is a perfect fit and `0.0` is no better than
always guessing the average; it can go negative for a model that is worse than
that. It says nothing about whether the test set was large enough to trust.

### RANSAC (RANdom SAmple Consensus)

A robust fitting method that votes instead of averaging. It repeatedly picks the
smallest number of rows that define the model (2 for a straight line), fits on
just those, and counts how many other rows fall within `residual_threshold` of
the result. The candidate with the most agreement wins, and the model is refitted
on that winning **inlier** set alone. `inlier_mask_` then tells you which rows it
believed, which makes it an outlier detector as well as a regressor. See
**Robust regression**, **Breakdown point**.

### Regression

A supervised learning task that predicts a number, such as price or delivery
time.

### Regularization

Adding a penalty on the size of the coefficients to the thing a model minimises, so
it is no longer free to fit the training rows as hard as it can. It trades a little
more **bias** for a lot less **variance**, which helps when there are few rows, many
columns, or correlated columns — and only costs you when there was no overfitting to
begin with. See **Ridge**, **L1 and L2 penalties**.

### Residual

The gap between one real value and the value the model predicted for it
(`actual − predicted`). Residuals are what least squares squares and adds up,
and plotting them is the fastest way to see where a model is wrong.

### Robust regression

Fitting a line that belongs to the majority of the rows rather than to the worst
ones. Ordinary least squares **squares** every error, so a row that misses by 100
counts as much as a hundred rows missing by 10, and a handful of broken rows can
own the fit. The three robust answers in scikit-learn are `RANSACRegressor`
(vote, then discard the losers), `HuberRegressor` (keep every row but cap what a
far row can charge, squared inside `epsilon` and straight-line outside), and
`TheilSenRegressor` (the median of the slope through every pair of rows). All
three assume the good data is the crowd. See **Breakdown point**, **RANSAC**.

### Retrieval-augmented generation (RAG)

An application pattern that retrieves relevant source material and gives it to
a generative model before the model answers.

### Ridge regression

Linear regression with an L2 penalty: it minimises
`Σ(y − ŷ)² + α·Σw²` instead of just the squared error. `alpha` is the dial between
the two goals. With one input column the effect is exactly

```text
w_ridge = w_ols * S/(S + alpha),   S = sum of (x - x_mean)^2 on the training rows
```

so `alpha` shrinks the slope by a factor between 0 and 1 — never to zero, never
negative. As `alpha` grows the fitted line **rotates flat**, and because the
intercept is not penalised it settles at `mean(y)`, which is the model R² calls
`0.0`.

## S

### Sigmoid

The curve `1 / (1 + e⁻ᶻ)`. It takes any number and returns one between 0 and 1,
never reaching either end: `z = 0` gives exactly `0.5`, large positive `z`
approaches 1, large negative approaches 0. It is what turns the linear score
inside **logistic regression** into a probability.

### scikit-learn

The standard Python library for classical machine learning — everything before neural
networks, including preprocessing, regression, classification, clustering, and model
evaluation. It exposes almost all of that through one shared interface, the estimator.

### Series

A single labelled column of one data type, from the Pandas library. A DataFrame
is a set of Series sharing one index.

### Shrinkage

The pull that a regularisation penalty applies to coefficients, moving them towards
zero. In Ridge with one input column the amount is exactly `S/(S+α)`, the **shrink
factor** — which is why the same `alpha` bites harder on a small dataset (`S` is
small) than on a large one.

### Synthetic data

Data generated from a formula rather than collected from the real world. Because
you chose the pattern, the noise level, and the number of groups, you know the
correct answer in advance — which is what makes it useful for testing an algorithm
or a pipeline. scikit-learn's `make_regression`, `make_classification`,
`make_blobs`, `make_circles`, and `make_moons` are the standard generators.

## T

### Token

A unit of text processed by a language model. A token may be a word, part of a
word, punctuation, or another small text unit.

### Train/test split

Holding back part of the data so a model can be scored on rows it has never seen.
The split must come before any step that learns from data, including preprocessing —
otherwise information crosses from test to train and causes data leakage.

### Training

The process of adjusting a model using examples so that its predictions become
more useful.

### Transformer

A neural-network architecture that uses attention to relate parts of an input.
Modern LLMs are commonly based on transformers.

## V

### Vector database

A system designed to store vectors and find nearby vectors efficiently. It is
commonly used for semantic search and RAG retrieval.

### Vector

An ordered list of numbers. In AI it can represent features, words, documents,
images, or other information.

### Vectorization

Expressing a calculation as one operation over a whole array instead of a Python
loop over its elements. The loop still runs, but inside compiled code over packed
memory, which is why it is much faster.
