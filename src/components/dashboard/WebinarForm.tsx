'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createWebinar, updateWebinar } from '@/lib/firebase';
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';
import { formatDuration } from '@/lib/webinar-state';
import type { Webinar, WebinarFormData } from '@/types';

interface WebinarFormProps {
  webinar?: Webinar;
  mode: 'create' | 'edit';
}

export function WebinarForm({ webinar, mode }: WebinarFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingYouTube, setFetchingYouTube] = useState(false);

  const [formData, setFormData] = useState<WebinarFormData>({
    title: webinar?.title || '',
    youtubeUrl: webinar ? `https://www.youtube.com/watch?v=${webinar.youtubeId}` : '',
    youtubeId: webinar?.youtubeId || '',
    durationSec: webinar?.durationSec || 0,
    scheduleTime: webinar?.scheduleTime || '20:00',
    thumbnailUrl: webinar?.thumbnailUrl || '',
    ctaEnabled: !!webinar?.ctaSettings,
    ctaShowTimeSec: webinar?.ctaSettings?.showTimeSec || 300,
    ctaLabel: webinar?.ctaSettings?.label || '',
    ctaUrl: webinar?.ctaSettings?.url || '',
    loopProtection: webinar?.loopProtection || false,
  });

  // Extract YouTube ID when URL changes
  useEffect(() => {
    const videoId = extractYouTubeId(formData.youtubeUrl);
    if (videoId && videoId !== formData.youtubeId) {
      setFormData((prev) => ({
        ...prev,
        youtubeId: videoId,
        thumbnailUrl: getYouTubeThumbnail(videoId),
      }));
    }
  }, [formData.youtubeUrl]);

  const fetchYouTubeInfo = async () => {
    if (!formData.youtubeId) {
      toast.error('YouTube URLを入力してください');
      return;
    }

    setFetchingYouTube(true);
    try {
      const response = await fetch('/api/youtube-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: formData.youtubeId }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        thumbnailUrl: data.thumbnailUrl || prev.thumbnailUrl,
        durationSec: data.durationSec || prev.durationSec,
      }));

      if (data.needsManualInput) {
        toast.info('動画の長さは手動で入力してください');
      } else {
        toast.success('動画情報を取得しました');
      }
    } catch (error) {
      toast.error('動画情報の取得に失敗しました');
    } finally {
      setFetchingYouTube(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('ログインしてください');
      return;
    }

    if (!formData.youtubeId) {
      toast.error('YouTube URLを入力してください');
      return;
    }

    if (!formData.durationSec || formData.durationSec <= 0) {
      toast.error('動画の長さを入力してください');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        await createWebinar(user.uid, formData);
        toast.success('ウェビナーを作成しました');
      } else if (webinar) {
        await updateWebinar(webinar.id, formData);
        toast.success('ウェビナーを更新しました');
      }
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(mode === 'create' ? '作成に失敗しました' : '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDurationInput = (value: string) => {
    // Parse HH:MM:SS or MM:SS format
    const parts = value.split(':').map(Number);
    let seconds = 0;

    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      seconds = parts[0];
    }

    setFormData((prev) => ({ ...prev, durationSec: seconds }));
  };

  const formatDurationInput = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL *</Label>
            <div className="flex gap-2">
              <Input
                id="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, youtubeUrl: e.target.value }))
                }
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={fetchYouTubeInfo}
                disabled={fetchingYouTube || !formData.youtubeId}
              >
                {fetchingYouTube ? '取得中...' : '情報取得'}
              </Button>
            </div>
            {formData.youtubeId && (
              <p className="text-sm text-gray-500">Video ID: {formData.youtubeId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              type="text"
              placeholder="ウェビナーのタイトル"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">動画の長さ *</Label>
              <Input
                id="duration"
                type="text"
                placeholder="45:00 または 1:30:00"
                value={formData.durationSec > 0 ? formatDurationInput(formData.durationSec) : ''}
                onChange={(e) => handleDurationInput(e.target.value)}
                required
              />
              {formData.durationSec > 0 && (
                <p className="text-sm text-gray-500">{formatDuration(formData.durationSec)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduleTime">毎日の開催時刻 *</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={formData.scheduleTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, scheduleTime: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {formData.thumbnailUrl && (
            <div className="space-y-2">
              <Label>サムネイル</Label>
              <div className="aspect-video max-w-md rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            CTA設定
            <Switch
              checked={formData.ctaEnabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, ctaEnabled: checked }))
              }
            />
          </CardTitle>
        </CardHeader>
        {formData.ctaEnabled && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ctaShowTimeSec">表示タイミング（開始からの秒数）</Label>
              <Input
                id="ctaShowTimeSec"
                type="number"
                min="0"
                value={formData.ctaShowTimeSec || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ctaShowTimeSec: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLabel">ボタンの文言</Label>
              <Input
                id="ctaLabel"
                type="text"
                placeholder="今すぐ申し込む"
                value={formData.ctaLabel}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ctaLabel: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaUrl">リンク先URL</Label>
              <Input
                id="ctaUrl"
                type="url"
                placeholder="https://example.com/apply"
                value={formData.ctaUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, ctaUrl: e.target.value }))}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Other Settings */}
      <Card>
        <CardHeader>
          <CardTitle>その他の設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="loopProtection">再訪問ブロック</Label>
              <p className="text-sm text-gray-500">
                一度視聴したユーザーの再訪問をブロックします
              </p>
            </div>
            <Switch
              id="loopProtection"
              checked={formData.loopProtection}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, loopProtection: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? '保存中...' : mode === 'create' ? '作成する' : '更新する'}
        </Button>
      </div>
    </form>
  );
}
