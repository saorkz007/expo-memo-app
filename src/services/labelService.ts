import { execute, fetch } from '../database/dbService';
import { labelQueries } from '../database/queries/labelQueries';
import { type Label } from '../types/label';
import { type Memo } from '../types/memo';
import { type LabelSchema } from '../database/schemas/labelSchema';
import { memoQueries } from '../database/queries/memoQueries';

// ラベルテーブル作成
const createTable = async () => {
  await execute({ sql: labelQueries.CREATE_TABLE });
};

// ラベル一覧取得
const getLabels = async (): Promise<Label[]> => {
  const rows = await fetch<LabelSchema>({ sql: labelQueries.SELECT_LABELS });
  const labels = rows.map((row): Label => {
    return {
      id: row.id,
      name: row.name,
      color: row.color
    };
  });
  return labels;
};

// ラベル単体取得
const getLabel = async (labelId: number): Promise<Label | undefined> => {
  // ラベルを取得する
  const rows = await fetch<LabelSchema>({ sql: labelQueries.SELECT_LABEL_TARGET_ID, params: [labelId] });

  if (rows.length === 0) {
    return undefined;
  }
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    color: row.color
  };
};

// ラベル追加
const addLabel = async (name: string, color: string) => {
  await execute({ sql: labelQueries.INSERT, params: [name, color] });
};

// ラベル修正
const editLabel = async (id: number, name: string, color: string) => {
  await execute({ sql: labelQueries.UPDATE, params: [name, color, id] });
};

// ラベル削除
// ※ sqlがどちらかが失敗したらロールバックされる
const deleteLabel = async (id: number) => {
  await execute({ sql: labelQueries.DELETE, params: [id] }, { sql: memoQueries.UPDATE_MEMO_TARGET_LABEL_ID_TO_NULL, params: [id] });
};

const resetSequence = async () => {
  await execute({ sql: labelQueries.RESET_SEQUENCE });
};

export { createTable, getLabels, getLabel, addLabel, editLabel, deleteLabel, resetSequence };
