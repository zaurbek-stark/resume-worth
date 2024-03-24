import React, { useEffect, useState } from 'react';
import ResumeUploader from './ResumeUploader';
import ResumeWorth from './ResumeWorth';
import styles from '../styles/ResumeAnalyzerApp.module.css';
import { useCompletion } from 'ai/react';

const ResumeAnalyzerApp = () => {
  const [showWorth, setShowWorth] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const { completion, isLoading, complete, error } = useCompletion({
    api: '/api/resume',
  });

  useEffect(() => {
    const getResumeWorth = async (text: string) => {
      const messageToSend = `RESUME: ${text}\n\n-------\n\n`;
      await complete(messageToSend);
      setShowWorth(true);
      setIsLoadingResume(false);
    };

    if (resumeText !== '') {
      getResumeWorth(resumeText).then();
    }
  }, [resumeText]);

  return (
    <div className={styles.analyzerWrapper}>
      {!showWorth ? (
        <div className={styles.uploaderWrapper}>
          <p className={styles.instructionsText}>Upload your resume to know your worth.</p>
          <ResumeUploader setIsLoading={setIsLoadingResume} setResumeText={setResumeText} />
          {(isLoadingResume || isLoading) && 
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
            </div>}
        </div>
      ) : (
        <ResumeWorth resumeWorth={completion} />
      )}
      {error && <p className={styles.errorMessage}>{error.message}</p>}
     
    </div>
  );
};

export default ResumeAnalyzerApp;