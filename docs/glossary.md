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
data.

### Broadcasting

The rule that lets an operation combine arrays of different shapes by stretching
size-1 dimensions instead of copying data. It is what makes "subtract the mean
from every row" a single expression.

## C

### Chunk

A smaller section of a document prepared for embedding or retrieval. Chunk
size and overlap affect how much context a RAG system can find.

### Classification

A supervised learning task that predicts a category, such as fraud or not
fraud.

## D

### Data leakage

Information from validation, test, or future data accidentally influences
training. It makes evaluation look better than real-world performance.

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

## F

### Feature

An input value used by a model to make a prediction. In a customer model,
examples include account age or number of support requests.

### Fine-tuning

Continuing the training of a pre-trained model on a targeted dataset so its
behavior better fits a task or domain.

## I

### Inference

Using a trained model to produce a prediction or generated output.

## L

### Large language model (LLM)

A neural network trained on large amounts of text and other data to understand
and generate language-like output.

## M

### Machine learning (ML)

A way to build software in which a model learns patterns from examples instead
of relying only on rules written by a developer.

### Model

The learned artifact that turns input features into a prediction or generated
output. It is similar to the decision logic behind an API, but its behavior is
learned from data.

## P

### Prompt

The instructions and context sent to a generative model.

## R

### Regression

A supervised learning task that predicts a number, such as price or delivery
time.

### Retrieval-augmented generation (RAG)

An application pattern that retrieves relevant source material and gives it to
a generative model before the model answers.

## T

### Token

A unit of text processed by a language model. A token may be a word, part of a
word, punctuation, or another small text unit.

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
