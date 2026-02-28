'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, Image, Copy } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { Blob } from '@/types';
import { toast } from "@/components/ui/use-toast"

type SortField = 'pathname' | 'size' | 'uploadedAt';
type SortDirection = 'asc' | 'desc';
export interface BlobsTableRef {
  refresh: () => void;
}

export const BlobsTable = forwardRef<BlobsTableRef>((props, ref) => {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchBlobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blobs');
      if (response.ok) {
        const data = await response.json();
        setBlobs(data.blobs);
      }
    } catch (error) {
      console.error('Error fetching blobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchBlobs
  }));

  useEffect(() => {
    fetchBlobs();
  }, []);

  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch('/api/blobs', {
        method: 'DELETE',
        body: JSON.stringify({ url }),
      });
      
      if (response.ok) {
        fetchBlobs();
      }
    } catch (error) {
      console.error('Error deleting blob:', error);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied",
        description: "URL has been copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedBlobs = blobs
    .filter(blob => 
      blob.pathname.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'pathname':
          return a.pathname.localeCompare(b.pathname) * modifier;
        case 'size':
          return (a.size - b.size) * modifier;
        case 'uploadedAt':
          return (new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()) * modifier;
        default:
          return 0;
      }
    });

  const SortHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <TableHead 
      onClick={() => handleSort(field)}
      className="cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </TableHead>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <SortHeader field="pathname">File Name</SortHeader>
            <SortHeader field="size">Size</SortHeader>
            <SortHeader field="uploadedAt">Upload Date</SortHeader>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedBlobs.map((blob) => (
            <TableRow key={blob.url}>
              <TableCell>
                {blob.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={blob.url} 
                    alt={blob.pathname}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <img className="w-16 h-16 p-3 text-gray-400" />
                )}
              </TableCell>
              <TableCell>{blob.pathname}</TableCell>
              <TableCell>{Math.round(blob.size / 1024)} KB</TableCell>
              <TableCell>{formatDate(blob.uploadedAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(blob.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(blob.url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

BlobsTable.displayName = 'BlobsTable';