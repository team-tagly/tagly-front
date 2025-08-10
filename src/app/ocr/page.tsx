'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const OcrPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 90) {
          return oldProgress;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90);
      });
    }, 500);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('OCR 처리 결과:', data);
      setResult(JSON.stringify(data));
      setProgress(100);
    } catch (error) {
      console.error('OCR 처리 실패:', error);
      setResult('OCR 처리 중 오류가 발생했습니다.');
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">OCR 이미지 분석</CardTitle>
          <CardDescription>
            이미지를 업로드하여 텍스트를 추출하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="picture">이미지</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-md"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full"
          >
            {loading ? '분석 중...' : '텍스트 추출'}
          </Button>
          {loading && (
            <Progress value={progress} className="w-full mt-4" />
          )}
          {result && (
            <div className="mt-4 p-4 border rounded bg-gray-100 w-full dark:bg-gray-800">
              <h2 className="text-lg font-semibold">추출된 텍스트</h2>
              <p className="mt-2 whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OcrPage;
