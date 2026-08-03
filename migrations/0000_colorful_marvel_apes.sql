CREATE TABLE `CarPhoto` (
	`id` text PRIMARY KEY NOT NULL,
	`carId` text NOT NULL,
	`url` text NOT NULL,
	`key` text NOT NULL,
	`orden` integer DEFAULT 0 NOT NULL,
	`portada` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Car` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`nombre` text NOT NULL,
	`marca` text,
	`anio` integer,
	`precio` integer,
	`kilometraje` integer,
	`transmision` text,
	`combustible` text,
	`color` text,
	`descripcion` text,
	`tipo` text,
	`destacado` integer DEFAULT false NOT NULL,
	`activo` integer DEFAULT true NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Car_slug_unique` ON `Car` (`slug`);--> statement-breakpoint
CREATE TABLE `ContactMessage` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`apellido` text NOT NULL,
	`email` text NOT NULL,
	`asunto` text NOT NULL,
	`mensaje` text NOT NULL,
	`leido` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hashedPassword` text NOT NULL,
	`name` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);