-- SQLite schema for the Touvre registrations

CREATE TABLE IF NOT EXISTS michoui (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  accompte_verser INTEGER NOT NULL DEFAULT 0,
  accompte_montant INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (
    (accompte_verser = 0 AND accompte_montant IS NULL)
    OR (accompte_verser = 1 AND accompte_montant IS NOT NULL AND accompte_montant >= 0)
  )
);

CREATE TABLE IF NOT EXISTS vide_grenier (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  accompte_verser INTEGER NOT NULL DEFAULT 0,
  accompte_montant INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (
    (accompte_verser = 0 AND accompte_montant IS NULL)
    OR (accompte_verser = 1 AND accompte_montant IS NOT NULL AND accompte_montant >= 0)
  )
);
