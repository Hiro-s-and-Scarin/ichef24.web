# Modelagem de Banco de Dados PostgreSQL - iChef24

## Tabelas

### 1. Tabela `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tabela `recipes`
```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL,
    steps JSONB NOT NULL,
    cooking_time INTEGER,
    servings INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    cuisine_type VARCHAR(100),
    tags TEXT[],
    image_url TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    ai_prompt TEXT,
    ai_model_version VARCHAR(50),
    is_public BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Tabela `favorites`
```sql
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);
```

### 4. Tabela `recipe_history`
```sql
CREATE TABLE recipe_history (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATED', 'UPDATED', 'DELETED', 'VIEWED', 'LIKED', 'UNLIKED')),
    data_before JSONB,
    data_after JSONB,
    change_summary TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Tabela `login_history`
```sql
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    failure_reason VARCHAR(100)
);
```

### 6. Tabela `audit_log`
```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Tabela `recipe_shares`
```sql
CREATE TABLE recipe_shares (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    share_token VARCHAR(255) UNIQUE NOT NULL,
    share_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Tabela `chat_sessions`
```sql
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    ai_model_version VARCHAR(50),
    total_messages INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Tabela `chat_messages`
```sql
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('USER', 'AI', 'SYSTEM')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    recipe_generated_id INTEGER REFERENCES recipes(id),
    metadata JSONB, -- Informações adicionais como temperatura, top_p, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Tabela `community_posts`
```sql
CREATE TABLE community_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    image_url TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Fácil', 'Intermediário', 'Avançado')),
    recipe_tags TEXT[], -- Tags específicas da receita (ex: "Risotto de Camarão")
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. Tabela `post_chat`
```sql
CREATE TABLE post_chat (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('USER', 'AI', 'SYSTEM')),
    content TEXT NOT NULL,
    parent_message_id INTEGER REFERENCES post_chat(id), -- Para respostas em thread
    is_recipe_related BOOLEAN DEFAULT FALSE, -- Se a mensagem gerou uma receita
    recipe_generated_id INTEGER REFERENCES recipes(id),
    tokens_used INTEGER DEFAULT 0,
    metadata JSONB, -- Informações adicionais do chat
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
