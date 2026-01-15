# 📅 Learning Log - Day 1
**Date:** 2026-01-14

---

## ✅ What I Accomplished Today

### 1. Project Setup
- Created backend solution with Clean Architecture (4 projects)
- Installed EF Core packages for SQL Server
- Set up project references between layers

### 2. Database Configuration
- Created `CineverseDbContext.cs` - the bridge between C# and database
- Configured connection string in `appsettings.json` for LocalDB
- Registered DbContext in `Program.cs` using dependency injection

### 3. First Entity & Migration
- Created `User.cs` entity with properties: Id, Name, Email, PasswordHash, Role, CreatedAt, UpdatedAt
- Ran first migration: `dotnet ef migrations add InitialCreate`
- Applied migration to database: `dotnet ef database update`
- **Result:** Real `Users` table created in LocalDB!

### 4. Database Visualization
- Connected SQL Server extension to LocalDB
- Viewed the `Users` table structure visually

---

## 📚 Key Concepts Learned

| Concept | What it means |
|---------|---------------|
| `DbContext` | The main class that talks to the database |
| `DbSet<T>` | Represents a table, used for CRUD operations |
| `= null!` | Null-forgiving operator for EF entities |
| `= string.Empty` | Alternative for non-nullable strings |
| Migration | C# file that describes database schema changes |
| `IDENTITY(1,1)` | SQL auto-increment column |

---

## 🛠️ Commands Learned

| Command | Purpose |
|---------|---------|
| `dotnet new sln` | Create solution |
| `dotnet new webapi` | Create API project |
| `dotnet new classlib` | Create class library |
| `dotnet add reference` | Link projects together |
| `dotnet add package` | Install NuGet package |
| `dotnet build` | Compile and check for errors |
| `dotnet ef migrations add` | Create migration |
| `dotnet ef database update` | Apply migrations to DB |

---

## 📁 Files Created Today

| File | Purpose |
|------|---------|
| `CineverseHub.Infrastructure/Data/CineverseDbContext.cs` | Database context |
| `CineverseHub.Core/Entities/User.cs` | User entity (becomes Users table) |
| `CineverseHub.Infrastructure/Migrations/*` | Migration files |

---

## ⏭️ Next Steps (Day 2)
- [ ] Create `RegisterDto` and `LoginDto` (for frontend input)
- [ ] Create `AuthService` (business logic for auth)
- [ ] Create `AuthController` (API endpoints)
- [ ] Test Register/Login with Postman
