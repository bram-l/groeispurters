'use client';

import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Name } from '@/domain/name';
import { getMilkPerDay, parseLine } from '@/domain/milk';
import { Button } from '@/components/button';
import { Data } from '../../data/kv/data';
import { serialize } from '@/data/kv/serialize';
import { useRouter } from 'next/navigation';
import { Guard } from '../auth';

const allowedFileType = 'text/plain';

export type OnSelect = (data: Data) => void;

export const UploadForm = () => {
  const [bette, setBette] = useState<Data | undefined>();
  const [elsie, setElsie] = useState<Data | undefined>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onClick = () => {
    console.log('click', {
      elsie,
      bette,
    });

    if (loading || !bette || !elsie) return;

    setLoading(true);

    const data = {
      bette: serialize(bette),
      elsie: serialize(elsie),
    };

    fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(async (res) => {
        const message = await res.text();
        console.log(res.status, message);
        router.push('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Guard>
        <div>
          <h2>Select files</h2>
          <Input name="bette" onSelect={(data) => setBette(data)} />
          <Input name="elsie" onSelect={(data) => setElsie(data)} />
          <Button disabled={!bette || !elsie} onClick={onClick}>
            Upload
          </Button>
        </div>
      </Guard>
    </>
  );
};

const Input: FC<{
  name: Name;
  onSelect: OnSelect;
}> = ({ name, onSelect }) => {
  const { setFile } = useParser(onSelect);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== allowedFileType) {
      alert(`Invalid file type: ${file.type}, expected ${allowedFileType}`);
      return;
    }

    setFile(file);
  };

  return (
    <div style={{ margin: '16px 0' }}>
      <label htmlFor={name}>
        <h4>{name.toUpperCase()}</h4>
        <input name={name} type="file" accept=".txt" onChange={onChange} />
      </label>
    </div>
  );
};

function useParser(onSelect: OnSelect) {
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (!file) return;

    let isCancelled = false;
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const text = e.target?.result;

      if (typeof text !== 'string' || isCancelled) return;

      const result = parseText(text);

      return onSelect(result);
    };

    fileReader.readAsText(file);

    return () => {
      isCancelled = true;

      if (fileReader?.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file, onSelect]);

  return { setFile };
}

function parseText(input: string) {
  const lines = input
    .split(/\n/)
    .filter((line) => !!line.trim())
    .map(parseLine);

  const milk = getMilkPerDay(lines);

  return { milk };
}
