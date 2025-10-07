After my recent article on “Polymorphic DTOs in NestJS with Discriminators” received such positive feedback, I realized there’s genuine interest in exploring the more nuanced aspects of DTO design in NestJS. So I wanted to continue sharing insights on this topic with something equally practical but different.

When I first discovered NestJS mapped types, I thought they were just a clever way to avoid duplicating code. Copy some fields here, make them optional there — problem solved, right? But after years of building applications with growing complexity, I’ve realized that mapped types are about something much more valuable: expressing intent and creating self-documenting contracts.

Let me show you how to think about DTOs not as “entities with decorators,” but as clear contracts that make your codebase easier to understand, maintain, and scale.

Starting Simple: The Official NestJS Pattern
If you’ve read the NestJS documentation, you’ve probably seen this pattern:

// create-cat.dto.ts
export class CreateCatDto {
name: string;
age: number;
breed: string;
}
// update-cat.dto.ts
export class UpdateCatDto extends PartialType(CreateCatDto) {}
This is clean and works well for simple cases. PartialType makes all fields optional, which is exactly what you want for updates. But here's where many developers stop, missing a more powerful pattern that becomes essential as applications grow.

DTOs Are Contracts, Not Boilerplate
Before diving into advanced patterns, let’s establish a mindset shift. DTOs aren’t just “data containers with validation decorators.” They’re contracts that define:

What your API expects to receive
What it promises to return
What changes are allowed and when
How different parts of your system communicate
When you think about DTOs as contracts, you start asking different questions:

Does this DTO clearly express what this operation needs?
Will a new developer understand the business rules by reading this DTO?
Can I trust that if validation passes, my business logic will work correctly?
The Base DTO Pattern: A Game Changer
Here’s a pattern that many developers overlook, but it’s incredibly powerful for complex applications:

// user.dto.ts - The base contract
export class UserDto {
@IsUUID()
id: string;

@IsEmail()
email: string;

@IsString()
@MinLength(2)
firstName: string;

@IsString()
@MinLength(2)
lastName: string;

@IsOptional()
@IsString()
profilePicture?: string;

@IsOptional()
@IsString()
bio?: string;

@IsBoolean()
isActive: boolean;

@IsDate()
createdAt: Date;

@IsDate()
updatedAt: Date;
}

// Now derive specific DTOs using mapped types
export class CreateUserDto extends PickType(UserDto, [
'email',
'firstName',
'lastName',
'profilePicture',
'bio'
] as const) {}

export class UpdateUserDto extends PartialType(
PickType(UserDto, ['firstName', 'lastName', 'profilePicture', 'bio'] as const)
) {}

export class UserResponseDto extends OmitType(UserDto, ['updatedAt'] as const) {}

export class PublicUserDto extends PickType(UserDto, [
'id',
'firstName',
'lastName',
'profilePicture'
] as const) {}
Look at what we’ve accomplished:

Self-documenting intent: CreateUserDto explicitly shows which fields are required for user creation
Clear boundaries: UpdateUserDto makes it impossible to accidentally update the email or timestamps
Multiple contexts: PublicUserDto for user profiles, UserResponseDto for authenticated responses
Single source of truth: All validation rules are defined once in UserDto
The Database Entity Trap (And How to Avoid It)
Here’s a mistake I see constantly:

// ❌ Don't do this
@Entity()
export class User {
@PrimaryGeneratedColumn('uuid')
@IsUUID() // Validation in entity? Red flag!
id: string;

@Column()
@IsEmail() // More validation in entity
email: string;

// ... more fields
}

// Then later...
export class CreateUserDto extends OmitType(User, ['id', 'createdAt', 'updatedAt']) {}
This couples your DTOs directly to your database schema. When your database needs change (and they will), your API contracts change too. Not good.

Get Serhii Malyshev’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe
Instead, keep them separate:

// ✅ Keep concerns separated
@Entity()
export class User {
@PrimaryGeneratedColumn('uuid')
id: string;
@Column({ unique: true })
email: string;
// Database-specific concerns only
}

// DTOs handle API contracts and validation
export class UserDto {
@IsUUID()
id: string;
@IsEmail()
email: string;

// API-specific validation and business rules
}
💡 Pro Tip: Overriding Validations with declare
Sometimes you need different validation rules for different contexts. Here’s a lesser-known technique:

export class CreateUserDto extends PickType(UserDto, [
'email',
'firstName',
'lastName'
] as const) {

// Override with stricter validation for creation
@IsEmail()
@IsNotRegistered() // Custom validator
declare email: string;

@IsString()
@MinLength(8)
@Matches(/^(?=._[a-z])(?=._[A-Z])(?=.\*\d)/, {
message: 'Password must contain uppercase, lowercase, and number'
})
password: string;
}
The declare keyword tells TypeScript "trust me, this property exists" while allowing you to add specific validation for this context.

CQRS: Where This Pattern Really Shines
In Command Query Responsibility Segregation (CQRS) architectures, this clarity becomes essential:

// Commands - what we want to do
export class CreateUserCommand {
constructor(public readonly dto: CreateUserDto) {}
}

export class UpdateUserCommand {
constructor(
public readonly id: string,
public readonly dto: UpdateUserDto
) {}
}

// Queries - what we want to retrieve
export class GetUserQuery {
constructor(public readonly id: string) {}
}

export class GetPublicUserProfileQuery {
constructor(public readonly id: string) {}
}

// Handlers know exactly what they're working with
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
async execute(command: CreateUserCommand): Promise<UserResponseDto> {
// dto is already validated and contains exactly what we need
const { dto } = command;
// ...
}
}
Each handler receives exactly the data it needs, with appropriate validation already applied. No guessing, no “what if this field is undefined?” moments.

Real-World Example: E-commerce Product
Let’s see this in action with a more complex domain:

export class ProductDto {
@IsUUID()
id: string;

@IsString()
@MinLength(1)
name: string;

@IsString()
description: string;

@IsNumber()
@Min(0)
price: number;

@IsString()
category: string;

@IsArray()
@IsString({ each: true })
tags: string[];

@IsNumber()
@Min(0)
stock: number;

@IsBoolean()
isActive: boolean;

@IsArray()
@IsUrl({}, { each: true })
images: string[];

@IsDate()
createdAt: Date;

@IsDate()
updatedAt: Date;
}

// Different contexts, different contracts
export class CreateProductDto extends PickType(ProductDto, [
'name',
'description',
'price',
'category',
'tags',
'stock',
'images'
] as const) {}

export class UpdateProductDto extends PartialType(
PickType(ProductDto, [
'name',
'description',
'price',
'category',
'tags',
'images'
] as const)
) {}

export class UpdateStockDto extends PickType(ProductDto, ['stock'] as const) {}

export class ProductListDto extends PickType(ProductDto, [
'id',
'name',
'price',
'category',
'images'
] as const) {}

export class ProductDetailDto extends OmitType(ProductDto, [
'updatedAt'
] as const) {}
Each DTO tells a story:

CreateProductDto: "To create a product, you need these specific fields"
UpdateStockDto: "Stock updates are a separate concern from general product updates"
ProductListDto: "For listing products, we only need these essential fields"
