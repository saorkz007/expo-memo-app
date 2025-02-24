import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
// import { DatabaseConnection } from './databaseConnection';

export type SqlArg = {
  sql: string;
  params?: (string | number)[];
};

const DB_NAME = 'MemoApp.db';

/**
 * DBパス取得
 */
const getDbFilePath = () => {
  const path = FileSystem.documentDirectory + 'SQLite' + '/' + DB_NAME;
  return path;
};

/**
 * 実行系SQL処理
 */
const execute = async <T>(...sqlArgs: SqlArg[]): Promise<void> => {
  // <T>特定の型を指定しない為
  // データベースを開く
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // トランザクションを使ってSQLを実行する
  await db.withTransactionAsync(async () => {
    for (const arg of sqlArgs) {
      const { sql, params } = arg;
      try {
        // SQL実行
        await db.runAsync(sql, ...(params || []));
      } catch (error) {
        console.error('sqlの実行に失敗しました', error);
        throw error;
      }
    }
  });
};

/**
 * 取得系SQL処理
 */
const fetch = async <T>(sqlArg: SqlArg): Promise<T[]> => {
  // <T>特定の型を指定しない為
  // データベースを開く
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  const { sql, params } = sqlArg;

  try {
    const allRows = await db.getAllAsync<T>(sql, ...(params || []));
    return allRows;
  } catch (error) {
    console.error('sqlの実行に失敗しました', error);
    throw error;
  }
};

export { execute, fetch, getDbFilePath };
