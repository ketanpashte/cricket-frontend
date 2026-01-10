import React, { useState } from 'react';
import { Button, CircularProgress, Alert, Stack, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

type ImportCsvProps = {
  importUrl: string;
  onImportSuccess?: () => void;
};

const ImportCsvButton: React.FC<ImportCsvProps> = ({ importUrl, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(importUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Import failed');
      }

      setSuccess('CSV imported successfully!');
      onImportSuccess?.();
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1} alignItems="center" sx={{ minWidth: 280 }}>
      <input
        id="csv-file-input"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Stack direction="row" spacing={1} alignItems="center" width="100%">
        <label htmlFor="csv-file-input" style={{ flexGrow: 1 }}>
          <Button fullWidth variant="outlined" component="span" startIcon={<UploadFileIcon />}>
            Select CSV File
          </Button>
        </label>

        <Button
          variant="contained"
          color="primary"
          disabled={!file || loading}
          onClick={handleUpload}
          sx={{ whiteSpace: 'nowrap', minWidth: 120 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Import CSV'}
        </Button>
      </Stack>

      {file && (
        <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-word' }}>
          Selected file: {file.name}
        </Typography>
      )}

      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>}
    </Stack>
  );
};

export default ImportCsvButton;
