import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { authService } from '../../services/authService';

const AnimatedBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute text-white font-black uppercase select-none animate-float" style={{ fontSize: 'clamp(5rem, 20vw, 15rem)', top: '5%', left: '10%', animationDuration: '40s' }}>Karmic Canteen</div>
        <div className="absolute text-white font-black uppercase select-none animate-float" style={{ fontSize: 'clamp(3rem, 15vw, 10rem)', top: '25%', left: '60%', animationDuration: '60s', animationDelay: '-15s' }}>Karmic Canteen</div>
        <div className="absolute text-white font-black uppercase select-none animate-float" style={{ fontSize: 'clamp(4rem, 18vw, 12rem)', top: '50%', left: '-5%', animationDuration: '50s', animationDelay: '-5s' }}>Karmic Canteen</div>
        <div className="absolute text-white font-black uppercase select-none animate-float" style={{ fontSize: 'clamp(5rem, 20vw, 15rem)', top: '80%', left: '40%', animationDuration: '70s', animationDelay: '-30s' }}>Karmic Canteen</div>
    </div>
);


const LoginScreen: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phone, setPhone] = useState('');

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setEmpId('');
    setPhone('');
    setError(null);
  };
  
  const handleTabChange = (registering: boolean) => {
    setIsRegistering(registering);
    clearForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isRegistering) {
      if (!name || !empId || !email || !phone || !password) {
        setError("All fields are required for registration.");
        setIsLoading(false);
        return;
      }
      const result = await authService.register({ id: empId, name, email, phone, password });
      if (result.user) {
          login(result.user);
      } else {
          setError(result.error || 'Registration failed. Please try again.');
      }
    } else {
      const result = await authService.login(email, password);
      if (result.user) {
          login(result.user);
      } else {
          setError(result.error || 'Login failed. Please check your credentials.');
      }
    }
    setIsLoading(false);
  };

  const inputStyles = "bg-gray-700/50 border border-gray-600 text-gray-200 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-karmic-primary focus:border-transparent placeholder-gray-500 transition-all duration-300";

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-900 to-karmic-primary/20 overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white">
              <span className="text-karmic-primary">Karmic</span> Canteen
            </h1>
            <p className="text-gray-400 mt-2">Efficiently Manage Your Canteen Meals</p>
        </div>
        <Card className="!bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-blue-500/20 shadow-2xl">
            <div className="flex border-b border-gray-700 mb-6">
                <button 
                    onClick={() => handleTabChange(false)} 
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${!isRegistering ? 'text-karmic-primary border-b-2 border-karmic-primary' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => handleTabChange(true)} 
                    className={`flex-1 py-3 font-semibold text-center transition-colors ${isRegistering ? 'text-karmic-primary border-b-2 border-karmic-primary' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Register
                </button>
            </div>
            
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-center" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {isRegistering && (
                     <>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} className={inputStyles} id="name" type="text" placeholder="John Doe" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="empId">Employee ID</label>
                            <input onChange={(e) => setEmpId(e.target.value)} value={empId} className={inputStyles} id="empId" type="text" placeholder="E12345" required />
                        </div>
                         <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} className={inputStyles} id="phone" type="tel" placeholder="9876543210" required />
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                        Karmic Solutions Email
                    </label>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className={inputStyles} id="email" type="email" placeholder="employee@karmicsolutions.com" required />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className={inputStyles} id="password" type="password" placeholder="******************" required />
                </div>
                <div className="pt-2">
                    <Button type="submit" isLoading={isLoading} className="!bg-blue-600 hover:!bg-blue-700 focus:ring-blue-500">
                        {isRegistering ? 'Register' : 'Sign In'}
                    </Button>
                </div>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;