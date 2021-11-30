
import {Spanner} from '@google-cloud/spanner';
import { ExecuteSqlRequest } from '@google-cloud/spanner/build/src/transaction';
import { DDLParsed } from './cli';
import * as _ from 'lodash'


export const loadTableSchema = async (project_id: string, instance_name: string, database_name: string): Promise<Array<DDLParsed>> => {
    const instance = new Spanner({
        projectId: project_id,
    }).instance(instance_name)

    const query: ExecuteSqlRequest = {
        sql: `SELECT * FROM information_schema.columns`
    }

    const [column_rows] = await instance.database(database_name).run(query);

    const column_rows_json = column_rows.map(column_row => column_row.toJSON());

    const colums_group_by_table = _.groupBy(column_rows_json, row => row.TABLE_NAME);

    return _.toPairs(colums_group_by_table).map(([table_name, rows]) => ({
        table_name,
        column_defs: rows.map(row => ({
            name: row.COLUMN_NAME,
            type: row.SPANNER_TYPE
        }))
    }))
};