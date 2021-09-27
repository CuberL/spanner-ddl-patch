#!/usr/bin/env node

import * as path from 'path'
import * as fs from 'fs'
import { parse } from './parser/parser.gen'
import * as _ from 'lodash'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

type DDLParsed = {
    table_name: string
    column_defs: Array<{
        name: string
        type: string
    }>,
    primary_key: string
}

type CmdOptions = {
    src: string
    dst: string
}

const main = () => {
    // @ts-ignore
    const argv: CmdOptions = yargs(hideBin(process.argv)).argv
    
    const src_path_full = path.resolve(process.cwd(), argv.src);
    const dst_path_full = path.resolve(process.cwd(), argv.dst);

    const src_ddl = fs.readFileSync(src_path_full).toString();
    const dst_ddl = fs.readFileSync(dst_path_full).toString();

    const src_ddl_parsed: DDLParsed = parse(src_ddl);
    const dst_ddl_parsed: DDLParsed = parse(dst_ddl);

    if (src_ddl_parsed.table_name !== dst_ddl_parsed.table_name) {
        throw new Error('Table names are not the same.')
    }

    const src_columns = src_ddl_parsed.column_defs.map(column => ({
        type: column.type.toLowerCase(),
        name: column.name.toLowerCase()
    }))
    const dst_columns = dst_ddl_parsed.column_defs.map(column => ({
        type: column.type.toLowerCase(),
        name: column.name.toLowerCase()
    }))

    const missing_columns = dst_columns.filter(dst_column => _.isNil(src_columns.find(src_column => src_column.name === dst_column.name)))
    const redundant_columns = src_columns.filter(src_column => _.isNil(dst_columns.find(dst_column => dst_column.name === src_column.name)))
    const changed_columns = dst_columns.filter(dst_column => {
        const same_name_column = src_columns.find(src_column => src_column.name === dst_column.name);
        if (!same_name_column) {
            return false
        }
        return same_name_column.type !== dst_column.type
    })

    const missing_column_ddls = missing_columns.map(column => {
        return `alter table ${dst_ddl_parsed.table_name} add column ${column.name} ${column.type};`
    })


    const changed_column_ddls = changed_columns.map(column => {
        return `alter table ${dst_ddl_parsed.table_name} alter column ${column.name} ${column.type};`
    })

    const redundant_column_ddls = redundant_columns.map(column => {
        return `alter table drop column ${column.name};`
    });

    process.stdout.write([
        ...missing_column_ddls,
        ...changed_column_ddls,
        ...redundant_column_ddls
    ].join('\n'))
}

main()