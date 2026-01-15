# CineverseHub Backend - Implementation Plan

> **Purpose**: Tactical setup guide and coding checklists for ASP.NET Core backend development  
> **Source of Truth**: [Backend System Design](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) (Check for DB Schema and Architecture)
> **Contains**: Project setup commands, DTOs, API Endpoints, and Development Checklists  

---

# TABLE OF CONTENTS

1. [Project Setup & Commands](#1-project-setup--commands)
2. [Module 1: Users & Authentication](#2-module-1-users--authentication)
3. [Module 2: Cinema & Infrastructure](#3-module-2-cinema--infrastructure)
4. [Module 3: Movies & Showtimes](#4-module-3-movies--showtimes)
5. [Module 4: Seat Reservation & Booking](#5-module-4-seat-reservation--booking)
6. [Module 5: Pricing Engine](#6-module-5-pricing-engine)
7. [Module 6: Concessions (F&B)](#7-module-6-concessions-fb)
8. [Module 7: Membership & Loyalty](#8-module-7-membership--loyalty)
9. [Module 8: Staff & Administration](#9-module-8-staff--administration)
10. [Module 9: Reporting & Analytics](#10-module-9-reporting--analytics)
11. [SignalR Real-Time](#11-signalr-real-time)
12. [Implementation Reference](#12-implementation-reference)
13. [Development Phases](#13-development-phases)

---

# 1. PROJECT SETUP & COMMANDS

## 1.1 Prerequisites

```bash
# Check .NET version
dotnet --version

# Install EF CLI tool
dotnet tool install --global dotnet-ef

# Verify
dotnet ef --version
```

## 1.2 Create Solution

```bash
mkdir CineverseHub.Backend
cd CineverseHub.Backend

dotnet new sln -n CineverseHub

dotnet new webapi -n CineverseHub.API -controllers
dotnet new classlib -n CineverseHub.Core
dotnet new classlib -n CineverseHub.Application
dotnet new classlib -n CineverseHub.Infrastructure

dotnet sln add CineverseHub.API/CineverseHub.API.csproj
dotnet sln add CineverseHub.Core/CineverseHub.Core.csproj
dotnet sln add CineverseHub.Application/CineverseHub.Application.csproj
dotnet sln add CineverseHub.Infrastructure/CineverseHub.Infrastructure.csproj
```

## 1.3 Add Project References

```bash
cd CineverseHub.API
dotnet add reference ../CineverseHub.Application/CineverseHub.Application.csproj
dotnet add reference ../CineverseHub.Infrastructure/CineverseHub.Infrastructure.csproj
cd ..

cd CineverseHub.Application
dotnet add reference ../CineverseHub.Core/CineverseHub.Core.csproj
cd ..

cd CineverseHub.Infrastructure
dotnet add reference ../CineverseHub.Core/CineverseHub.Core.csproj
cd ..
```

## 1.4 Install NuGet Packages

### CineverseHub.Infrastructure:
```bash
cd CineverseHub.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.0
cd ..
```

### CineverseHub.API:
```bash
cd CineverseHub.API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection --version 12.0.1
dotnet add package FluentValidation.AspNetCore --version 11.3.0
dotnet add package BCrypt.Net-Next --version 4.0.3
cd ..
```

### CineverseHub.Application:
```bash
cd CineverseHub.Application
dotnet add package AutoMapper --version 12.0.1
dotnet add package FluentValidation --version 11.9.0
cd ..
```

## 1.5 EF Migration Commands

| Action | Command |
|--------|---------|
| Create migration | `dotnet ef migrations add <Name> --project CineverseHub.Infrastructure --startup-project CineverseHub.API` |
| Apply to database | `dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API` |
| Remove last migration | `dotnet ef migrations remove --project CineverseHub.Infrastructure --startup-project CineverseHub.API` |
| Generate SQL script | `dotnet ef migrations script --project CineverseHub.Infrastructure --startup-project CineverseHub.API -o migration.sql` |
| List migrations | `dotnet ef migrations list --project CineverseHub.Infrastructure --startup-project CineverseHub.API` |

## 1.6 Run Application

```bash
dotnet run --project CineverseHub.API

# With hot reload
dotnet watch run --project CineverseHub.API
```

## 1.7 Folder Structure

```
CineverseHub.Backend/
├── CineverseHub.sln
├── CineverseHub.API/
│   ├── Controllers/
│   ├── Hubs/
│   ├── Middleware/
│   └── Program.cs
├── CineverseHub.Application/
│   ├── Services/
│   ├── DTOs/
│   └── Validators/
├── CineverseHub.Core/
│   ├── Entities/
│   ├── Interfaces/
│   └── Exceptions/
└── CineverseHub.Infrastructure/
    ├── Data/
    │   ├── CineverseDbContext.cs
    │   └── Migrations/
    └── Repositories/
```

---

# 2. MODULE 1: USERS & AUTHENTICATION

## 2.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| AUTH-001 | The system SHALL allow guests to register with email and password |
| AUTH-002 | The system SHALL validate that email addresses are unique |
| AUTH-003 | The system SHALL hash passwords before storing |
| AUTH-004 | The system SHALL send a verification email upon registration |
| AUTH-005 | The system SHALL authenticate users with email and password |
| AUTH-006 | The system SHALL issue JWT access tokens (15-minute expiry) |
| AUTH-007 | The system SHALL issue refresh tokens (7-day expiry) |
| AUTH-008 | The system SHALL lock accounts after 5 failed login attempts |
| AUTH-009 | The system SHALL support roles: Customer, Staff, Manager, Admin |
| AUTH-010 | The system SHALL restrict endpoints based on user role |
| AUTH-011 | The system SHALL allow admins to assign roles to users |
| AUTH-012 | The system SHALL log all role changes |

## 2.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `users`, `roles`, `permissions`, `role_permissions`, and `staff_users` table definitions.

## 2.3 Entity Properties

| Entity | Properties |
|--------|------------|
| User | Id, Username, Email, PasswordHash, Phone, CreatedAt, LastLogin, Status, EmailVerified |
| Role | Id, Name, Description |
| Permission | Id, Name, Description |
| RolePermission | Id, RoleId, PermissionId |
| StaffUser | Id, UserId, RoleId, HireDate, Status |

## 2.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/auth/register` | Register new user | No | - |
| POST | `/api/auth/login` | Login, get tokens | No | - |
| POST | `/api/auth/refresh` | Refresh token | Yes | All |
| POST | `/api/auth/logout` | Invalidate session | Yes | All |
| POST | `/api/auth/forgot-password` | Request reset | No | - |
| POST | `/api/auth/reset-password` | Reset password | No | - |
| GET | `/api/users/profile` | Get current user | Yes | All |
| PUT | `/api/users/profile` | Update profile | Yes | All |
| GET | `/api/users` | List all users | Yes | Admin |
| PUT | `/api/users/{id}/role` | Update role | Yes | Admin |

## 2.5 DTOs Required

| DTO | Properties |
|-----|------------|
| RegisterDto | Username, Email, Password, ConfirmPassword, Phone |
| LoginDto | Email, Password |
| TokenResponseDto | AccessToken, RefreshToken, ExpiresAt, UserId, Username, Role |
| UserProfileDto | Id, Username, Email, Phone, CreatedAt, Status |
| UpdateProfileDto | Username, Phone |

## 2.6 Migration Command

```bash
dotnet ef migrations add InitialAuth --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 2.7 Checklist

- [ ] Create User entity
- [ ] Create Role entity
- [ ] Create Permission entity
- [ ] Create RolePermission entity
- [ ] Create StaffUser entity
- [ ] Add DbSets to DbContext
- [ ] Configure relationships
- [ ] Run migration
- [ ] Create IUserRepository interface
- [ ] Implement UserRepository
- [ ] Create IAuthService interface
- [ ] Implement AuthService
- [ ] Create DTOs
- [ ] Create validators
- [ ] Create AuthController
- [ ] Create UsersController
- [ ] Configure JWT in Program.cs
- [ ] Seed default roles
- [ ] Test with Postman

---

# 3. MODULE 2: CINEMA & INFRASTRUCTURE

## 3.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| CIN-001 | The system SHALL allow admins to add cinema locations |
| CIN-002 | The system SHALL store cinema name, address, phone, email |
| CIN-003 | The system SHALL track total halls per cinema |
| CIN-004 | The system SHALL support cinema status: active, closed, maintenance |
| HALL-001 | The system SHALL allow admins to create halls within a cinema |
| HALL-002 | The system SHALL support screen types: Standard, IMAX, 4DX, Dolby |
| HALL-003 | The system SHALL track seating capacity per hall |
| SEAT-001 | The system SHALL allow admins to define seat layouts per hall |
| SEAT-002 | The system SHALL support seat types: Standard, VIP, Couple, Wheelchair |
| SEAT-003 | The system SHALL store grid position (X, Y) for visual mapping |
| SEAT-004 | The system SHALL use row labels (A-Z) and seat numbers |
| SEAT-005 | The system SHALL allow disabling damaged seats |

## 3.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `cinemas`, `halls`, and `seatlayouts` table definitions.

## 3.3 Entity Properties

| Entity | Properties |
|--------|------------|
| Cinema | CinemaId, Name, Location, Address, Phone, Email, TotalHalls, Status, CreatedAt |
| Hall | HallId, CinemaId, Name, ScreenType, SeatingCapacity, Status |
| SeatLayout | SeatId, HallId, RowLabel, SeatNumber, SeatType, GridX, GridY, IsAvailable |

## 3.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/cinemas` | List cinemas | No | All |
| GET | `/api/cinemas/{id}` | Get cinema | No | All |
| POST | `/api/cinemas` | Create cinema | Yes | Admin |
| PUT | `/api/cinemas/{id}` | Update cinema | Yes | Admin |
| DELETE | `/api/cinemas/{id}` | Delete cinema | Yes | Admin |
| GET | `/api/cinemas/{id}/halls` | Get halls | No | All |
| POST | `/api/halls` | Create hall | Yes | Admin |
| PUT | `/api/halls/{id}` | Update hall | Yes | Admin |
| GET | `/api/halls/{id}/seats` | Get seat layout | No | All |
| POST | `/api/halls/{id}/seats` | Create seats | Yes | Admin |
| PUT | `/api/seats/{id}` | Update seat | Yes | Admin |

## 3.5 DTOs Required

| DTO | Properties |
|-----|------------|
| CreateCinemaDto | Name, Location, Address, Phone, Email |
| CinemaDto | CinemaId, Name, Location, Address, Phone, Email, TotalHalls, Status |
| CreateHallDto | CinemaId, Name, ScreenType, SeatingCapacity |
| HallDto | HallId, CinemaId, Name, ScreenType, SeatingCapacity, Status |
| CreateSeatDto | HallId, RowLabel, SeatNumber, SeatType, GridX, GridY |
| SeatDto | SeatId, RowLabel, SeatNumber, SeatType, GridX, GridY, IsAvailable |

## 3.6 Migration Command

```bash
dotnet ef migrations add AddCinemaSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 3.7 Checklist

- [ ] Create Cinema entity
- [ ] Create Hall entity
- [ ] Create SeatLayout entity
- [ ] Add DbSets to DbContext
- [ ] Configure relationships (1:N Cinema→Halls, 1:N Hall→Seats)
- [ ] Run migration
- [ ] Create repositories
- [ ] Create DTOs
- [ ] Create CinemasController
- [ ] Create HallsController
- [ ] Create SeatsController
- [ ] Test with Postman

---

# 4. MODULE 3: MOVIES & SHOWTIMES

## 4.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| MOV-001 | The system SHALL allow admins to add movies |
| MOV-002 | The system SHALL store movie duration in minutes |
| MOV-003 | The system SHALL support age ratings: G, PG, PG-13, R, NC-17 |
| MOV-004 | The system SHALL categorize movies by genre |
| MOV-005 | The system SHALL track movie status: coming_soon, now_showing, ended |
| MOV-006 | The system SHALL store poster URL and trailer URL |
| SHW-001 | The system SHALL allow scheduling movies in halls at specific times |
| SHW-002 | The system SHALL prevent overlapping showtimes in the same hall |
| SHW-003 | The system SHALL auto-calculate end time from duration |
| SHW-004 | The system SHALL support showtime status: scheduled, cancelled, ended |
| SSS-001 | The system SHALL create seat status records when showtime is created |
| SSS-002 | The system SHALL track each seat status: available, locked, booked |
| SSS-003 | The system SHALL use RowVersion for concurrency control |

## 4.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `movies`, `showtimes`, and `showtimeseatstatus` table definitions.

## 4.3 Entity Properties

| Entity | Properties |
|--------|------------|
| Movie | MovieId, Title, Description, Duration, Rating, Genre, ReleaseDate, PosterUrl, TrailerUrl, Status, CreatedAt |
| Showtime | ShowtimeId, MovieId, HallId, StartTime, EndTime, Status, CreatedAt |
| ShowtimeSeatStatus | ShowtimeSeatId, ShowtimeId, SeatId, Status, RowVersion (byte[]) |

## 4.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/movies` | List movies | No | All |
| GET | `/api/movies/{id}` | Get movie | No | All |
| POST | `/api/movies` | Create movie | Yes | Admin |
| PUT | `/api/movies/{id}` | Update movie | Yes | Admin |
| DELETE | `/api/movies/{id}` | Delete movie | Yes | Admin |
| GET | `/api/showtimes` | List showtimes | No | All |
| GET | `/api/showtimes/{id}` | Get showtime | No | All |
| POST | `/api/showtimes` | Create showtime | Yes | Admin, Manager |
| PUT | `/api/showtimes/{id}` | Update showtime | Yes | Admin, Manager |
| DELETE | `/api/showtimes/{id}` | Cancel showtime | Yes | Admin, Manager |
| GET | `/api/showtimes/{id}/seats` | Get seat availability | No | All |

## 4.5 DTOs Required

| DTO | Properties |
|-----|------------|
| CreateMovieDto | Title, Description, Duration, Rating, Genre, ReleaseDate, PosterUrl, TrailerUrl |
| MovieDto | MovieId, Title, Description, Duration, Rating, Genre, ReleaseDate, PosterUrl, TrailerUrl, Status |
| CreateShowtimeDto | MovieId, HallId, StartTime |
| ShowtimeDto | ShowtimeId, MovieId, MovieTitle, HallId, HallName, StartTime, EndTime, Status |
| SeatStatusDto | ShowtimeSeatId, SeatId, RowLabel, SeatNumber, SeatType, Status |

## 4.6 Migration Command

```bash
dotnet ef migrations add AddMovieShowtimeSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 4.7 Checklist

- [ ] Create Movie entity
- [ ] Create Showtime entity
- [ ] Create ShowtimeSeatStatus entity (with [Timestamp] on RowVersion)
- [ ] Add DbSets to DbContext
- [ ] Configure relationships
- [ ] Run migration
- [ ] Create repositories
- [ ] Create DTOs
- [ ] Create MoviesController
- [ ] Create ShowtimesController
- [ ] Test with Postman

---

# 5. MODULE 4: SEAT RESERVATION & BOOKING

## 5.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| LOCK-001 | The system SHALL allow users to temporarily lock seats |
| LOCK-002 | The system SHALL set lock expiration time (configurable, default 10 min) |
| LOCK-003 | The system SHALL auto-release expired locks |
| LOCK-004 | The system SHALL prevent locking already locked/booked seats |
| LOCK-005 | The system SHALL handle concurrent lock attempts |
| BOOK-001 | The system SHALL create booking after successful payment |
| BOOK-002 | The system SHALL generate unique booking reference code |
| BOOK-003 | The system SHALL calculate total from ticket prices |
| BOOK-004 | The system SHALL update seat status to booked on confirmation |
| BOOK-005 | The system SHALL send booking confirmation email |
| BOOK-006 | The system SHALL allow cancellation before showtime |
| TKT-001 | The system SHALL create one ticket per seat booked |
| TKT-002 | The system SHALL link tickets to ticket types |
| TKT-003 | The system SHALL generate QR code for each ticket |
| TKT-004 | The system SHALL allow staff to validate tickets via QR |

## 5.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `seatlocks`, `bookings`, `tickets`, and `tickettypes` table definitions.

## 5.3 Entity Properties

| Entity | Properties |
|--------|------------|
| SeatLock | LockId, ShowtimeSeatId, UserId, LockExpirationTime, CreatedAt |
| Booking | BookingId, UserId, TotalAmount, PaymentStatus, BookingReferenceCode, Status, CreatedAt |
| Ticket | TicketId, BookingId, ShowtimeSeatId, TicketTypeId, FinalPrice, QrCode, IsUsed, UsedAt |
| TicketType | TypeId, Name, Description, DefaultPriceMultiplier, IsActive |

## 5.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/api/bookings/lock-seats` | Lock seats | Yes | Customer |
| DELETE | `/api/bookings/unlock-seats` | Release locks | Yes | Customer |
| POST | `/api/bookings` | Create booking | Yes | Customer |
| GET | `/api/bookings` | List user bookings | Yes | Customer |
| GET | `/api/bookings/{id}` | Get booking | Yes | Customer, Staff |
| DELETE | `/api/bookings/{id}` | Cancel booking | Yes | Customer |
| GET | `/api/bookings/{id}/tickets` | Get tickets | Yes | Customer |
| GET | `/api/tickets/{id}/qr` | Generate QR | Yes | Customer |
| POST | `/api/tickets/validate` | Validate ticket | Yes | Staff |
| GET | `/api/ticket-types` | List ticket types | No | All |

## 5.5 DTOs Required

| DTO | Properties |
|-----|------------|
| LockSeatsDto | ShowtimeId, SeatIds (list) |
| LockResultDto | Locks (list), ExpiresAt |
| CreateBookingDto | ShowtimeId, SeatSelections (list of SeatId + TicketTypeId) |
| BookingDto | BookingId, ReferenceCode, TotalAmount, Status, CreatedAt, Tickets |
| TicketDto | TicketId, SeatLabel, SeatType, TicketType, Price, QrCode, IsUsed |
| ValidateTicketDto | QrCode or TicketId |

## 5.6 Migration Command

```bash
dotnet ef migrations add AddBookingSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 5.7 Checklist

- [ ] Create SeatLock entity
- [ ] Create Booking entity
- [ ] Create Ticket entity
- [ ] Create TicketType entity
- [ ] Add DbSets to DbContext
- [ ] Configure relationships and unique constraints
- [ ] Run migration
- [ ] Create ISeatLockService interface
- [ ] Implement SeatLockService
- [ ] Create IBookingService interface
- [ ] Implement BookingService
- [ ] Create background service for expired lock cleanup
- [ ] Create BookingsController
- [ ] Create TicketsController
- [ ] Seed default ticket types (Adult, Child, Student, Senior)
- [ ] Test with Postman

---

# 6. MODULE 5: PRICING ENGINE

## 6.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| PRC-001 | The system SHALL support ticket types (Adult, Child, Student, Senior) |
| PRC-002 | The system SHALL apply price multipliers per ticket type |
| PRC-003 | The system SHALL support pricing rules based on day of week |
| PRC-004 | The system SHALL support pricing rules based on time of day |
| PRC-005 | The system SHALL apply surcharges for seat types (VIP, Couple) |
| PRC-006 | The system SHALL support promotional discounts |
| PRC-007 | The system SHALL calculate final price from base + adjustments |

## 6.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `pricingrules` and `showtimepricing` table definitions.

## 6.3 Entity Properties

| Entity | Properties |
|--------|------------|
| PricingRule | RuleId, Description, DayOfWeek, StartTimeRange, EndTimeRange, PriceAdjustment, AdjustmentType, IsActive |
| ShowtimePricing | ShowtimePricingId, ShowtimeId, RuleId, BasePrice |

## 6.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/ticket-types` | List ticket types | No | All |
| POST | `/api/ticket-types` | Create ticket type | Yes | Admin |
| PUT | `/api/ticket-types/{id}` | Update ticket type | Yes | Admin |
| GET | `/api/pricing-rules` | List pricing rules | Yes | Admin, Manager |
| POST | `/api/pricing-rules` | Create rule | Yes | Admin |
| PUT | `/api/pricing-rules/{id}` | Update rule | Yes | Admin |
| DELETE | `/api/pricing-rules/{id}` | Delete rule | Yes | Admin |
| GET | `/api/showtimes/{id}/pricing` | Get showtime pricing | No | All |

## 6.5 Migration Command

```bash
dotnet ef migrations add AddPricingSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 6.6 Checklist

- [ ] Create PricingRule entity
- [ ] Create ShowtimePricing entity
- [ ] Add DbSets to DbContext
- [ ] Run migration
- [ ] Create IPricingService interface
- [ ] Implement PricingService
- [ ] Create PricingController
- [ ] Seed default pricing rules
- [ ] Test with Postman

---

# 7. MODULE 6: CONCESSIONS (F&B)

## 7.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| FNB-001 | The system SHALL allow admins to manage menu items |
| FNB-002 | The system SHALL categorize items: Popcorn, Drinks, Combos, Snacks |
| FNB-003 | The system SHALL track stock levels |
| FNB-004 | The system SHALL warn when stock is low |
| FNB-005 | The system SHALL allow ordering during booking |
| FNB-006 | The system SHALL allow standalone orders |
| FNB-007 | The system SHALL deduct stock on order |
| FNB-008 | The system SHALL track order status: pending, preparing, ready, collected |

## 7.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `items` and `concessionorders` table definitions.
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 7.3 Entity Properties

| Entity | Properties |
|--------|------------|
| ConcessionItem | ItemId, Name, Category, Description, UnitPrice, ImageUrl, StockLevel, IsAvailable |
| ConcessionOrder | OrderId, BookingId, UserId, ItemId, Quantity, Subtotal, Status, CreatedAt |

## 7.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/concessions/items` | List menu | No | All |
| GET | `/api/concessions/items/{id}` | Get item | No | All |
| POST | `/api/concessions/items` | Create item | Yes | Admin, Manager |
| PUT | `/api/concessions/items/{id}` | Update item | Yes | Admin, Manager |
| DELETE | `/api/concessions/items/{id}` | Delete item | Yes | Admin |
| POST | `/api/concessions/orders` | Create order | Yes | Customer, Staff |
| GET | `/api/concessions/orders` | List orders | Yes | Staff, Manager |
| GET | `/api/concessions/orders/{id}` | Get order | Yes | Customer, Staff |
| PUT | `/api/concessions/orders/{id}/status` | Update status | Yes | Staff |

## 7.5 Migration Command

```bash
dotnet ef migrations add AddConcessionSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 7.6 Checklist

- [ ] Create ConcessionItem entity
- [ ] Create ConcessionOrder entity
- [ ] Add DbSets to DbContext
- [ ] Run migration
- [ ] Create ConcessionController
- [ ] Seed sample menu items
- [ ] Test with Postman

---

# 8. MODULE 7: MEMBERSHIP & LOYALTY

## 8.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| MEM-001 | The system SHALL support tiers: Bronze, Silver, Gold, Platinum |
| MEM-002 | The system SHALL auto-upgrade tiers based on spending |
| MEM-003 | The system SHALL provide different benefits per tier |
| MEM-004 | The system SHALL award points for purchases |
| MEM-005 | The system SHALL apply tier multipliers for points |
| MEM-006 | The system SHALL allow redeeming points for discounts |
| MEM-007 | The system SHALL track point expiry |
| MEM-008 | The system SHALL log all point transactions |
| MEM-009 | The system SHALL track tier change history |

## 8.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `membership`, `membershiptransactions`, and `membershiphistory` table definitions.

## 8.3 Entity Properties

| Entity | Properties |
|--------|------------|
| Membership | MemberId, UserId, PointsBalance, TierLevel, CurrentTierStart, CurrentTierEnd, TotalSpent, CreatedAt |
| MembershipTransaction | TransactionId, MemberId, BookingId, PointsDelta, TransactionType, Description, TransactionDate |
| MembershipHistory | HistoryId, MemberId, TierLevel, StartDate, EndDate, UpgradeCriteria |

## 8.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/membership` | Get membership | Yes | Customer |
| POST | `/api/membership` | Enroll | Yes | Customer |
| GET | `/api/membership/points` | Get points | Yes | Customer |
| GET | `/api/membership/transactions` | List transactions | Yes | Customer |
| POST | `/api/membership/redeem` | Redeem points | Yes | Customer |
| GET | `/api/membership/tiers` | List tier benefits | No | All |
| GET | `/api/membership/history` | Get tier history | Yes | Customer |

## 8.5 Migration Command

```bash
dotnet ef migrations add AddMembershipSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 8.6 Checklist

- [ ] Create Membership entity
- [ ] Create MembershipTransaction entity
- [ ] Create MembershipHistory entity
- [ ] Add DbSets to DbContext
- [ ] Run migration
- [ ] Create IMembershipService interface
- [ ] Implement MembershipService
- [ ] Create MembershipController
- [ ] Test with Postman

---

# 9. MODULE 8: STAFF & ADMINISTRATION

## 9.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| STF-001 | The system SHALL allow admins to create staff accounts |
| STF-002 | The system SHALL assign roles to staff |
| STF-003 | The system SHALL track hire date and status |
| STF-004 | The system SHALL allow managers to create shifts |
| STF-005 | The system SHALL track clock-in and clock-out |
| STF-006 | The system SHALL track cash drawer amounts |
| AUD-001 | The system SHALL log all admin/staff actions |
| AUD-002 | The system SHALL capture action type, timestamp, user |
| AUD-003 | The system SHALL store old/new values for updates |
| AUD-004 | The system SHALL never allow deleting audit logs |

## 9.2 Database Schema Reference
See **Section 3.2** in [backend_system_design.md](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) for the `shifts` and `audit_logs` table definitions.
```

## 9.3 Entity Properties

| Entity | Properties |
|--------|------------|
| Shift | ShiftId, StaffId, StartTime, EndTime, ActualStart, ActualEnd, CashDrawerStartAmount, CashDrawerEndAmount, Status, Notes |
| AuditLog | LogId, StaffId, ActionType, TableName, RecordId, OldValue, NewValue, IpAddress, UserAgent, Timestamp |

## 9.4 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/staff` | List staff | Yes | Manager, Admin |
| GET | `/api/staff/{id}` | Get staff | Yes | Manager, Admin |
| POST | `/api/staff` | Create staff | Yes | Admin |
| PUT | `/api/staff/{id}` | Update staff | Yes | Admin |
| GET | `/api/shifts` | List shifts | Yes | Staff, Manager |
| POST | `/api/shifts` | Create shift | Yes | Manager |
| PUT | `/api/shifts/{id}` | Update shift | Yes | Manager |
| DELETE | `/api/shifts/{id}` | Delete shift | Yes | Manager |
| PUT | `/api/shifts/{id}/clock-in` | Clock in | Yes | Staff |
| PUT | `/api/shifts/{id}/clock-out` | Clock out | Yes | Staff |
| GET | `/api/audit-logs` | Query logs | Yes | Admin |
| GET | `/api/audit-logs/export` | Export logs | Yes | Admin |

## 9.5 Migration Command

```bash
dotnet ef migrations add AddStaffSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

## 9.6 Checklist

- [ ] Create Shift entity
- [ ] Create AuditLog entity
- [ ] Add DbSets to DbContext
- [ ] Run migration
- [ ] Create StaffController
- [ ] Create ShiftsController
- [ ] Create AuditController
- [ ] Test with Postman

---

# 10. MODULE 9: REPORTING & ANALYTICS

## 10.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| RPT-001 | The system SHALL generate daily/weekly/monthly sales summaries |
| RPT-002 | The system SHALL break down revenue by cinema and movie |
| RPT-003 | The system SHALL separate ticket vs concession revenue |
| RPT-004 | The system SHALL export reports to Excel/PDF |
| RPT-005 | The system SHALL calculate seat occupancy rates |
| RPT-006 | The system SHALL identify best/worst performing movies |
| RPT-007 | The system SHALL show peak hours and days |
| RPT-008 | The system SHALL track membership enrollment trends |
| RPT-009 | The system SHALL identify top spenders |

## 10.2 API Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/api/reports/sales/summary` | Sales summary | Yes | Manager, Admin |
| GET | `/api/reports/sales/by-movie` | By movie | Yes | Manager, Admin |
| GET | `/api/reports/sales/by-cinema` | By cinema | Yes | Admin |
| GET | `/api/reports/occupancy` | Occupancy | Yes | Manager, Admin |
| GET | `/api/reports/occupancy/by-showtime` | By showtime | Yes | Manager |
| GET | `/api/reports/membership/summary` | Membership stats | Yes | Admin |
| GET | `/api/reports/membership/top-spenders` | Top spenders | Yes | Admin |
| GET | `/api/reports/export` | Export | Yes | Manager, Admin |

## 10.3 Checklist

- [ ] Create IReportService interface
- [ ] Implement ReportService
- [ ] Create ReportsController
- [ ] Add Excel export capability
- [ ] Add PDF export capability
- [ ] Test with Postman

---

# 11. SIGNALR REAL-TIME

## 11.1 Functional Requirements

| ID | Requirement |
|----|-------------|
| RT-001 | The system SHALL broadcast seat status changes in real-time |
| RT-002 | The system SHALL group connections by showtime |
| RT-003 | The system SHALL notify clients when seats are locked |
| RT-004 | The system SHALL notify clients when seats are booked |

## 11.2 Hub Endpoint

| Hub | Route |
|-----|-------|
| SeatStatusHub | `/hubs/seat-status` |

## 11.3 Hub Methods

| Method | Direction | Purpose |
|--------|-----------|---------|
| JoinShowtimeGroup | Client → Server | Subscribe to showtime updates |
| LeaveShowtimeGroup | Client → Server | Unsubscribe |
| SeatStatusChanged | Server → Client | Notify of status change |

## 11.4 Checklist

- [ ] Install SignalR package
- [ ] Create SeatStatusHub
- [ ] Configure hub in Program.cs
- [ ] Integrate with SeatLockService
- [ ] Test with frontend

---

## 12. IMPLEMENTATION REFERENCE
For the complete entity relationship diagrams and business rules, always refer to the [Backend System Design](file:///c:/Users/gimsh/Desktop/Movie-Reservaton-System-Using-ASP.NET-and-React/Doc/backend_system_design.md) document.

---

# 13. DEVELOPMENT PHASES

## Phase 1: Foundation (Week 1-2)
- [ ] Create solution structure
- [ ] Install packages
- [ ] Set up DbContext
- [ ] Module 1: Users & Authentication
- [ ] Test auth endpoints

## Phase 2: Core Domain (Week 3-4)
- [ ] Module 2: Cinema & Infrastructure
- [ ] Module 3: Movies & Showtimes
- [ ] Test all CRUD endpoints

## Phase 3: Booking Engine (Week 5-6)
- [ ] Module 4: Seat Reservation & Booking
- [ ] Implement seat locking
- [ ] Implement booking flow
- [ ] SignalR integration

## Phase 4: Business Logic (Week 7)
- [ ] Module 5: Pricing Engine
- [ ] Module 6: Concessions

## Phase 5: Advanced (Week 8)
- [ ] Module 7: Membership & Loyalty
- [ ] Module 8: Staff & Administration
- [ ] Module 9: Reporting

---

# QUICK REFERENCE: ALL MIGRATIONS

```bash
dotnet ef migrations add InitialAuth --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddCinemaSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddMovieShowtimeSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddBookingSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddPricingSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddConcessionSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddMembershipSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API
dotnet ef migrations add AddStaffSchema --project CineverseHub.Infrastructure --startup-project CineverseHub.API

# Apply all
dotnet ef database update --project CineverseHub.Infrastructure --startup-project CineverseHub.API
```

---

**Document End**
