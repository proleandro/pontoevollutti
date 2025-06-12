
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

interface ThankYouButtonProps {
  onClose: () => void;
}

export function ThankYouButton({ onClose }: ThankYouButtonProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguarda a animação terminar
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-out">
        <div className="bg-gradient-to-r from-publievo-purple-500 to-publievo-orange-500 text-white p-8 rounded-2xl shadow-2xl transform scale-95 opacity-0 transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Heart className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">Obrigado pela sua contribuição hoje!</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-r from-publievo-purple-500 to-publievo-orange-500 text-white p-8 rounded-2xl shadow-2xl transform animate-scale-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="w-16 h-16 text-white animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -bottom-1 -left-1 animate-bounce delay-300" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Obrigado pela sua contribuição hoje!
            </h3>
            <p className="text-white/90">
              Seu estágio faz a diferença! ✨
            </p>
          </div>
          
          <Button
            onClick={() => setIsVisible(false)}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
