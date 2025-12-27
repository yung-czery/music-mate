/*
  Warnings:

  - A unique constraint covering the columns `[spotifyId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,spotifyId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "spotifyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "Playlist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_userId_spotifyId_key" ON "Playlist"("userId", "spotifyId");
