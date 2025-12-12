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

  const embedCode = generateEmbedCode(webinar.id);

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
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{webinar.title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            動画時間: {formatDuration(webinar.durationSec)}
          </p>

          <div className="flex gap-2 flex-wrap">
            <Link href={`/webinars/${webinar.id}/edit`}>
              <Button variant="outline" size="sm">
                編集
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setShowEmbedDialog(true)}>
              埋め込みコード
            </Button>
            <Link href={`/watch/${webinar.id}?preview=true`} target="_blank">
              <Button variant="outline" size="sm">
                プレビュー
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
            >
              削除
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ウェビナーを削除</DialogTitle>
            <DialogDescription>
              「{webinar.title}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? '削除中...' : '削除する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Code Dialog */}
      <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>埋め込みコード</DialogTitle>
            <DialogDescription>
              以下のコードをウェブサイトに貼り付けてください
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-all">
              <code>{embedCode}</code>
            </pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmbedDialog(false)}>
              閉じる
            </Button>
            <Button onClick={handleCopyEmbed}>コピー</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
