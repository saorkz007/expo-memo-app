const CreateTableLabels = `
CREATE TABLE IF NOT EXISTS labels (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  color         TEXT    NOT NULL,
  created_at    TEXT    DEFAULT (DATETIME('now','localtime')),
  updated_at    TEXT    DEFAULT (DATETIME('now','localtime'))
);
`;

// ラベル一覧取得
const SelectLabels = `
  SELECT
    id,
    name,
    color,
    created_at,
    updated_at
  FROM
    labels
  ORDER BY
    created_at ASC;
`;

// ラベル単体取得
const SelectLabelTargetId = `
  SELECT
    id,
    name,
    color,
    created_at,
    updated_at
  FROM
    labels
  WHERE
    id = ?
`;

// ラベル追加
const InsertLabel = `
  INSERT INTO labels (
    name,
    color
  ) VALUES (
    ?,
    ?
  );
`;

// ラベル更新
const UpdateLabel = `
  UPDATE
    labels
  SET
    name = ?,
    color = ?,
    updated_at = (DATETIME('now','localtime'))
  WHERE
    id = ?
`;

// ラベル削除
const DeleteLabel = `
  DELETE FROM
    labels
  WHERE
    id = ?;
`;

// ラベルIDのシーケンスをリセット
const ResetSequence = `
  UPDATE
    sqlite_sequence
  SET
    seq = 0
  WHERE
    name = 'labels'
`;

const labelQueries = Object.freeze({
  CREATE_TABLE: CreateTableLabels,
  SELECT_LABELS: SelectLabels,
  SELECT_LABEL_TARGET_ID: SelectLabelTargetId,
  INSERT: InsertLabel,
  UPDATE: UpdateLabel,
  DELETE: DeleteLabel,
  RESET_SEQUENCE: ResetSequence
});

export { labelQueries };
