'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { deleteWebinar } from '@/lib/firebase';
import { generateEmbedCode, getAppDomain } from '@/lib/embed-code';
import { formatDuration } from '@/lib/webinar-state';
import type { Webinar } from '@/types';

interface WebinarCardProps {
  webinar: Webinar;
  onDelete?: () => void;
}

export function WebinarCard({ webinar, onDelete }: WebinarCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const thumbnailUrl =
    webinar.thumbnailUrl ||
    `https://img.youtube.com/vi/${webinar.youtubeId}/hqdefault.jpg`;

  const embedCode = generateEmbedCode(webinar.id, undefined, webinar.youtubeId);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteWebinar(webinar.id);
      toast.success('ウェビナーを削除しました');
      onDelete?.();
    } catch (error) {
      toast.error('削除に失敗しました');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success('埋め込みコードをコピーしました');
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={thumbnailUrl}
            alt={webinar.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {webinar.scheduleTime} 開始
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-2">{webinar.title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            動画時間: {formatDuration(webinar.durationSec)}
          </p>

          <div className="grid grid-cols-2 sm:flex gap-2 sm:flex-wrap">
            <Link href={`/webinars/${webinar.id}/edit`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                編集
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setShowEmbedDialog(true)} className="w-full sm:w-auto text-xs sm:text-sm">
              埋め込み
            </Button>
            <Link href={`/watch/${webinar.id}?preview=true`} target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                プレビュー
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 w-full sm:w-auto text-xs sm:text-sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              削除
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">ウェビナーを削除</DialogTitle>
            <DialogDescription className="text-sm">
              「{webinar.title}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="w-full sm:w-auto">
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="w-full sm:w-auto">
              {deleting ? '削除中...' : '削除する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Code Dialog */}
      <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl mx-auto max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">埋め込みコード</DialogTitle>
            <DialogDescription className="text-sm">
              以下のコードをウェブサイトに貼り付けてください
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-hidden">
            <pre className="bg-gray-100 p-3 sm:p-4 rounded-lg overflow-auto text-xs sm:text-sm whitespace-pre-wrap break-all max-h-40 sm:max-h-48">
              <code>{embedCode}</code>
            </pre>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEmbedDialog(false)} className="w-full sm:w-auto">
              閉じる
            </Button>
            <Button onClick={handleCopyEmbed} className="w-full sm:w-auto">コピー</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
