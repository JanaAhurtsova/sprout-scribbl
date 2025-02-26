'use client';

import { Session } from 'next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { settingsSchema, zSettingsSchema } from '@/types/settings-schema';
import { useStateAction } from 'next-safe-action/stateful-hooks';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { useState } from 'react';
import { settings } from '@/server/actions/settings';
import { UploadButton } from '@/app/api/uploadthing/upload';

export default function SettingsCard({ session }: { session: Session }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const form = useForm<zSettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: session.user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      name: session.user?.name || undefined,
      isTwoFactorEnabled: Boolean(session.user?.isTwoFactorEnabled) || undefined,
      image: session.user?.image || '',
    },
    mode: 'onChange',
  });

  const { execute, status } = useStateAction(settings, {
    onSuccess(data) {
      if (data?.data?.error) setError(data.data.error);
      if (data?.data?.success) setSuccess(data.data.success);
    },
    onError() {
      setError('Something went wrong');
    },
  });
  const image = form.watch('image');

  const onSubmit = (data: zSettingsSchema) => {
    execute(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' disabled={status === 'executing'} {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className='flex items-center gap-2'>
                    {!image ? (
                      <div className='w-[42px] text-center font-bold'>
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <Image
                        className='rounded-full'
                        src={image}
                        alt='user image'
                        width={42}
                        height={42}
                      />
                    )}
                    <UploadButton
                      className='ut:button:transition-all scale-75 ut-button:bg-primary ut-button:ring-primary ut-button:duration-500 hover:ut-button:bg-primary/75 ut-allowed-content:hidden ut-label:hidden ut-label:bg-red-50'
                      endpoint='avatarUploader'
                      onUploadBegin={() => setAvatarUploading(true)}
                      onUploadError={(error) => {
                        form.setError('image', { type: 'validate', message: error.message });
                        setAvatarUploading(false);
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue('image', res[0].ufsUrl);
                        setAvatarUploading(false);
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <span>Change Avatar</span>;
                          return <span>Uploading...</span>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      placeholder='User Image'
                      type='hidden'
                      disabled={status === 'executing'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='********'
                      {...field}
                      type='password'
                      disabled={status === 'executing' || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='********'
                      {...field}
                      type='password'
                      disabled={status === 'executing' || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isTwoFactorEnabled'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={status === 'executing' || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type='submit' disabled={status === 'executing' || avatarUploading}>
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
