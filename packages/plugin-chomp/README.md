# Chomp Plugin

## Overview

This plugin provides functionality for managing and interacting with Chomp game questions. It enables the creation, retrieval, and management of coding challenge questions.

## Features

### Actions

#### findQuestion

Searches and retrieves questions based on criteria like difficulty, topic, or keywords.

```typescript
import { findQuestion } from "@elizaos/plugin-chomp";

// Example usage through Eliza runtime
const result = await findQuestion.handler(runtime, {
    input: "find a beginner JavaScript question",
    entities: [],
    intent: "find_question",
});
```

#### createQuestion

Creates new coding challenge questions with specified parameters.

```typescript
import { createQuestion } from "@elizaos/plugin-chomp";

// Example usage through Eliza runtime
const result = await createQuestion.handler(runtime, {
    input: "create a question about array manipulation",
    entities: [],
    intent: "create_question",
});
```

## Adding a new action

Reuse providers and utilities from the existing actions where possible. Add more utilities if you think they will be useful for other actions.

1. Add the action to the `actions` directory. Try to follow the naming convention of the other actions.
2. Export the action in the `index.ts` file.

## Example Workflow

```typescript
import { chompPlugin } from "@elizaos/plugin-chomp";

// Register the plugin with Eliza
eliza.use(chompPlugin);

// The plugin will now handle intents related to:
// - Finding coding questions
// - Creating new questions
// - Managing question metadata
```

## Configuration

No additional configuration is required. The plugin uses the core Eliza runtime environment.

## TODO:

1. Add question validation
2. Implement difficulty scoring
3. Add category management
4. Support multiple programming languages

## License

MIT
