"use client";
    
    import { useState, useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Card } from '@/components/ui/card';
    import { useToast } from '@/hooks/use-toast';
    import { getSession } from '@/lib/auth/session';
    import { Alert } from '@/components/ui/alert';
    
    export default function LoginPage() {
      const router = useRouter();
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState('');
      const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
      useEffect(() => {
        if (getSession()) {
          router.push('/dashboard');
        }
      }, [router]);
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors
    
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
    
          if (!response.ok) {
            const data = await response.json();
            if (data.error) {
              throw new Error(data.error);
            } else {
              throw new Error('ログインに失敗しました');
            }
          }
    
          router.push('/dashboard');
          router.refresh();
        } catch (error) {
          setError(error instanceof Error ? error.message : 'ログインに失敗しました');
        } finally {
          setIsLoading(false);
        }
      };
    
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold text-center mb-8">Cocrea ログイン</h1>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <p>{error}</p>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  メールアドレス
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isLoading}
                  required
                />
              </div>
    
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  パスワード
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isLoading}
                  required
                />
              </div>
    
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>
          </Card>
        </div>
      );
    }
