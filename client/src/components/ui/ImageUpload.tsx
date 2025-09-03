'use client'

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { Title } from './Title';
import clsx from 'clsx';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  url?: string;
  base64?: string;
}

interface ImageUploadProps {
  label?: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  onImagesChange?: (images: ImageFile[]) => void;
  initialImages?: string[];
  className?: string;
  errorMessage?: string;
  convertToBase64?: boolean;
}

export function ImageUpload({
  label = 'Upload de Imagens',
  maxFiles = 3,
  acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024,
  onImagesChange,
  initialImages = [],
  className = '',
  errorMessage,
  convertToBase64 = true
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>(() => 
    initialImages.map((url, index) => ({
      id: `existing-${index}`,
      file: new File([], 'existing-image'),
      preview: url,
      url
    }))
  );

  const convertFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newImages: ImageFile[] = [];
    
    for (const file of acceptedFiles) {
      const image: ImageFile = {
        id: `new-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file)
      };

      if (convertToBase64) {
        try {
          image.base64 = await convertFileToBase64(file);
        } catch (error) {
          console.error('Erro ao converter imagem para base64:', error);
        }
      }

      newImages.push(image);
    }

    const updatedImages = [...images, ...newImages].slice(0, maxFiles);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  }, [images, maxFiles, onImagesChange, convertToBase64, convertFileToBase64]);

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedFileTypes
    },
    maxSize: maxFileSize,
    maxFiles: maxFiles - images.length,
    disabled: images.length >= maxFiles
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedFileTypesText = () => {
    return acceptedFileTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
  };

  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  return (
    <div className={`w-full flex flex-col items-start gap-2 ${className}`}>
      {label && (
        <label>
          <Title size='xs' bold='normal'>
            {label}
          </Title>
        </label>
      )}
      
      <div className="w-full space-y-4">
        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 hover:border-primary/50',
            {
              'border-primary bg-primary/5': isDragActive && !isDragReject,
              'border-destructive bg-destructive/5': isDragReject,
              'border-border hover:border-primary/30': !isDragActive && !isDragReject,
              'opacity-50 cursor-not-allowed': images.length >= maxFiles
            }
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-3">
            <div className={clsx(
              'p-3 rounded-full transition-colors duration-300',
              {
                'bg-primary/10 text-primary': isDragActive && !isDragReject,
                'bg-muted text-muted-foreground': !isDragActive
              }
            )}>
              {isDragActive ? (
                <Upload className="w-6 h-6" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
            
            <div className="space-y-1">
              {isDragActive ? (
                <p className="text-sm font-medium">
                  {isDragReject ? 'Arquivo não suportado' : 'Solte as imagens aqui'}
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    {images.length >= maxFiles ? 'Limite de imagens atingido' : 'Arraste e solte imagens aqui'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ou clique para selecionar
                  </p>
                </>
              )}
              
              <p className="text-xs text-muted-foreground">
                {getAcceptedFileTypesText()} • Máx: {formatFileSize(maxFileSize)} • {images.length}/{maxFiles} imagens
              </p>
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  type="button"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full text-white"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium truncate">
                    {image.file.name || 'Imagem existente'}
                  </p>
                  {/* {image.file.size > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.file.size)}
                    </p>
                  )}
                  {image.base64 && (
                    <p className="text-xs text-green-600">
                      ✓ Base64 convertido
                    </p>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          {errorMessage}
        </small>
      )}
    </div>
  );
}
