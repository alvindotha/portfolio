-- Posts and projects now share one likes table and one views table.
--
-- Widened in place rather than replaced, so every existing post like and view
-- survives untouched: post_id simply becomes nullable and project_id is added
-- beside it. Exactly one of the two is set on any row, enforced by a CHECK
-- (Prisma has no syntax for it, so it lives here).
--
-- Postgres treats NULLs as distinct in a unique index, so (post_id, ip) and
-- (project_id, ip) coexist without colliding: a project like has post_id NULL
-- and never competes for the post uniqueness.

ALTER TABLE "likes" ALTER COLUMN "post_id" DROP NOT NULL;
ALTER TABLE "likes" ADD COLUMN "project_id" INTEGER;
ALTER TABLE "likes" ADD CONSTRAINT "likes_project_id_fkey"
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "likes_project_id_ip_address_key" ON "likes"("project_id", "ip_address");
CREATE INDEX "likes_project_id_idx" ON "likes"("project_id");
ALTER TABLE "likes" ADD CONSTRAINT "likes_exactly_one_subject"
  CHECK (num_nonnulls("post_id", "project_id") = 1);

ALTER TABLE "views" ALTER COLUMN "post_id" DROP NOT NULL;
ALTER TABLE "views" ADD COLUMN "project_id" INTEGER;
ALTER TABLE "views" ADD CONSTRAINT "views_project_id_fkey"
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "views_project_id_ip_address_key" ON "views"("project_id", "ip_address");
CREATE INDEX "views_project_id_idx" ON "views"("project_id");
ALTER TABLE "views" ADD CONSTRAINT "views_exactly_one_subject"
  CHECK (num_nonnulls("post_id", "project_id") = 1);
