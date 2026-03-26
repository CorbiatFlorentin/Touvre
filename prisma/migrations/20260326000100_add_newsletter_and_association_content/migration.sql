-- Create newsletter storage
CREATE TABLE "newsletter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published_at" DATETIME NOT NULL,
    "images_json" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create association content singleton
CREATE TABLE "association_content" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create association members
CREATE TABLE "association_member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "association_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image_data_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "association_member_association_id_fkey"
      FOREIGN KEY ("association_id") REFERENCES "association_content" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "association_member_association_id_sort_order_idx"
ON "association_member"("association_id", "sort_order");

INSERT INTO "association_content" ("id", "body", "updated_at")
VALUES (1, '', CURRENT_TIMESTAMP);
