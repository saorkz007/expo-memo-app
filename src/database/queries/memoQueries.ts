// メモテーブル作成
const CreateTableMemos = `
CREATE TABLE IF NOT EXISTS memos (
  id            TEXT,
  label_id      INTEGER,
  title         TEXT        NOT NULL,
  content       TEXT,
  created_at    TEXT        DEFAULT (DATETIME('now','localtime')),
  updated_at    TEXT        DEFAULT (DATETIME('now','localtime')),
  PRIMARY KEY(id),
  FOREIGN KEY(label_id)     REFERENCES labels(id)
);
`;

// メモ一覧取得
const SelectMemos = `
SELECT
  m.id,
  m.label_id,
  m.title,
  m.content,
  m.created_at,
  m.updated_at,
  l.name,
  l.color
FROM
  memos m
LEFT JOIN
  labels l
ON
  m.label_id = l.id
ORDER BY
  m.updated_at DESC
`;

// メモIDを指定してメモ取得
const SelectMemoTargetId = `
SELECT
  id,
  label_id,
  title,
  content,
  created_at,
  updated_at
FROM
  memos
WHERE
  id = ?
`;

// メモ追加
const InsertMemos = `
INSERT INTO memos (id, title, content) VALUES (?, ?, ?);
`;

// メモ更新
const UpdateMemo = `
UPDATE
  memos
SET
  title = ?,
  content = ?,
  updated_at = (DATETIME('now','localtime'))
WHERE
  id = ?
`;

// メモ削除
const DeleteMemo = `
DELETE FROM
  memos
WHERE
  id = ?
`;

// ラベル削除時に、削除されたラベルに紐づくメモのラベルIDをNULLに更新する
// ※ メモの並び順を更新したくない場合は、updated_atを更新するのは辞める
const UpdateMemoTargetLabelIdToNull = `
UPDATE
  memos
SET
  label_id = NULL,
  updated_at = (DATETIME('now','localtime'))
WHERE
  label_id = ?
`;

// メモのラベルIDを更新
const UpdateMemoLabelIdById = `
UPDATE
  memos
SET
  label_id = ?,
  updated_at = (DATETIME('now','localtime'))
WHERE
  id = ?
`;

// メモのラベルIDをNULLに更新
const UpdateMemoLabelIdToNullById = `
UPDATE
  memos
SET
  label_id = NULL,
  updated_at = (DATETIME('now','localtime'))
WHERE
  id = ?
`;

const memoQueries = Object.freeze({
  CREATE_TABLE: CreateTableMemos,
  SELECT_MEMOS: SelectMemos,
  SELECT_MEMO_TARGET_ID: SelectMemoTargetId,
  INSERT: InsertMemos,
  UPDATE: UpdateMemo,
  DELETE: DeleteMemo,
  UPDATE_MEMO_TARGET_LABEL_ID_TO_NULL: UpdateMemoTargetLabelIdToNull,
  UPDATE_MEMO_LABEL_ID_BY_ID: UpdateMemoLabelIdById,
  UPDATE_MEMO_LABEL_ID_TO_NULL_BY_ID: UpdateMemoLabelIdToNullById
});

export { memoQueries };
