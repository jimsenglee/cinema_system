# Git Commands Reference

## Daily Workflow (Most Common)

### 1. Check Status (See what changed)
```bash
git status
```

### 2. Stage All Changes
```bash
git add .
```
Or stage specific files:
```bash
git add path/to/file
```

### 3. Commit Changes
```bash
git commit -m "feat: add User entity and database migration"
```

**Commit message conventions:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests

### 4. Push to GitHub
```bash
git push origin main
```
Or push current branch:
```bash
git push
```

---

## All-in-One (Quick Push)
```bash
git add . && git commit -m "Your message" && git push
```

---

## Branch Management

### Create and Switch to New Branch
```bash
git checkout -b feature/auth-system
```

### Switch Between Branches
```bash
git checkout main
git checkout feature/auth-system
```

### List All Branches
```bash
git branch -a
```

### Delete Branch
```bash
git branch -d branch-name  # Safe delete
git branch -D branch-name  # Force delete
```

---

## Pulling & Syncing

### Pull Latest Changes (Before starting work)
```bash
git pull origin main
```

### Fetch Changes Without Merging
```bash
git fetch origin
```

---

## Viewing History

### See Commit History
```bash
git log --oneline --graph --all
```

### See What Changed in Last Commit
```bash
git show
```

### See Diff Before Committing
```bash
git diff
```

---

## Undo Changes

### Unstage Files (Keep changes)
```bash
git reset HEAD path/to/file
```

### Discard Changes in Working Directory
```bash
git checkout -- path/to/file
```

### Undo Last Commit (Keep changes)
```bash
git reset --soft HEAD~1
```

---

## GitHub Actions Preparation

### 1. Create Workflow File
Location: `.github/workflows/dotnet.yml`

```yaml
name: .NET CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
        
    - name: Restore dependencies
      run: dotnet restore
      
    - name: Build
      run: dotnet build --no-restore
      
    - name: Test
      run: dotnet test --no-build --verbosity normal
```

### 2. Push Workflow File
```bash
git add .github/workflows/dotnet.yml
git commit -m "ci: add GitHub Actions workflow"
git push
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `git status` | Check what changed |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit staged changes |
| `git push` | Upload to GitHub |
| `git pull` | Download latest |
| `git checkout -b branch-name` | Create new branch |
| `git log --oneline` | View commit history |

---

## Best Practices

✅ **DO:**
- Commit often with clear messages
- Pull before you push
- Use branches for features
- Test before pushing

❌ **DON'T:**
- Commit directly to `main` (use branches)
- Push broken code
- Use vague commit messages like "update"
- Forget to pull regularly
