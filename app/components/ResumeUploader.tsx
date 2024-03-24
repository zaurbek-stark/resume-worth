import React, { useState } from 'react';
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
import styles from '../styles/ResumeUploader.module.css';
import { MdCloudUpload } from "react-icons/md";

type Props = {
  setResumeText: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ResumeUploader: React.FC<Props> = ({ setResumeText, setIsLoading }) => {
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const mergeTextContent = (textContent: TextContent) => {
    return textContent.items
      .map((item) => {
        const { str, hasEOL } = item as TextItem;
        return str + (hasEOL ? '\n' : '');
      })
      .join('');
  };

  const readResume = async (pdfFile: File | undefined) => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    if (!pdfFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
        const loadingTask = pdfjs.getDocument(new Uint8Array(arrayBuffer));
        loadingTask.promise.then(
          (pdfDoc) => {
            pdfDoc.getPage(1).then((page) => {
              page.getTextContent().then((textContent) => {
                const extractedText = mergeTextContent(textContent);
                setResumeText(extractedText);
              });
            });
          },
          (reason) => {
            console.error(`Error during PDF loading: ${reason}`);
          }
        );
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setResumeText('');
    setError('');
    setIsLoading(true);

    try {
      const items = event.dataTransfer.items;

      if (!items || items.length !== 1) {
        throw new Error('Please drop a single file.');
      }
      const item = items[0];

      if (item.kind !== 'file' || item.type !== 'application/pdf') {
        throw new Error('Please drop a single PDF file.');
      }
      const file = item.getAsFile();

      if (!file) {
        throw new Error("The PDF wasn't uploaded correctly.");
      }
      await readResume(file);
    } catch (error) {
      setError('There was an error reading the resume. Please try again.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleButtonUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setIsLoading(true);
    setResumeText('');

    try {
      const file = event.target.files?.[0];
      if (!file) {
        setError("The PDF wasn't uploaded correctly.");
        setIsLoading(false);
        return;
      }
      await readResume(file);
    } catch (error) {
      setError('There was an error reading the resume. Please try again.');
    }
  };

  return (
    <div>
      <div
        className={`${styles.fileUploadBtnContainer} ${isDragOver ? styles.dragOver : ''}`}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e)}
      >
        <input
          type="file"
          id="file-upload"
          onChange={handleButtonUpload}
          accept="application/pdf"
          hidden
        />
        <label htmlFor="file-upload" className={`${styles.label} ${styles.mainBtn}`}>
          <MdCloudUpload /> Upload resume
        </label>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default ResumeUploader;