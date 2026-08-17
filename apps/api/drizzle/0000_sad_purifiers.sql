CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`type_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deep_search_types` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	CONSTRAINT `deep_search_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `deep_search_types_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `investor_category_scores` (
	`investor_id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`relevance_score` double NOT NULL,
	`source_url` varchar(2048) NOT NULL,
	`source_type` varchar(255) NOT NULL,
	`extracted_at` timestamp NOT NULL DEFAULT (now()),
	`verified` boolean NOT NULL DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `investors` (
	`id` varchar(36) NOT NULL,
	`firm_name` varchar(255) NOT NULL,
	`contact_name` varchar(255),
	`role` varchar(255),
	`stage_focus` json NOT NULL,
	`check_size_min` int,
	`check_size_max` int,
	`website` varchar(2048),
	`linkedin_url` varchar(2048),
	`notes` text,
	CONSTRAINT `investors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_runs` (
	`id` varchar(36) NOT NULL,
	`type_id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`keywords` text,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`started_at` timestamp,
	`completed_at` timestamp,
	CONSTRAINT `search_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_type_id_deep_search_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `deep_search_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investor_category_scores` ADD CONSTRAINT `investor_category_scores_investor_id_investors_id_fk` FOREIGN KEY (`investor_id`) REFERENCES `investors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `investor_category_scores` ADD CONSTRAINT `investor_category_scores_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `search_runs` ADD CONSTRAINT `search_runs_type_id_deep_search_types_id_fk` FOREIGN KEY (`type_id`) REFERENCES `deep_search_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `search_runs` ADD CONSTRAINT `search_runs_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;