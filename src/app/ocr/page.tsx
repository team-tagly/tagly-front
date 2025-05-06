'use client';
import { useState } from 'react';
import axios from 'axios';

const OcrPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
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
    try {
      const response = await axios.post(
        'http://localhost:8080/api/ocr/extract-text',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setResult(response.data.text);
    } catch (error) {
      console.error('OCR 처리 실패:', error);
      setResult('OCR 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">OCR 테스트</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? '처리 중...' : 'OCR 실행'}
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-100 w-full max-w-lg">
          <h2 className="text-lg font-semibold">OCR 결과</h2>
          <p className="mt-2">{result}</p>
        </div>
      )}
    </div>
  );
};

export default OcrPage;
