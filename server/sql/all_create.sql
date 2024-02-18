select * from users
select * from refresh_sessions
-- truncate refresh_sessions
-- truncate users
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- create domain "emailType" varchar(200) not null check (value ~ $$^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$$);
-- create domain "roleType" varchar(20) not null check (value in ('user', 'admin', 'moder'))
-- drop domain email_type cascade


insert into users values(default, 'max', 'Hashed1', 'uniq_email@google.com')

create table users(
	"id" uuid primary key default uuid_generate_v4(),
	"nickname" varchar(100) not null,
	"email" "emailType" unique,
-- 	"regDate" timestamp without time zone default NOW(),
	"role" "roleType" default 'user',
	"hashed" varchar(300) not null
);


-- alter table users add column role varchar(20) not null default 'user'
create table refresh_sessions(
	"id" serial primary key,
	"userId" int not null references users(id) on delete cascade,
	"refreshToken" varchar(400) not null,
	"startTime" timestamp without time zone default now(),
	"expireTime" timestamp without time zone not null,
	"fingerprint" varchar(32) not null,
	"isRevoked" boolean not null
)

create table categories(
	"subId" serial primary key,
	"type" varchar(100) not null,
	"description" text not null default '-'
);
-- thread - группа тем близких по цели/смыслу
-- lastTopic could be null
create table forum_threads(
	"threadId" serial primary key,
	"type" varchar(100) not null,
	"description" text not null default 'default rules'
);

create table topics(
	"topicId" uuid primary key default uuid_generate_v4(),
	"name" varchar(200) not null,
	"threadId" int not null,
	"topicStarterId" int not null,
	"lastUserPostId" int not null,
	"lastActivity" timestamp without time zone default now(),
	"messCount" int default 1,
	constraint fk_threads_1N foreign key ("threadId") references forum_threads("threadId"),
	constraint fk_users_opener_11 foreign key("topicStarterId") references users(id),
	constraint fk_users_last_11 foreign key("lastUserPostId") references users(id)
);
-- 
-- posts should be redone
create table posts(
	"postId" uuid primary key default uuid_generate_v4(),
	"postDate" timestamp without time zone not null default now(),
	"body" text not null,
	"topicId" uuid not null,
	"userId" int not null,
	"parentId" uuid,
	constraint fk_users_1N foreign key ("userId") references users(id),
	constraint fk_topics_1N foreign key ("topicId") references topics("topicId")
);

-- drop table refresh_sessions
create unique index user_id_hashidx on refresh_sessions("userId")
create index refresh_token_btreeidx on refresh_sessions("refreshToken")


-- create table test(
-- 	id serial primary key,
-- 	name varchar(50)
-- )
-- insert into test values(default, 'qwerasdf')
-- select * from test