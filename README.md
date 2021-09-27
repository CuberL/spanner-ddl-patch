# Spanner DDL patch file generator

A tool to generate ddl base on source ddl and destination ddl. It can calculate difference and generate ddl.

## Usage

Prepare a src.ddl

```sql
CREATE TABLE users (
    user_id STRING(32),
    name STRING(MAX),
    age INT64,
    sex STRING(8)
) PRIMARY KEY (user_id);

```

Prepare a dst.ddl
```sql
CREATE TABLE users (
    user_id STRING(32),
    name STRING(1024),
    sex STRING(8),
    avatar STRING(MAX)
) PRIMARY KEY (user_id);
```

Then install and run the tool

``` shell
yarn global add spanner-ddl-patch
spanner-ddl-patch --src ./src.ddl --dst ./dst.ddl
```

Output: 
``` sql
alter table users add column avatar string(max);
alter table users alter column name string(1024);
alter table drop column age;
```

## Known issues
- Do not support to patch the options