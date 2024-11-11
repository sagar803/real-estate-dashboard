//@ts-nocheck

import { FileUp } from 'lucide-react';
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import PropertySchemaDialog from './property-schema-dialog';

const CsvUpload: React.FC = ({csvFile, setCsvFile}) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setCsvFile(file);
  };

  return (
      <div className="my-2">
        <div className='flex justify-between'>
          <Label className="flex items-center gap-2 h-10">
            <FileUp className="w-4 h-4" />
            {"PDF Files"}
          </Label>
          <PropertySchemaDialog />
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="pdf-upload"
            accept=".csv"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <Label
            htmlFor="pdf-upload"
            className={`flex-1 py-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors duration-200 flex flex-col items-center justify-center text-muted-foreground border-blue-500 bg-blue-100 dark:bg-blue-950`}
          >
            <FileUp className="w-8 h-8 mb-2" />
            <span>Click to upload</span>
            <span className="text-xs">
              {csvFile
                ? `${csvFile.name} selected`
                : "No file selected"}
            </span>
          </Label>
        </div>
      </div>
  );
};

export default CsvUpload;
