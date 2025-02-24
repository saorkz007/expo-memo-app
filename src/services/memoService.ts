import { execute, fetch } from '../database/dbService';
import { memoQueries } from '../database/queries/memoQueries';
import * as Crypto from 'expo-crypto'; //uuid生成してくれるライブラリ
import { type Memo } from '../types/memo';
import { MemoSchema } from '../database/schemas/memoSchema';
import { type SqlArg } from '../database/dbService';

// メモテーブル作成
const createTable = async () => {
  await execute({ sql: memoQueries.CREATE_TABLE });
};

// メモ一覧取得
const getMemos = async (): Promise<Memo[]> => {
  const rows = await fetch<MemoSchema>({ sql: memoQueries.SELECT_MEMOS });
  // フロントのメモ型に変換する
  const memos = rows.map((row): Memo => {
    return {
      id: row.id,
      title: row.title,
      content: row.content || '',
      labelId: row.label_id || undefined
    };
  });
  return memos;
};

// メモ単体取得
const getMemo = async (memoId: string): Promise<Memo | undefined> => {
  const rows = await fetch<MemoSchema>({ sql: memoQueries.SELECT_MEMO_TARGET_ID, params: [memoId] });

  if (rows.length === 0) {
    return undefined;
  }
  // フロントのメモ型に変換する
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content || '',
    labelId: row.label_id || undefined
  };
};

// メモ作成
const addMemo = async (labelId: number | undefined, title: string, content: string) => {
  const memoId = Crypto.randomUUID();
  let queries: SqlArg[] = [];

  queries.push({ sql: memoQueries.INSERT, params: [memoId, title, content] });

  // ラベルIDが指定されていたら、メモのラベルIDを更新する
  if (labelId !== undefined) {
    queries.push({ sql: memoQueries.UPDATE_MEMO_LABEL_ID_BY_ID, params: [labelId, memoId] });
  }
  await execute(...queries);
};

// メモ更新
const editMemo = async (memoId: string, title: string, content: string) => {
  await execute({ sql: memoQueries.UPDATE, params: [title, content, memoId] }); // SQLパラメータの順番通りにしなきゃいけない
};

// メモ削除
const deleteMemo = async (memoId: string) => {
  await execute({ sql: memoQueries.DELETE, params: [memoId] });
};

// メモのラベルIDを更新
const setLabel = async (memoId: string, labelId: number | undefined) => {
  if (labelId === undefined) {
    // メモからラベルを削除する
    await execute({ sql: memoQueries.UPDATE_MEMO_LABEL_ID_TO_NULL_BY_ID, params: [memoId] });
    return;
  } else {
    // メモのラベルを更新する
    await execute({ sql: memoQueries.UPDATE_MEMO_LABEL_ID_BY_ID, params: [labelId, memoId] });
  }
};

export { createTable, getMemos, getMemo, addMemo, editMemo, deleteMemo, setLabel };
