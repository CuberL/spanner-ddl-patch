# Spanner DDL patch file generator

[![Build Status](https://img.shields.io/travis/cuberl/spanner-ddl-patch)](https://travis-ci.org/CuberL/spanner-ddl-patch)
[![License](https://img.shields.io/github/license/cuberl/spanner-ddl-patch?color=blue)](https://github.com/CuberL/spanner-ddl-patch/blob/master/LICENSE)
[![Version](https://img.shields.io/npm/v/spanner-ddl-patch)](https://www.npmjs.com/package/spanner-ddl-patch)

A tool to generate ddl base on source ddl and destination ddl. It can calculate difference and generate ddl.

## Usage - Fetch information from spanner directly

After v0.1.0, You can fetch table schema from spanner directly.

You need to login by gcloud to get the credentials first:

``` shell
gcloud auth login
```

Then you can compare the whole database `(${project_id}.${instance_id}.${database})`

``` shell
spanner-ddl-patch --mode db --src product_project_id.product_instance_id.product_database --dst testing_product_id.testing_instance_id.testing_database
```



## Usage - By DDL

Prepare a src.sql

```sql
CREATE TABLE users (
    user_id STRING(32),
    name STRING(MAX),
    age INT64,
    sex STRING(8)
) PRIMARY KEY (user_id);

```

Prepare a dst.sql
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
spanner-ddl-patch --src ./src.sql --dst ./dst.sql --mode ddl
```

Output: 
``` sql
alter table users add column avatar string(max);
alter table users alter column name string(1024);
alter table users drop column age;
```

## Known issues
- Do not support to patch the options
- Do not support to create/drop tables
