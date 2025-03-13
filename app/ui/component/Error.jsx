import React, { useEffect, useState } from 'react';

const ErrorPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className={`w-full max-w-2xl text-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Animated Elements */}
        <div className="relative h-64 w-full mb-8">
          {/* Background elements with staggered animations */}
          <div className={`absolute left-1/4 top-1/4 w-20 h-20 bg-blue-100 rounded-lg transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}></div>
          <div className={`absolute right-1/4 top-1/2 w-16 h-16 bg-purple-100 rounded-full transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}></div>
          <div className={`absolute left-1/3 bottom-0 w-24 h-10 bg-teal-100 rounded-lg transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}></div>
          
          {/* Animated door */}
          <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-20 h-40 bg-white rounded-t-full border-2 border-indigo-900 shadow-lg relative">
              <div className="w-4 h-4 bg-indigo-500 rounded-full absolute right-3 top-1/2 transform -translate-y-1/2"></div>
              <div className="w-6 h-2 bg-indigo-900 absolute left-3 top-1/2 transform -translate-y-3"></div>
              <div className="px-2 py-1 bg-indigo-500 text-xs text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded">
                403
              </div>
            </div>
          </div>
          
          {/* Animated characters */}
          <div className={`absolute left-1/3 bottom-0 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
            <div className="w-12 h-16 bg-teal-500 rounded-md absolute -bottom-8 -left-2"></div>
          </div>
          
          <div className={`absolute right-1/3 bottom-0 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="w-8 h-8 bg-indigo-900 rounded-full"></div>
            <div className="w-12 h-16 bg-indigo-900 rounded-md absolute -bottom-8 -left-2"></div>
            <div className="w-6 h-6 bg-red-400 absolute top-16 -right-2 animate-pulse"></div>
          </div>
        </div>
        
        {/* Text content with staggered animations */}
        <h1 className={`text-4xl font-bold text-indigo-900 mb-4 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          We are Sorry...
        </h1>
        
        <p className={`text-gray-700 mb-2 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          The page you&apos;re trying to access has restricted access.
        </p>
        
        <p className={`text-gray-700 mb-8 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Please refer to your system administrator
        </p>
        
        {/* Button with hover animation */}
        <button className={`bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isLoaded ? 'opacity-100 translate-y-0 delay-1000' : 'opacity-0 translate-y-4'}`}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;