import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

type ExportCsvButtonProps = {
    url: string;
    filename?: string;
    children?: React.ReactNode;
    startIcon?: React.ReactNode;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
};

const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({
    url,
    filename = 'data.csv',
    children = 'Export CSV',
    startIcon = <DownloadIcon />,
    variant = 'contained',
    color = 'primary',
}) => {
    const handleExport = () => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={handleExport} startIcon={startIcon} variant={variant} color={color}>
            {children}
        </Button>
    );
};

export default ExportCsvButton;
