---
description: Coding rules and best practices for the CineverseHub movie reservation backend (ASP.NET Core)
---

# 🔒 CineverseHub Backend Coding Rules

These rules apply to ALL code changes in the `CineverseHub.Backend` solution.

---

## 0. Teaching & Explanation Standards (For AI Assistant)
- **Never give code without explanation.** Every piece of code must have a "What this does" and "Why we need it" explanation.
- **Explain commands before AND after.** Before: what will happen. After: where to verify the result (which file changed, what to look for).
- **Don't simplify.** Give full technical details. The user is learning to be a software engineer, not a script kiddie.
- **One step at a time.** Wait for confirmation before proceeding to the next step.
- **Research before recommending.** Always verify best practices against current industry standards (roadmap.sh, official docs, Stack Overflow trends) before suggesting patterns. Never rely on assumptions.

---

## 0.1 Git Safety Rules (CRITICAL - NEVER VIOLATE)

### ⛔ BANNED COMMANDS - Never Run These:
| Command | Why Banned | Safe Alternative |
|---------|-----------|------------------|
| `git clean -fd` | Deletes untracked files PERMANENTLY | `git status` to see what would be removed, then manual delete |
| `git reset --hard` | DESTROYS uncommitted changes | `git stash` to save changes temporarily |
| `git push --force` | Overwrites remote history, breaks team's work | `git push --force-with-lease` (safer, checks remote first) |
| `git branch -D` | Force deletes branch without merge check | `git branch -d` (safe delete, warns if unmerged) |
| `rm -rf .git` | Destroys entire git history | Never needed - talk to team lead if considering this |

### ⚠️ USE WITH CAUTION - Always Confirm First:
- `git reset HEAD~1` - Undoes last commit (keeps changes)
- `git checkout -- .` - Discards all working changes
- `git rebase` - Rewrites history, can cause conflicts

### ✅ SAFE PATTERN - Always Follow:
1. `git status` - See what will change
2. `git stiff` - Preview changes
3. THEN run the command
4. Immediately verify with `git status` again

---


## 1. DRY (Don't Repeat Yourself)
- **Never copy-paste code.** Extract reusable logic into services, helpers, or extension methods.
- **Use base classes or interfaces** for common entity patterns (e.g., `AuditableEntity` with `CreatedAt`, `UpdatedAt`).
- **Map DTOs with AutoMapper**, don't write manual mapping in every controller.

## 2. SOLID Principles
- **Single Responsibility**: One class = one job. Controllers call services; services contain business logic; repositories touch the database.
- **Open/Closed**: Use interfaces (`IBookingService`, `IUserRepository`) so implementations can be swapped without changing consumers.
- **Dependency Injection**: Register all services in `Program.cs`. Never use `new Service()` inside a class.

## 3. Security First
- **Hash passwords** with BCrypt or Argon2. NEVER store plain text.
- **Validate all inputs** with FluentValidation before processing.
- **Use `[Authorize]` attributes** on ALL controllers except public endpoints.
- **Parameterized queries only**: Entity Framework handles this, but NEVER concatenate SQL strings.
- **Rate limit** sensitive endpoints like login and register.

## 4. Concurrency & Double-Booking Prevention
- **Use `RowVersion` (Optimistic Concurrency)** on `ShowtimeSeatStatus` entity.
- **Use Redis for seat locks** in high-traffic scenarios.
- **Background job must clean expired locks** every 1-2 minutes.

## 5. Clean Code
- **Meaningful names**: `CreateBookingAsync`, not `DoIt` or `ProcessData`.
- **Small methods**: A method should do ONE thing and be less than 30 lines.
- **No magic numbers**: Use constants or enums. `SeatStatus.Locked`, not `"locked"`.
- **Comments**: Only explain *why*, not *what*. The code explains *what*.

## 6. Error Handling
- **Use custom exceptions** (`SeatAlreadyLockedException`, `BookingNotFoundException`).
- **Global exception middleware** to catch all errors and return consistent JSON responses.
- **Log errors with Serilog** including stack trace and request context.

## 7. Testing
- **Unit test all services** using xUnit and Moq.
- **Integration tests** for critical flows (seat locking, booking).
- **Test with Postman** after finishing each module's endpoints.

## 8. Git Workflow
- **Feature branches**: `feature/auth`, `feature/booking`, etc.
- **Meaningful commits**: `feat(auth): add jwt token refresh`, not `update`.
- **Commit often, push daily**.

---

## Quick Reference: Entity Conventions
| Convention | Example |
|------------|---------|
| Primary Key | `Id` (Guid) |
| Timestamps | `CreatedAt`, `UpdatedAt` |
| Soft Delete | `Status = 'deleted'` (no physical delete) |
| Navigation | `public virtual User User { get; set; }` |
| Concurrency | `[Timestamp] public byte[] RowVersion { get; set; }` |
