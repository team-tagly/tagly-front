import React, { useEffect, useState } from 'react';

interface ResponseType {
  text: string;
}

const ServicePage = () => {
  const [sessionId] = useState<string>(crypto.randomUUID());
  const [results, setResults] = useState<ResponseType[]>([]);

  // 1) 컴포넌트 마운트 시 SSE 연결
  useEffect(() => {
    const es = new EventSource(`/api/images/stream/connect/${sessionId}`);
    es.onmessage = (e) => setResults((prev) => [...prev, JSON.parse(e.data)]);
    return () => es.close();
  }, [sessionId]);

  // 2) 파일 선택 시 업로드 및 처리 트리거
  const onUpload = async (e) => {
    const form = new FormData();
    Array.from(e.target.files).forEach((f) => form.append('files', f));
    form.append('sessionId', sessionId);

    const res = await fetch('/api/images/upload-and-process', {
      method: 'POST',
      body: form,
    });
    const body = await res.json();
    console.log('처리 시작:', body);
  };

  return (
    <div>
      <input type="file" multiple onChange={onUpload} />
      <ul>
        {results.map((r, i) => (
          <li key={i}>{r.text || r}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServicePage;
