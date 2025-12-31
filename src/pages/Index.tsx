import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { CallingDashboard } from '@/components/CallingDashboard';
import { APP_CONFIG } from '@/config/app';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>{APP_CONFIG.appName} - Cold Calling CRM</title>
        <meta name="description" content="Mobile-first cold calling CRM for sales teams. Manage leads, make calls, and track outcomes efficiently." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1e293b" />
      </Helmet>

      {isAuthenticated ? <CallingDashboard /> : <LoginForm />}
    </>
  );
};

export default Index;
