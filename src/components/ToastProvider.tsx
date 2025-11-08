import { Toaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid #e5e5e5',
          fontSize: '0.95rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
        duration: 3000, // auto-dismiss after 3s
      }}
    />
  );
}
