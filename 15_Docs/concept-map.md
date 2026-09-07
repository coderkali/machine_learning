# AI/ML Concept Map

This map starts with the relationships needed for the current roadmap. It will
grow only when real learning adds a useful connection.

```mermaid
flowchart TD
    Python[Python] --> Data[NumPy and Pandas]
    Data --> EDA[Visualization and EDA]
    Stats[Statistics] --> ML[Machine Learning]
    LA[Linear Algebra] --> ML
    Data --> ML

    ML --> DL[Deep Learning]
    DL --> NLP[Natural Language Processing]
    DL --> CV[Computer Vision]
    DL --> RL[Reinforcement Learning]
    NLP --> Transformers[Transformers]
    LA --> Transformers

    Transformers --> LLM[Large Language Models]
    Prompt[Prompt Engineering] --> LLMApps[LLM Applications]
    LLM --> LLMApps
    LLM --> Embeddings[Embeddings]
    Embeddings --> VectorDB[Vector Databases]
    VectorDB --> RAG[RAG]
    LLMApps --> RAG
    RAG --> Agents[AI Agents]
    Prompt --> Agents

    Git[Git and GitHub] --> Delivery[Reproducible Delivery]
    Docker[Docker] --> Delivery
    ML --> MLOps[MLOps]
    Delivery --> MLOps
    Agents --> LLMOps[LLMOps]
    Delivery --> LLMOps

    SQL[SQL and Databases] --> BI[BI and Analytics]
    SQL --> DataPlatform[Data Platforms]
    Kafka[Kafka] --> DataPlatform
    Spark[Spark] --> DataPlatform
    DataPlatform --> SystemDesign[AI System Design]
    MLOps --> SystemDesign
    LLMOps --> SystemDesign
```

## Three useful engineering views

### Training flow

```text
Raw data -> Validation -> Preprocessing -> Training -> Evaluation -> Model
```

### Prediction flow

```text
Client -> API -> Same preprocessing -> Model -> Prediction -> Monitoring
```

### RAG flow

```text
Documents -> Chunks -> Embeddings -> Vector database
                                      |
Question -> Embedding -> Retrieval ---+
                         |
                         v
                Prompt + context -> LLM -> Answer
```

The training and serving paths must agree on how features are prepared. A RAG
system has a separate ingestion path and question-answering path, much like a
search index has a write path and a query path.
